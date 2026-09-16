insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
values
  (current_timestamp, current_timestamp, 'Travertine Beige', 'travertine-beige', 'Travertine', 'Morocco', 'Beige', 'Warm natural travertine with a quiet mineral character.', 'Flooring, walls, terraces', true),
  (current_timestamp, current_timestamp, 'Calacatta Gold', 'calacatta-gold', 'Marble', 'Italy', 'White and gold', 'Expressive white marble with fine warm-gold veining.', 'Kitchens, bathrooms, feature walls', true),
  (current_timestamp, current_timestamp, 'Nero Marquina', 'nero-marquina', 'Marble', 'Spain', 'Black', 'Deep black marble defined by dramatic white veining.', 'Interiors, vanities, statement surfaces', true);

insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'Honed', 20.00, 'Select', 720.00, true from stone_materials where slug = 'travertine-beige';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'Polished', 20.00, 'Select', 1450.00, true from stone_materials where slug = 'calacatta-gold';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'Polished', 20.00, 'Select', 980.00, true from stone_materials where slug = 'nero-marquina';

insert into inventory_items (created_at, updated_at, variant_id, on_hand_m2, reserved_m2, min_stock_m2, version)
select current_timestamp, current_timestamp, v.id, 250.00, 0.00, 40.00, 0 from stone_variants v join stone_materials m on m.id = v.material_id where m.slug = 'travertine-beige';
insert into inventory_items (created_at, updated_at, variant_id, on_hand_m2, reserved_m2, min_stock_m2, version)
select current_timestamp, current_timestamp, v.id, 85.00, 0.00, 25.00, 0 from stone_variants v join stone_materials m on m.id = v.material_id where m.slug = 'calacatta-gold';
insert into inventory_items (created_at, updated_at, variant_id, on_hand_m2, reserved_m2, min_stock_m2, version)
select current_timestamp, current_timestamp, v.id, 120.00, 0.00, 30.00, 0 from stone_variants v join stone_materials m on m.id = v.material_id where m.slug = 'nero-marquina';
