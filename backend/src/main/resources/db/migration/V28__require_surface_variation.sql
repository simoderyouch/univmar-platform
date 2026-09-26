-- V27 supplies a value for every legacy row, so the canonical variant descriptor
-- can now be required at the database boundary as well as in the API.
alter table stone_variant alter column variant_name set not null;
