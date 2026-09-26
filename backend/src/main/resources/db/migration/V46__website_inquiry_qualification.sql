alter table website_inquiry add column if not exists qualified_customer_id uuid references customer(id);
alter table website_inquiry add column if not exists qualified_project_id uuid references customer_project(id);
create index if not exists idx_website_inquiry_qualified_project on website_inquiry(qualified_project_id);
