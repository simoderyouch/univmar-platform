package com.univmar.inventory.domain;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findAllByInventoryItemIdOrderByOccurredAtDesc(UUID inventoryItemId);
}
