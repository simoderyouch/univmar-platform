package com.univmar.remnant.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoneRemnantRepository extends JpaRepository<StoneRemnant, UUID> {
    boolean existsByRemnantNumberIgnoreCase(String remnantNumber);
    List<StoneRemnant> findAllByReservedOrderItemId(UUID orderItemId);
    List<StoneRemnant> findAllByReservedOrderItemOrderId(UUID orderId);
}
