alter table purchase_order add column version bigint not null default 0;
alter table purchase_order_item add column version bigint not null default 0;
