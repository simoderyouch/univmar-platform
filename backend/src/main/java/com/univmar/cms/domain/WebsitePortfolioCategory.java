package com.univmar.cms.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "website_portfolio_category")
public class WebsitePortfolioCategory {
    @Id private UUID id; @Column(nullable = false, length = 100) private String name; @Column(nullable = false, unique = true, length = 100) private String slug; @Column(name = "sort_order", nullable = false) private int sortOrder; @Column(nullable = false) private boolean active = true; @Column(name = "created_at", nullable = false) private Instant createdAt; @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected WebsitePortfolioCategory() { }
    public WebsitePortfolioCategory(String name, String slug, int sortOrder, boolean active) { id = UUID.randomUUID(); update(name, slug, sortOrder, active); }
    public void update(String name, String slug, int sortOrder, boolean active) { this.name = name; this.slug = slug; this.sortOrder = sortOrder; this.active = active; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void touched() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getName() { return name; } public String getSlug() { return slug; } public int getSortOrder() { return sortOrder; } public boolean isActive() { return active; }
}
