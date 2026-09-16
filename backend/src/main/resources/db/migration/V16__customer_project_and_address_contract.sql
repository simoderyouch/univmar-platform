alter table customer_projects
    add column reference varchar(64);
alter table customer_projects
    add column description varchar(2000);
alter table customer_projects
    add column status varchar(20);
alter table customer_projects
    add column site_country varchar(2);
update customer_projects
set reference = 'PRJ-' || id,
    description = notes,
    status = 'ACTIVE'
where reference is null;
alter table customer_projects alter column reference set not null;
alter table customer_projects alter column status set not null;
alter table customer_projects add constraint uk_customer_projects_reference unique (reference);

alter table customer_addresses
    add column type varchar(20);
alter table customer_addresses
    add column country_code varchar(2);
alter table customer_addresses
    add column default_address boolean not null default false;
update customer_addresses
set type = 'OTHER',
    country_code = 'MA',
    default_address = default_delivery
where type is null;
alter table customer_addresses alter column type set not null;
alter table customer_addresses alter column country_code set not null;
