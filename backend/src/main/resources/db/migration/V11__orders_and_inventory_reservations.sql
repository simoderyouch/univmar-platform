create table customer_order (
    id uuid primary key,
    number varchar(40) not null unique,
    quotation_id uuid not null unique references quotation(id),
    customer_id uuid not null references customer(id),
    project_id uuid not null references customer_project(id),
    status varchar(30) not null,
    subtotal numeric(14,2) not null,
    tax_total numeric(14,2) not null,
    transport numeric(14,2) not null,
    grand_total numeric(14,2) not null,
    created_at timestamp with time zone not null,
    confirmed_at timestamp with time zone,
    cancelled_at timestamp with time zone
);
create index idx_customer_order_status on customer_order(status);
create index idx_customer_order_customer on customer_order(customer_id);

create table customer_order_item (
    id uuid primary key,
    order_id uuid not null references customer_order(id) on delete cascade,
    quotation_item_id uuid not null references quotation_item(id),
    variant_id uuid not null references stone_variant(id),
    material_name varchar(180) not null,
    variant_label varchar(220) not null,
    quantity_m2 numeric(14,3) not null check (quantity_m2 > 0),
    unit_price numeric(14,2) not null,
    discount_percent numeric(5,2) not null,
    tax_percent numeric(5,2) not null,
    line_total numeric(14,2) not null
);
create index idx_customer_order_item_order on customer_order_item(order_id);

create table inventory_reservation (
    id uuid primary key,
    order_item_id uuid not null references customer_order_item(id) on delete cascade,
    inventory_item_id uuid not null references inventory_item(id),
    quantity_m2 numeric(14,3) not null check (quantity_m2 > 0),
    status varchar(20) not null,
    created_at timestamp with time zone not null,
    released_at timestamp with time zone
);
create index idx_inventory_reservation_item on inventory_reservation(inventory_item_id);
create index idx_inventory_reservation_order_item on inventory_reservation(order_item_id);

create table customer_order_event (
    id uuid primary key,
    order_id uuid not null references customer_order(id) on delete cascade,
    type varchar(60) not null,
    message varchar(500) not null,
    occurred_at timestamp with time zone not null
);
create index idx_customer_order_event_order on customer_order_event(order_id, occurred_at);
