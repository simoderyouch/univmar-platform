CREATE TABLE stone_remnant (
    id UUID PRIMARY KEY,
    remnant_number VARCHAR(80) NOT NULL UNIQUE,
    parent_slab_id UUID NOT NULL REFERENCES stone_slab(id),
    reserved_order_item_id UUID REFERENCES customer_order_item(id),
    length_mm NUMERIC(14,2) NOT NULL,
    width_mm NUMERIC(14,2) NOT NULL,
    surface_area_m2 NUMERIC(14,3) NOT NULL,
    photo_url VARCHAR(1000),
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_stone_remnant_status ON stone_remnant(status);
CREATE INDEX idx_stone_remnant_parent ON stone_remnant(parent_slab_id);
CREATE INDEX idx_stone_remnant_order_item ON stone_remnant(reserved_order_item_id);
