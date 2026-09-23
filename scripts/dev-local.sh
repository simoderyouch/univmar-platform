#!/usr/bin/env bash
# Default development mode: Docker services, native API and Vite for fast reloads.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
run_dir="$project_root/.run"
command -v docker >/dev/null 2>&1 || { echo "Docker is required for PostgreSQL and MinIO." >&2; exit 1; }
command -v mvn >/dev/null 2>&1 || { echo "Maven is required." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Node.js and npm are required." >&2; exit 1; }
mkdir -p "$run_dir"
for service in api web; do
  pid_file="$run_dir/$service.pid"
  if [ -f "$pid_file" ] && ps -p "$(cat "$pid_file")" -o stat= 2>/dev/null | grep -qv 'Z'; then echo "$service is already running (PID $(cat "$pid_file")). Use ./scripts/dev-restart.sh local to restart it." >&2; exit 1; fi
  rm -f "$pid_file"
done

cd "$project_root"
docker compose up -d db minio

export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:postgresql://localhost:5432/univmar}"
export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-univmar}"
export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-univmar_local_password}"
export UNIVMAR_STORAGE_PROVIDER="${UNIVMAR_STORAGE_PROVIDER:-s3}"
export UNIVMAR_STORAGE_S3_ENDPOINT="${UNIVMAR_STORAGE_S3_ENDPOINT:-http://localhost:9000}"
export UNIVMAR_STORAGE_S3_PUBLIC_URL="${UNIVMAR_STORAGE_S3_PUBLIC_URL:-http://localhost:9000/univmar}"
export UNIVMAR_STORAGE_S3_BUCKET="${UNIVMAR_STORAGE_S3_BUCKET:-univmar}"
export UNIVMAR_STORAGE_S3_ACCESS_KEY="${UNIVMAR_STORAGE_S3_ACCESS_KEY:-minioadmin}"
export UNIVMAR_STORAGE_S3_SECRET_KEY="${UNIVMAR_STORAGE_S3_SECRET_KEY:-minioadmin}"
export UNIVMAR_BASE_GALLERY_SOURCE="${UNIVMAR_BASE_GALLERY_SOURCE:-$project_root/base-gallery}"
export UNIVMAR_INITIAL_ADMIN_EMAIL="${UNIVMAR_INITIAL_ADMIN_EMAIL:-admin@univmar.local}"
export UNIVMAR_INITIAL_ADMIN_PASSWORD="${UNIVMAR_INITIAL_ADMIN_PASSWORD:-ChangeMe123!}"
export UNIVMAR_JWT_SECRET="${UNIVMAR_JWT_SECRET:-local-development-secret-change-before-production-2026}"
export VITE_ASSET_BASE_URL="${VITE_ASSET_BASE_URL:-http://localhost:9000/univmar}"

(cd "$project_root/backend" && mvn spring-boot:run >"$run_dir/api.log" 2>&1 & echo $! >"$run_dir/api.pid")
(cd "$project_root/frontend" && npm run dev -- --host 0.0.0.0 >"$run_dir/web.log" 2>&1 & echo $! >"$run_dir/web.pid")
echo local >"$run_dir/mode"

echo "Local development started: native API and Vite, Docker PostgreSQL and MinIO."
echo "Web: http://localhost:5173 · API: http://localhost:8080 · MinIO: http://localhost:9001"
echo "Logs: .run/api.log and .run/web.log"
