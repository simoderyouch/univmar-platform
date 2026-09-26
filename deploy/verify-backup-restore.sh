#!/usr/bin/env bash
set -euo pipefail

# Requires PostgreSQL client tools and a deployment credential with permission
# to create and drop a temporary verification database.
: "${PGHOST:?Set PGHOST}"
: "${PGPORT:=5432}"
: "${PGUSER:?Set PGUSER}"
: "${PGDATABASE:?Set PGDATABASE}"
: "${PGPASSWORD:?Set PGPASSWORD}"

backup_file="$(mktemp -t univmar-backup-XXXXXX.dump)"
restore_db="${PGDATABASE}_restore_check_$(date +%Y%m%d%H%M%S)"

cleanup() {
  dropdb --if-exists "$restore_db" || true
  rm -f "$backup_file"
}
trap cleanup EXIT

pg_dump --format=custom --file="$backup_file" "$PGDATABASE"
createdb "$restore_db"
pg_restore --clean --if-exists --no-owner --dbname="$restore_db" "$backup_file"

source_count="$(psql --tuples-only --no-align --dbname="$PGDATABASE" --command='select count(*) from flyway_schema_history')"
restore_count="$(psql --tuples-only --no-align --dbname="$restore_db" --command='select count(*) from flyway_schema_history')"

test "$source_count" = "$restore_count"
psql --dbname="$restore_db" --command='select version, description, success from flyway_schema_history order by installed_rank desc limit 5'
echo "Backup and restore verification passed for $PGDATABASE."
