package com.univmar.catalog.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StoneMaterialRepository
    extends
        JpaRepository<StoneMaterial, UUID>,
        JpaSpecificationExecutor<StoneMaterial>
{
    Optional<StoneMaterial> findBySkuIgnoreCase(String sku);
}
