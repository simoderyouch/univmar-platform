-- V23 accidentally reduced imported image paths to "\\1/images/<filename>".
-- The variant's material category is also the corresponding MinIO gallery folder.
update stone_variant variant
set main_image_url = '/api/v1/uploads/base-gallery/' || (
    select category.name
    from stone_material material
    join material_category category on category.id = material.category_id
    where material.id = variant.material_id
) || '/images/' || substr(variant.main_image_url, position('/images/' in variant.main_image_url) + 8)
where ascii(left(variant.main_image_url, 1)) = 92
  and variant.main_image_url like '%/images/%';

update stone_slab slab
set photo_url = '/api/v1/uploads/base-gallery/' || (
    select category.name
    from inventory_item inventory
    join stone_variant variant on variant.id = inventory.variant_id
    join stone_material material on material.id = variant.material_id
    join material_category category on category.id = material.category_id
    where inventory.id = slab.inventory_item_id
) || '/images/' || substr(slab.photo_url, position('/images/' in slab.photo_url) + 8)
where ascii(left(slab.photo_url, 1)) = 92
  and slab.photo_url like '%/images/%';
