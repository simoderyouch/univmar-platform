package com.univmar.inventory.domain;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> { List<StockMovement> findTop50ByInventoryItemIdOrderByCreatedAtDesc(Long inventoryItemId); List<StockMovement> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(String referenceType, Long referenceId); }
