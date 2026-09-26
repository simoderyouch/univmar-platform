package com.univmar.cms.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "website_contact_form_settings")
public class WebsiteContactFormSettings {
    @Id private UUID id;
    @Column(nullable = false) private boolean enabled = true;
    @Column(nullable = false, length = 180) private String title;
    @Column(nullable = false, length = 1000) private String description;
    @Column(nullable = false, length = 80) private String submitLabel;
    @Column(nullable = false) private boolean requireEmail;
    @Column(nullable = false) private boolean requirePhone;
    @Column(nullable = false) private Instant updatedAt;
    public WebsiteContactFormSettings() { id = UUID.randomUUID(); title = "Request a consultation"; description = "Tell us about your stone project and our team will contact you."; submitLabel = "Send enquiry"; }
    public void update(boolean enabled, String title, String description, String submitLabel, boolean requireEmail, boolean requirePhone) { this.enabled = enabled; this.title = title; this.description = description; this.submitLabel = submitLabel; this.requireEmail = requireEmail; this.requirePhone = requirePhone; }
    @PrePersist @PreUpdate void touch() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public boolean isEnabled() { return enabled; } public String getTitle() { return title; } public String getDescription() { return description; } public String getSubmitLabel() { return submitLabel; } public boolean isRequireEmail() { return requireEmail; } public boolean isRequirePhone() { return requirePhone; } public Instant getUpdatedAt() { return updatedAt; }
}
