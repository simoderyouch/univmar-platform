package com.univmar.invoice.domain;

import com.univmar.order.domain.SalesOrder;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "customer_invoice")
public class CustomerInvoice {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String number;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private SalesOrder order;
    private LocalDate issueDate;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 24) private InvoiceStatus status = InvoiceStatus.DRAFT;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal subtotal;
    @Column(name = "tax_total", nullable = false, precision = 14, scale = 2) private BigDecimal taxTotal;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal transport;
    @Column(name = "grand_total", nullable = false, precision = 14, scale = 2) private BigDecimal grandTotal;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "issued_at") private Instant issuedAt;
    @Column(name = "voided_at") private Instant voidedAt;
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true) private final List<InvoicePayment> payments = new ArrayList<>();

    protected CustomerInvoice() { }
    public CustomerInvoice(String number, SalesOrder order, LocalDate dueDate, String notes) {
        id = UUID.randomUUID(); this.number = number; this.order = order; this.dueDate = dueDate; this.notes = notes;
        subtotal = order.getSubtotal(); taxTotal = order.getTaxTotal(); transport = order.getTransport(); grandTotal = order.getGrandTotal();
    }
    public void issue(LocalDate date) { issueDate = date; status = InvoiceStatus.ISSUED; issuedAt = Instant.now(); }
    public void voidInvoice() { status = InvoiceStatus.VOID; voidedAt = Instant.now(); }
    public void addPayment(InvoicePayment payment) { payments.add(payment); refreshStatus(LocalDate.now()); }
    public void refreshStatus(LocalDate today) {
        if (status == InvoiceStatus.DRAFT || status == InvoiceStatus.VOID) return;
        int comparison = paidTotal().compareTo(grandTotal);
        if (comparison >= 0) status = InvoiceStatus.PAID;
        else if (paidTotal().signum() > 0) status = InvoiceStatus.PARTIALLY_PAID;
        else if (dueDate != null && dueDate.isBefore(today)) status = InvoiceStatus.OVERDUE;
        else status = InvoiceStatus.ISSUED;
    }
    public BigDecimal paidTotal() { return payments.stream().map(InvoicePayment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add); }
    public BigDecimal outstandingTotal() { return grandTotal.subtract(paidTotal()).max(BigDecimal.ZERO); }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public String getNumber() { return number; } public SalesOrder getOrder() { return order; } public LocalDate getIssueDate() { return issueDate; } public LocalDate getDueDate() { return dueDate; } public InvoiceStatus getStatus() { return status; } public BigDecimal getSubtotal() { return subtotal; } public BigDecimal getTaxTotal() { return taxTotal; } public BigDecimal getTransport() { return transport; } public BigDecimal getGrandTotal() { return grandTotal; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; } public Instant getIssuedAt() { return issuedAt; } public Instant getVoidedAt() { return voidedAt; } public List<InvoicePayment> getPayments() { return payments; }
}
