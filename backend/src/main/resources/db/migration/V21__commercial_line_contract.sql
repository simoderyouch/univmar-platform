alter table quotation_items
    add column unit varchar(16) not null default 'M2',
    add column display_order integer not null default 0;

alter table order_items
    add column line_type varchar(32) not null default 'MATERIAL',
    add column unit varchar(16) not null default 'M2',
    add column display_order integer not null default 0;

update order_items oi
set line_type = qi.type,
    unit = qi.unit,
    display_order = qi.display_order
from quotation_items qi
join customer_orders o on o.quotation_id = qi.quotation_id
where oi.order_id = o.id
  and oi.variant_id is not distinct from qi.variant_id
  and oi.description_snapshot = qi.description_snapshot;
