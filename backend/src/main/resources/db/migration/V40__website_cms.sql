alter table public_showcase_item alter column public_title drop not null;
alter table public_showcase_item alter column public_summary drop not null;
alter table public_showcase_item alter column cover_image_url drop not null;

create table website_contact_form_settings (
    id uuid primary key,
    enabled boolean not null default true,
    title varchar(180) not null,
    description varchar(1000) not null,
    submit_label varchar(80) not null,
    require_email boolean not null default false,
    require_phone boolean not null default false,
    updated_at timestamp with time zone not null
);
create table website_inquiry (
    id uuid primary key,
    full_name varchar(180) not null,
    email varchar(320),
    phone varchar(80),
    message text,
    source_page varchar(500),
    status varchar(20) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
create index idx_website_inquiry_status_created on website_inquiry(status, created_at desc);
