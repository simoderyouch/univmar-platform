-- Raw refresh tokens must not remain recoverable from the database.
alter table refresh_tokens add column token_hash varchar(128);
update refresh_tokens
set revoked = true,
    token_hash = 'REVOKED-' || id
where token_hash is null;
alter table refresh_tokens alter column token_hash set not null;
alter table refresh_tokens add constraint uk_refresh_tokens_token_hash unique (token_hash);
alter table refresh_tokens drop column token;
