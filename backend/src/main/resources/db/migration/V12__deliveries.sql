alter table inventory_reservation add column consumed_m2 numeric(14,3) not null default 0;

create table delivery (
    id uuid primary key,
    number varchar(40) not null unique,
    order_id uuid not null references customer_order(id),
    scheduled_date date,
    status varchar(20) not null,
    notes text,
    dispatched_at timestamp with time zone,
    delivered_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone not null
);
create index idx_delivery_order on delivery(order_id);
create index idx_delivery_status on delivery(status);
create index idx_delivery_scheduled on delivery(scheduled_date);

create table delivery_item (
    id uuid primary key,
    delivery_id uuid not null references delivery(id) on delete cascade,
    order_item_id uuid not null references customer_order_item(id),
    quantity_m2 numeric(14,3) not null check (quantity_m2 > 0)
);
create index idx_delivery_item_delivery on delivery_item(delivery_id);
create index idx_delivery_item_order_item on delivery_item(order_item_id);
