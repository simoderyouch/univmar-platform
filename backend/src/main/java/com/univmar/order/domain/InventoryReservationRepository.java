package com.univmar.order.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryReservationRepository extends JpaRepository<InventoryReservation, UUID> {
    List<InventoryReservation> findAllByInventoryItemIdAndStatus(UUID inventoryItemId, ReservationStatus status);
    List<InventoryReservation> findAllByOrderItemIdAndStatusOrderByCreatedAt(UUID orderItemId, ReservationStatus status);
}
