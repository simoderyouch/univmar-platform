package com.univmar.inventory.domain;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID>, JpaSpecificationExecutor<InventoryItem> {
    Optional<InventoryItem> findByVariantIdAndWarehouseIdAndLocationIdAndLotNumberAndBundleNumber(UUID variantId, UUID warehouseId, UUID locationId, String lotNumber, String bundleNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from InventoryItem i where i.variant.id = :variantId order by i.createdAt, i.id")
    List<InventoryItem> findAllByVariantIdForUpdate(UUID variantId);
}
