package com.univmar.order.domain;

import com.univmar.quotation.domain.QuotationItem;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "customer_order_item")
public class SalesOrderItem {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private SalesOrder order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "quotation_item_id") private QuotationItem quotationItem;
    @Column(name = "variant_id", nullable = false) private UUID variantId;
    @Column(name = "material_name", nullable = false, length = 180) private String materialName;
    @Column(name = "variant_label", nullable = false, length = 220) private String variantLabel;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    @Column(name = "unit_price", nullable = false, precision = 14, scale = 2) private BigDecimal unitPrice;
    @Column(name = "discount_percent", nullable = false, precision = 5, scale = 2) private BigDecimal discountPercent;
    @Column(name = "tax_percent", nullable = false, precision = 5, scale = 2) private BigDecimal taxPercent;
    @Column(name = "line_total", nullable = false, precision = 14, scale = 2) private BigDecimal lineTotal;
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true) private final List<InventoryReservation> reservations = new ArrayList<>();
    protected SalesOrderItem() { }
    public SalesOrderItem(SalesOrder order, QuotationItem quote) { id = UUID.randomUUID(); this.order = order; quotationItem = quote; variantId = quote.getVariantId(); materialName = quote.getMaterialName(); variantLabel = quote.getVariantLabel(); quantityM2 = quote.getQuantityM2(); unitPrice = quote.getUnitPrice(); discountPercent = quote.getDiscountPercent(); taxPercent = quote.getTaxPercent(); lineTotal = quote.net().add(quote.tax()); }
    public void addReservation(InventoryReservation reservation) { reservations.add(reservation); }
    public UUID getId() { return id; } public SalesOrder getOrder() { return order; } public UUID getVariantId() { return variantId; } public String getMaterialName() { return materialName; } public String getVariantLabel() { return variantLabel; } public BigDecimal getQuantityM2() { return quantityM2; } public BigDecimal getUnitPrice() { return unitPrice; } public BigDecimal getDiscountPercent() { return discountPercent; } public BigDecimal getTaxPercent() { return taxPercent; } public BigDecimal getLineTotal() { return lineTotal; } public List<InventoryReservation> getReservations() { return reservations; }
}
