package com.univmar.quotation.domain;

import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "quotations")
public class Quotation extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "request_id")
    private QuoteRequest request;
    @ManyToOne
    @JoinColumn(name = "revision_of_id")
    private Quotation revisionOf;
    @Column(nullable = false)
    private int revisionNumber = 1;
    @Column(nullable = false, unique = true)
    private String quoteNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuotationStatus status = QuotationStatus.DRAFT;
    @Column(nullable = false)
    private LocalDate validUntil;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal subtotal;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal discount;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal tax;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal total;
    @Column(nullable = false, length = 3)
    private String currency = "MAD";
    private Instant sentAt;
    private Instant acceptedAt;

    protected Quotation() {
    }

    public Quotation(QuoteRequest request, String number, LocalDate validUntil, BigDecimal subtotal, BigDecimal discount, BigDecimal tax, BigDecimal total) {
        this(request, null, 1, number, validUntil, subtotal, discount, tax, total);
    }

    public Quotation(QuoteRequest request, Quotation revisionOf, int revisionNumber, String number, LocalDate validUntil, BigDecimal subtotal, BigDecimal discount, BigDecimal tax, BigDecimal total) {
        this.request = request;
        this.revisionOf = revisionOf;
        this.revisionNumber = revisionNumber;
        quoteNumber = number;
        this.validUntil = validUntil;
        this.subtotal = subtotal;
        this.discount = discount;
        this.tax = tax;
        this.total = total;
    }

    public QuoteRequest getRequest() {
        return request;
    }

    public Quotation getRevisionOf() {
        return revisionOf;
    }

    public int getRevisionNumber() {
        return revisionNumber;
    }

    public QuotationStatus getStatus() {
        return status;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public String getQuoteNumber() {
        return quoteNumber;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getCurrency() {
        return currency;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public Instant getAcceptedAt() {
        return acceptedAt;
    }

    public void send() {
        if (status != QuotationStatus.DRAFT) throw new IllegalStateException("Only draft quotations can be sent");
        if (validUntil.isBefore(LocalDate.now()))
            throw new IllegalStateException("Quotation validity must be today or later");
        status = QuotationStatus.SENT;
        sentAt = Instant.now();
        request.quoted();
    }

    public void accept() {
        status = QuotationStatus.ACCEPTED;
        acceptedAt = Instant.now();
    }

    public void reject() {
        if (status != QuotationStatus.SENT) throw new IllegalStateException("Only sent quotations can be rejected");
        status = QuotationStatus.REJECTED;
    }

    public void expire() {
        if (status == QuotationStatus.SENT) status = QuotationStatus.EXPIRED;
    }

    public void cancel() {
        if (status != QuotationStatus.DRAFT && status != QuotationStatus.SENT)
            throw new IllegalStateException("Only draft or sent quotations can be cancelled");
        status = QuotationStatus.CANCELLED;
    }

    public void supersede() {
        if (status != QuotationStatus.DRAFT && status != QuotationStatus.SENT)
            throw new IllegalStateException("Only draft or sent quotations can be superseded");
        status = QuotationStatus.SUPERSEDED;
    }
}
