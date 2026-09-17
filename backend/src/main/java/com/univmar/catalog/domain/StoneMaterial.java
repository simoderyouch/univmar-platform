package com.univmar.catalog.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stone_material")
public class StoneMaterial {
    @Id
    private UUID id;
    @Column(nullable = false, length = 160)
    private String name;
    @Column(name = "commercial_name", length = 160)
    private String commercialName;
    @Column(nullable = false, unique = true, length = 80)
    private String sku;
    @Enumerated(EnumType.STRING)
    @Column(name = "stone_type", nullable = false, length = 30)
    private StoneType stoneType;
    @Column(length = 100)
    private String origin;
    @Column(length = 100)
    private String color;
    @Column(length = 160)
    private String pattern;
    @Column(columnDefinition = "text")
    private String description;
    @Column(columnDefinition = "text")
    private String applications;
    @Column(name = "main_image_url", length = 1000)
    private String mainImageUrl;
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    @ElementCollection
    @CollectionTable(name = "stone_material_image", joinColumns = @JoinColumn(name = "material_id"))
    @Column(name = "image_url", nullable = false, length = 1000)
    @OrderColumn(name = "position")
    private final List<String> galleryImageUrls = new ArrayList<>();
    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<StoneVariant> variants = new ArrayList<>();

    protected StoneMaterial() {
    }

    public StoneMaterial(String name, String commercialName, String sku, StoneType stoneType, String origin, String color, String pattern, String description, String applications, String mainImageUrl, List<String> galleryImageUrls) {
        this.id = UUID.randomUUID();
        update(name, commercialName, sku, stoneType, origin, color, pattern, description, applications, mainImageUrl, galleryImageUrls);
    }

    public void update(String name, String commercialName, String sku, StoneType stoneType, String origin, String color, String pattern, String description, String applications, String mainImageUrl, List<String> galleryImageUrls) {
        this.name = name;
        this.commercialName = commercialName;
        this.sku = sku;
        this.stoneType = stoneType;
        this.origin = origin;
        this.color = color;
        this.pattern = pattern;
        this.description = description;
        this.applications = applications;
        this.mainImageUrl = mainImageUrl;
        this.galleryImageUrls.clear();
        if (galleryImageUrls != null) this.galleryImageUrls.addAll(galleryImageUrls);
    }

    public void addVariant(StoneVariant variant) {
        variants.add(variant);
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

    public String getName() {
        return name;
    }

    public String getCommercialName() {
        return commercialName;
    }

    public String getSku() {
        return sku;
    }

    public StoneType getStoneType() {
        return stoneType;
    }

    public String getOrigin() {
        return origin;
    }

    public String getColor() {
        return color;
    }

    public String getPattern() {
        return pattern;
    }

    public String getDescription() {
        return description;
    }

    public String getApplications() {
        return applications;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<String> getGalleryImageUrls() {
        return List.copyOf(galleryImageUrls);
    }

    public List<StoneVariant> getVariants() {
        return List.copyOf(variants);
    }
}
