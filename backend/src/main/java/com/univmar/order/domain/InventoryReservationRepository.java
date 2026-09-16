package com.univmar.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryReservationRepository extends JpaRepository<InventoryReservation, Long> {
    List<InventoryReservation> findByOrderItem_Order_IdAndStatus(Long orderId, ReservationStatus status);
}
