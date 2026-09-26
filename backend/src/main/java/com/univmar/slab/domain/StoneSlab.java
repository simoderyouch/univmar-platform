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
    @Column(name = "remaining_surface_area_m2", nullable = false, precision = 14, scale = 3) private BigDecimal remainingSurfaceAreaM2;
    @Column(name = "photo_url", length = 1000) private String photoUrl;
    @Column(precision = 14, scale = 2) private BigDecimal cost;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private SlabStatus status = SlabStatus.AVAILABLE;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected StoneSlab() { }
    public StoneSlab(String slabNumber, InventoryItem inventoryItem, BigDecimal lengthMm, BigDecimal widthMm, String photoUrl, BigDecimal cost, String notes) { id = UUID.randomUUID(); this.slabNumber = slabNumber; this.inventoryItem = inventoryItem; this.lengthMm = lengthMm; this.widthMm = widthMm; surfaceAreaM2 = area(lengthMm, widthMm); remainingSurfaceAreaM2 = surfaceAreaM2; this.photoUrl = photoUrl; this.cost = cost; this.notes = notes; }
    public void update(String slabNumber, BigDecimal lengthMm, BigDecimal widthMm, String photoUrl, BigDecimal cost, String notes) { BigDecimal newSurface = area(lengthMm, widthMm); BigDecimal recoveredOffcutArea = surfaceAreaM2.subtract(remainingSurfaceAreaM2); if (newSurface.compareTo(recoveredOffcutArea) < 0) throw new IllegalArgumentException("The revised slab area is smaller than its recovered offcuts."); this.slabNumber = slabNumber; this.lengthMm = lengthMm; this.widthMm = widthMm; surfaceAreaM2 = newSurface; remainingSurfaceAreaM2 = newSurface.subtract(recoveredOffcutArea); this.photoUrl = photoUrl; this.cost = cost; this.notes = notes; }
    public void recoverOffcut(BigDecimal area) { if (area == null || area.signum() <= 0 || remainingSurfaceAreaM2.compareTo(area) < 0) throw new IllegalArgumentException(); remainingSurfaceAreaM2 = remainingSurfaceAreaM2.subtract(area); }
    public void reviseRecoveredOffcut(BigDecimal previousArea, BigDecimal revisedArea) { BigDecimal revisedRemaining = remainingSurfaceAreaM2.add(previousArea).subtract(revisedArea); if (revisedArea == null || revisedArea.signum() <= 0 || revisedRemaining.signum() < 0) throw new IllegalArgumentException(); remainingSurfaceAreaM2 = revisedRemaining; }
    public void hold() { if (status != SlabStatus.AVAILABLE) throw new IllegalStateException(); status = SlabStatus.HELD; }
    public void reserve(SalesOrderItem item) { if (status != SlabStatus.AVAILABLE && status != SlabStatus.HELD) throw new IllegalStateException(); reservedOrderItem = item; status = SlabStatus.RESERVED; }
    public void allocateForFabrication() { if (status != SlabStatus.AVAILABLE && status != SlabStatus.HELD) throw new IllegalStateException(); status = SlabStatus.IN_FABRICATION; }
    public void releaseFabrication() { if (status != SlabStatus.IN_FABRICATION) throw new IllegalStateException(); status = SlabStatus.AVAILABLE; }
    public void consumeForFabrication() { if (status != SlabStatus.IN_FABRICATION) throw new IllegalStateException(); status = SlabStatus.CONSUMED; }
    public void release() { if (status != SlabStatus.HELD && status != SlabStatus.RESERVED) throw new IllegalStateException(); reservedOrderItem = null; status = SlabStatus.AVAILABLE; }
    public void sell() { if (status != SlabStatus.RESERVED) throw new IllegalStateException(); status = SlabStatus.SOLD; }
    public void damage() { if (status != SlabStatus.AVAILABLE && status != SlabStatus.HELD) throw new IllegalStateException(); status = SlabStatus.DAMAGED; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    private BigDecimal area(BigDecimal length, BigDecimal width) { return length.multiply(width).divide(new BigDecimal("1000000"), 3, RoundingMode.HALF_UP); }
    public UUID getId() { return id; } public String getSlabNumber() { return slabNumber; } public InventoryItem getInventoryItem() { return inventoryItem; } public SalesOrderItem getReservedOrderItem() { return reservedOrderItem; } public BigDecimal getLengthMm() { return lengthMm; } public BigDecimal getWidthMm() { return widthMm; } public BigDecimal getSurfaceAreaM2() { return surfaceAreaM2; } public BigDecimal getRemainingSurfaceAreaM2() { return remainingSurfaceAreaM2; } public String getPhotoUrl() { return photoUrl; } public BigDecimal getCost() { return cost; } public SlabStatus getStatus() { return status; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; }
}
