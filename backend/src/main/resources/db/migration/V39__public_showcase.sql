create table public_showcase_item (
    id uuid primary key,
    kind varchar(20) not null,
    material_id uuid references stone_material(id),
    project_id uuid references customer_project(id),
    public_title varchar(180) not null,
    public_summary text not null,
    cover_image_url varchar(1000) not null,
    published boolean not null default false,
    published_at timestamp with time zone,
    sort_order integer not null default 0,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_showcase_link check ((kind = 'PRODUCT' and project_id is null) or (kind = 'PROJECT' and material_id is null))
);
create index idx_showcase_public on public_showcase_item(kind, published, sort_order);
