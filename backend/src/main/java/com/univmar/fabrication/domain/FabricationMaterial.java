package com.univmar.fabrication.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "fabrication_material", uniqueConstraints = @UniqueConstraint(name = "uq_fabrication_material", columnNames = {"fabrication_job_id", "material_type", "material_id"}))
public class FabricationMaterial {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "fabrication_job_id", nullable = false) private FabricationJob job;
    @Enumerated(EnumType.STRING) @Column(name = "material_type", nullable = false, length = 30) private FabricationMaterialType materialType;
    @Column(name = "material_id", nullable = false) private UUID materialId;
    @Column(length = 2000) private String notes;
    protected FabricationMaterial() { }
    public FabricationMaterial(FabricationJob job, FabricationMaterialType type, UUID materialId, String notes) { id = UUID.randomUUID(); this.job = job; materialType = type; this.materialId = materialId; this.notes = notes; }
    public UUID getId() { return id; } public FabricationJob getJob() { return job; } public FabricationMaterialType getMaterialType() { return materialType; } public UUID getMaterialId() { return materialId; } public String getNotes() { return notes; }
}
