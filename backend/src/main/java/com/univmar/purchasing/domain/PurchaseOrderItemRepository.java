package com.univmar.purchasing.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, UUID> { Optional<PurchaseOrderItem> findByIdAndPurchaseOrderId(UUID id, UUID purchaseOrderId); }
