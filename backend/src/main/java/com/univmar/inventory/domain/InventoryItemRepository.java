package com.univmar.inventory.domain;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByVariantId(Long variantId);

    @Lock(LockModeType.OPTIMISTIC)
    @Query("select item from InventoryItem item join fetch item.variant where item.variant.id = :variantId")
    Optional<InventoryItem> findForReservationByVariantId(@Param("variantId") Long variantId);

    @Query("select item from InventoryItem item where item.active = true and item.onHandM2 - item.reservedM2 <= item.minStockM2")
    Page<InventoryItem> findLowStock(Pageable pageable);

    Page<InventoryItem> findByActiveTrue(Pageable pageable);
}
