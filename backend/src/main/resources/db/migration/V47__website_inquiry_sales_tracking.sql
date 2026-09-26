alter table website_inquiry add column if not exists assigned_to_user_id uuid references app_user(id);
alter table website_inquiry add column if not exists call_outcome varchar(30) not null default 'UNCONTACTED';
alter table website_inquiry add column if not exists call_notes text;
alter table website_inquiry add column if not exists next_follow_up_at timestamp with time zone;
create index if not exists idx_website_inquiry_assigned_status on website_inquiry(assigned_to_user_id, status);
