-- A material identifies the stone itself. Surface treatments are variants of it.
alter table stone_variant add column variant_name varchar(100);

update stone_variant set variant_name = 'Standard' where variant_name is null;

-- Beige Taza: retain its first imported record and move every surface treatment below it.
update stone_material set name = 'Beige Taza' where id = '6b30d462-0fcd-5633-9d0a-29c0fdafe335';
update stone_variant set material_id = '6b30d462-0fcd-5633-9d0a-29c0fdafe335', variant_name = case id
    when '366bd06c-06f3-5fc2-a22f-a290ee23eed5' then 'Poli'
    when 'bee75c95-525f-5870-b390-be2e352e4dde' then 'Bouchardé'
    when '884df2a2-c6cc-5005-8a20-62cbf09facdb' then 'Vieille'
    when 'a46fd00b-0009-5faa-928f-e5333093b1aa' then 'Brut'
    when '2d77d2b5-6b65-5882-b471-82bafdd72678' then 'Veinage'
    when 'cd54ff4b-ab1a-5347-8f66-930a01df1c05' then 'Strié'
    when '98d2ca29-258e-5bf1-91f8-992192ab1e5e' then 'Sablé'
end
where id in ('366bd06c-06f3-5fc2-a22f-a290ee23eed5','bee75c95-525f-5870-b390-be2e352e4dde','884df2a2-c6cc-5005-8a20-62cbf09facdb','a46fd00b-0009-5faa-928f-e5333093b1aa','2d77d2b5-6b65-5882-b471-82bafdd72678','cd54ff4b-ab1a-5347-8f66-930a01df1c05','98d2ca29-258e-5bf1-91f8-992192ab1e5e');
update stone_variant set finish = 'POLISHED' where id = '366bd06c-06f3-5fc2-a22f-a290ee23eed5';
update stone_variant set finish = 'SANDBLASTED' where id = '98d2ca29-258e-5bf1-91f8-992192ab1e5e';
update quote_request_item set material_id = '6b30d462-0fcd-5633-9d0a-29c0fdafe335' where material_id in ('4ed78297-668d-53b9-a33a-0f3a00866bce','f9fb9399-cf6e-5561-afdf-4d0fe513eb26','acfee880-020d-5c06-9db6-b6a2a0bf02d1','6b7071d6-2ef9-50d3-b8ce-69635ff6d575','cf3b1b11-7494-59b3-beae-f3ae9fe39603','074a38f0-5456-5c50-a0ea-a629e29555a4');
delete from stone_material where id in ('4ed78297-668d-53b9-a33a-0f3a00866bce','f9fb9399-cf6e-5561-afdf-4d0fe513eb26','acfee880-020d-5c06-9db6-b6a2a0bf02d1','6b7071d6-2ef9-50d3-b8ce-69635ff6d575','cf3b1b11-7494-59b3-beae-f3ae9fe39603','074a38f0-5456-5c50-a0ea-a629e29555a4');

-- Gris Taza uses the same material-to-surface hierarchy.
update stone_material set name = 'Gris Taza' where id = '9f46b38d-c565-5da5-8518-8e9311aa3196';
update stone_variant set material_id = '9f46b38d-c565-5da5-8518-8e9311aa3196', variant_name = case id
    when 'eafdc935-a9ba-5561-afdf-4d0fe513eb26' then 'Poli'
    when 'a7c63370-4200-5dea-b9fe-b4b118970725' then 'Bouchardé'
    when '8d6f9546-ed14-5df4-befd-ea3847b3ece0' then 'Vieille'
    when '077b9426-5602-5ff3-82a5-a21c75861dc1' then 'Brut'
    when '1518a07a-93f6-5e4a-86da-44033a624ed3' then 'Veinage'
    when 'b47aedce-3f84-5cff-a157-a969f0b3b323' then 'Strié'
    when '83cc5cb1-b224-5e0d-8656-11a5a64d547a' then 'Sablé'
end
where id in ('eafdc935-a9ba-5561-afdf-4d0fe513eb26','a7c63370-4200-5dea-b9fe-b4b118970725','8d6f9546-ed14-5df4-befd-ea3847b3ece0','077b9426-5602-5ff3-82a5-a21c75861dc1','1518a07a-93f6-5e4a-86da-44033a624ed3','b47aedce-3f84-5cff-a157-a969f0b3b323','83cc5cb1-b224-5e0d-8656-11a5a64d547a');
update stone_variant set finish = 'POLISHED' where id = 'eafdc935-a9ba-5561-afdf-4d0fe513eb26';
update stone_variant set finish = 'SANDBLASTED' where id = '83cc5cb1-b224-5e0d-8656-11a5a64d547a';
update quote_request_item set material_id = '9f46b38d-c565-5da5-8518-8e9311aa3196' where material_id in ('6a9eebc2-4be5-5bb8-9159-7dbd4d89e864','8d64b85b-b40d-5ae8-9ea8-6998b823aa21','4c0f5e06-9442-5bf4-840d-dc5617794bb2','65090ada-a90f-594c-b855-4451c043a4f0','cc88453c-6b1a-5fab-9a58-2c3925f00958','4b579915-01d8-552c-a0b2-8103ed9c0120');
delete from stone_material where id in ('6a9eebc2-4be5-5bb8-9159-7dbd4d89e864','8d64b85b-b40d-5ae8-9ea8-6998b823aa21','4c0f5e06-9442-5bf4-840d-dc5617794bb2','65090ada-a90f-594c-b855-4451c043a4f0','cc88453c-6b1a-5fab-9a58-2c3925f00958','4b579915-01d8-552c-a0b2-8103ed9c0120');
