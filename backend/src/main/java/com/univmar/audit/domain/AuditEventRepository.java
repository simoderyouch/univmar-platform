package com.univmar.audit.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findTop100ByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
}
