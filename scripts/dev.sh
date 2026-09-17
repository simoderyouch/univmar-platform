#!/usr/bin/env bash
# Starts UNIVMAR locally without Docker.
# Backend uses the H2 development database configured in application.yml.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
run_dir="$project_root/.run"

if ! command -v mvn >/dev/null 2>&1; then
  echo "Maven is required. Install Maven, then run this script again." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install Node.js 20+ (or newer), then run this script again." >&2
  exit 1
fi

mkdir -p "$run_dir"

for service in api web; do
  pid_file="$run_dir/$service.pid"
  if [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
    echo "$service is already running (PID $(cat "$pid_file")). Use ./scripts/dev-restart.sh to restart it." >&2
    exit 1
  fi
  rm -f "$pid_file"
done

# These defaults are only for the local in-memory H2 environment. Override any
# value before calling this script if you need different local credentials.
export UNIVMAR_INITIAL_ADMIN_EMAIL="${UNIVMAR_INITIAL_ADMIN_EMAIL:-admin@univmar.local}"
export UNIVMAR_INITIAL_ADMIN_PASSWORD="${UNIVMAR_INITIAL_ADMIN_PASSWORD:-ChangeMe123!}"
export UNIVMAR_JWT_SECRET="${UNIVMAR_JWT_SECRET:-local-development-secret-change-before-production-2026}"

(
  cd "$project_root/backend"
  mvn spring-boot:run >"$run_dir/api.log" 2>&1 &
  echo $! >"$run_dir/api.pid"
)
(
  cd "$project_root/frontend"
  npm run dev -- --host 0.0.0.0 >"$run_dir/web.log" 2>&1 &
  echo $! >"$run_dir/web.pid"
)

echo "Starting API and web development servers…"
echo "Web: http://localhost:5173"
echo "API: http://localhost:8080"
echo "Login: $UNIVMAR_INITIAL_ADMIN_EMAIL"
echo "Logs:  .run/api.log and .run/web.log"
echo "Stop:  ./scripts/dev-stop.sh"
