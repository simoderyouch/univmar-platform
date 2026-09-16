alter table quotations
    add column sent_at timestamp with time zone;
alter table quotations
    add column accepted_at timestamp with time zone;
update quotations
set sent_at = updated_at
where sent_at is null and status in ('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');
update quotations
set accepted_at = updated_at
where accepted_at is null and status = 'ACCEPTED';

alter table customer_orders
    add column currency varchar(3) not null default 'MAD';
alter table customer_orders
    add column confirmed_at timestamp with time zone;
alter table customer_orders
    add column cancelled_at timestamp with time zone;
update customer_orders
set confirmed_at = created_at
where confirmed_at is null;
alter table customer_orders alter column confirmed_at set not null;
update customer_orders
set cancelled_at = updated_at
where status = 'CANCELLED' and cancelled_at is null;
