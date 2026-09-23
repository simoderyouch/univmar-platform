package com.univmar.label.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLabelRepository extends JpaRepository<InventoryLabel, UUID> {
    Optional<InventoryLabel> findByTargetTypeAndTargetId(LabelTargetType targetType, UUID targetId);
    Optional<InventoryLabel> findByLabelCode(String labelCode);
}
