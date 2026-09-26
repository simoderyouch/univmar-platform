package com.univmar.slab.domain;

import java.util.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface StoneSlabRepository extends JpaRepository<StoneSlab, UUID> {
    boolean existsBySlabNumberIgnoreCase(String slabNumber);
    boolean existsBySlabNumberIgnoreCaseAndIdNot(String slabNumber, UUID id);
    List<StoneSlab> findAllByReservedOrderItemId(UUID orderItemId);
    List<StoneSlab> findAllByReservedOrderItemOrderId(UUID orderId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from StoneSlab s where s.id = :id")
    Optional<StoneSlab> findByIdForUpdate(UUID id);
}
