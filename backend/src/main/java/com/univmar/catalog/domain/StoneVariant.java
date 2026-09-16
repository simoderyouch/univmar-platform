package com.univmar.catalog.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "stone_variants")
public class StoneVariant extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private StoneMaterial material;
    @Column(nullable = false, unique = true, length = 100)
    private String sku;
    @Column(nullable = false, length = 100)
    private String finish;
    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal thicknessMm;
    @Column(length = 100)
    private String grade;
    @Column(precision = 19, scale = 2)
    private BigDecimal indicativePrice;
    @Column(nullable = false)
    private boolean active = true;

    protected StoneVariant() {
    }

    public StoneVariant(StoneMaterial material, String finish, BigDecimal thicknessMm, String grade, BigDecimal indicativePrice) {
        this(material, generatedSku(), finish, thicknessMm, grade, indicativePrice);
    }

    public StoneVariant(StoneMaterial material, String sku, String finish, BigDecimal thicknessMm, String grade, BigDecimal indicativePrice) {
        this.material = material;
        this.sku = sku;
        this.finish = finish;
        this.thicknessMm = thicknessMm;
        this.grade = grade;
        this.indicativePrice = indicativePrice;
    }

    private static String generatedSku() {
        return "VAR-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase(Locale.ROOT);
    }

    public StoneMaterial getMaterial() {
        return material;
    }

    public String getSku() {
        return sku;
    }

    public String getFinish() {
        return finish;
    }

    public BigDecimal getThicknessMm() {
        return thicknessMm;
    }

    public String getGrade() {
        return grade;
    }

    public BigDecimal getIndicativePrice() {
        return indicativePrice;
    }

    public boolean isActive() {
        return active;
    }

    public void update(String finish, BigDecimal thicknessMm, String grade, BigDecimal indicativePrice, boolean active) {
        this.finish = finish;
        this.thicknessMm = thicknessMm;
        this.grade = grade;
        this.indicativePrice = indicativePrice;
        this.active = active;
    }
}
