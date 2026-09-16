package com.univmar.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByQuotationId(Long quotationId);

    Optional<Order> findByIdAndCustomerId(Long id, Long customerId);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
