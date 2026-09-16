alter table quote_requests
    add column reference varchar(64);
alter table quote_requests
    add column submitted_at timestamp with time zone;
update quote_requests
set reference = 'RFQ-' || id,
    submitted_at = case when status in ('SUBMITTED', 'UNDER_REVIEW', 'QUOTED') then updated_at else null end
where reference is null;
alter table quote_requests alter column reference set not null;
alter table quote_requests add constraint uk_quote_requests_reference unique (reference);
