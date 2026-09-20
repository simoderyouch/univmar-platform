package com.univmar.purchasing.domain;

import com.univmar.inventory.domain.InventoryItem;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "goods_receipt")
public class GoodsReceipt {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "purchase_order_item_id", nullable = false) private PurchaseOrderItem purchaseOrderItem;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "inventory_item_id") private InventoryItem inventoryItem;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    @Column(name = "received_at", nullable = false) private Instant receivedAt;
    @Column(columnDefinition = "text") private String note;
    protected GoodsReceipt() { }
    public GoodsReceipt(PurchaseOrderItem item, InventoryItem inventoryItem, BigDecimal quantityM2, String note) { this.id = UUID.randomUUID(); this.purchaseOrderItem = item; this.inventoryItem = inventoryItem; this.quantityM2 = quantityM2; this.note = note; this.receivedAt = Instant.now(); }
    public UUID getId() { return id; } public BigDecimal getQuantityM2() { return quantityM2; } public Instant getReceivedAt() { return receivedAt; } public String getNote() { return note; }
}
