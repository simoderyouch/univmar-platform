-- Keep imported product and demo slab images in the ERP's dedicated base-gallery folder.
update stone_variant
set main_image_url = replace(main_image_url, '/images/', '/base-gallery/')
where main_image_url like '/images/%';

update stone_slab
set photo_url = replace(photo_url, '/images/', '/base-gallery/')
where photo_url like '/images/%';
