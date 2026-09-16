package com.univmar.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderAddressRepository extends JpaRepository<OrderAddress, Long> {
    List<OrderAddress> findByOrderId(Long orderId);
}
