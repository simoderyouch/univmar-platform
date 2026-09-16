package com.univmar.catalog.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "catalogue_categories")
public class CatalogCategory extends BaseEntity {
    @Column(unique = true) private Integer sourceCategoryId;
    @Column(nullable = false, unique = true, length = 120) private String slug;
    @Column(nullable = false, unique = true, length = 100) private String name;
    @Column(nullable = false) private int displayOrder;
    @Column(nullable = false) private boolean localMaterial;
    @Column(nullable = false) private boolean active = true;

    protected CatalogCategory() { }

    public Integer getSourceCategoryId() { return sourceCategoryId; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isLocalMaterial() { return localMaterial; }
    public boolean isActive() { return active; }
}
