package com.univmar.catalog.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "stone_material_images")
public class StoneMaterialImage extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private StoneMaterial material;
    @Column(nullable = false, length = 1000)
    private String imageUrl;
    @Column(unique = true, length = 255)
    private String storageKey;
    @Column(length = 100)
    private String contentType;
    @Column(length = 300)
    private String altText;
    @Column(nullable = false)
    private int displayOrder;
    @Column(nullable = false)
    private boolean primaryImage;

    protected StoneMaterialImage() {
    }

    public StoneMaterialImage(StoneMaterial material, String imageUrl, String altText, int displayOrder, boolean primaryImage) {
        this.material = material;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.displayOrder = displayOrder;
        this.primaryImage = primaryImage;
    }

    public StoneMaterialImage(StoneMaterial material, String imageUrl, String altText, int displayOrder, boolean primaryImage, String storageKey, String contentType) {
        this(material, imageUrl, altText, displayOrder, primaryImage);
        this.storageKey = storageKey;
        this.contentType = contentType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAltText() {
        return altText;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public boolean isPrimaryImage() {
        return primaryImage;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getContentType() {
        return contentType;
    }

    public void updatePresentation(String altText, int displayOrder, boolean primaryImage) {
        this.altText = altText;
        this.displayOrder = displayOrder;
        this.primaryImage = primaryImage;
    }
}
