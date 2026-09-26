-- V22 originally replaced every occurrence of /images/ in imported paths.
-- Imported paths legitimately include a final /images/ directory, so retain it.
update stone_variant
set main_image_url = regexp_replace(main_image_url, '^(/base-gallery/.+)/base-gallery/', '\\1/images/')
where main_image_url like '/base-gallery/%/base-gallery/%';

update stone_slab
set photo_url = regexp_replace(photo_url, '^(/base-gallery/.+)/base-gallery/', '\\1/images/')
where photo_url like '/base-gallery/%/base-gallery/%';
