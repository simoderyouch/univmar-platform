-- Imported from landing/data/categories.json and landing/data/products.json.
-- Image URLs are served by the main landing site and remain editable through the catalogue API.

update catalogue_categories set name = 'Marbre local', display_order = 1, local_material = true, active = true, updated_at = current_timestamp where slug = 'marbre-local';
update catalogue_categories set name = 'Pierre Naturelle&Tahejart', display_order = 2, local_material = true, active = true, updated_at = current_timestamp where slug = 'pierre-naturelle-tahejart';
update catalogue_categories set name = 'Granit', display_order = 3, local_material = false, active = true, updated_at = current_timestamp where slug = 'granit';
update catalogue_categories set name = 'Marbre', display_order = 4, local_material = false, active = true, updated_at = current_timestamp where slug = 'marbre';
update catalogue_categories set name = 'Onyx', display_order = 5, local_material = false, active = true, updated_at = current_timestamp where slug = 'onyx';
update catalogue_categories set name = 'Quartz', display_order = 6, local_material = false, active = true, updated_at = current_timestamp where slug = 'quartz';

insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'marbre-local', 'Marbre local', 1, true, true
where not exists (select 1 from catalogue_categories where slug = 'marbre-local');
insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'pierre-naturelle-tahejart', 'Pierre Naturelle&Tahejart', 2, true, true
where not exists (select 1 from catalogue_categories where slug = 'pierre-naturelle-tahejart');
insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'granit', 'Granit', 3, false, true
where not exists (select 1 from catalogue_categories where slug = 'granit');
insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'marbre', 'Marbre', 4, false, true
where not exists (select 1 from catalogue_categories where slug = 'marbre');
insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'onyx', 'Onyx', 5, false, true
where not exists (select 1 from catalogue_categories where slug = 'onyx');
insert into catalogue_categories (created_at, updated_at, slug, name, display_order, local_material, active)
select current_timestamp, current_timestamp, 'quartz', 'Quartz', 6, false, true
where not exists (select 1 from catalogue_categories where slug = 'quartz');

