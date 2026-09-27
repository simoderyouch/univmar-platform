package com.univmar.cms.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import java.util.*;
import com.univmar.user.domain.User;

@Entity
@Table(name = "website_inquiry")
public class WebsiteInquiry {
    @Id private UUID id;
    @Column(nullable = false, length = 180) private String fullName;
    @Column(length = 320) private String email;
    @Column(length = 80) private String phone;
    @Column(columnDefinition = "text") private String message;
    @Column(length = 500) private String sourcePage;
    @Column(length = 160) private String subject;
    @Column(length = 12) private String language;
    @Column(length = 2000) private String selectedProducts;
    @Column(length = 160) private String utmSource;
    @Column(length = 160) private String utmMedium;
    @Column(length = 160) private String utmCampaign;
    @Column(length = 1000) private String referrer;
    @Enumerated(EnumType.STRING) @Column(name = "notification_status", nullable = false, length = 20) private WebsiteInquiryNotificationStatus notificationStatus = WebsiteInquiryNotificationStatus.PENDING;
    @Column(name = "notification_error", length = 500) private String notificationError;
    @Column(name = "notification_attempts", nullable = false) private int notificationAttempts;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private WebsiteInquiryStatus status = WebsiteInquiryStatus.NEW;
    @Column(nullable = false) private Instant createdAt;
    @Column(nullable = false) private Instant updatedAt;
    @Column(name = "qualified_customer_id") private UUID qualifiedCustomerId;
    @Column(name = "qualified_project_id") private UUID qualifiedProjectId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_to_user_id") private User assignedTo;
    @Enumerated(EnumType.STRING) @Column(name = "call_outcome", nullable = false, length = 30) private WebsiteInquiryCallOutcome callOutcome = WebsiteInquiryCallOutcome.UNCONTACTED;
    @Column(name = "call_notes", columnDefinition = "text") private String callNotes;
    @Column(name = "next_follow_up_at") private Instant nextFollowUpAt;
    @OneToMany(mappedBy = "inquiry", cascade = CascadeType.ALL, orphanRemoval = true) @OrderBy("createdAt asc") private final List<WebsiteInquiryAttachment> attachments = new ArrayList<>();
    protected WebsiteInquiry() { }
    public WebsiteInquiry(String fullName, String email, String phone, String subject, String message, String language, String selectedProducts, String sourcePage, String utmSource, String utmMedium, String utmCampaign, String referrer) { id = UUID.randomUUID(); this.fullName = fullName; this.email = email; this.phone = phone; this.subject = subject; this.message = message; this.language = language; this.selectedProducts = selectedProducts; this.sourcePage = sourcePage; this.utmSource = utmSource; this.utmMedium = utmMedium; this.utmCampaign = utmCampaign; this.referrer = referrer; }
    public void changeStatus(WebsiteInquiryStatus status) { this.status = status; }
    public void qualified(UUID customerId, UUID projectId) { this.qualifiedCustomerId = customerId; this.qualifiedProjectId = projectId; }
    public void clearQualification() { this.qualifiedCustomerId = null; this.qualifiedProjectId = null; }
    public void salesTracking(User user, WebsiteInquiryCallOutcome outcome, String notes, Instant followUpAt) { this.assignedTo = user; this.callOutcome = outcome == null ? WebsiteInquiryCallOutcome.UNCONTACTED : outcome; this.callNotes = notes; this.nextFollowUpAt = followUpAt; }
    public void addAttachment(WebsiteInquiryAttachment attachment) { attachments.add(attachment); }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    public void notificationSent() { notificationStatus = WebsiteInquiryNotificationStatus.SENT; notificationError = null; notificationAttempts++; }
    public void notificationFailed(String error) { notificationStatus = WebsiteInquiryNotificationStatus.FAILED; notificationError = error == null ? "Delivery failed." : error.substring(0, Math.min(error.length(), 500)); notificationAttempts++; }
    public void retryNotification() { if (notificationStatus != WebsiteInquiryNotificationStatus.SENT) notificationStatus = WebsiteInquiryNotificationStatus.PENDING; }
    public UUID getId() { return id; } public String getFullName() { return fullName; } public String getEmail() { return email; } public String getPhone() { return phone; } public String getSubject() { return subject; } public String getMessage() { return message; } public String getLanguage() { return language; } public String getSelectedProducts() { return selectedProducts; } public String getSourcePage() { return sourcePage; } public String getUtmSource() { return utmSource; } public String getUtmMedium() { return utmMedium; } public String getUtmCampaign() { return utmCampaign; } public String getReferrer() { return referrer; } public WebsiteInquiryNotificationStatus getNotificationStatus() { return notificationStatus; } public String getNotificationError() { return notificationError; } public int getNotificationAttempts() { return notificationAttempts; } public WebsiteInquiryStatus getStatus() { return status; } public UUID getQualifiedCustomerId() { return qualifiedCustomerId; } public UUID getQualifiedProjectId() { return qualifiedProjectId; } public User getAssignedTo() { return assignedTo; } public WebsiteInquiryCallOutcome getCallOutcome() { return callOutcome; } public String getCallNotes() { return callNotes; } public Instant getNextFollowUpAt() { return nextFollowUpAt; } public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; } public List<WebsiteInquiryAttachment> getAttachments() { return List.copyOf(attachments); }
}
