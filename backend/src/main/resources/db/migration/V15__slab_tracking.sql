create table stone_slab (
    id uuid primary key,
    slab_number varchar(80) not null unique,
    inventory_item_id uuid not null references inventory_item(id),
    reserved_order_item_id uuid references customer_order_item(id),
    length_mm numeric(14,2) not null check (length_mm > 0),
    width_mm numeric(14,2) not null check (width_mm > 0),
    surface_area_m2 numeric(14,3) not null check (surface_area_m2 > 0),
    photo_url varchar(1000),
    cost numeric(14,2),
    status varchar(20) not null,
    notes text,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
create index idx_stone_slab_inventory on stone_slab(inventory_item_id);
create index idx_stone_slab_status on stone_slab(status);
create index idx_stone_slab_order_item on stone_slab(reserved_order_item_id);
