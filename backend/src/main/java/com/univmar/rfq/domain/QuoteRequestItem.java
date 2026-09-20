package com.univmar.rfq.domain;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneVariant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "quote_request_item")
public class QuoteRequestItem {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "rfq_id", nullable = false) private QuoteRequest rfq;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "material_id", nullable = false) private StoneMaterial material;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "variant_id", nullable = false) private StoneVariant variant;
    @Column(name = "quantity_m2", nullable = false, precision = 14, scale = 3) private BigDecimal quantityM2;
    @Column(nullable = false, length = 20) private String unit;
    @Column(name = "requested_dimensions", length = 180) private String requestedDimensions;
    @Column(name = "processing_service", length = 180) private String processingService;
    @Column(columnDefinition = "text") private String comment;
    protected QuoteRequestItem() { }
    public QuoteRequestItem(QuoteRequest rfq, StoneMaterial material, StoneVariant variant, BigDecimal quantityM2, String unit, String requestedDimensions, String processingService, String comment) {
        id = UUID.randomUUID(); this.rfq = rfq; this.material = material; this.variant = variant; this.quantityM2 = quantityM2; this.unit = unit; this.requestedDimensions = requestedDimensions; this.processingService = processingService; this.comment = comment;
    }
    public UUID getId() { return id; } public StoneMaterial getMaterial() { return material; } public StoneVariant getVariant() { return variant; }
    public BigDecimal getQuantityM2() { return quantityM2; } public String getUnit() { return unit; } public String getRequestedDimensions() { return requestedDimensions; }
    public String getProcessingService() { return processingService; } public String getComment() { return comment; }
}
