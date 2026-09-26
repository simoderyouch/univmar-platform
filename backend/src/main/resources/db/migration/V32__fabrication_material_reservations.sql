ALTER TABLE fabrication_material ADD COLUMN reserved_quantity_m2 NUMERIC(14,3) NOT NULL DEFAULT 0;
ALTER TABLE fabrication_material ADD COLUMN released_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_fabrication_material_active ON fabrication_material(material_type, material_id, released_at);
