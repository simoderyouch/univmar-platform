-- Sellable variants need a stable business identifier for commercial snapshots and external integrations.
alter table stone_variants add column sku varchar(100);
update stone_variants set sku = 'VAR-' || id where sku is null;
alter table stone_variants alter column sku set not null;
alter table stone_variants add constraint uk_stone_variants_sku unique (sku);

alter table stone_materials add column origin_type varchar(16);
update stone_materials
set origin_type = case
    when lower(coalesce(origin_country, '')) like '%maroc%'
      or lower(coalesce(origin_country, '')) like '%moroc%' then 'LOCAL'
    else 'IMPORTED'
end
where origin_type is null;
alter table stone_materials alter column origin_type set not null;
