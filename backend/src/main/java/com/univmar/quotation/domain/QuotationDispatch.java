package com.univmar.quotation.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "quotation_dispatch")
public class QuotationDispatch {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "quotation_id", nullable = false) private Quotation quotation;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private QuotationDispatchChannel channel;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private QuotationDispatchStatus status;
    @Column(name = "recipient_email", length = 320) private String recipientEmail;
    @Column(name = "cc_emails", columnDefinition = "text") private String ccEmails;
    @Column(length = 500) private String subject;
    @Column(columnDefinition = "text") private String message;
    @Column(name = "token_hash", nullable = false, unique = true, length = 64) private String tokenHash;
    @Column(name = "sent_by", nullable = false, length = 320) private String sentBy;
    @Column(name = "sent_at") private Instant sentAt;
    @Column(name = "failure_reason", length = 1000) private String failureReason;
    @Enumerated(EnumType.STRING) @Column(name = "client_response", nullable = false, length = 30) private QuotationClientResponse clientResponse = QuotationClientResponse.PENDING;
    @Column(name = "responded_by", length = 320) private String respondedBy;
    @Column(name = "response_message", columnDefinition = "text") private String responseMessage;
    @Column(name = "responded_at") private Instant respondedAt;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected QuotationDispatch() { }
    public QuotationDispatch(Quotation quotation, QuotationDispatchChannel channel, String recipientEmail, String ccEmails, String subject, String message, String tokenHash, String sentBy) {
        this.id = UUID.randomUUID(); this.quotation = quotation; this.channel = channel; this.recipientEmail = recipientEmail; this.ccEmails = ccEmails; this.subject = subject; this.message = message; this.tokenHash = tokenHash; this.sentBy = sentBy; this.status = QuotationDispatchStatus.FAILED;
    }
    public void sent() { status = QuotationDispatchStatus.SENT; sentAt = Instant.now(); failureReason = null; }
    public void failed(String value) { status = QuotationDispatchStatus.FAILED; failureReason = value == null ? "Delivery failed." : value.substring(0, Math.min(value.length(), 1000)); }
    public void respond(QuotationClientResponse response, String name, String message) { if (respondedAt != null) throw new IllegalStateException("The client has already responded through this link."); clientResponse = response; respondedBy = name; responseMessage = message; respondedAt = Instant.now(); }
    @PrePersist void created() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public Quotation getQuotation() { return quotation; } public QuotationDispatchChannel getChannel() { return channel; } public QuotationDispatchStatus getStatus() { return status; } public String getRecipientEmail() { return recipientEmail; } public String getCcEmails() { return ccEmails; } public String getSubject() { return subject; } public String getMessage() { return message; } public String getTokenHash() { return tokenHash; } public String getSentBy() { return sentBy; } public Instant getSentAt() { return sentAt; } public String getFailureReason() { return failureReason; } public QuotationClientResponse getClientResponse() { return clientResponse; } public String getRespondedBy() { return respondedBy; } public String getResponseMessage() { return responseMessage; } public Instant getRespondedAt() { return respondedAt; } public Instant getCreatedAt() { return createdAt; }
}
