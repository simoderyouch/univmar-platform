alter table stone_variant add column main_image_url varchar(1000);

create table stone_variant_image (
    variant_id uuid not null references stone_variant(id) on delete cascade,
    position integer not null,
    image_url varchar(1000) not null,
    primary key (variant_id, position)
);

-- Preserve existing catalog images by assigning them to every current variant.
update stone_variant variant
set main_image_url = material.main_image_url
from stone_material material
where material.id = variant.material_id;

insert into stone_variant_image (variant_id, position, image_url)
select variant.id, image.position, image.image_url
from stone_variant variant
join stone_material_image image on image.material_id = variant.material_id;

drop table stone_material_image;
alter table stone_material drop column main_image_url;
