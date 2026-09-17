create table app_user (
    id uuid primary key,
    email varchar(320) not null unique,
    password_hash varchar(255) not null,
    role varchar(40) not null,
    active boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_app_user_email on app_user (email);
