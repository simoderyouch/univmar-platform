#!/usr/bin/env bash
# Starts the complete development stack: PostgreSQL, MinIO, API, and web.
# Set UNIVMAR_DEV_MODE=local to use the H2/local-filesystem fallback.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "${UNIVMAR_DEV_MODE:-docker}" = "local" ]; then
  exec "$project_root/scripts/dev-local.sh"
fi

command -v docker >/dev/null 2>&1 || { echo "Docker is required for MinIO development mode. Use UNIVMAR_DEV_MODE=local ./scripts/dev.sh for the H2 fallback." >&2; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "Docker Compose is required." >&2; exit 1; }

cd "$project_root"
docker compose up --build -d

echo "UNIVMAR development stack started."
echo "Web:    http://localhost:5173"
echo "API:    http://localhost:8080"
echo "MinIO:  http://localhost:9001 (minioadmin / minioadmin)"
echo "Login:  admin@univmar.local / ChangeMe123!"
echo "Stop:   ./scripts/dev-stop.sh"
