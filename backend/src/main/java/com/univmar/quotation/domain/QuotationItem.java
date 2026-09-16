package com.univmar.quotation.domain;

import com.univmar.catalog.domain.StoneVariant;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "quotation_items")
public class QuotationItem extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "quotation_id")
    private Quotation quotation;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommercialLineType type;
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private StoneVariant variant;
    @Column(nullable = false)
    private String descriptionSnapshot;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal quantity;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal lineTotal;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UnitType unit;
    @Column(nullable = false)
    private int displayOrder;

    protected QuotationItem() {
    }

    public QuotationItem(Quotation q, CommercialLineType type, StoneVariant variant, String description, BigDecimal quantity, UnitType unit, BigDecimal price, int displayOrder) {
        quotation = q;
        this.type = type;
        this.variant = variant;
        descriptionSnapshot = description;
        this.quantity = quantity;
        this.unit = unit;
        unitPrice = price;
        lineTotal = quantity.multiply(price);
        this.displayOrder = displayOrder;
    }

    public CommercialLineType getType() {
        return type;
    }

    public StoneVariant getVariant() {
        return variant;
    }

    public String getDescriptionSnapshot() {
        return descriptionSnapshot;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public UnitType getUnit() { return unit; }

    public int getDisplayOrder() { return displayOrder; }
}
