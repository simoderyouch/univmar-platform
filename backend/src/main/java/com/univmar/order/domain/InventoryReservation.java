package com.univmar.order.domain;

import com.univmar.inventory.domain.InventoryItem;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventory_reservation")
public class InventoryReservation {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_item_id") private SalesOrderItem orderItem;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "inventory_item_id") private InventoryItem inventoryItem;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    @Column(name = "consumed_m2", nullable = false, precision = 14, scale = 3) private BigDecimal consumedM2 = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ReservationStatus status = ReservationStatus.ACTIVE;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "released_at") private Instant releasedAt;
    protected InventoryReservation() { }
    public InventoryReservation(SalesOrderItem orderItem, InventoryItem inventoryItem, BigDecimal quantityM2) { id = UUID.randomUUID(); this.orderItem = orderItem; this.inventoryItem = inventoryItem; this.quantityM2 = quantityM2; }
    public BigDecimal remainingM2() { return quantityM2.subtract(consumedM2); }
    public void consume(BigDecimal quantity) { if (status != ReservationStatus.ACTIVE || remainingM2().compareTo(quantity) < 0) throw new IllegalArgumentException("Reservation cannot cover this delivery."); consumedM2 = consumedM2.add(quantity); if (remainingM2().signum() == 0) status = ReservationStatus.CONSUMED; }
    public void release() { if (status != ReservationStatus.ACTIVE) throw new IllegalArgumentException("Reservation is no longer active."); status = ReservationStatus.RELEASED; releasedAt = Instant.now(); }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public SalesOrderItem getOrderItem() { return orderItem; } public InventoryItem getInventoryItem() { return inventoryItem; } public BigDecimal getQuantityM2() { return quantityM2; } public BigDecimal getConsumedM2() { return consumedM2; } public BigDecimal getRemainingM2() { return remainingM2(); } public ReservationStatus getStatus() { return status; } public Instant getCreatedAt() { return createdAt; } public Instant getReleasedAt() { return releasedAt; }
}
