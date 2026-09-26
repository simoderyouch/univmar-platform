-- A named surface variation is the sole commercial variant descriptor.
-- Preserve legacy finishes only where a named variation was never supplied.
update stone_variant
set variant_name = case finish
    when 'POLISHED' then 'Polished'
    when 'HONED' then 'Honed'
    when 'BRUSHED' then 'Brushed'
    when 'LEATHERED' then 'Leathered'
    when 'FLAMED' then 'Flamed'
    when 'SANDBLASTED' then 'Sandblasted'
    else 'Standard'
end
where variant_name is null or trim(variant_name) = '';

alter table stone_variant drop column finish;
