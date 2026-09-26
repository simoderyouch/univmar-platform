alter table stone_slab add column remaining_surface_area_m2 numeric(14,3);
update stone_slab s set remaining_surface_area_m2 = case when s.surface_area_m2 > coalesce((select sum(r.surface_area_m2) from stone_remnant r where r.parent_slab_id = s.id), 0) then s.surface_area_m2 - coalesce((select sum(r.surface_area_m2) from stone_remnant r where r.parent_slab_id = s.id), 0) else 0 end;
alter table stone_slab alter column remaining_surface_area_m2 set not null;
alter table stone_slab add constraint chk_stone_slab_remaining_surface check (remaining_surface_area_m2 >= 0 and remaining_surface_area_m2 <= surface_area_m2);
