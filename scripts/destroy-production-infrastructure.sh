#!/usr/bin/env bash
# Permanently remove the UNIVMAR production Terraform stack.
# Usage:
#   ./scripts/destroy-production-infrastructure.sh --plan
#   ./scripts/destroy-production-infrastructure.sh --apply --confirm DESTROY_UNIVMAR_PRODUCTION

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
terraform_dir="$project_root/infra/production"
assets_bucket="univmar-089496390808-production-assets"
mode="${1:-}"
confirmation=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/destroy-production-infrastructure.sh --plan
  ./scripts/destroy-production-infrastructure.sh --apply --confirm DESTROY_UNIVMAR_PRODUCTION

This permanently destroys the Terraform-managed production application stack,
including ECS services, RDS PostgreSQL, ALB/networking, ECR repositories, and
all objects and versions in the production asset bucket.

It intentionally retains the separate Terraform state bucket and manually
managed Secrets Manager entries so the teardown remains auditable and the
stack can be rebuilt later.
EOF
}

case "$mode" in
  --plan|--apply) ;;
  -h|--help|"") usage; exit 0 ;;
  *) usage >&2; exit 1 ;;
esac

if [[ "$mode" == "--apply" ]]; then
  [[ "${2:-}" == "--confirm" && "${3:-}" == "DESTROY_UNIVMAR_PRODUCTION" ]] || {
    echo "Refusing to destroy. Use: --apply --confirm DESTROY_UNIVMAR_PRODUCTION" >&2
    exit 1
  }
fi

command -v terraform >/dev/null 2>&1 || { echo "Terraform is required." >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "AWS CLI is required." >&2; exit 1; }

account_id="$(aws sts get-caller-identity --query Account --output text)"
[[ "$account_id" == "089496390808" ]] || {
  echo "Refusing to continue: expected AWS account 089496390808, got $account_id." >&2
  exit 1
}

# Versioned buckets retain old object versions and delete markers. Terraform's
# bucket destroy does not always remove them, so remove every version only after
# the explicit destructive confirmation has passed.
empty_versioned_assets_bucket() {
  if ! aws s3api head-bucket --bucket "$assets_bucket" 2>/dev/null; then
    return
  fi

  echo "Removing all object versions from s3://$assets_bucket ..."
  while :; do
    local objects
    objects="$(aws s3api list-object-versions --bucket "$assets_bucket" --output json \
      | jq -c '[.Versions[]?, .DeleteMarkers[]? | {Key: .Key, VersionId: .VersionId}]')"

    [[ "$objects" != "[]" ]] || break
    aws s3api delete-objects --bucket "$assets_bucket" \
      --delete "{\"Objects\":$objects,\"Quiet\":true}" >/dev/null
  done
}

force_delete_ecr_repositories() {
  local repository
  for repository in univmar-production-api univmar-production-erp-web univmar-production-landing; do
    if aws ecr describe-repositories --repository-names "$repository" --region eu-west-3 >/dev/null 2>&1; then
      echo "Force-removing ECR repository and images: $repository"
      aws ecr delete-repository --repository-name "$repository" --force --region eu-west-3 >/dev/null
    fi
  done
}

cd "$terraform_dir"
plan_file="$(mktemp /tmp/univmar-production-destroy.XXXXXX.tfplan)"
trap 'rm -f "$plan_file"' EXIT

terraform init -input=false

if [[ "$mode" == "--apply" ]]; then
  empty_versioned_assets_bucket
  force_delete_ecr_repositories
fi

terraform plan -destroy -input=false -lock-timeout=60s \
  -var='allow_assets_bucket_destroy=true' \
  -out="$plan_file"

if [[ "$mode" == "--plan" ]]; then
  echo "Destroy plan created and reviewed. No infrastructure was changed."
  exit 0
fi

terraform apply -input=false "$plan_file"
echo "Production application infrastructure has been destroyed. The Terraform state bucket and Secrets Manager entries were retained."
