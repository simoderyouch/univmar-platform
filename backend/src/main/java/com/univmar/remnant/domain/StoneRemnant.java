package com.univmar.remnant.domain;

import com.univmar.order.domain.SalesOrderItem;
import com.univmar.slab.domain.StoneSlab;
import jakarta.persistence.*;
import java.math.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "stone_remnant")
public class StoneRemnant {
    @Id private UUID id;
    @Column(name = "remnant_number", nullable = false, unique = true, length = 80) private String remnantNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "parent_slab_id", nullable = false) private StoneSlab parentSlab;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reserved_order_item_id") private SalesOrderItem reservedOrderItem;
    @Column(name = "length_mm", nullable = false, precision = 14, scale = 2) private BigDecimal lengthMm;
    @Column(name = "width_mm", nullable = false, precision = 14, scale = 2) private BigDecimal widthMm;
    @Column(name = "surface_area_m2", nullable = false, precision = 14, scale = 3) private BigDecimal surfaceAreaM2;
    @Column(name = "photo_url", length = 1000) private String photoUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private RemnantStatus status = RemnantStatus.AVAILABLE;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected StoneRemnant() { }
    public StoneRemnant(String number, StoneSlab parentSlab, BigDecimal lengthMm, BigDecimal widthMm, String photoUrl, String notes) { id = UUID.randomUUID(); remnantNumber = number; this.parentSlab = parentSlab; this.lengthMm = lengthMm; this.widthMm = widthMm; surfaceAreaM2 = lengthMm.multiply(widthMm).divide(new BigDecimal("1000000"), 3, RoundingMode.HALF_UP); this.photoUrl = photoUrl; this.notes = notes; }
    public void hold() { if (status != RemnantStatus.AVAILABLE) throw new IllegalStateException(); status = RemnantStatus.HELD; }
    public void reserve(SalesOrderItem item) { if (status != RemnantStatus.AVAILABLE && status != RemnantStatus.HELD) throw new IllegalStateException(); reservedOrderItem = item; status = RemnantStatus.RESERVED; }
    public void release() { if (status != RemnantStatus.HELD && status != RemnantStatus.RESERVED) throw new IllegalStateException(); reservedOrderItem = null; status = RemnantStatus.AVAILABLE; }
    public void consume() { if (status != RemnantStatus.RESERVED) throw new IllegalStateException(); status = RemnantStatus.CONSUMED; }
    public void damage() { if (status != RemnantStatus.AVAILABLE && status != RemnantStatus.HELD) throw new IllegalStateException(); status = RemnantStatus.DAMAGED; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getRemnantNumber() { return remnantNumber; } public StoneSlab getParentSlab() { return parentSlab; } public SalesOrderItem getReservedOrderItem() { return reservedOrderItem; } public BigDecimal getLengthMm() { return lengthMm; } public BigDecimal getWidthMm() { return widthMm; } public BigDecimal getSurfaceAreaM2() { return surfaceAreaM2; } public String getPhotoUrl() { return photoUrl; } public RemnantStatus getStatus() { return status; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; }
}
