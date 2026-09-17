package com.univmar.catalog.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
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
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected StoneVariant() {
    }

    public StoneVariant(StoneMaterial material, BigDecimal thicknessMm, Finish finish, String format) {
        this.id = UUID.randomUUID();
        this.material = material;
        update(thicknessMm, finish, format);
    }

    public void update(BigDecimal thicknessMm, Finish finish, String format) {
        this.thicknessMm = thicknessMm;
        this.finish = finish;
        this.format = format;
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

    public BigDecimal getThicknessMm() {
        return thicknessMm;
    }

    public Finish getFinish() {
        return finish;
    }

    public String getFormat() {
        return format;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
