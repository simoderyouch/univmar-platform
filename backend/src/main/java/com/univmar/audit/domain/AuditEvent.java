package com.univmar.audit.domain;

import com.univmar.document.domain.DocumentTargetType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_event")
public class AuditEvent {
    @Id private UUID id;
    @Enumerated(EnumType.STRING) @Column(name = "target_type", nullable = false, length = 30) private DocumentTargetType targetType;
    @Column(name = "target_id", nullable = false) private UUID targetId;
    @Column(name = "event_type", nullable = false, length = 60) private String eventType;
    @Column(nullable = false, length = 500) private String message;
    @Column(nullable = false, length = 320) private String actor;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    protected AuditEvent() { }
    public AuditEvent(DocumentTargetType targetType, UUID targetId, String eventType, String message, String actor) { id = UUID.randomUUID(); this.targetType = targetType; this.targetId = targetId; this.eventType = eventType; this.message = message; this.actor = actor; occurredAt = Instant.now(); }
    public UUID getId() { return id; } public DocumentTargetType getTargetType() { return targetType; } public UUID getTargetId() { return targetId; } public String getEventType() { return eventType; } public String getMessage() { return message; } public String getActor() { return actor; } public Instant getOccurredAt() { return occurredAt; }
}