update stone_materials set name = 'Beige taza polli', category = 'Marbre local', origin_country = 'Maroc', primary_color = 'Beige', description = 'Beige taza polli — matériau référencé dans le catalogue UNIVMAR.', applications = 'Projets sur mesure', active = true, updated_at = current_timestamp where slug = 'beige-taza';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'beige-taza'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_polli.jpg', 'Beige taza polli — Marbre local', 0, true from stone_materials where slug = 'beige-taza'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_polli.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza bouchardé', 'beige-taza-boucharde-210', 'Marbre local', 'Maroc', 'Beige', 'Beige taza bouchardé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-boucharde-210');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'beige-taza-boucharde-210'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_bouchardé.jpg', 'Beige taza bouchardé — Marbre local', 0, true from stone_materials where slug = 'beige-taza-boucharde-210'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_bouchardé.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza vieille', 'beige-taza-vieille-211', 'Marbre local', 'Import sélectionné', 'Beige', 'Beige taza vieille — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-vieille-211');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 180.00, true from stone_materials where slug = 'beige-taza-vieille-211'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_vieille.jpg', 'Beige taza vieille — Marbre local', 0, true from stone_materials where slug = 'beige-taza-vieille-211'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_vieille.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza brut', 'beige-taza-brut-212', 'Marbre local', 'Maroc', 'Beige', 'Beige taza brut — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-brut-212');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'beige-taza-brut-212'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_brut.jpg', 'Beige taza brut — Marbre local', 0, true from stone_materials where slug = 'beige-taza-brut-212'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_brut.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza veinage', 'beige-taza-veinage-213', 'Marbre local', 'Import sélectionné', 'Beige', 'Beige taza veinage — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-veinage-213');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 180.00, true from stone_materials where slug = 'beige-taza-veinage-213'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_veinage.jpg', 'Beige taza veinage — Marbre local', 0, true from stone_materials where slug = 'beige-taza-veinage-213'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_veinage.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza strié', 'beige-taza-strie-214', 'Marbre local', 'Maroc', 'Beige', 'Beige taza strié — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-strie-214');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'beige-taza-strie-214'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_strié.jpg', 'Beige taza strié — Marbre local', 0, true from stone_materials where slug = 'beige-taza-strie-214'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_strié.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza polli', 'gris-taza-polli-215', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza polli — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-polli-215');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 240.00, true from stone_materials where slug = 'gris-taza-polli-215'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_polli.jpg', 'Gris taza polli — Marbre local', 0, true from stone_materials where slug = 'gris-taza-polli-215'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_polli.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza bouchardé', 'gris-taza-boucharde-216', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza bouchardé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-boucharde-216');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 240.00, true from stone_materials where slug = 'gris-taza-boucharde-216'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_bouchardé.jpg', 'Gris taza bouchardé — Marbre local', 0, true from stone_materials where slug = 'gris-taza-boucharde-216'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_bouchardé.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza vieille', 'gris-taza-vieille-217', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza vieille — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-vieille-217');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 240.00, true from stone_materials where slug = 'gris-taza-vieille-217'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_vieille.jpg', 'Gris taza vieille — Marbre local', 0, true from stone_materials where slug = 'gris-taza-vieille-217'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_vieille.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza brut', 'gris-taza-brut-218', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza brut — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-brut-218');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 210.00, true from stone_materials where slug = 'gris-taza-brut-218'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_brut.jpg', 'Gris taza brut — Marbre local', 0, true from stone_materials where slug = 'gris-taza-brut-218'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_brut.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza veinage', 'gris-taza-veinage-219', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza veinage — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-veinage-219');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 240.00, true from stone_materials where slug = 'gris-taza-veinage-219'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_veinage.jpg', 'Gris taza veinage — Marbre local', 0, true from stone_materials where slug = 'gris-taza-veinage-219'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_veinage.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza strié', 'gris-taza-strie-220', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza strié — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-strie-220');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 280.00, true from stone_materials where slug = 'gris-taza-strie-220'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_strié.jpg', 'Gris taza strié — Marbre local', 0, true from stone_materials where slug = 'gris-taza-strie-220'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_strié.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris taza sablé', 'gris-taza-sable-221', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris taza sablé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-taza-sable-221');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 240.00, true from stone_materials where slug = 'gris-taza-sable-221'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_taza_sablé.jpg', 'Gris taza sablé — Marbre local', 0, true from stone_materials where slug = 'gris-taza-sable-221'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_taza_sablé.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Beige taza sablé', 'beige-taza-sable-222', 'Marbre local', 'Maroc', 'Beige', 'Beige taza sablé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'beige-taza-sable-222');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'beige-taza-sable-222'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Beige_taza_sablé.webp', 'Beige taza sablé — Marbre local', 0, true from stone_materials where slug = 'beige-taza-sable-222'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Beige_taza_sablé.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Zola vieille', 'zola-vieille-223', 'Marbre local', 'Import sélectionné', 'À confirmer', 'Zola vieille — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'zola-vieille-223');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 200.00, true from stone_materials where slug = 'zola-vieille-223'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Zola_vieille.jpg', 'Zola vieille — Marbre local', 0, true from stone_materials where slug = 'zola-vieille-223'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Zola_vieille.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Pierre volcanique', 'pierre-volcanique-224', 'Marbre local', 'Import sélectionné', 'À confirmer', 'Pierre volcanique — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'pierre-volcanique-224');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 280.00, true from stone_materials where slug = 'pierre-volcanique-224'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Pierre_volcanique.jpg', 'Pierre volcanique — Marbre local', 0, true from stone_materials where slug = 'pierre-volcanique-224'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Pierre_volcanique.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Volubilis', 'volubilis-225', 'Marbre local', 'Import sélectionné', 'À confirmer', 'Volubilis — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'volubilis-225');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 400.00, true from stone_materials where slug = 'volubilis-225'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Volubilis.jpg', 'Volubilis — Marbre local', 0, true from stone_materials where slug = 'volubilis-225'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Volubilis.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Noir khenifra', 'noir-khenifra-226', 'Marbre local', 'Maroc', 'Noir', 'Noir khenifra — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-khenifra-226');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-khenifra-226'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Noir_khenifra.jpg', 'Noir khenifra — Marbre local', 0, true from stone_materials where slug = 'noir-khenifra-226'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Noir_khenifra.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Noir_khenifra_application_1782398088289.webp', 'Noir khenifra — Marbre local', 1, false from stone_materials where slug = 'noir-khenifra-226'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Noir_khenifra_application_1782398088289.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris tiflet', 'gris-tiflet-228', 'Marbre local', 'Import sélectionné', 'Gris', 'Gris tiflet — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-tiflet-228');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 320.00, true from stone_materials where slug = 'gris-tiflet-228'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_tiflet.jpg', 'Gris tiflet — Marbre local', 0, true from stone_materials where slug = 'gris-tiflet-228'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_tiflet.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_tiflet_application_1.webp', 'Gris tiflet — Marbre local', 1, false from stone_materials where slug = 'gris-tiflet-228'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_tiflet_application_1.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris benslimane', 'gris-benslimane-229', 'Marbre local', 'Maroc', 'Gris', 'Gris benslimane — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-benslimane-229');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 300.00, true from stone_materials where slug = 'gris-benslimane-229'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_benslimane_1784276539693.webp', 'Gris benslimane — Marbre local', 0, true from stone_materials where slug = 'gris-benslimane-229'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_benslimane_1784276539693.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Noir azilal', 'noir-azilal-230', 'Marbre local', 'Import sélectionné', 'Noir', 'Noir azilal — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-azilal-230');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 400.00, true from stone_materials where slug = 'noir-azilal-230'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Noir_azilal.jpg', 'Noir azilal — Marbre local', 0, true from stone_materials where slug = 'noir-azilal-230'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Noir_azilal.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Noir_azilal_application_1.jpg', 'Noir azilal — Marbre local', 1, false from stone_materials where slug = 'noir-azilal-230'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Noir_azilal_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Jaune bejaad', 'jaune-bejaad-231', 'Marbre local', 'Import sélectionné', 'Jaune', 'Jaune bejaad — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'jaune-bejaad-231');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 320.00, true from stone_materials where slug = 'jaune-bejaad-231'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Jaune_bejaad.jpg', 'Jaune bejaad — Marbre local', 0, true from stone_materials where slug = 'jaune-bejaad-231'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Jaune_bejaad.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Rouge agadir', 'rouge-agadir-232', 'Marbre local', 'Import sélectionné', 'Rouge', 'Rouge agadir — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'rouge-agadir-232');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 380.00, true from stone_materials where slug = 'rouge-agadir-232'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Rouge_agadir.jpg', 'Rouge agadir — Marbre local', 0, true from stone_materials where slug = 'rouge-agadir-232'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Rouge_agadir.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Rouge_agadir_application_1.webp', 'Rouge agadir — Marbre local', 1, false from stone_materials where slug = 'rouge-agadir-232'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Rouge_agadir_application_1.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Bir jdid', 'bir-jdid-233', 'Marbre local', 'Import sélectionné', 'À confirmer', 'Bir jdid — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'bir-jdid-233');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 350.00, true from stone_materials where slug = 'bir-jdid-233'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Bir_jdid.jpg', 'Bir jdid — Marbre local', 0, true from stone_materials where slug = 'bir-jdid-233'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Bir_jdid.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Eclaté beige taza', 'eclate-beige-taza-235', 'Pierre Naturelle&Tahejart', 'Maroc', 'Beige', 'Eclaté beige taza — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-beige-taza-235');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 120.00, true from stone_materials where slug = 'eclate-beige-taza-235'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_beige_taza_1782484060825.jpg', 'Eclaté beige taza — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-beige-taza-235'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_beige_taza_1782484060825.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Éclaté gris taza', 'eclate-gris-taza-236', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'Gris', 'Éclaté gris taza — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-gris-taza-236');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 130.00, true from stone_materials where slug = 'eclate-gris-taza-236'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_gris_taza.jpg', 'Éclaté gris taza — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-gris-taza-236'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_gris_taza.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Éclaté Noir khenifra', 'eclate-noir-khenifra-237', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'Noir', 'Éclaté Noir khenifra — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-noir-khenifra-237');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 180.00, true from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_Noir_khenifra.jpg', 'Éclaté Noir khenifra — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_Noir_khenifra.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_1.jpg', 'Éclaté Noir khenifra — Pierre Naturelle&Tahejart', 1, false from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_1.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_2.jpg', 'Éclaté Noir khenifra — Pierre Naturelle&Tahejart', 2, false from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_2.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_3.jpg', 'Éclaté Noir khenifra — Pierre Naturelle&Tahejart', 3, false from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_3.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_4.jpg', 'Éclaté Noir khenifra — Pierre Naturelle&Tahejart', 4, false from stone_materials where slug = 'eclate-noir-khenifra-237'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_Noir_khenifra_application_4.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Éclaté noir azilal', 'eclate-noir-azilal-238', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'Noir', 'Éclaté noir azilal — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-noir-azilal-238');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 180.00, true from stone_materials where slug = 'eclate-noir-azilal-238'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_noir_azilal.jpg', 'Éclaté noir azilal — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-noir-azilal-238'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_noir_azilal.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_noir_azilal_application_1.jpg', 'Éclaté noir azilal — Pierre Naturelle&Tahejart', 1, false from stone_materials where slug = 'eclate-noir-azilal-238'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Eclate_noir_azilal_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Éclaté volubilis', 'eclate-volubilis-239', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Éclaté volubilis — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-volubilis-239');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 180.00, true from stone_materials where slug = 'eclate-volubilis-239'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_volubilis.jpg', 'Éclaté volubilis — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-volubilis-239'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_volubilis.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Éclaté rouge rosé', 'eclate-rouge-rose-240', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'Rouge', 'Éclaté rouge rosé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'eclate-rouge-rose-240');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 220.00, true from stone_materials where slug = 'eclate-rouge-rose-240'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_rouge_rosé.jpg', 'Éclaté rouge rosé — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'eclate-rouge-rose-240'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Éclaté_rouge_rosé.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Crazy Beige Taza', 'crazy-beige-taza-241', 'Pierre Naturelle&Tahejart', 'Maroc', 'Beige', 'Crazy Beige Taza — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'crazy-beige-taza-241');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'crazy-beige-taza-241'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Crazy_Beige_Taza_1782394799523.jpg', 'Crazy Beige Taza — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'crazy-beige-taza-241'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Crazy_Beige_Taza_1782394799523.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Ardoise verdatre', 'ardoise-verdatre-242', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Ardoise verdatre — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'ardoise-verdatre-242');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 130.00, true from stone_materials where slug = 'ardoise-verdatre-242'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise_verdatre.jpg', 'Ardoise verdatre — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'ardoise-verdatre-242'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise_verdatre.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Ardoise violet foncé', 'ardoise-violet-fonce-243', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Ardoise violet foncé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'ardoise-violet-fonce-243');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 160.00, true from stone_materials where slug = 'ardoise-violet-fonce-243'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise_violet_foncé.jpg', 'Ardoise violet foncé — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'ardoise-violet-fonce-243'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise_violet_foncé.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Ardoise', 'ardoise-244', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Ardoise — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'ardoise-244');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 130.00, true from stone_materials where slug = 'ardoise-244'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise.jpg', 'Ardoise — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'ardoise-244'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Ardoise', 'ardoise-245', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Ardoise — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'ardoise-245');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 120.00, true from stone_materials where slug = 'ardoise-245'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise2.jpg', 'Ardoise — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'ardoise-245'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise2.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Ardoise', 'ardoise-246', 'Pierre Naturelle&Tahejart', 'Import sélectionné', 'À confirmer', 'Ardoise — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'ardoise-246');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', 140.00, true from stone_materials where slug = 'ardoise-246'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise3.jpg', 'Ardoise — Pierre Naturelle&Tahejart', 0, true from stone_materials where slug = 'ardoise-246'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Pierre Naturelle&Tahejart/images/Ardoise3.jpg');

