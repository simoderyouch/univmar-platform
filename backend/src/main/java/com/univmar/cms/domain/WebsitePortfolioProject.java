package com.univmar.cms.domain;

import com.univmar.project.domain.Project;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name = "website_portfolio_project")
public class WebsitePortfolioProject {
    @Id private UUID id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "project_id", nullable = false, unique = true) private Project project;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "category_id", nullable = false) private WebsitePortfolioCategory category;
    @Column(nullable = false) private boolean published;
    @Column(nullable = false) private boolean featured;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    @Column(name = "cover_image_url", nullable = false, length = 1000) private String coverImageUrl;
    @ElementCollection @CollectionTable(name = "website_portfolio_project_image", joinColumns = @JoinColumn(name = "portfolio_project_id")) @OrderColumn(name = "position") @Column(name = "image_url", nullable = false, length = 1000) private final List<String> galleryImageUrls = new ArrayList<>();
    @Column(name = "created_at", nullable = false) private Instant createdAt; @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    protected WebsitePortfolioProject() { }
    public WebsitePortfolioProject(Project project, WebsitePortfolioCategory category, boolean published, boolean featured, int sortOrder, String coverImageUrl, List<String> gallery) { id = UUID.randomUUID(); update(project, category, published, featured, sortOrder, coverImageUrl, gallery); }
    public void update(Project project, WebsitePortfolioCategory category, boolean published, boolean featured, int sortOrder, String coverImageUrl, List<String> gallery) { this.project = project; this.category = category; this.published = published; this.featured = featured; this.sortOrder = sortOrder; this.coverImageUrl = coverImageUrl; galleryImageUrls.clear(); if (gallery != null) galleryImageUrls.addAll(gallery); }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void touched() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public Project getProject() { return project; } public WebsitePortfolioCategory getCategory() { return category; } public boolean isPublished() { return published; } public boolean isFeatured() { return featured; } public int getSortOrder() { return sortOrder; } public String getCoverImageUrl() { return coverImageUrl; } public List<String> getGalleryImageUrls() { return List.copyOf(galleryImageUrls); }
}
