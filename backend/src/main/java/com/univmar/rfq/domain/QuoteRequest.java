package com.univmar.rfq.domain;

import com.univmar.customer.domain.CustomerProject;
import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "quote_requests")
public class QuoteRequest extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private CustomerProject project;
    @Column(nullable = false, unique = true, length = 64)
    private String reference;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RfqStatus status = RfqStatus.DRAFT;
    private String notes;
    private LocalDate desiredDate;
    private Instant submittedAt;
    private Long assigneeId;

    protected QuoteRequest() {
    }

    public QuoteRequest(User customer, String notes, LocalDate desiredDate) {
        this(customer, null, notes, desiredDate);
    }

    public QuoteRequest(User customer, CustomerProject project, String notes, LocalDate desiredDate) {
        this.customer = customer;
        this.project = project;
        reference = "RFQ-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase(Locale.ROOT);
        this.notes = notes;
        this.desiredDate = desiredDate;
    }

    public User getCustomer() {
        return customer;
    }

    public CustomerProject getProject() {
        return project;
    }

    public String getReference() {
        return reference;
    }

    public RfqStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDate getDesiredDate() {
        return desiredDate;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void submit() {
        if (status != RfqStatus.DRAFT) throw new IllegalStateException("RFQ is not a draft");
        status = RfqStatus.SUBMITTED;
        submittedAt = Instant.now();
    }

    public void review(Long assignee) {
        if (status != RfqStatus.SUBMITTED) throw new IllegalStateException("RFQ cannot be reviewed");
        status = RfqStatus.UNDER_REVIEW;
        assigneeId = assignee;
    }

    public void quoted() {
        if (status != RfqStatus.UNDER_REVIEW && status != RfqStatus.QUOTED)
            throw new IllegalStateException("RFQ must be under review before it can be quoted");
        status = RfqStatus.QUOTED;
    }

    public void close() {
        if (status != RfqStatus.QUOTED)
            throw new IllegalStateException("Only quoted RFQs can be closed");
        status = RfqStatus.CLOSED;
    }

    public void cancel() {
        if (status != RfqStatus.DRAFT && status != RfqStatus.SUBMITTED && status != RfqStatus.UNDER_REVIEW)
            throw new IllegalStateException("Only active RFQs can be cancelled");
        status = RfqStatus.CANCELLED;
    }
}
