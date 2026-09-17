create table stone_material (
    id uuid primary key,
    name varchar(160) not null,
    commercial_name varchar(160),
    sku varchar(80) not null unique,
    stone_type varchar(30) not null,
    origin varchar(100), color varchar(100), pattern varchar(160),
    description text, applications text, main_image_url varchar(1000),
    active boolean not null default true,
    created_at timestamp with time zone not null, updated_at timestamp with time zone not null
);
create index idx_stone_material_name on stone_material (name);
create index idx_stone_material_filters on stone_material (stone_type, origin, color, active);

create table stone_material_image (
    material_id uuid not null references stone_material(id) on delete cascade,
    position integer not null,
    image_url varchar(1000) not null,
    primary key (material_id, position)
);

create table stone_variant (
    id uuid primary key,
    material_id uuid not null references stone_material(id) on delete cascade,
    thickness_mm numeric(12,3) not null check (thickness_mm > 0),
    finish varchar(30) not null,
    format_description varchar(160),
    active boolean not null default true,
    created_at timestamp with time zone not null, updated_at timestamp with time zone not null
);
create index idx_stone_variant_material on stone_variant (material_id);
