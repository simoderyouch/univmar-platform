alter table stone_material_images add column storage_key varchar(255);
alter table stone_material_images add column content_type varchar(100);
create unique index uq_stone_material_images_storage_key
  on stone_material_images(storage_key);
