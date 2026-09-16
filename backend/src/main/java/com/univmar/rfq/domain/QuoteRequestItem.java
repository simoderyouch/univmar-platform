package com.univmar.rfq.domain;

import com.univmar.catalog.domain.StoneVariant;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "quote_request_items")
public class QuoteRequestItem extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest request;
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private StoneVariant variant;
    @Column(length = 1000)
    private String description;
    @Column(name = "quantity_m2", nullable = false, precision = 19, scale = 2)
    private BigDecimal quantityM2;
    private String note;

    protected QuoteRequestItem() {
    }

    public QuoteRequestItem(QuoteRequest request, StoneVariant variant, String description, BigDecimal quantity, String note) {
        this.request = request;
        this.variant = variant;
        this.description = description;
        quantityM2 = quantity;
        this.note = note;
    }

    public StoneVariant getVariant() {
        return variant;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getQuantityM2() {
        return quantityM2;
    }

    public String getNote() {
        return note;
    }
}
