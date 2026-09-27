package com.univmar.inventory.domain;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID>, JpaSpecificationExecutor<InventoryItem> {
    List<InventoryItem> findAllByVariantId(UUID variantId);
    Optional<InventoryItem> findByVariantIdAndWarehouseIdAndLocationIdAndLotNumberAndBundleNumber(UUID variantId, UUID warehouseId, UUID locationId, String lotNumber, String bundleNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from InventoryItem i where i.variant.id = :variantId order by i.createdAt, i.id")
    List<InventoryItem> findAllByVariantIdForUpdate(UUID variantId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from InventoryItem i where i.id = :id")
    Optional<InventoryItem> findByIdForUpdate(UUID id);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from InventoryItem i where i.variant.id = :variantId and i.warehouse.id = :warehouseId and i.location.id = :locationId and ((:lotNumber is null and i.lotNumber is null) or i.lotNumber = :lotNumber) and ((:bundleNumber is null and i.bundleNumber is null) or i.bundleNumber = :bundleNumber)")
    Optional<InventoryItem> findByPositionForUpdate(@Param("variantId") UUID variantId, @Param("warehouseId") UUID warehouseId, @Param("locationId") UUID locationId, @Param("lotNumber") String lotNumber, @Param("bundleNumber") String bundleNumber);
}
