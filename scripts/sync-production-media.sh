#!/usr/bin/env bash
# Upload locally stored catalogue, category, and project media to production S3.
# Usage: ./scripts/sync-production-media.sh [--dry-run]

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bucket="${UNIVMAR_PRODUCTION_MEDIA_BUCKET:-univmar-089496390808-production-assets}"
region="${AWS_REGION:-eu-west-3}"
dry_run=false

usage() {
  cat <<'EOF'
Usage: ./scripts/sync-production-media.sh [--dry-run]

Uploads, without deleting, these local folders to the production S3 bucket:
  base-gallery/                 -> s3://<bucket>/base-gallery/
  backend/data/uploads/images/  -> s3://<bucket>/images/

Requirements:
  - AWS CLI configured with access to the production bucket.
  - Set UNIVMAR_PRODUCTION_MEDIA_BUCKET to override the default bucket.
  - Set AWS_REGION to override eu-west-3.
EOF
}

case "${1:-}" in
  "") ;;
  --dry-run) dry_run=true ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 1 ;;
esac

command -v aws >/dev/null 2>&1 || {
  echo "AWS CLI is required." >&2
  exit 1
}

sync_folder() {
  local source="$1"
  local prefix="$2"
  local target="s3://${bucket}/${prefix}/"

  if [[ ! -d "$source" ]]; then
    echo "Skipping missing folder: $source"
    return
  fi

  echo "Syncing $source -> $target"
  local args=(s3 sync "$source/" "$target" --region "$region" --no-progress --only-show-errors)
  if [[ "$dry_run" == true ]]; then
    args+=(--dryrun)
  fi
  aws "${args[@]}"
}

sync_folder "$project_root/base-gallery" "base-gallery"
sync_folder "$project_root/backend/data/uploads/images" "images"

if [[ "$dry_run" == true ]]; then
  echo "Dry run complete. No files were uploaded."
else
  echo "Production media sync complete."
fi
