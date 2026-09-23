CREATE TABLE inventory_label (
    id UUID PRIMARY KEY,
    label_code VARCHAR(64) NOT NULL UNIQUE,
    target_type VARCHAR(30) NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_inventory_label_target UNIQUE (target_type, target_id)
);

CREATE INDEX idx_inventory_label_target ON inventory_label(target_type, target_id);
