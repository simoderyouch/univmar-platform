package com.univmar.project.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project_realization_image")
public class ProjectRealizationImage {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "project_id", nullable = false) private Project project;
    @Column(name = "image_url", nullable = false, length = 1000) private String imageUrl;
    @Column(length = 240) private String caption;
    @Column(nullable = false) private int position;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected ProjectRealizationImage() { }

    public ProjectRealizationImage(Project project, String imageUrl, String caption, int position) {
        this.id = UUID.randomUUID(); this.project = project; this.imageUrl = imageUrl; this.caption = caption; this.position = position;
    }

    @PrePersist void created() { createdAt = Instant.now(); }
    public UUID getId() { return id; }
    public Project getProject() { return project; }
    public String getImageUrl() { return imageUrl; }
    public String getCaption() { return caption; }
    public int getPosition() { return position; }
    public Instant getCreatedAt() { return createdAt; }
}
