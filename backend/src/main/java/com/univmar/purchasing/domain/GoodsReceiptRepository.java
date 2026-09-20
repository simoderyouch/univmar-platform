package com.univmar.purchasing.domain;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, UUID> { List<GoodsReceipt> findAllByPurchaseOrderItemIdOrderByReceivedAtDesc(UUID purchaseOrderItemId); }
