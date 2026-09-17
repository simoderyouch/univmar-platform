create table warehouse (
    id uuid primary key,
    code varchar(40) not null unique,
    name varchar(160) not null,
    active boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table warehouse_location (
    id uuid primary key,
    warehouse_id uuid not null references warehouse(id),
    code varchar(40) not null,
    zone varchar(80),
    active boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint uk_location_warehouse_code unique (warehouse_id, code)
);

create table inventory_item (
    id uuid primary key,
    variant_id uuid not null references stone_variant(id),
    warehouse_id uuid not null references warehouse(id),
    location_id uuid not null references warehouse_location(id),
    lot_number varchar(80),
    bundle_number varchar(80),
    on_hand_m2 numeric(14,3) not null default 0,
    reserved_m2 numeric(14,3) not null default 0,
    damaged_m2 numeric(14,3) not null default 0,
    cost_per_m2 numeric(14,2),
    supplier_name varchar(160),
    arrival_date date,
    version bigint not null default 0,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
create index idx_inventory_variant on inventory_item(variant_id);
create index idx_inventory_warehouse on inventory_item(warehouse_id);
create index idx_inventory_lot on inventory_item(lot_number);
create index idx_inventory_bundle on inventory_item(bundle_number);

create table stock_movement (
    id uuid primary key,
    inventory_item_id uuid not null references inventory_item(id),
    type varchar(30) not null,
    quantity_m2 numeric(14,3) not null check (quantity_m2 > 0),
    reason varchar(500) not null,
    comment varchar(2000),
    occurred_at timestamp with time zone not null,
    created_at timestamp with time zone not null
);
create index idx_stock_movement_item_occurred on stock_movement(inventory_item_id, occurred_at desc);
