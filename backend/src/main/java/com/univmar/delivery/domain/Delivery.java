package com.univmar.delivery.domain;

import com.univmar.order.domain.SalesOrder;
import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "delivery")
public class Delivery {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String number;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private SalesOrder order;
    @Column(name = "scheduled_date") private LocalDate scheduledDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private DeliveryStatus status = DeliveryStatus.PLANNED;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "dispatched_at") private Instant dispatchedAt;
    @Column(name = "delivered_at") private Instant deliveredAt;
    @Column(name = "cancelled_at") private Instant cancelledAt;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true) private final List<DeliveryItem> items = new ArrayList<>();
    protected Delivery() { }
    public Delivery(String number, SalesOrder order, LocalDate scheduledDate, String notes) { id = UUID.randomUUID(); this.number = number; this.order = order; this.scheduledDate = scheduledDate; this.notes = notes; }
    public void addItem(DeliveryItem item) { items.add(item); }
    public void prepare() { status = DeliveryStatus.PREPARING; }
    public void dispatch() { status = DeliveryStatus.DISPATCHED; dispatchedAt = Instant.now(); }
    public void confirmDelivered() { status = DeliveryStatus.DELIVERED; deliveredAt = Instant.now(); }
    public void cancel() { status = DeliveryStatus.CANCELLED; cancelledAt = Instant.now(); }
    public void fail() { status = DeliveryStatus.FAILED; }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public String getNumber() { return number; } public SalesOrder getOrder() { return order; } public LocalDate getScheduledDate() { return scheduledDate; } public DeliveryStatus getStatus() { return status; } public String getNotes() { return notes; } public Instant getDispatchedAt() { return dispatchedAt; } public Instant getDeliveredAt() { return deliveredAt; } public Instant getCancelledAt() { return cancelledAt; } public Instant getCreatedAt() { return createdAt; } public List<DeliveryItem> getItems() { return items; }
}
