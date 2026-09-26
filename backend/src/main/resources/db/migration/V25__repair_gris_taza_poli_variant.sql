-- Correct the imported Gris Taza polished variant after its consolidation.
update stone_variant
set variant_name = 'Poli', finish = 'POLISHED'
where id = 'eafdc935-a9ba-556c-95c2-30a498bf7482';
