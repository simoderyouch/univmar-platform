package com.univmar.inventory.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findTop50ByInventoryItemIdOrderByCreatedAtDesc(Long inventoryItemId);

    List<StockMovement> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(String referenceType, Long referenceId);
}
