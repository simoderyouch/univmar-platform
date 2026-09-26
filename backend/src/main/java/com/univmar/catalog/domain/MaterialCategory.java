package com.univmar.catalog.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "material_category")
public class MaterialCategory {
    @Id private UUID id;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false, unique = true, length = 100) private String slug;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    @Column(nullable = false) private boolean active = true;
    @Column(name = "website_visible", nullable = false) private boolean websiteVisible = true;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected MaterialCategory() { }
    public MaterialCategory(String name, String slug, int sortOrder, boolean active, boolean websiteVisible) { id = UUID.randomUUID(); update(name, slug, sortOrder, active, websiteVisible); }
    public void update(String name, String slug, int sortOrder, boolean active, boolean websiteVisible) { this.name = name; this.slug = slug; this.sortOrder = sortOrder; this.active = active; this.websiteVisible = websiteVisible; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void touched() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getName() { return name; } public String getSlug() { return slug; } public int getSortOrder() { return sortOrder; } public boolean isActive() { return active; } public boolean isWebsiteVisible() { return websiteVisible; }
}
