package com.univmar.slab.domain;

import com.univmar.inventory.domain.InventoryItem;
import com.univmar.order.domain.SalesOrderItem;
import jakarta.persistence.*;
import java.math.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "stone_slab")
public class StoneSlab {
    @Id private UUID id;
    @Column(name = "slab_number", nullable = false, unique = true, length = 80) private String slabNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "inventory_item_id") private InventoryItem inventoryItem;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reserved_order_item_id") private SalesOrderItem reservedOrderItem;
    @Column(name = "length_mm", nullable = false, precision = 14, scale = 2) private BigDecimal lengthMm;
    @Column(name = "width_mm", nullable = false, precision = 14, scale = 2) private BigDecimal widthMm;
    @Column(name = "surface_area_m2", nullable = false, precision = 14, scale = 3) private BigDecimal surfaceAreaM2;
    @Column(name = "photo_url", length = 1000) private String photoUrl;
    @Column(precision = 14, scale = 2) private BigDecimal cost;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private SlabStatus status = SlabStatus.AVAILABLE;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected StoneSlab() { }
    public StoneSlab(String slabNumber, InventoryItem inventoryItem, BigDecimal lengthMm, BigDecimal widthMm, String photoUrl, BigDecimal cost, String notes) { id = UUID.randomUUID(); this.slabNumber = slabNumber; this.inventoryItem = inventoryItem; this.lengthMm = lengthMm; this.widthMm = widthMm; surfaceAreaM2 = lengthMm.multiply(widthMm).divide(new BigDecimal("1000000"), 3, RoundingMode.HALF_UP); this.photoUrl = photoUrl; this.cost = cost; this.notes = notes; }
    public void hold() { if (status != SlabStatus.AVAILABLE) throw new IllegalStateException(); status = SlabStatus.HELD; }
    public void reserve(SalesOrderItem item) { if (status != SlabStatus.AVAILABLE && status != SlabStatus.HELD) throw new IllegalStateException(); reservedOrderItem = item; status = SlabStatus.RESERVED; }
    public void release() { if (status != SlabStatus.HELD && status != SlabStatus.RESERVED) throw new IllegalStateException(); reservedOrderItem = null; status = SlabStatus.AVAILABLE; }
    public void sell() { if (status != SlabStatus.RESERVED) throw new IllegalStateException(); status = SlabStatus.SOLD; }
    public void damage() { if (status != SlabStatus.AVAILABLE && status != SlabStatus.HELD) throw new IllegalStateException(); status = SlabStatus.DAMAGED; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getSlabNumber() { return slabNumber; } public InventoryItem getInventoryItem() { return inventoryItem; } public SalesOrderItem getReservedOrderItem() { return reservedOrderItem; } public BigDecimal getLengthMm() { return lengthMm; } public BigDecimal getWidthMm() { return widthMm; } public BigDecimal getSurfaceAreaM2() { return surfaceAreaM2; } public String getPhotoUrl() { return photoUrl; } public BigDecimal getCost() { return cost; } public SlabStatus getStatus() { return status; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; }
}
