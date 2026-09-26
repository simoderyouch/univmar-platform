package com.univmar.catalog.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stone_variant")
public class StoneVariant {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private StoneMaterial material;
    @Column(name = "thickness_mm", nullable = false, precision = 12, scale = 3)
    private BigDecimal thicknessMm;
    @Column(name = "format_description", length = 160)
    private String format;
    @Column(name = "variant_name", nullable = false, length = 100)
    private String variantName;
    @Column(name = "main_image_url", length = 1000)
    private String mainImageUrl;
    @ElementCollection
    @CollectionTable(name = "stone_variant_image", joinColumns = @JoinColumn(name = "variant_id"))
    @Column(name = "image_url", nullable = false, length = 1000)
    @OrderColumn(name = "position")
    private final List<String> galleryImageUrls = new ArrayList<>();
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected StoneVariant() {
    }

    public StoneVariant(StoneMaterial material, BigDecimal thicknessMm, String format, String mainImageUrl, List<String> galleryImageUrls, String variantName) {
        this.id = UUID.randomUUID();
        this.material = material;
        update(thicknessMm, format, mainImageUrl, galleryImageUrls, variantName);
    }

    public void update(BigDecimal thicknessMm, String format, String mainImageUrl, List<String> galleryImageUrls, String variantName) {
        this.thicknessMm = thicknessMm;
        this.format = format;
        this.variantName = variantName;
        this.mainImageUrl = mainImageUrl;
        this.galleryImageUrls.clear();
        if (galleryImageUrls != null) this.galleryImageUrls.addAll(galleryImageUrls);
    }

    @PrePersist
    void createTimestamp() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    void updateTimestamp() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public StoneMaterial getMaterial() {
        return material;
    }

    public BigDecimal getThicknessMm() {
        return thicknessMm;
    }

    public String getFormat() {
        return format;
    }

    public String getVariantName() {
        return variantName;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public List<String> getGalleryImageUrls() {
        return List.copyOf(galleryImageUrls);
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
