#!/usr/bin/env bash
# Stops the mode most recently started by dev.sh, or the mode passed as $1.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
run_dir="$project_root/.run"
mode="${1:-$(cat "$run_dir/mode" 2>/dev/null || printf local)}"

for service in api web; do
  pid_file="$run_dir/$service.pid"
  if [ -f "$pid_file" ]; then
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" 2>/dev/null; then kill "$pid"; echo "Stopped $service (PID $pid)."; fi
    rm -f "$pid_file"
  fi
done

case "$mode" in
  local) (cd "$project_root" && docker compose stop db minio) ;;
  container) (cd "$project_root" && docker compose down) ;;
  h2) ;;
  *) echo "Unknown mode: $mode" >&2; exit 1 ;;
esac
rm -f "$run_dir/mode"
