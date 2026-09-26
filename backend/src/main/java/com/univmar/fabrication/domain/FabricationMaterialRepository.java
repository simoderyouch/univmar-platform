package com.univmar.fabrication.domain;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FabricationMaterialRepository extends JpaRepository<FabricationMaterial, UUID> {
    boolean existsByMaterialTypeAndMaterialIdAndReleasedAtIsNull(FabricationMaterialType materialType, UUID materialId);
}
