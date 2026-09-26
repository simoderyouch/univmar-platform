create table crm_lead (
    id uuid primary key,
    version bigint not null default 0,
    full_name varchar(180) not null,
    email varchar(320),
    phone varchar(80),
    company_name varchar(180),
    message text,
    status varchar(30) not null,
    source varchar(40) not null,
    source_page varchar(500),
    campaign_source varchar(160),
    campaign_medium varchar(160),
    campaign_name varchar(160),
    assigned_to_user_id uuid references app_user(id),
    customer_id uuid references customer(id),
    project_id uuid references customer_project(id),
    next_follow_up_at timestamp with time zone,
    first_responded_at timestamp with time zone,
    last_activity_at timestamp with time zone not null,
    closed_at timestamp with time zone,
    lost_reason varchar(500),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_crm_lead_contact check (email is not null or phone is not null)
);
create index idx_crm_lead_owner_status on crm_lead(assigned_to_user_id, status);
create index idx_crm_lead_last_activity on crm_lead(last_activity_at desc);
create table crm_lead_activity (
    id uuid primary key,
    lead_id uuid not null references crm_lead(id),
    type varchar(40) not null,
    message text not null,
    actor varchar(320) not null,
    occurred_at timestamp with time zone not null
);
create index idx_crm_lead_activity_lead on crm_lead_activity(lead_id, occurred_at desc);
