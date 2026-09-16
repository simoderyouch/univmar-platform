package com.univmar.inventory.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "stock_movements")
public class StockMovement extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private MovementType type;
    @Column(name = "quantity_m2", nullable = false, precision = 19, scale = 2)
    private BigDecimal quantityM2;
    @Column(nullable = false, length = 120)
    private String referenceType;
    @Column(nullable = false)
    private Long referenceId;
    @Column(nullable = false, length = 500)
    private String reason;
    @Column(nullable = false)
    private Long actorId;

    protected StockMovement() {
    }

    public StockMovement(InventoryItem item, MovementType type, BigDecimal quantityM2, String referenceType, Long referenceId, String reason, Long actorId) {
        this.inventoryItem = item;
        this.type = type;
        this.quantityM2 = quantityM2;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.reason = reason;
        this.actorId = actorId;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public MovementType getType() {
        return type;
    }

    public BigDecimal getQuantityM2() {
        return quantityM2;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public String getReason() {
        return reason;
    }

    public Long getActorId() {
        return actorId;
    }
}
