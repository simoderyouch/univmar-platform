package com.univmar.crm.domain;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.project.domain.Project;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "public_showcase_item")
public class PublicShowcaseItem {
    @Id private UUID id;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ShowcaseKind kind;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "material_id") private StoneMaterial material;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "project_id") private Project project;
    // Legacy optional overrides. New CMS entries inherit safe values from the linked source record.
    @Column(length = 180) private String publicTitle;
    @Column(columnDefinition = "text") private String publicSummary;
    @Column(length = 1000) private String coverImageUrl;
    @Column(nullable = false) private boolean published;
    private Instant publishedAt;
    @Column(nullable = false) private int sortOrder;
    @Column(nullable = false) private Instant createdAt;
    @Column(nullable = false) private Instant updatedAt;
    protected PublicShowcaseItem() { }
    public PublicShowcaseItem(ShowcaseKind kind, StoneMaterial material, Project project, boolean published, int sortOrder) { id = UUID.randomUUID(); this.kind = kind; update(material, project, published, sortOrder); }
    public void update(StoneMaterial material, Project project, boolean published, int sortOrder) { this.material = material; this.project = project; this.sortOrder = sortOrder; if (published && !this.published) publishedAt = Instant.now(); this.published = published; if (!published) publishedAt = null; }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public ShowcaseKind getKind() { return kind; } public StoneMaterial getMaterial() { return material; } public Project getProject() { return project; } public String getPublicTitle() { return publicTitle; } public String getPublicSummary() { return publicSummary; } public String getCoverImageUrl() { return coverImageUrl; } public boolean isPublished() { return published; } public Instant getPublishedAt() { return publishedAt; } public int getSortOrder() { return sortOrder; } public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; }
}
