#!/usr/bin/env bash
# Starts the API and Vite locally with the H2 development database.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
run_dir="$project_root/.run"
command -v mvn >/dev/null 2>&1 || { echo "Maven is required." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Node.js and npm are required." >&2; exit 1; }
mkdir -p "$run_dir"
for service in api web; do
  pid_file="$run_dir/$service.pid"
  if [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then echo "$service is already running (PID $(cat "$pid_file"))." >&2; exit 1; fi
  rm -f "$pid_file"
done
export UNIVMAR_INITIAL_ADMIN_EMAIL="${UNIVMAR_INITIAL_ADMIN_EMAIL:-admin@univmar.local}"
export UNIVMAR_INITIAL_ADMIN_PASSWORD="${UNIVMAR_INITIAL_ADMIN_PASSWORD:-ChangeMe123!}"
export UNIVMAR_JWT_SECRET="${UNIVMAR_JWT_SECRET:-local-development-secret-change-before-production-2026}"
(cd "$project_root/backend" && mvn spring-boot:run >"$run_dir/api.log" 2>&1 & echo $! >"$run_dir/api.pid")
(cd "$project_root/frontend" && npm run dev -- --host 0.0.0.0 >"$run_dir/web.log" 2>&1 & echo $! >"$run_dir/web.pid")
echo "Local H2 mode started. Web: http://localhost:5173 · API: http://localhost:8080"
