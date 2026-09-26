create table quotation_dispatch (
    id uuid primary key,
    quotation_id uuid not null references quotation(id) on delete cascade,
    channel varchar(20) not null,
    status varchar(20) not null,
    recipient_email varchar(320),
    cc_emails text,
    subject varchar(500),
    message text,
    token_hash varchar(64) not null unique,
    sent_by varchar(320) not null,
    sent_at timestamp with time zone,
    failure_reason varchar(1000),
    client_response varchar(30) not null default 'PENDING',
    responded_by varchar(320),
    response_message text,
    responded_at timestamp with time zone,
    created_at timestamp with time zone not null
);

create index idx_quotation_dispatch_quotation_created on quotation_dispatch(quotation_id, created_at desc);
