package com.univmar.inventory.domain;

import com.univmar.catalog.domain.StoneVariant;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;

@Entity @Table(name = "inventory_items")
public class InventoryItem extends BaseEntity {
    @OneToOne(optional = false) @JoinColumn(name = "variant_id", nullable = false, unique = true) private StoneVariant variant;
    @Column(name = "on_hand_m2", nullable = false, precision = 19, scale = 2) private BigDecimal onHandM2 = BigDecimal.ZERO;
    @Column(name = "reserved_m2", nullable = false, precision = 19, scale = 2) private BigDecimal reservedM2 = BigDecimal.ZERO;
    @Column(name = "min_stock_m2", nullable = false, precision = 19, scale = 2) private BigDecimal minStockM2 = BigDecimal.ZERO;
    @Column(nullable = false) private boolean active = true;
    @Version private Long version;
    protected InventoryItem() { }
    public InventoryItem(StoneVariant variant, BigDecimal minStockM2) { this.variant = variant; this.minStockM2 = minStockM2; }
    public StoneVariant getVariant() { return variant; } public BigDecimal getOnHandM2() { return onHandM2; } public BigDecimal getReservedM2() { return reservedM2; }
    public BigDecimal getMinStockM2() { return minStockM2; } public BigDecimal availableM2() { return onHandM2.subtract(reservedM2); }
    public boolean isActive() { return active; }
    public void updateMinStock(BigDecimal minStockM2) { this.minStockM2 = minStockM2; }
    public void archive() { if (reservedM2.compareTo(BigDecimal.ZERO) > 0) throw ApiException.conflict("INVENTORY_RESERVED", "Inventory with reserved stock cannot be archived"); active = false; }
    public void stockIn(BigDecimal quantity) { onHandM2 = onHandM2.add(quantity); }
    public void adjust(BigDecimal delta) { if (onHandM2.add(delta).compareTo(reservedM2) < 0) throw ApiException.conflict("INVALID_INVENTORY_ADJUSTMENT", "Adjustment cannot reduce on-hand stock below reserved stock"); onHandM2 = onHandM2.add(delta); }
    public void reserve(BigDecimal quantity) { if (availableM2().compareTo(quantity) < 0) throw ApiException.conflict("INSUFFICIENT_STOCK", "Insufficient available stock"); reservedM2 = reservedM2.add(quantity); }
    public void release(BigDecimal quantity) { if (reservedM2.compareTo(quantity) < 0) throw new IllegalStateException("Cannot release more than reserved"); reservedM2 = reservedM2.subtract(quantity); }
    public void consume(BigDecimal quantity) { if (reservedM2.compareTo(quantity) < 0 || onHandM2.compareTo(quantity) < 0) throw new IllegalStateException("Invalid inventory consumption"); reservedM2 = reservedM2.subtract(quantity); onHandM2 = onHandM2.subtract(quantity); }
}
