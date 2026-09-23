#!/usr/bin/env bash
# Restarts a development mode: local (default), container, or h2.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mode="${1:-local}"
"$project_root/scripts/dev-stop.sh" "$mode"
exec "$project_root/scripts/dev.sh" "$mode"
