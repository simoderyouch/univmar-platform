package com.univmar.purchasing.domain;

import com.univmar.catalog.domain.StoneVariant;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "purchase_order_item")
public class PurchaseOrderItem {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "purchase_order_id", nullable = false) private PurchaseOrder purchaseOrder;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "variant_id", nullable = false) private StoneVariant variant;
    @Column(name = "ordered_m2", nullable = false, precision = 14, scale = 3) private BigDecimal orderedM2;
    @Column(name = "received_m2", nullable = false, precision = 14, scale = 3) private BigDecimal receivedM2 = BigDecimal.ZERO;
    @Column(name = "cost_per_m2", precision = 14, scale = 2) private BigDecimal costPerM2;
    @Column(columnDefinition = "text") private String notes;
    protected PurchaseOrderItem() { }
    public PurchaseOrderItem(PurchaseOrder purchaseOrder, StoneVariant variant, BigDecimal orderedM2, BigDecimal costPerM2, String notes) { this.id = UUID.randomUUID(); this.purchaseOrder = purchaseOrder; this.variant = variant; this.orderedM2 = orderedM2; this.costPerM2 = costPerM2; this.notes = notes; }
    public void receive(BigDecimal quantity) { receivedM2 = receivedM2.add(quantity); }
    public UUID getId() { return id; } public StoneVariant getVariant() { return variant; } public BigDecimal getOrderedM2() { return orderedM2; } public BigDecimal getReceivedM2() { return receivedM2; } public BigDecimal getRemainingM2() { return orderedM2.subtract(receivedM2); } public BigDecimal getCostPerM2() { return costPerM2; } public String getNotes() { return notes; }
}
