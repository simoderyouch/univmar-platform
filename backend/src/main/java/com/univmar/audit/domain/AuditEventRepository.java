package com.univmar.audit.domain;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findTop100ByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
}
