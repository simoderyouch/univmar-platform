-- Implements the website-lead lifecycle and its conversion links from the V1 UML.
-- Existing CLOSED leads represented a terminal, non-actionable outcome; preserve them as REJECTED.
update website_quote_requests
set status = 'REJECTED'
where status = 'CLOSED';

alter table website_quote_requests
    add column converted_customer_id bigint references customer_profiles(id);

alter table website_quote_requests
    add column converted_rfq_id bigint unique references quote_requests(id);

alter table website_quote_requests
    add column converted_at timestamp with time zone;

create index idx_website_quote_requests_converted_customer
    on website_quote_requests(converted_customer_id);
