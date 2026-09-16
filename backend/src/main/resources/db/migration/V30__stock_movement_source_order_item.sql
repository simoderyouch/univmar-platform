alter table stock_movements add column source_order_item_id bigint references order_items(id);
create index idx_stock_movements_source_order_item on stock_movements(source_order_item_id);
