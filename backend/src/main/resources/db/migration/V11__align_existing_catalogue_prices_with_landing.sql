-- The four materials retained from the original stock seed have no public
-- price in the landing catalogue. Keep their commercial price unset until
-- Sales publishes an indicative price.
update stone_variants
set indicative_price = null, updated_at = current_timestamp
where material_id in (
  select id from stone_materials
  where slug in ('beige-taza', 'new-calacatta-gris', 'onyx-rose', 'vert-guatemala')
);
