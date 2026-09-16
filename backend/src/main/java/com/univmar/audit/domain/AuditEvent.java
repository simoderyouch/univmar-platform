package com.univmar.audit.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_events")
public class AuditEvent extends BaseEntity {
    private Long actorId;
    @Column(nullable = false)
    private String action;
    @Column(nullable = false)
    private String entityType;
    private Long entityId;
    @Column(length = 2000)
    private String detail;

    protected AuditEvent() {
    }

    public AuditEvent(Long actorId, String action, String entityType, Long entityId, String detail) {
        this.actorId = actorId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.detail = detail;
    }

    public Long getActorId() {
        return actorId;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public String getDetail() {
        return detail;
    }
}
