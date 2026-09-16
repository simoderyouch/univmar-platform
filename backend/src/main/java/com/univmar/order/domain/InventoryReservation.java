package com.univmar.order.domain;

import com.univmar.inventory.domain.InventoryItem;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_reservations")
public class InventoryReservation extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;
    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;
    @Column(name = "quantity_m2", nullable = false, precision = 19, scale = 2)
    private BigDecimal quantityM2;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.ACTIVE;

    protected InventoryReservation() {
    }

    public InventoryReservation(OrderItem line, InventoryItem item, BigDecimal quantity) {
        orderItem = line;
        inventoryItem = item;
        quantityM2 = quantity;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public BigDecimal getQuantityM2() {
        return quantityM2;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void release() {
        status = ReservationStatus.RELEASED;
    }

    public void consume() {
        status = ReservationStatus.CONSUMED;
    }
}
