package com.univmar.label.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventory_label", uniqueConstraints = @UniqueConstraint(name = "uq_inventory_label_target", columnNames = {"target_type", "target_id"}))
public class InventoryLabel {
    @Id private UUID id;
    @Column(name = "label_code", nullable = false, unique = true, length = 64) private String labelCode;
    @Enumerated(EnumType.STRING) @Column(name = "target_type", nullable = false, length = 30) private LabelTargetType targetType;
    @Column(name = "target_id", nullable = false) private UUID targetId;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected InventoryLabel() { }
    public InventoryLabel(LabelTargetType targetType, UUID targetId) { id = UUID.randomUUID(); labelCode = UUID.randomUUID().toString(); this.targetType = targetType; this.targetId = targetId; }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public String getLabelCode() { return labelCode; } public LabelTargetType getTargetType() { return targetType; } public UUID getTargetId() { return targetId; } public Instant getCreatedAt() { return createdAt; }
}