update stone_materials set name = 'NEW CALACATA GRIS', category = 'Quartz', origin_country = 'Import sélectionné', primary_color = 'Gris', description = 'NEW CALACATA GRIS — matériau référencé dans le catalogue UNIVMAR.', applications = 'Projets sur mesure', active = true, updated_at = current_timestamp where slug = 'new-calacatta-gris';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'new-calacatta-gris'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_GRIS.jpg', 'NEW CALACATA GRIS — Quartz', 0, true from stone_materials where slug = 'new-calacatta-gris'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_GRIS.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_GRIS_application_1782425043524.jpg', 'NEW CALACATA GRIS — Quartz', 1, false from stone_materials where slug = 'new-calacatta-gris'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_GRIS_application_1782425043524.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'NEW CALACATA DORE', 'new-calacata-dore-5001', 'Quartz', 'Import sélectionné', 'À confirmer', 'NEW CALACATA DORE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'new-calacata-dore-5001');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'new-calacata-dore-5001'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_DORE.jpg', 'NEW CALACATA DORE — Quartz', 0, true from stone_materials where slug = 'new-calacata-dore-5001'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_DORE.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_DORE_application_1.jpg', 'NEW CALACATA DORE — Quartz', 1, false from stone_materials where slug = 'new-calacata-dore-5001'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Quartz/images/NEW_CALACATA_DORE_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Rose Porino', 'rose-porino-5002', 'Granit', 'Import sélectionné', 'Rose', 'Rose Porino — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'rose-porino-5002');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'rose-porino-5002'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Rose_Porino.jpg', 'Rose Porino — Granit', 0, true from stone_materials where slug = 'rose-porino-5002'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Rose_Porino.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Rose_Porino_application_1782483933701.jpg', 'Rose Porino — Granit', 1, false from stone_materials where slug = 'rose-porino-5002'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Rose_Porino_application_1782483933701.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Rose Avel', 'rose-avel-5003', 'Granit', 'Import sélectionné', 'Rose', 'Rose Avel — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'rose-avel-5003');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'rose-avel-5003'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Rose_Avel.jpg', 'Rose Avel — Granit', 0, true from stone_materials where slug = 'rose-avel-5003'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Rose_Avel.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Patagonia', 'patagonia-5004', 'Granit', 'Import sélectionné', 'À confirmer', 'Patagonia — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'patagonia-5004');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'patagonia-5004'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Patagonia_1782408285809.jpg', 'Patagonia — Granit', 0, true from stone_materials where slug = 'patagonia-5004'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Patagonia_1782408285809.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Noir Galaxy', 'noir-galaxy-5005', 'Granit', 'Import sélectionné', 'Noir', 'Noir Galaxy — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-galaxy-5005');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-galaxy-5005'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Noir_Galaxy.jpg', 'Noir Galaxy — Granit', 0, true from stone_materials where slug = 'noir-galaxy-5005'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Noir_Galaxy.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Noir_Galaxy_application_1782408266232.jpg', 'Noir Galaxy — Granit', 1, false from stone_materials where slug = 'noir-galaxy-5005'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Noir_Galaxy_application_1782408266232.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Noir Absolu', 'noir-absolu-5006', 'Granit', 'Import sélectionné', 'Noir', 'Noir Absolu — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-absolu-5006');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-absolu-5006'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Noir_Absolu_1782570217868.jpg', 'Noir Absolu — Granit', 0, true from stone_materials where slug = 'noir-absolu-5006'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Noir_Absolu_1782570217868.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Noir_Absolu_application_1782570221908.jpg', 'Noir Absolu — Granit', 1, false from stone_materials where slug = 'noir-absolu-5006'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Noir_Absolu_application_1782570221908.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Noir_Absolu_application_1782570223759.jpg', 'Noir Absolu — Granit', 2, false from stone_materials where slug = 'noir-absolu-5006'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Noir_Absolu_application_1782570223759.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'New Halayeb', 'new-halayeb-5007', 'Granit', 'Import sélectionné', 'À confirmer', 'New Halayeb — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'new-halayeb-5007');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'new-halayeb-5007'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/New_Halayeb_1782393850510.jpg', 'New Halayeb — Granit', 0, true from stone_materials where slug = 'new-halayeb-5007'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/New_Halayeb_1782393850510.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/New_Halayeb_application_1782393857625.jpg', 'New Halayeb — Granit', 1, false from stone_materials where slug = 'new-halayeb-5007'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/New_Halayeb_application_1782393857625.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Matrix Titanium', 'matrix-titanium-5008', 'Granit', 'Import sélectionné', 'À confirmer', 'Matrix Titanium — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'matrix-titanium-5008');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'matrix-titanium-5008'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Matrix_Noir.jpg', 'Matrix Titanium — Granit', 0, true from stone_materials where slug = 'matrix-titanium-5008'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Matrix_Noir.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Matrix_Titanium_application_1782408250212.webp', 'Matrix Titanium — Granit', 1, false from stone_materials where slug = 'matrix-titanium-5008'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Matrix_Titanium_application_1782408250212.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Labrador Noir', 'labrador-noir-5009', 'Granit', 'Import sélectionné', 'Noir', 'Labrador Noir — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'labrador-noir-5009');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'labrador-noir-5009'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Labrador_Noir.jpg', 'Labrador Noir — Granit', 0, true from stone_materials where slug = 'labrador-noir-5009'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Labrador_Noir.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Labrador_Noir_application_1782393363363.jpg', 'Labrador Noir — Granit', 1, false from stone_materials where slug = 'labrador-noir-5009'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Labrador_Noir_application_1782393363363.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Labrador Bleu', 'labrador-bleu-5010', 'Granit', 'Import sélectionné', 'Bleu', 'Labrador Bleu — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'labrador-bleu-5010');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'labrador-bleu-5010'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Labrador_Bleu.jpg', 'Labrador Bleu — Granit', 0, true from stone_materials where slug = 'labrador-bleu-5010'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Labrador_Bleu.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Labrador_Bleu_application_1.jpg', 'Labrador Bleu — Granit', 1, false from stone_materials where slug = 'labrador-bleu-5010'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Labrador_Bleu_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Blanc Perle', 'blanc-perle-5011', 'Granit', 'Import sélectionné', 'Blanc', 'Blanc Perle — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-perle-5011');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-perle-5011'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Blanc_Perle.jpg', 'Blanc Perle — Granit', 0, true from stone_materials where slug = 'blanc-perle-5011'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Blanc_Perle.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/Blanc_Perle_application_1782408305891.jpg', 'Blanc Perle — Granit', 1, false from stone_materials where slug = 'blanc-perle-5011'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/Blanc_Perle_application_1782408305891.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'BALTIC BROWN', 'baltic-brown-5012', 'Granit', 'Import sélectionné', 'À confirmer', 'BALTIC BROWN — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'baltic-brown-5012');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'baltic-brown-5012'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/BALTIC_BROWN.jpg', 'BALTIC BROWN — Granit', 0, true from stone_materials where slug = 'baltic-brown-5012'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/BALTIC_BROWN.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Granit/images/BALTIC_BROWN_application_1782398309436.jpg', 'BALTIC BROWN — Granit', 1, false from stone_materials where slug = 'baltic-brown-5012'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Granit/images/BALTIC_BROWN_application_1782398309436.jpg');

