alter table inventory_reservations
    add column reserved_at timestamp with time zone;
alter table inventory_reservations
    add column released_at timestamp with time zone;
alter table inventory_reservations
    add column consumed_at timestamp with time zone;
update inventory_reservations
set reserved_at = created_at,
    released_at = case when status = 'RELEASED' then updated_at else null end,
    consumed_at = case when status = 'CONSUMED' then updated_at else null end
where reserved_at is null;
alter table inventory_reservations alter column reserved_at set not null;
