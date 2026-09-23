CREATE TABLE fabrication_job (
    id UUID PRIMARY KEY,
    job_number VARCHAR(40) NOT NULL UNIQUE,
    order_id UUID NOT NULL REFERENCES customer_order(id),
    title VARCHAR(180) NOT NULL,
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    due_date DATE,
    measurement_notes TEXT,
    drawing_url VARCHAR(1000),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ready_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE fabrication_operation (
    id UUID PRIMARY KEY,
    fabrication_job_id UUID NOT NULL REFERENCES fabrication_job(id),
    operation_type VARCHAR(40) NOT NULL,
    sequence_no INTEGER NOT NULL,
    notes VARCHAR(2000),
    status VARCHAR(20) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_fabrication_operation_sequence UNIQUE (fabrication_job_id, sequence_no)
);

CREATE TABLE fabrication_material (
    id UUID PRIMARY KEY,
    fabrication_job_id UUID NOT NULL REFERENCES fabrication_job(id),
    material_type VARCHAR(30) NOT NULL,
    material_id UUID NOT NULL,
    notes VARCHAR(2000)
);

CREATE INDEX idx_fabrication_job_status ON fabrication_job(status);
CREATE INDEX idx_fabrication_job_order ON fabrication_job(order_id);
CREATE INDEX idx_fabrication_material_job ON fabrication_material(fabrication_job_id);
