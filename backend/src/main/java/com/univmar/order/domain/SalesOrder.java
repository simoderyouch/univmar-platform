package com.univmar.order.domain;

import com.univmar.customer.domain.Customer;
import com.univmar.project.domain.Project;
import com.univmar.quotation.domain.Quotation;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "customer_order")
public class SalesOrder {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String number;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "quotation_id") private Quotation quotation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "customer_id") private Customer customer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "project_id") private Project project;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private OrderStatus status = OrderStatus.PENDING;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal subtotal;
    @Column(name = "tax_total", nullable = false, precision = 14, scale = 2) private BigDecimal taxTotal;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal transport;
    @Column(name = "grand_total", nullable = false, precision = 14, scale = 2) private BigDecimal grandTotal;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "confirmed_at") private Instant confirmedAt;
    @Column(name = "cancelled_at") private Instant cancelledAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) private final List<SalesOrderItem> items = new ArrayList<>();
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) private final List<OrderEvent> events = new ArrayList<>();

    protected SalesOrder() { }
    public SalesOrder(String number, Quotation quotation) {
        id = UUID.randomUUID(); this.number = number; this.quotation = quotation; customer = quotation.getCustomer(); project = quotation.getProject();
        subtotal = quotation.getSubtotal(); taxTotal = quotation.getTaxTotal(); transport = quotation.getTransport(); grandTotal = quotation.getGrandTotal();
    }
    public void addItem(SalesOrderItem item) { items.add(item); }
    public void event(String type, String message) { events.add(new OrderEvent(this, type, message)); }
    public void confirm() { status = OrderStatus.CONFIRMED; confirmedAt = Instant.now(); event("ORDER_CONFIRMED", "Order confirmed"); }
    public void cancel() { status = OrderStatus.CANCELLED; cancelledAt = Instant.now(); event("ORDER_CANCELLED", "Order cancelled and active stock reservations released"); }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public String getNumber() { return number; } public Quotation getQuotation() { return quotation; } public Customer getCustomer() { return customer; } public Project getProject() { return project; } public OrderStatus getStatus() { return status; } public BigDecimal getSubtotal() { return subtotal; } public BigDecimal getTaxTotal() { return taxTotal; } public BigDecimal getTransport() { return transport; } public BigDecimal getGrandTotal() { return grandTotal; } public Instant getCreatedAt() { return createdAt; } public Instant getConfirmedAt() { return confirmedAt; } public Instant getCancelledAt() { return cancelledAt; } public List<SalesOrderItem> getItems() { return items; } public List<OrderEvent> getEvents() { return events; }
}
