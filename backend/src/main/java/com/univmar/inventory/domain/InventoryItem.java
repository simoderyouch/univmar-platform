package com.univmar.inventory.domain;

import com.univmar.catalog.domain.StoneVariant;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "inventory_item")
public class InventoryItem {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "variant_id", nullable = false) private StoneVariant variant;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "warehouse_id", nullable = false) private Warehouse warehouse;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "location_id", nullable = false) private WarehouseLocation location;
    @Column(name = "lot_number", length = 80) private String lotNumber;
    @Column(name = "bundle_number", length = 80) private String bundleNumber;
    @Column(name = "on_hand_m2", nullable = false, precision = 14, scale = 3) private BigDecimal onHandM2 = BigDecimal.ZERO;
    @Column(name = "reserved_m2", nullable = false, precision = 14, scale = 3) private BigDecimal reservedM2 = BigDecimal.ZERO;
    @Column(name = "damaged_m2", nullable = false, precision = 14, scale = 3) private BigDecimal damagedM2 = BigDecimal.ZERO;
    @Column(name = "cost_per_m2", precision = 14, scale = 2) private BigDecimal costPerM2;
    @Column(name = "supplier_name", length = 160) private String supplierName;
    @Column(name = "arrival_date") private LocalDate arrivalDate;
    @Version private long version;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected InventoryItem() { }
    public InventoryItem(StoneVariant variant, Warehouse warehouse, WarehouseLocation location, String lotNumber, String bundleNumber, BigDecimal costPerM2, String supplierName, LocalDate arrivalDate) {
        this.id = UUID.randomUUID(); this.variant = variant; this.warehouse = warehouse; this.location = location; this.lotNumber = lotNumber; this.bundleNumber = bundleNumber; this.costPerM2 = costPerM2; this.supplierName = supplierName; this.arrivalDate = arrivalDate;
    }
    public void receive(BigDecimal quantity) { onHandM2 = onHandM2.add(quantity); }
    public void adjustIn(BigDecimal quantity) { onHandM2 = onHandM2.add(quantity); }
    public void adjustOut(BigDecimal quantity) { requireAvailable(quantity); onHandM2 = onHandM2.subtract(quantity); }
    public void markDamaged(BigDecimal quantity) { requireAvailable(quantity); damagedM2 = damagedM2.add(quantity); }
    private void requireAvailable(BigDecimal quantity) { if (availableM2().compareTo(quantity) < 0) throw new IllegalArgumentException("Insufficient available quantity."); }
    public BigDecimal availableM2() { return onHandM2.subtract(reservedM2).subtract(damagedM2); }
    @PrePersist void createTimestamp() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public StoneVariant getVariant() { return variant; } public Warehouse getWarehouse() { return warehouse; } public WarehouseLocation getLocation() { return location; }
    public String getLotNumber() { return lotNumber; } public String getBundleNumber() { return bundleNumber; } public BigDecimal getOnHandM2() { return onHandM2; } public BigDecimal getReservedM2() { return reservedM2; } public BigDecimal getDamagedM2() { return damagedM2; } public BigDecimal getAvailableM2() { return availableM2(); } public BigDecimal getCostPerM2() { return costPerM2; } public String getSupplierName() { return supplierName; } public LocalDate getArrivalDate() { return arrivalDate; }
}