update stone_materials set name = 'Onyx rose', category = 'Onyx', origin_country = 'Import sélectionné', primary_color = 'Rose', description = 'Onyx rose — matériau référencé dans le catalogue UNIVMAR.', applications = 'Projets sur mesure', active = true, updated_at = current_timestamp where slug = 'onyx-rose';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-rose'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_rose.webp', 'Onyx rose — Onyx', 0, true from stone_materials where slug = 'onyx-rose'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_rose.webp');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_rose_application_1782424399635.webp', 'Onyx rose — Onyx', 1, false from stone_materials where slug = 'onyx-rose'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_rose_application_1782424399635.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Onyx orange', 'onyx-orange-5015', 'Onyx', 'Import sélectionné', 'Orange', 'Onyx orange — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'onyx-orange-5015');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-orange-5015'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_orange.jpg', 'Onyx orange — Onyx', 0, true from stone_materials where slug = 'onyx-orange-5015'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_orange.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_orange_application_1.jpg', 'Onyx orange — Onyx', 1, false from stone_materials where slug = 'onyx-orange-5015'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_orange_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Onyx marron', 'onyx-marron-5016', 'Onyx', 'Import sélectionné', 'Marron', 'Onyx marron — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'onyx-marron-5016');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-marron-5016'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_marron.jpg', 'Onyx marron — Onyx', 0, true from stone_materials where slug = 'onyx-marron-5016'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_marron.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_marron_application_1782424620151.webp', 'Onyx marron — Onyx', 1, false from stone_materials where slug = 'onyx-marron-5016'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_marron_application_1782424620151.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Onyx  Blue', 'onyx-blue-5017', 'Onyx', 'Import sélectionné', 'À confirmer', 'Onyx  Blue — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'onyx-blue-5017');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-blue-5017'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_Blue.jpg', 'Onyx  Blue — Onyx', 0, true from stone_materials where slug = 'onyx-blue-5017'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_Blue.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_Blue_application_1.jpg', 'Onyx  Blue — Onyx', 1, false from stone_materials where slug = 'onyx-blue-5017'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_Blue_application_1.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_Blue_application_1782395020971.jpg', 'Onyx  Blue — Onyx', 2, false from stone_materials where slug = 'onyx-blue-5017'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_Blue_application_1782395020971.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Onyx blanc', 'onyx-blanc-5018', 'Onyx', 'Import sélectionné', 'Blanc', 'Onyx blanc — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'onyx-blanc-5018');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-blanc-5018'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_blanc.jpg', 'Onyx blanc — Onyx', 0, true from stone_materials where slug = 'onyx-blanc-5018'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_blanc.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_blanc_application_1782395071086.jpg', 'Onyx blanc — Onyx', 1, false from stone_materials where slug = 'onyx-blanc-5018'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_blanc_application_1782395071086.jpg');

