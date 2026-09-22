package com.univmar.audit;

import com.univmar.audit.api.AuditDtos.*;
import com.univmar.audit.domain.*;
import com.univmar.document.domain.DocumentTargetType;
import com.univmar.user.domain.UserRepository;
import java.util.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuditService {
    private final AuditEventRepository events; private final UserRepository users;
    public AuditService(AuditEventRepository events, UserRepository users) { this.events = events; this.users = users; }
    public void record(DocumentTargetType targetType, UUID targetId, String eventType, String message) { events.save(new AuditEvent(targetType, targetId, eventType, message, actor())); }
    @Transactional(readOnly = true) public List<Response> list(DocumentTargetType targetType, UUID targetId) { return events.findAllByTargetTypeAndTargetIdOrderByOccurredAtDesc(targetType, targetId).stream().map(event -> new Response(event.getId(), event.getEventType(), event.getMessage(), event.getActor(), event.getOccurredAt())).toList(); }
    private String actor() { var authentication = SecurityContextHolder.getContext().getAuthentication(); try { return authentication == null ? "System" : users.findById(UUID.fromString(authentication.getName())).map(user -> user.getEmail()).orElse("System"); } catch (Exception ignored) { return "System"; } }
}
