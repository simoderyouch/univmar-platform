package com.univmar.order.domain;

import com.univmar.quotation.domain.Quotation;
import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "customer_orders")
public class Order extends BaseEntity {
    @OneToOne(optional = false)
    @JoinColumn(name = "quotation_id", unique = true)
    private Quotation quotation;
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;
    @Column(nullable = false, unique = true)
    private String orderNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.CONFIRMED;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalSnapshot;
    @Column(nullable = false, length = 3)
    private String currency;
    @Column(nullable = false)
    private Instant confirmedAt;
    private Instant cancelledAt;

    protected Order() {
    }

    public Order(Quotation quote, String number) {
        quotation = quote;
        customer = quote.getRequest().getCustomer();
        orderNumber = number;
        totalSnapshot = quote.getTotal();
        currency = quote.getCurrency();
        confirmedAt = Instant.now();
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public User getCustomer() {
        return customer;
    }

    public Quotation getQuotation() {
        return quotation;
    }

    public BigDecimal getTotalSnapshot() {
        return totalSnapshot;
    }

    public String getCurrency() {
        return currency;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public Instant getCancelledAt() {
        return cancelledAt;
    }

    public void reserve() {
        if (status != OrderStatus.CONFIRMED)
            throw new IllegalStateException("Only confirmed orders can be reserved");
        status = OrderStatus.RESERVED;
    }

    public void transition(OrderStatus next) {
        boolean legal = (status == OrderStatus.CONFIRMED && (next == OrderStatus.RESERVED || next == OrderStatus.CANCELLED))
                || (status == OrderStatus.RESERVED && (next == OrderStatus.PROCESSING || next == OrderStatus.CANCELLED))
                || (status == OrderStatus.PROCESSING && (next == OrderStatus.READY || next == OrderStatus.CANCELLED))
                || (status == OrderStatus.READY && next == OrderStatus.COMPLETED);
        if (!legal) throw new IllegalStateException("Illegal order status transition");
        status = next;
        if (next == OrderStatus.CANCELLED) cancelledAt = Instant.now();
    }
}
