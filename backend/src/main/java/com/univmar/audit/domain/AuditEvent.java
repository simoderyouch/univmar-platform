package com.univmar.audit.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_events")
public class AuditEvent extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "actor_id")
    private User actor;
    @Column(nullable = false)
    private String action;
    @Column(nullable = false)
    private String entityType;
    private Long entityId;
    @Column(length = 2000)
    private String detail;
    @Column(length = 4000)
    private String detailsJson;

    protected AuditEvent() {
    }

    public AuditEvent(User actor, String action, String entityType, Long entityId, String detail) {
        this.actor = actor;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.detail = detail;
        detailsJson = detail == null ? null : "{\"message\":\"" + escape(detail) + "\"}";
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }

    public Long getActorId() {
        return actor == null ? null : actor.getId();
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

    public String getDetailsJson() {
        return detailsJson;
    }
}
