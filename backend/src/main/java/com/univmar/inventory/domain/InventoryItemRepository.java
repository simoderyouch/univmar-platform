package com.univmar.inventory.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID>, JpaSpecificationExecutor<InventoryItem> {
    Optional<InventoryItem> findByVariantIdAndWarehouseIdAndLocationIdAndLotNumberAndBundleNumber(UUID variantId, UUID warehouseId, UUID locationId, String lotNumber, String bundleNumber);
}
