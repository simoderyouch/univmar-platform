create table quote_request_event (
  id uuid primary key,
  rfq_id uuid not null references quote_request(id) on delete cascade,
  message varchar(300) not null,
  occurred_at timestamp with time zone not null
);
create index idx_quote_request_event_rfq on quote_request_event(rfq_id, occurred_at);
