package com.univmar.catalog.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoneMaterialImageRepository extends JpaRepository<StoneMaterialImage, Long> {
    List<StoneMaterialImage> findByMaterialIdOrderByDisplayOrderAsc(Long materialId);

    void deleteByMaterialId(Long materialId);

    java.util.Optional<StoneMaterialImage> findByIdAndMaterialId(Long id, Long materialId);
}
