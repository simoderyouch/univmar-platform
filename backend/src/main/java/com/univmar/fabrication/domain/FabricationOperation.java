package com.univmar.fabrication.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "fabrication_operation")
public class FabricationOperation {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "fabrication_job_id", nullable = false) private FabricationJob job;
    @Enumerated(EnumType.STRING) @Column(name = "operation_type", nullable = false, length = 40) private FabricationOperationType operationType;
    @Column(name = "sequence_no", nullable = false) private int sequenceNo;
    @Column(length = 2000) private String notes;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private FabricationOperationStatus status = FabricationOperationStatus.PENDING;
    @Column(name = "completed_at") private Instant completedAt;
    protected FabricationOperation() { }
    public FabricationOperation(FabricationJob job, FabricationOperationType type, int sequenceNo, String notes) { id = UUID.randomUUID(); this.job = job; operationType = type; this.sequenceNo = sequenceNo; this.notes = notes; }
    public void complete() { if (status != FabricationOperationStatus.PENDING) throw new IllegalStateException(); status = FabricationOperationStatus.COMPLETED; completedAt = Instant.now(); }
    public UUID getId() { return id; } public FabricationJob getJob() { return job; } public FabricationOperationType getOperationType() { return operationType; } public int getSequenceNo() { return sequenceNo; } public String getNotes() { return notes; } public FabricationOperationStatus getStatus() { return status; } public Instant getCompletedAt() { return completedAt; }
}
