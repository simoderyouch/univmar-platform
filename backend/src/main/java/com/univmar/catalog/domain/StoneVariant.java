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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Finish finish;
    @Column(name = "format_description", length = 160)
    private String format;
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

    public StoneVariant(StoneMaterial material, BigDecimal thicknessMm, Finish finish, String format, String mainImageUrl, List<String> galleryImageUrls) {
        this.id = UUID.randomUUID();
        this.material = material;
        update(thicknessMm, finish, format, mainImageUrl, galleryImageUrls);
    }

    public void update(BigDecimal thicknessMm, Finish finish, String format, String mainImageUrl, List<String> galleryImageUrls) {
        this.thicknessMm = thicknessMm;
        this.finish = finish;
        this.format = format;
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

    public Finish getFinish() {
        return finish;
    }

    public String getFormat() {
        return format;
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
