package com.univmar.catalog.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoneVariantRepository extends JpaRepository<StoneVariant, Long> {
    List<StoneVariant> findByMaterialIdAndActiveTrue(Long materialId);

    boolean existsBySku(String sku);
}
