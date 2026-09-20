package com.univmar.order.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customer_order_event")
public class OrderEvent {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private SalesOrder order;
    @Column(nullable = false, length = 60) private String type;
    @Column(nullable = false, length = 500) private String message;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    protected OrderEvent() { }
    public OrderEvent(SalesOrder order, String type, String message) { id = UUID.randomUUID(); this.order = order; this.type = type; this.message = message; this.occurredAt = Instant.now(); }
    public UUID getId() { return id; } public String getType() { return type; } public String getMessage() { return message; } public Instant getOccurredAt() { return occurredAt; }
}
