package com.univmar.slab.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoneSlabRepository extends JpaRepository<StoneSlab, UUID> {
    boolean existsBySlabNumberIgnoreCase(String slabNumber);
    List<StoneSlab> findAllByReservedOrderItemId(UUID orderItemId);
    List<StoneSlab> findAllByReservedOrderItemOrderId(UUID orderId);
}
