create table supplier (
    id uuid primary key,
    name varchar(180) not null unique,
    contact_name varchar(120), country varchar(100), email varchar(180), phone varchar(60),
    address text, materials_supplied text, payment_terms varchar(160), lead_time_days integer,
    notes text, active boolean not null default true,
    created_at timestamp with time zone not null, updated_at timestamp with time zone not null
);

create table purchase_order (
    id uuid primary key, number varchar(40) not null unique,
    supplier_id uuid not null references supplier(id), status varchar(30) not null,
    expected_arrival date, notes text,
    created_at timestamp with time zone not null, updated_at timestamp with time zone not null
);
create index idx_purchase_order_supplier on purchase_order(supplier_id);
create index idx_purchase_order_status on purchase_order(status);

create table purchase_order_item (
    id uuid primary key, purchase_order_id uuid not null references purchase_order(id),
    variant_id uuid not null references stone_variant(id), ordered_m2 numeric(14,3) not null check (ordered_m2 > 0),
    received_m2 numeric(14,3) not null default 0 check (received_m2 >= 0),
    cost_per_m2 numeric(14,2), notes text
);
create index idx_purchase_order_item_order on purchase_order_item(purchase_order_id);

create table goods_receipt (
    id uuid primary key, purchase_order_item_id uuid not null references purchase_order_item(id),
    inventory_item_id uuid references inventory_item(id), quantity_m2 numeric(14,3) not null check (quantity_m2 > 0),
    received_at timestamp with time zone not null, note text
);
create index idx_goods_receipt_item on goods_receipt(purchase_order_item_id);

alter table stock_movement add column source_reference varchar(60);
alter table stock_movement add column source_supplier varchar(180);
