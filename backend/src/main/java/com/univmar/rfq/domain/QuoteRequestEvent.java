package com.univmar.rfq.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "quote_request_event")
public class QuoteRequestEvent {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "rfq_id", nullable = false) private QuoteRequest rfq;
    @Column(nullable = false, length = 300) private String message;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    protected QuoteRequestEvent() { }
    public QuoteRequestEvent(QuoteRequest rfq, String message) { id = UUID.randomUUID(); this.rfq = rfq; this.message = message; occurredAt = Instant.now(); }
    public UUID getId() { return id; } public String getMessage() { return message; } public Instant getOccurredAt() { return occurredAt; }
}
