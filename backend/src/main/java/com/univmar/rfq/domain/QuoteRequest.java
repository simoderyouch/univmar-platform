package com.univmar.rfq.domain;

import com.univmar.customer.domain.Customer;
import com.univmar.project.domain.Project;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quote_request")
public class QuoteRequest {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String number;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "customer_id", nullable = false) private Customer customer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "project_id", nullable = false) private Project project;
    @Column(name = "created_by", nullable = false, length = 320) private String createdBy;
    @Column(name = "required_date") private LocalDate requiredDate;
    @Column(name = "delivery_location", length = 240) private String deliveryLocation;
    @Column(columnDefinition = "text") private String notes;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private RfqStatus status = RfqStatus.DRAFT;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @OneToMany(mappedBy = "rfq", cascade = CascadeType.ALL, orphanRemoval = true) private final List<QuoteRequestItem> items = new ArrayList<>();
    @OneToMany(mappedBy = "rfq", cascade = CascadeType.ALL, orphanRemoval = true) private final List<QuoteRequestAttachment> attachments = new ArrayList<>();
    @OneToMany(mappedBy = "rfq", cascade = CascadeType.ALL, orphanRemoval = true) private final List<QuoteRequestEvent> events = new ArrayList<>();

    protected QuoteRequest() { }
    public QuoteRequest(String number, Customer customer, Project project, String createdBy, LocalDate requiredDate, String deliveryLocation, String notes) {
        id = UUID.randomUUID(); this.number = number; this.customer = customer; this.project = project; this.createdBy = createdBy; update(requiredDate, deliveryLocation, notes);
    }
    public void update(LocalDate requiredDate, String deliveryLocation, String notes) { this.requiredDate = requiredDate; this.deliveryLocation = deliveryLocation; this.notes = notes; }
    public void addItem(QuoteRequestItem item) { items.add(item); }
    public void removeItem(UUID itemId) { items.removeIf(item -> item.getId().equals(itemId)); }
    public void addAttachment(QuoteRequestAttachment attachment) { attachments.add(attachment); }
    public void recordEvent(String message) { events.add(new QuoteRequestEvent(this, message)); }
    public void transitionTo(RfqStatus next) { status = next; recordEvent("RFQ moved to " + next.name().replace('_', ' ').toLowerCase()); }
    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getNumber() { return number; } public Customer getCustomer() { return customer; }
    public Project getProject() { return project; } public String getCreatedBy() { return createdBy; } public LocalDate getRequiredDate() { return requiredDate; }
    public String getDeliveryLocation() { return deliveryLocation; } public String getNotes() { return notes; } public RfqStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; } public List<QuoteRequestItem> getItems() { return items; } public List<QuoteRequestAttachment> getAttachments() { return attachments; }
    public List<QuoteRequestEvent> getEvents() { return events; }
}
