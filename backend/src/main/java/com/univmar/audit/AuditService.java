package com.univmar.audit;

import com.univmar.audit.domain.AuditEvent;
import com.univmar.audit.domain.AuditEventRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditEventRepository events;

    public AuditService(AuditEventRepository events) {
        this.events = events;
    }

    public void record(Long actorId, String action, String entityType, Long entityId, String detail) {
        events.save(new AuditEvent(actorId, action, entityType, entityId, detail));
    }
}
