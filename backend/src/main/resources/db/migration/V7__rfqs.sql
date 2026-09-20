create table quote_request (
  id uuid primary key,
  number varchar(40) not null unique,
  customer_id uuid not null references customer(id),
  project_id uuid not null references customer_project(id),
  created_by varchar(320) not null,
  required_date date,
  delivery_location varchar(240),
  notes text,
  status varchar(20) not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);
create table quote_request_item (
  id uuid primary key,
  rfq_id uuid not null references quote_request(id) on delete cascade,
  material_id uuid not null references stone_material(id),
  variant_id uuid not null references stone_variant(id),
  quantity_m2 numeric(14,3) not null,
  unit varchar(20) not null,
  requested_dimensions varchar(180),
  processing_service varchar(180),
  comment text
);
create table quote_request_attachment (
  id uuid primary key,
  rfq_id uuid not null references quote_request(id) on delete cascade,
  file_name varchar(255) not null,
  file_url varchar(1000) not null,
  content_type varchar(120)
);
create index idx_quote_request_customer on quote_request(customer_id);
create index idx_quote_request_project on quote_request(project_id);
create index idx_quote_request_status on quote_request(status);
