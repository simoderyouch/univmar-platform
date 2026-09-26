-- The imported website catalog used QUARTZ; the ERP's canonical stone type is QUARTZITE.
update stone_material set stone_type = 'QUARTZITE' where stone_type = 'QUARTZ';