update stone_materials set name = 'VERT GUATEMALA', category = 'Marbre', origin_country = 'Import sélectionné', primary_color = 'Vert', description = 'VERT GUATEMALA — matériau référencé dans le catalogue UNIVMAR.', applications = 'Projets sur mesure', active = true, updated_at = current_timestamp where slug = 'vert-guatemala';
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'vert-guatemala'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA.jpg', 'VERT GUATEMALA — Marbre', 0, true from stone_materials where slug = 'vert-guatemala'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA_application_1782483974503.jpg', 'VERT GUATEMALA — Marbre', 1, false from stone_materials where slug = 'vert-guatemala'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA_application_1782483974503.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA_application_1782484000912.jpg', 'VERT GUATEMALA — Marbre', 2, false from stone_materials where slug = 'vert-guatemala'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/VERT_GUATEMALA_application_1782484000912.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'VERT DES ALPES', 'vert-des-alpes-5020', 'Marbre', 'Import sélectionné', 'Vert', 'VERT DES ALPES — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'vert-des-alpes-5020');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'vert-des-alpes-5020'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/VERT_DES_ALPES.jpg', 'VERT DES ALPES — Marbre', 0, true from stone_materials where slug = 'vert-des-alpes-5020'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/VERT_DES_ALPES.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/VERT_DES_ALPES_application_1782421579983.webp', 'VERT DES ALPES — Marbre', 1, false from stone_materials where slug = 'vert-des-alpes-5020'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/VERT_DES_ALPES_application_1782421579983.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'TUNDRA GRIS', 'tundra-gris-5021', 'Marbre', 'Import sélectionné', 'Gris', 'TUNDRA GRIS — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'tundra-gris-5021');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'tundra-gris-5021'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/TUNDRA_GRIS.jpg', 'TUNDRA GRIS — Marbre', 0, true from stone_materials where slug = 'tundra-gris-5021'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/TUNDRA_GRIS.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/TUNDRA_GRIS_application_1.jpg', 'TUNDRA GRIS — Marbre', 1, false from stone_materials where slug = 'tundra-gris-5021'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/TUNDRA_GRIS_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'ROUGE ALICANTE', 'rouge-alicante-5024', 'Marbre', 'Import sélectionné', 'Rouge', 'ROUGE ALICANTE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'rouge-alicante-5024');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'rouge-alicante-5024'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/ROUGE_ALICANTE.jpg', 'ROUGE ALICANTE — Marbre', 0, true from stone_materials where slug = 'rouge-alicante-5024'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/ROUGE_ALICANTE.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/ROUGE_ALICANTE_application_1782426490531.webp', 'ROUGE ALICANTE — Marbre', 1, false from stone_materials where slug = 'rouge-alicante-5024'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/ROUGE_ALICANTE_application_1782426490531.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'PIERRE DE BALI', 'pierre-de-bali-5025', 'Marbre', 'Import sélectionné', 'À confirmer', 'PIERRE DE BALI — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'pierre-de-bali-5025');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'pierre-de-bali-5025'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PIERRE_DE_BALI.jpg', 'PIERRE DE BALI — Marbre', 0, true from stone_materials where slug = 'pierre-de-bali-5025'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PIERRE_DE_BALI.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PIERRE_DE_BALI_application_1.jpg', 'PIERRE DE BALI — Marbre', 1, false from stone_materials where slug = 'pierre-de-bali-5025'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PIERRE_DE_BALI_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'PERLATINO', 'perlatino-5026', 'Marbre', 'Import sélectionné', 'À confirmer', 'PERLATINO — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'perlatino-5026');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'perlatino-5026'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PERLATINO.jpg', 'PERLATINO — Marbre', 0, true from stone_materials where slug = 'perlatino-5026'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PERLATINO.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PERLATINO_application_1.jpg', 'PERLATINO — Marbre', 1, false from stone_materials where slug = 'perlatino-5026'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PERLATINO_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'PANDA WHITE', 'panda-white-5027', 'Marbre', 'Import sélectionné', 'À confirmer', 'PANDA WHITE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'panda-white-5027');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'panda-white-5027'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PANDA_WHITE.jpg', 'PANDA WHITE — Marbre', 0, true from stone_materials where slug = 'panda-white-5027'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PANDA_WHITE.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/PANDA_WHITE_application_1782421777270.jpg', 'PANDA WHITE — Marbre', 1, false from stone_materials where slug = 'panda-white-5027'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/PANDA_WHITE_application_1782421777270.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'NOIR PORTORO', 'noir-portoro-5028', 'Marbre', 'Import sélectionné', 'Noir', 'NOIR PORTORO — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-portoro-5028');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-portoro-5028'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_PORTORO_1782421843345.jpg', 'NOIR PORTORO — Marbre', 0, true from stone_materials where slug = 'noir-portoro-5028'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_PORTORO_1782421843345.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_PORTORO_application_1782422343307.webp', 'NOIR PORTORO — Marbre', 1, false from stone_materials where slug = 'noir-portoro-5028'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_PORTORO_application_1782422343307.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'NOIR FLOWER', 'noir-flower-5029', 'Marbre', 'Import sélectionné', 'Noir', 'NOIR FLOWER — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-flower-5029');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-flower-5029'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_FLOWER.jpg', 'NOIR FLOWER — Marbre', 0, true from stone_materials where slug = 'noir-flower-5029'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_FLOWER.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_FLOWER_application_1782422936169.webp', 'NOIR FLOWER — Marbre', 1, false from stone_materials where slug = 'noir-flower-5029'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_FLOWER_application_1782422936169.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'NOIR AZIZA', 'noir-aziza-5030', 'Marbre', 'Import sélectionné', 'Noir', 'NOIR AZIZA — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'noir-aziza-5030');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'noir-aziza-5030'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_AZIZA.jpg', 'NOIR AZIZA — Marbre', 0, true from stone_materials where slug = 'noir-aziza-5030'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_AZIZA.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/NOIR_AZIZA_application_1.jpg', 'NOIR AZIZA — Marbre', 1, false from stone_materials where slug = 'noir-aziza-5030'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/NOIR_AZIZA_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Marron Imperial clair', 'marron-imperial-clair-5031', 'Marbre', 'Import sélectionné', 'Marron', 'Marron Imperial clair — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'marron-imperial-clair-5031');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'marron-imperial-clair-5031'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Beige_IMPERIAL.jpg', 'Marron Imperial clair — Marbre', 0, true from stone_materials where slug = 'marron-imperial-clair-5031'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Beige_IMPERIAL.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Marron_Imperial_clair_application_1782423616064.webp', 'Marron Imperial clair — Marbre', 1, false from stone_materials where slug = 'marron-imperial-clair-5031'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Marron_Imperial_clair_application_1782423616064.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'MARRON IMPERIAL', 'marron-imperial-5032', 'Marbre', 'Import sélectionné', 'Marron', 'MARRON IMPERIAL — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'marron-imperial-5032');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'marron-imperial-5032'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/MARRON_IMPERIAL.jpg', 'MARRON IMPERIAL — Marbre', 0, true from stone_materials where slug = 'marron-imperial-5032'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/MARRON_IMPERIAL.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/MARRON_IMPERIAL_application_1.jpg', 'MARRON IMPERIAL — Marbre', 1, false from stone_materials where slug = 'marron-imperial-5032'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/MARRON_IMPERIAL_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'MARMARA WHITE', 'marmara-white-5033', 'Marbre', 'Import sélectionné', 'À confirmer', 'MARMARA WHITE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'marmara-white-5033');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'marmara-white-5033'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/MARMARA_WHITE.jpg', 'MARMARA WHITE — Marbre', 0, true from stone_materials where slug = 'marmara-white-5033'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/MARMARA_WHITE.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/MARMARA_WHITE_application_1.jpg', 'MARMARA WHITE — Marbre', 1, false from stone_materials where slug = 'marmara-white-5033'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/MARMARA_WHITE_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'GRIS ARMANI', 'gris-armani-5034', 'Marbre', 'Import sélectionné', 'Gris', 'GRIS ARMANI — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-armani-5034');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'gris-armani-5034'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/GRIS_ARMANI.jpg', 'GRIS ARMANI — Marbre', 0, true from stone_materials where slug = 'gris-armani-5034'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/GRIS_ARMANI.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/GRIS_ARMANI_application_1782423833068.webp', 'GRIS ARMANI — Marbre', 1, false from stone_materials where slug = 'gris-armani-5034'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/GRIS_ARMANI_application_1782423833068.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'FOREST VERT', 'forest-vert-5035', 'Marbre', 'Import sélectionné', 'Vert', 'FOREST VERT — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'forest-vert-5035');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'forest-vert-5035'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/FOREST_VERT_1782411993824.jpg', 'FOREST VERT — Marbre', 0, true from stone_materials where slug = 'forest-vert-5035'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/FOREST_VERT_1782411993824.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/FOREST_VERT_application_1782412011712.jpg', 'FOREST VERT — Marbre', 1, false from stone_materials where slug = 'forest-vert-5035'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/FOREST_VERT_application_1782412011712.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'EMOTION GREY', 'emotion-grey-5036', 'Marbre', 'Import sélectionné', 'À confirmer', 'EMOTION GREY — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'emotion-grey-5036');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'emotion-grey-5036'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/EMOTION_GREY.jpg', 'EMOTION GREY — Marbre', 0, true from stone_materials where slug = 'emotion-grey-5036'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/EMOTION_GREY.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/EMOTION_GREY_application_1.jpg', 'EMOTION GREY — Marbre', 1, false from stone_materials where slug = 'emotion-grey-5036'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/EMOTION_GREY_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'DEEP BLUE', 'deep-blue-5037', 'Marbre', 'Import sélectionné', 'À confirmer', 'DEEP BLUE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'deep-blue-5037');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'deep-blue-5037'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/DEEP_BLUE.jpg', 'DEEP BLUE — Marbre', 0, true from stone_materials where slug = 'deep-blue-5037'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/DEEP_BLUE.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/DEEP_BLUE_application_1782424002937.webp', 'DEEP BLUE — Marbre', 1, false from stone_materials where slug = 'deep-blue-5037'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/DEEP_BLUE_application_1782424002937.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'CREMA SOFITA', 'crema-sofita-5038', 'Marbre', 'Import sélectionné', 'À confirmer', 'CREMA SOFITA — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'crema-sofita-5038');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'crema-sofita-5038'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_SOFITA.jpg', 'CREMA SOFITA — Marbre', 0, true from stone_materials where slug = 'crema-sofita-5038'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_SOFITA.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_SOFITA_application_1782424215657.webp', 'CREMA SOFITA — Marbre', 1, false from stone_materials where slug = 'crema-sofita-5038'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_SOFITA_application_1782424215657.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'CREMA ROYAL', 'crema-royal-5039', 'Marbre', 'Import sélectionné', 'À confirmer', 'CREMA ROYAL — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'crema-royal-5039');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'crema-royal-5039'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL.jpg', 'CREMA ROYAL — Marbre', 0, true from stone_materials where slug = 'crema-royal-5039'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL_application_1782411719890.jpg', 'CREMA ROYAL — Marbre', 1, false from stone_materials where slug = 'crema-royal-5039'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL_application_1782411719890.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL_application_1782411897332.jpg', 'CREMA ROYAL — Marbre', 2, false from stone_materials where slug = 'crema-royal-5039'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_ROYAL_application_1782411897332.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'CREMA MARFIL', 'crema-marfil-5040', 'Marbre', 'Import sélectionné', 'À confirmer', 'CREMA MARFIL — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'crema-marfil-5040');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'crema-marfil-5040'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL.jpg', 'CREMA MARFIL — Marbre', 0, true from stone_materials where slug = 'crema-marfil-5040'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL_application_1782411558884.jpg', 'CREMA MARFIL — Marbre', 1, false from stone_materials where slug = 'crema-marfil-5040'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL_application_1782411558884.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL_application_1782411564209.jpg', 'CREMA MARFIL — Marbre', 2, false from stone_materials where slug = 'crema-marfil-5040'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_MARFIL_application_1782411564209.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'CREMA GALALA', 'crema-galala-5041', 'Marbre', 'Import sélectionné', 'À confirmer', 'CREMA GALALA — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'crema-galala-5041');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'crema-galala-5041'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_GALALA.jpg', 'CREMA GALALA — Marbre', 0, true from stone_materials where slug = 'crema-galala-5041'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_GALALA.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CREMA_GALALA_application_1782411414174.jpg', 'CREMA GALALA — Marbre', 1, false from stone_materials where slug = 'crema-galala-5041'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CREMA_GALALA_application_1782411414174.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Calacatta violia', 'calacatta-violia-5042', 'Marbre', 'Import sélectionné', 'À confirmer', 'Calacatta violia — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'calacatta-violia-5042');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'calacatta-violia-5042'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/CALACATA_VIOLIA.webp', 'Calacatta violia — Marbre', 0, true from stone_materials where slug = 'calacatta-violia-5042'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/CALACATA_VIOLIA.webp');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Calacatta_violia_application_1782411383299.jpg', 'Calacatta violia — Marbre', 1, false from stone_materials where slug = 'calacatta-violia-5042'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Calacatta_violia_application_1782411383299.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'BLANC THASSOS', 'blanc-thassos-5043', 'Marbre', 'Import sélectionné', 'Blanc', 'BLANC THASSOS — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-thassos-5043');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-thassos-5043'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_THASSOS_1782393575606.jpg', 'BLANC THASSOS — Marbre', 0, true from stone_materials where slug = 'blanc-thassos-5043'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_THASSOS_1782393575606.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_THASSOS_application_1782393818572.jpg', 'BLANC THASSOS — Marbre', 1, false from stone_materials where slug = 'blanc-thassos-5043'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_THASSOS_application_1782393818572.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'BLANC POLARIS', 'blanc-polaris-5044', 'Marbre', 'Import sélectionné', 'Blanc', 'BLANC POLARIS — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-polaris-5044');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-polaris-5044'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_1782408540722.jpg', 'BLANC POLARIS — Marbre', 0, true from stone_materials where slug = 'blanc-polaris-5044'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_1782408540722.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_application_1782408547201.jpg', 'BLANC POLARIS — Marbre', 1, false from stone_materials where slug = 'blanc-polaris-5044'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_application_1782408547201.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_application_1782408650858.jpg', 'BLANC POLARIS — Marbre', 2, false from stone_materials where slug = 'blanc-polaris-5044'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_POLARIS_application_1782408650858.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'BLANC IBIZA', 'blanc-ibiza-5045', 'Marbre', 'Import sélectionné', 'Blanc', 'BLANC IBIZA — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-ibiza-5045');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-ibiza-5045'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_IBIZA_1782410324582.jpg', 'BLANC IBIZA — Marbre', 0, true from stone_materials where slug = 'blanc-ibiza-5045'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_IBIZA_1782410324582.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BLANC_IBIZA_application_1782410634677.jpg', 'BLANC IBIZA — Marbre', 1, false from stone_materials where slug = 'blanc-ibiza-5045'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BLANC_IBIZA_application_1782410634677.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'BALNC SAFIR', 'balnc-safir-5046', 'Marbre', 'Import sélectionné', 'À confirmer', 'BALNC SAFIR — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'balnc-safir-5046');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'balnc-safir-5046'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BALNC_SAFIR.webp', 'BALNC SAFIR — Marbre', 0, true from stone_materials where slug = 'balnc-safir-5046'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BALNC_SAFIR.webp');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Blanc CARRARE', 'blanc-carrare-5047', 'Marbre', 'Import sélectionné', 'Blanc', 'Blanc CARRARE — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-carrare-5047');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-carrare-5047'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/BALNC_CARRARA.webp', 'Blanc CARRARE — Marbre', 0, true from stone_materials where slug = 'blanc-carrare-5047'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/BALNC_CARRARA.webp');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Blanc_CARRARA_application_1782409884826.jpg', 'Blanc CARRARE — Marbre', 1, false from stone_materials where slug = 'blanc-carrare-5047'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Blanc_CARRARA_application_1782409884826.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Volakas', 'volakas-5048', 'Marbre', 'Import sélectionné', 'À confirmer', 'Volakas — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'volakas-5048');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'volakas-5048'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Volakas_1782408585410.jpg', 'Volakas — Marbre', 0, true from stone_materials where slug = 'volakas-5048'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Volakas_1782408585410.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Volakas_application_1782408596535.jpg', 'Volakas — Marbre', 1, false from stone_materials where slug = 'volakas-5048'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Volakas_application_1782408596535.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Arabiscato Orobico Rosso', 'arabiscato-orobico-rosso-5049', 'Marbre', 'Import sélectionné', 'À confirmer', 'Arabiscato Orobico Rosso — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'arabiscato-orobico-rosso-5049');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'arabiscato-orobico-rosso-5049'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_Rosso_1782408435643.jpg', 'Arabiscato Orobico Rosso — Marbre', 0, true from stone_materials where slug = 'arabiscato-orobico-rosso-5049'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_Rosso_1782408435643.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_Rosso_application_1782408438893.jpg', 'Arabiscato Orobico Rosso — Marbre', 1, false from stone_materials where slug = 'arabiscato-orobico-rosso-5049'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_Rosso_application_1782408438893.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Arabiscato Orobico', 'arabiscato-orobico-5050', 'Marbre', 'Import sélectionné', 'À confirmer', 'Arabiscato Orobico — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'arabiscato-orobico-5050');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'arabiscato-orobico-5050'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_1782408389089.jpg', 'Arabiscato Orobico — Marbre', 0, true from stone_materials where slug = 'arabiscato-orobico-5050'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_1782408389089.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_application_1782408405434.jpg', 'Arabiscato Orobico — Marbre', 1, false from stone_materials where slug = 'arabiscato-orobico-5050'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/Arabiscato_Orobico_application_1782408405434.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'ARABISCATO BLANC', 'arabiscato-blanc-5051', 'Marbre', 'Import sélectionné', 'Blanc', 'ARABISCATO BLANC — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'arabiscato-blanc-5051');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'arabiscato-blanc-5051'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC.webp', 'ARABISCATO BLANC — Marbre', 0, true from stone_materials where slug = 'arabiscato-blanc-5051'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC.webp');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC_application_1782408332451.jpg', 'ARABISCATO BLANC — Marbre', 1, false from stone_materials where slug = 'arabiscato-blanc-5051'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC_application_1782408332451.jpg');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC_application_1782408346174.jpg', 'ARABISCATO BLANC — Marbre', 2, false from stone_materials where slug = 'arabiscato-blanc-5051'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre/images/ARABISCATO_BLANC_application_1782408346174.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Onyx Vert', 'onyx-vert-5054', 'Onyx', 'Import sélectionné', 'Vert', 'Onyx Vert — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'onyx-vert-5054');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'onyx-vert-5054'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_Vert.webp', 'Onyx Vert — Onyx', 0, true from stone_materials where slug = 'onyx-vert-5054'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_Vert.webp');
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Onyx/images/Onyx_Vert_application_1.jpg', 'Onyx Vert — Onyx', 1, false from stone_materials where slug = 'onyx-vert-5054'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Onyx/images/Onyx_Vert_application_1.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris Khenifra', 'gris-khenifra-5055', 'Marbre local', 'Maroc', 'Gris', 'Gris Khenifra — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-khenifra-5055');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'gris-khenifra-5055'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_Khenifra_1782570016609.jpg', 'Gris Khenifra — Marbre local', 0, true from stone_materials where slug = 'gris-khenifra-5055'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_Khenifra_1782570016609.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Gris Msoun', 'gris-msoun-5056', 'Marbre local', 'Maroc', 'Gris', 'Gris Msoun — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'gris-msoun-5056');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'gris-msoun-5056'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Gris_Msoun_1782570053278.jpg', 'Gris Msoun — Marbre local', 0, true from stone_materials where slug = 'gris-msoun-5056'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Gris_Msoun_1782570053278.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Volubilis Foncé', 'volubilis-fonce-5057', 'Marbre local', 'Maroc', 'À confirmer', 'Volubilis Foncé — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'volubilis-fonce-5057');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'volubilis-fonce-5057'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/product_1782570138666.jpg', 'Volubilis Foncé — Marbre local', 0, true from stone_materials where slug = 'volubilis-fonce-5057'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/product_1782570138666.jpg');

