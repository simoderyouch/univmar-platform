package com.univmar.invoice.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "invoice_payment")
public class InvoicePayment {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "invoice_id") private CustomerInvoice invoice;
    @Column(name = "payment_date", nullable = false) private LocalDate paymentDate;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private PaymentMethod method;
    @Column(length = 120) private String reference;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    protected InvoicePayment() { }
    public InvoicePayment(CustomerInvoice invoice, LocalDate paymentDate, BigDecimal amount, PaymentMethod method, String reference, String notes) { id = UUID.randomUUID(); this.invoice = invoice; this.paymentDate = paymentDate; this.amount = amount; this.method = method; this.reference = reference; this.notes = notes; }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public CustomerInvoice getInvoice() { return invoice; } public LocalDate getPaymentDate() { return paymentDate; } public BigDecimal getAmount() { return amount; } public PaymentMethod getMethod() { return method; } public String getReference() { return reference; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; }
}
