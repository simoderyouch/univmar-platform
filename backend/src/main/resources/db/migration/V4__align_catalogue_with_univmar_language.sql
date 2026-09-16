-- Replace generic demonstration materials with the terms used by UNIVMAR.
-- This migration preserves the existing material, variant, inventory, and reference IDs.
update stone_materials
set name = 'Beige Taza', slug = 'beige-taza', category = 'Pierre naturelle & Tahejart',
    origin_country = 'Maroc', primary_color = 'Beige',
    description = 'Pierre naturelle marocaine sélectionnée pour les revêtements, façades et projets sur mesure.',
    applications = 'Sols, murs, façades, escaliers, terrasses'
where slug = 'travertine-beige';

update stone_materials
set name = 'New Calacatta Gris', slug = 'new-calacatta-gris', category = 'Marbre importé',
    origin_country = 'Import sélectionné', primary_color = 'Blanc et gris',
    description = 'Marbre veiné élégant pour cuisines, salles de bain et intérieurs haut de gamme.',
    applications = 'Plans de travail, salles de bain, murs, mobilier'
where slug = 'calacatta-gold';

update stone_materials
set name = 'Onyx Rose', slug = 'onyx-rose', category = 'Onyx',
    origin_country = 'Import sélectionné', primary_color = 'Rose',
    description = 'Onyx décoratif à forte présence visuelle pour pièces et espaces d’exception.',
    applications = 'Murs décoratifs, vasques, mobilier, pièces sur mesure'
where slug = 'nero-marquina';

update stone_variants set finish = 'Poli', thickness_mm = 20.00, grade = 'Sélection UNIVMAR', indicative_price = 720.00
where material_id = (select id from stone_materials where slug = 'beige-taza');
update stone_variants set finish = 'Poli', thickness_mm = 20.00, grade = 'Sélection UNIVMAR', indicative_price = 1450.00
where material_id = (select id from stone_materials where slug = 'new-calacatta-gris');
update stone_variants set finish = 'Poli', thickness_mm = 20.00, grade = 'Sélection UNIVMAR', indicative_price = 1800.00
where material_id = (select id from stone_materials where slug = 'onyx-rose');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Vert Guatemala', 'vert-guatemala', 'Marbre importé', 'Import sélectionné', 'Vert',
       'Marbre vert profond pour des réalisations architecturales et décoratives distinctives.',
       'Plans de travail, murs, salles de bain, mobilier', true
where not exists (select 1 from stone_materials where slug = 'vert-guatemala');

insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, m.id, 'Poli', 20.00, 'Sélection UNIVMAR', 1600.00, true
from stone_materials m
where m.slug = 'vert-guatemala'
  and not exists (select 1 from stone_variants v where v.material_id = m.id and v.finish = 'Poli' and v.thickness_mm = 20.00);

insert into inventory_items (created_at, updated_at, variant_id, on_hand_m2, reserved_m2, min_stock_m2, version)
select current_timestamp, current_timestamp, v.id, 60.00, 0.00, 15.00, 0
from stone_variants v join stone_materials m on m.id = v.material_id
where m.slug = 'vert-guatemala'
  and not exists (select 1 from inventory_items i where i.variant_id = v.id);
