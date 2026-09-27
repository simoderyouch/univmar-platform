alter table stone_variant add column if not exists public_availability_policy varchar(30) not null default 'AUTO';
alter table stone_material add column if not exists public_uses varchar(500);
alter table stone_material add column if not exists care_summary varchar(1000);
alter table stone_material add column if not exists indoor_outdoor varchar(20);
create table if not exists website_portfolio_project_material (
    portfolio_project_id uuid not null references website_portfolio_project(id) on delete cascade,
    variant_id uuid not null references stone_variant(id),
    display_order integer not null default 0,
    primary key (portfolio_project_id, variant_id)
);
create index if not exists idx_portfolio_project_material_variant on website_portfolio_project_material(variant_id, display_order);
create table if not exists website_inquiry_attachment (
    id uuid primary key,
    inquiry_id uuid not null references website_inquiry(id) on delete cascade,
    document_url varchar(1000) not null,
    original_filename varchar(500) not null,
    content_type varchar(100) not null,
    file_size bigint not null,
    created_at timestamp with time zone not null
);
