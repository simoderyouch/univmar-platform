#!/usr/bin/env bash
# Stops the local servers created by dev.sh.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
run_dir="$project_root/.run"

for service in api web; do
  pid_file="$run_dir/$service.pid"
  if [ -f "$pid_file" ]; then
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid"
      echo "Stopped $service (PID $pid)."
    fi
    rm -f "$pid_file"
  fi
done
