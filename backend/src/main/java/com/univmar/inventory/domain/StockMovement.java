package com.univmar.inventory.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "stock_movement")
public class StockMovement {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "inventory_item_id", nullable = false) private InventoryItem inventoryItem;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private MovementType type;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    @Column(nullable = false, length = 500) private String reason;
    @Column(length = 2000) private String comment;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    @Column(name = "source_reference", length = 60) private String sourceReference;
    @Column(name = "source_supplier", length = 180) private String sourceSupplier;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected StockMovement() { }
    public StockMovement(InventoryItem inventoryItem, MovementType type, BigDecimal quantityM2, String reason, String comment, Instant occurredAt) { this.id = UUID.randomUUID(); this.inventoryItem = inventoryItem; this.type = type; this.quantityM2 = quantityM2; this.reason = reason; this.comment = comment; this.occurredAt = occurredAt == null ? Instant.now() : occurredAt; }
    public StockMovement(InventoryItem inventoryItem, MovementType type, BigDecimal quantityM2, String reason, String comment, Instant occurredAt, String sourceReference, String sourceSupplier) { this(inventoryItem, type, quantityM2, reason, comment, occurredAt); this.sourceReference = sourceReference; this.sourceSupplier = sourceSupplier; }
    @PrePersist void createTimestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public MovementType getType() { return type; } public BigDecimal getQuantityM2() { return quantityM2; } public String getReason() { return reason; } public String getComment() { return comment; } public Instant getOccurredAt() { return occurredAt; } public String getSourceReference() { return sourceReference; } public String getSourceSupplier() { return sourceSupplier; }
}
