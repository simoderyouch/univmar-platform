alter table quotation_items
    add column unit varchar(16) not null default 'M2';
alter table quotation_items
    add column display_order integer not null default 0;

alter table order_items
    add column line_type varchar(32) not null default 'MATERIAL';
alter table order_items
    add column unit varchar(16) not null default 'M2';
alter table order_items
    add column display_order integer not null default 0;

update order_items oi
set line_type = (
        select qi.type
        from quotation_items qi
        join customer_orders o on o.quotation_id = qi.quotation_id
        where o.id = oi.order_id
          and (oi.variant_id = qi.variant_id or (oi.variant_id is null and qi.variant_id is null))
          and oi.description_snapshot = qi.description_snapshot
    ),
    unit = (
        select qi.unit
        from quotation_items qi
        join customer_orders o on o.quotation_id = qi.quotation_id
        where o.id = oi.order_id
          and (oi.variant_id = qi.variant_id or (oi.variant_id is null and qi.variant_id is null))
          and oi.description_snapshot = qi.description_snapshot
    ),
    display_order = (
        select qi.display_order
        from quotation_items qi
        join customer_orders o on o.quotation_id = qi.quotation_id
        where o.id = oi.order_id
          and (oi.variant_id = qi.variant_id or (oi.variant_id is null and qi.variant_id is null))
          and oi.description_snapshot = qi.description_snapshot
    )
where exists (
    select 1
    from quotation_items qi
    join customer_orders o on o.quotation_id = qi.quotation_id
    where o.id = oi.order_id
      and (oi.variant_id = qi.variant_id or (oi.variant_id is null and qi.variant_id is null))
      and oi.description_snapshot = qi.description_snapshot
);