insert into stone_materials (created_at, updated_at, name, slug, category, origin_country, primary_color, description, applications, active)
select current_timestamp, current_timestamp, 'Blanc Zayane', 'blanc-zayane-5058', 'Marbre local', 'Maroc', 'Blanc', 'Blanc Zayane — matériau référencé dans le catalogue UNIVMAR.', 'Projets sur mesure', true
where not exists (select 1 from stone_materials where slug = 'blanc-zayane-5058');
insert into stone_variants (created_at, updated_at, material_id, finish, thickness_mm, grade, indicative_price, active)
select current_timestamp, current_timestamp, id, 'À confirmer', 20.00, 'Catalogue landing', null, true from stone_materials where slug = 'blanc-zayane-5058'
and not exists (select 1 from stone_variants v where v.material_id = stone_materials.id);
insert into stone_material_images (created_at, updated_at, material_id, image_url, alt_text, display_order, primary_image)
select current_timestamp, current_timestamp, id, 'https://universmarbre.com/images/Marbre local/images/Blanc_Zayane_1782644937295.jpg', 'Blanc Zayane — Marbre local', 0, true from stone_materials where slug = 'blanc-zayane-5058'
and not exists (select 1 from stone_material_images i where i.material_id = stone_materials.id and i.image_url = 'https://universmarbre.com/images/Marbre local/images/Blanc_Zayane_1782644937295.jpg');

update stone_materials
set origin_country = 'Maroc', updated_at = current_timestamp
where category in ('Marbre local', 'Pierre Naturelle&Tahejart');
