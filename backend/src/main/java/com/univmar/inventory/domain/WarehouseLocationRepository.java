package com.univmar.inventory.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseLocationRepository extends JpaRepository<WarehouseLocation, UUID> {
    List<WarehouseLocation> findAllByWarehouseIdOrderByCode(UUID warehouseId);
    Optional<WarehouseLocation> findByIdAndWarehouseId(UUID id, UUID warehouseId);
    Optional<WarehouseLocation> findByWarehouseIdAndCodeIgnoreCase(UUID warehouseId, String code);
}
