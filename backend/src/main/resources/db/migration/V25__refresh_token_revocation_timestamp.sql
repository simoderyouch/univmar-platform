alter table refresh_tokens add column revoked_at timestamp with time zone;
update refresh_tokens set revoked_at = updated_at where revoked = true and revoked_at is null;
alter table refresh_tokens drop column revoked;
