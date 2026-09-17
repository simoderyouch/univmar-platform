#!/usr/bin/env bash
# Restarts both local development servers.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"$project_root/scripts/dev-stop.sh"
exec "$project_root/scripts/dev.sh"
