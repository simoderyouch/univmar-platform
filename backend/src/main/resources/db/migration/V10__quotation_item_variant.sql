alter table quotation_item add column variant_id uuid references stone_variant(id);
create index idx_quotation_item_variant on quotation_item(variant_id);
