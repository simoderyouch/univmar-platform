package com.univmar.catalog.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "stone_materials")
public class StoneMaterial extends BaseEntity {
    @Column(unique = true)
    private Long sourceProductId;
    @Column(nullable = false, length = 160)
    private String name;
    @Column(nullable = false, unique = true, length = 180)
    private String slug;
    @Column(nullable = false, length = 100)
    private String category;
    @Column(length = 100)
    private String originCountry;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MaterialOriginType originType;
    @Column(length = 100)
    private String primaryColor;
    @Column(length = 4000)
    private String description;
    @Column(length = 500)
    private String applications;
    @Column(nullable = false)
    private boolean active = true;

    protected StoneMaterial() {
    }

    public StoneMaterial(String name, String slug, String category, String originCountry, String primaryColor, String description, String applications) {
        this(name, slug, category, originCountry, defaultOriginType(originCountry), primaryColor, description, applications);
    }

    public StoneMaterial(String name, String slug, String category, String originCountry, MaterialOriginType originType,
                         String primaryColor, String description, String applications) {
        this.name = name;
        this.slug = slug;
        this.category = category;
        this.originCountry = originCountry;
        this.originType = originType == null ? defaultOriginType(originCountry) : originType;
        this.primaryColor = primaryColor;
        this.description = description;
        this.applications = applications;
    }

    public Long getSourceProductId() {
        return sourceProductId;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getCategory() {
        return category;
    }

    public String getOriginCountry() {
        return originCountry;
    }

    public MaterialOriginType getOriginType() {
        return originType;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public String getDescription() {
        return description;
    }

    public String getApplications() {
        return applications;
    }

    public boolean isActive() {
        return active;
    }

    public void update(String name, String category, String originCountry, String primaryColor, String description, String applications, boolean active) {
        update(name, category, originCountry, defaultOriginType(originCountry), primaryColor, description, applications, active);
    }

    public void update(String name, String category, String originCountry, MaterialOriginType originType,
                       String primaryColor, String description, String applications, boolean active) {
        this.name = name;
        this.category = category;
        this.originCountry = originCountry;
        this.originType = originType == null ? defaultOriginType(originCountry) : originType;
        this.primaryColor = primaryColor;
        this.description = description;
        this.applications = applications;
        this.active = active;
    }

    private static MaterialOriginType defaultOriginType(String country) {
        return country != null && country.toLowerCase(java.util.Locale.ROOT).contains("maroc") ? MaterialOriginType.LOCAL : MaterialOriginType.IMPORTED;
    }
}
