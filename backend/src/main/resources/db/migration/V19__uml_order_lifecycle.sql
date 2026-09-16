-- Translate the prior V1 names into the UML order lifecycle without losing existing orders.
update customer_orders
set status = case status
    when 'CONFIRMED' then 'RESERVED'
    when 'PREPARING' then 'PROCESSING'
    when 'DELIVERED' then 'COMPLETED'
    else status
end;
