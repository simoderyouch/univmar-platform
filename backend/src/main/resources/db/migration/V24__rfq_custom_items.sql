alter table quote_request_items alter column variant_id drop not null;
alter table quote_request_items add column description varchar(1000);
