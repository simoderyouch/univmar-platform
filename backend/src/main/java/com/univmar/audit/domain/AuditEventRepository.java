package com.univmar.audit.domain;

import com.univmar.document.domain.DocumentTargetType;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    List<AuditEvent> findAllByTargetTypeAndTargetIdOrderByOccurredAtDesc(DocumentTargetType targetType, UUID targetId);
}
