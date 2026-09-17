package com.univmar.catalog.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface StoneMaterialRepository extends JpaRepository<StoneMaterial, UUID>, JpaSpecificationExecutor<StoneMaterial> {
    Optional<StoneMaterial> findBySkuIgnoreCase(String sku);
}
