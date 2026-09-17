package com.univmar.catalog.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoneVariantRepository extends JpaRepository<StoneVariant, UUID> {
    Optional<StoneVariant> findByIdAndMaterialId(UUID id, UUID materialId);

    List<StoneVariant> findAllByMaterialId(UUID materialId);
}
