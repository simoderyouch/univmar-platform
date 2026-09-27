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
    /** Legacy technical classification retained for stock history; staff manage the dynamic category below. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private MaterialCategory category;
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
    @Column(name = "public_uses", length = 500)
    private String publicUses;
    @Column(name = "care_summary", length = 1000)
    private String careSummary;
    @Column(name = "indoor_outdoor", length = 20)
    private String indoorOutdoor;
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<StoneVariant> variants = new ArrayList<>();

    protected StoneMaterial() {
    }

    public StoneMaterial(String name, String commercialName, String sku, StoneType stoneType, MaterialCategory category, String origin, String color, String pattern, String description, String applications) {
        this.id = UUID.randomUUID();
        update(name, commercialName, sku, stoneType, category, origin, color, pattern, description, applications);
    }

    public void update(String name, String commercialName, String sku, StoneType stoneType, MaterialCategory category, String origin, String color, String pattern, String description, String applications) {
        this.name = name;
        this.commercialName = commercialName;
        this.sku = sku;
        this.stoneType = stoneType;
        this.category = category;
        this.origin = origin;
        this.color = color;
        this.pattern = pattern;
        this.description = description;
        this.applications = applications;
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

    public MaterialCategory getCategory() { return category; }

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
    public String getPublicUses() { return publicUses; }
    public String getCareSummary() { return careSummary; }
    public String getIndoorOutdoor() { return indoorOutdoor; }
    public void updatePublicDiscovery(String uses, String care, String setting) { this.publicUses = uses; this.careSummary = care; this.indoorOutdoor = setting; }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<StoneVariant> getVariants() {
        return List.copyOf(variants);
    }
}
