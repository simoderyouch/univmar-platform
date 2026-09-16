update stock_movements
set type = case
    when type = 'STOCK_IN' then 'RECEIPT'
    when type = 'SALE' then 'ISSUE'
    when type = 'ADJUSTMENT' and quantity_m2 >= 0 then 'ADJUSTMENT_IN'
    when type = 'ADJUSTMENT' then 'ADJUSTMENT_OUT'
    else type
end;
