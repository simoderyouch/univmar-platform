package com.univmar.audit;

import com.univmar.audit.domain.AuditEvent;
import com.univmar.audit.domain.AuditEventRepository;
import com.univmar.user.domain.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditEventRepository events;
    private final UserRepository users;

    public AuditService(AuditEventRepository events, UserRepository users) {
        this.events = events;
        this.users = users;
    }

    public void record(Long actorId, String action, String entityType, Long entityId, String detail) {
        events.save(new AuditEvent(actorId == null ? null : users.findById(actorId).orElse(null), action, entityType, entityId, detail));
    }
}
