-- Mock stock is useful for development, but its seed note should not appear as
-- operational information in the slab workspace.
update stone_slab
set notes = null
where slab_number = 'SLAB-DEMO-001'
  and notes = 'Demo slab linked to order.';
