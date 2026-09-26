#!/usr/bin/env bash
# Usage: ./scripts/dev.sh [local|container|h2]
# local (default): Docker PostgreSQL + MinIO, native Spring Boot + Vite.
# container: full Docker stack. h2: native API + Vite with in-memory fallback.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mode="${1:-local}"

case "$mode" in
  local) exec "$project_root/scripts/dev-local.sh" ;;
  h2) exec "$project_root/scripts/dev-h2.sh" ;;
  container)
    command -v docker >/dev/null 2>&1 || { echo "Docker is required for container mode." >&2; exit 1; }
    cd "$project_root"
    docker compose up --build -d
    mkdir -p "$project_root/.run"
    echo container >"$project_root/.run/mode"
    echo "Container stack started. Web: http://localhost:5173 · API: http://localhost:8080 · MinIO: http://localhost:9001"
    ;;
  *) echo "Unknown mode: $mode. Use local, container, or h2." >&2; exit 1 ;;
esac
