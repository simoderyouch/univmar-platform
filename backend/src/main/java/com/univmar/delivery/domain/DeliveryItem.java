package com.univmar.delivery.domain;

import com.univmar.order.domain.SalesOrderItem;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "delivery_item")
public class DeliveryItem {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "delivery_id") private Delivery delivery;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_item_id") private SalesOrderItem orderItem;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    protected DeliveryItem() { }
    public DeliveryItem(Delivery delivery, SalesOrderItem orderItem, BigDecimal quantityM2) { id = UUID.randomUUID(); this.delivery = delivery; this.orderItem = orderItem; this.quantityM2 = quantityM2; }
    public UUID getId() { return id; } public SalesOrderItem getOrderItem() { return orderItem; } public BigDecimal getQuantityM2() { return quantityM2; }
}
