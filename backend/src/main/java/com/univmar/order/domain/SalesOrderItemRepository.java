package com.univmar.order.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Finds the owning order before that order is locked for an exact-material selection. */
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, UUID> {
    @Query("select i from SalesOrderItem i join fetch i.order where i.id = :id")
    Optional<SalesOrderItem> findByIdWithOrder(UUID id);
}
