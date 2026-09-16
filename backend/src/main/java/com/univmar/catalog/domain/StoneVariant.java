package com.univmar.catalog.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity @Table(name = "stone_variants")
public class StoneVariant extends BaseEntity {
    @ManyToOne(optional = false) @JoinColumn(name = "material_id", nullable = false) private StoneMaterial material;
    @Column(nullable = false, length = 100) private String finish;
    @Column(nullable = false, precision = 8, scale = 2) private BigDecimal thicknessMm;
    @Column(length = 100) private String grade;
    @Column(precision = 19, scale = 2) private BigDecimal indicativePrice;
    @Column(nullable = false) private boolean active = true;
    protected StoneVariant() { }
    public StoneVariant(StoneMaterial material, String finish, BigDecimal thicknessMm, String grade, BigDecimal indicativePrice) { this.material = material; this.finish = finish; this.thicknessMm = thicknessMm; this.grade = grade; this.indicativePrice = indicativePrice; }
    public StoneMaterial getMaterial() { return material; } public String getFinish() { return finish; } public BigDecimal getThicknessMm() { return thicknessMm; }
    public String getGrade() { return grade; } public BigDecimal getIndicativePrice() { return indicativePrice; } public boolean isActive() { return active; }
    public void update(String finish, BigDecimal thicknessMm, String grade, BigDecimal indicativePrice, boolean active) { this.finish = finish; this.thicknessMm = thicknessMm; this.grade = grade; this.indicativePrice = indicativePrice; this.active = active; }
}
