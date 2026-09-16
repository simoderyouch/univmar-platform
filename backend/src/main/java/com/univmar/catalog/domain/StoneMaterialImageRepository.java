package com.univmar.catalog.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoneMaterialImageRepository extends JpaRepository<StoneMaterialImage, Long> {
    List<StoneMaterialImage> findByMaterialIdOrderByDisplayOrderAsc(Long materialId);
    void deleteByMaterialId(Long materialId);
    java.util.Optional<StoneMaterialImage> findByIdAndMaterialId(Long id, Long materialId);
}
