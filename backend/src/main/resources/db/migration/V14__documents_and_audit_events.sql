create table business_document (
    id uuid primary key,
    target_type varchar(30) not null,
    target_id uuid not null,
    document_type varchar(40) not null,
    file_name varchar(255) not null,
    file_url varchar(1000) not null,
    content_type varchar(120) not null,
    file_size bigint not null,
    uploaded_by varchar(320) not null,
    created_at timestamp with time zone not null
);
create index idx_business_document_target on business_document(target_type, target_id);

create table audit_event (
    id uuid primary key,
    target_type varchar(30) not null,
    target_id uuid not null,
    event_type varchar(60) not null,
    message varchar(500) not null,
    actor varchar(320) not null,
    occurred_at timestamp with time zone not null
);
create index idx_audit_event_target_time on audit_event(target_type, target_id, occurred_at);
