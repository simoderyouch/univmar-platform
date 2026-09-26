package com.univmar.remnant.domain;

import java.util.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface StoneRemnantRepository extends JpaRepository<StoneRemnant, UUID> {
    boolean existsByRemnantNumberIgnoreCase(String remnantNumber);
    boolean existsByRemnantNumberIgnoreCaseAndIdNot(String remnantNumber, UUID id);
    List<StoneRemnant> findAllByReservedOrderItemId(UUID orderItemId);
    List<StoneRemnant> findAllByReservedOrderItemOrderId(UUID orderId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from StoneRemnant r where r.id = :id")
    Optional<StoneRemnant> findByIdForUpdate(UUID id);
}
