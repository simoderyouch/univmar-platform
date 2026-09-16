package com.univmar.order.domain;

import com.univmar.catalog.domain.StoneVariant;
import com.univmar.quotation.domain.CommercialLineType;
import com.univmar.quotation.domain.UnitType;
import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private StoneVariant variant;
    @Column(nullable = false)
    private String descriptionSnapshot;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private CommercialLineType lineType;
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

    protected OrderItem() {
    }

    public OrderItem(Order order, CommercialLineType lineType, StoneVariant variant, String description, BigDecimal quantity, UnitType unit, BigDecimal price, BigDecimal lineTotal, int displayOrder) {
        this.order = order;
        this.variant = variant;
        this.lineType = lineType;
        descriptionSnapshot = description;
        this.quantity = quantity;
        this.unit = unit;
        unitPrice = price;
        this.lineTotal = lineTotal;
        this.displayOrder = displayOrder;
    }

    public StoneVariant getVariant() {
        return variant;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getDescriptionSnapshot() {
        return descriptionSnapshot;
    }

    public CommercialLineType getLineType() { return lineType; }

    public UnitType getUnit() { return unit; }

    public int getDisplayOrder() { return displayOrder; }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }
}
