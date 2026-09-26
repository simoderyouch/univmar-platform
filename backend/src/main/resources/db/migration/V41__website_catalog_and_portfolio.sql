create table material_category (
    id uuid primary key,
    name varchar(100) not null,
    slug varchar(100) not null unique,
    sort_order integer not null default 0,
    active boolean not null default true,
    website_visible boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

insert into material_category (id, name, slug, sort_order, active, website_visible, created_at, updated_at) values
('00000000-0000-0000-0000-000000000041', 'Marbre local', 'marbre-local', 1, true, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000042', 'Pierre Naturelle&Tahejart', 'pierre-naturelle-tahejart', 2, true, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000043', 'Granit', 'granit', 3, true, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000044', 'Marbre', 'marbre', 4, true, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000045', 'Onyx', 'onyx', 5, true, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000046', 'Quartz', 'quartz', 6, true, true, current_timestamp, current_timestamp);

alter table stone_material add column category_id uuid;
update stone_material set category_id = '00000000-0000-0000-0000-000000000041' where lower(commercial_name) = 'marbre local';
update stone_material set category_id = '00000000-0000-0000-0000-000000000042' where lower(commercial_name) = 'pierre naturelle&tahejart';
update stone_material set category_id = '00000000-0000-0000-0000-000000000043' where category_id is null and stone_type = 'GRANITE';
update stone_material set category_id = '00000000-0000-0000-0000-000000000045' where category_id is null and stone_type = 'ONYX';
update stone_material set category_id = '00000000-0000-0000-0000-000000000046' where category_id is null and stone_type = 'QUARTZITE';
update stone_material set category_id = '00000000-0000-0000-0000-000000000044' where category_id is null;
alter table stone_material alter column category_id set not null;
alter table stone_material add constraint fk_stone_material_category foreign key (category_id) references material_category(id);
create index idx_stone_material_category on stone_material(category_id);

create table website_portfolio_category (
    id uuid primary key,
    name varchar(100) not null,
    slug varchar(100) not null unique,
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
insert into website_portfolio_category (id, name, slug, sort_order, active, created_at, updated_at) values
('00000000-0000-0000-0000-000000000051', 'Salles de Bain', 'salles-de-bain', 1, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000052', 'Escaliers', 'escaliers', 2, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000053', 'Cuisines', 'cuisines', 3, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000054', 'Piscines', 'piscines', 4, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000055', 'Extérieur', 'exterieur', 5, true, current_timestamp, current_timestamp),
('00000000-0000-0000-0000-000000000056', 'Intérieurs', 'interieurs', 6, true, current_timestamp, current_timestamp);

create table website_portfolio_project (
    id uuid primary key,
    project_id uuid not null unique references customer_project(id),
    category_id uuid not null references website_portfolio_category(id),
    published boolean not null default false,
    featured boolean not null default false,
    sort_order integer not null default 0,
    cover_image_url varchar(1000) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
create table website_portfolio_project_image (
    portfolio_project_id uuid not null references website_portfolio_project(id) on delete cascade,
    position integer not null,
    image_url varchar(1000) not null,
    primary key (portfolio_project_id, position)
);
create index idx_website_portfolio_public on website_portfolio_project(published, featured, sort_order);

alter table website_inquiry add column subject varchar(160);
alter table website_inquiry add column language varchar(12);
alter table website_inquiry add column selected_products varchar(2000);
alter table website_inquiry add column utm_source varchar(160);
alter table website_inquiry add column utm_medium varchar(160);
alter table website_inquiry add column utm_campaign varchar(160);
alter table website_inquiry add column referrer varchar(1000);
alter table website_inquiry add column notification_status varchar(20) not null default 'PENDING';
alter table website_inquiry add column notification_error varchar(500);
alter table website_inquiry add column notification_attempts integer not null default 0;
create index idx_website_inquiry_created on website_inquiry(created_at desc);
