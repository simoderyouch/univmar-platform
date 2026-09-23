package com.univmar.fabrication.domain;

import com.univmar.order.domain.SalesOrder;
import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "fabrication_job")
public class FabricationJob {
    @Id private UUID id;
    @Column(name = "job_number", nullable = false, unique = true, length = 40) private String jobNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id", nullable = false) private SalesOrder order;
    @Column(nullable = false, length = 180) private String title;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private FabricationStatus status = FabricationStatus.MEASUREMENT;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private FabricationPriority priority = FabricationPriority.NORMAL;
    @Column(name = "due_date") private LocalDate dueDate;
    @Column(name = "measurement_notes", columnDefinition = "text") private String measurementNotes;
    @Column(name = "drawing_url", length = 1000) private String drawingUrl;
    @Column(columnDefinition = "text") private String notes;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @Column(name = "ready_at") private Instant readyAt;
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true) private final List<FabricationOperation> operations = new ArrayList<>();
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true) private final List<FabricationMaterial> materials = new ArrayList<>();
    protected FabricationJob() { }
    public FabricationJob(String number, SalesOrder order, String title, FabricationPriority priority, LocalDate dueDate, String measurementNotes, String drawingUrl, String notes) { id = UUID.randomUUID(); jobNumber = number; this.order = order; this.title = title; this.priority = priority == null ? FabricationPriority.NORMAL : priority; this.dueDate = dueDate; this.measurementNotes = measurementNotes; this.drawingUrl = drawingUrl; this.notes = notes; }
    public void addOperation(FabricationOperation operation) { operations.add(operation); }
    public void addMaterial(FabricationMaterial material) { materials.add(material); }
    public void advance(FabricationStatus next) { if (next.ordinal() != status.ordinal() + 1) throw new IllegalStateException("Jobs must advance one workshop stage at a time."); status = next; if (next == FabricationStatus.READY) readyAt = Instant.now(); }
    @PrePersist void created() { createdAt = updatedAt = Instant.now(); } @PreUpdate void updated() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getJobNumber() { return jobNumber; } public SalesOrder getOrder() { return order; } public String getTitle() { return title; } public FabricationStatus getStatus() { return status; } public FabricationPriority getPriority() { return priority; } public LocalDate getDueDate() { return dueDate; } public String getMeasurementNotes() { return measurementNotes; } public String getDrawingUrl() { return drawingUrl; } public String getNotes() { return notes; } public Instant getCreatedAt() { return createdAt; } public Instant getReadyAt() { return readyAt; } public List<FabricationOperation> getOperations() { return operations; } public List<FabricationMaterial> getMaterials() { return materials; }
}
