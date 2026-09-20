package com.univmar.purchasing.domain;

import com.univmar.supplier.domain.Supplier;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "purchase_order")
public class PurchaseOrder {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String number;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "supplier_id", nullable = false) private Supplier supplier;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private PurchaseOrderStatus status = PurchaseOrderStatus.DRAFT;
    @Column(name = "expected_arrival") private LocalDate expectedArrival;
    @Column(columnDefinition = "text") private String notes;
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true) private final List<PurchaseOrderItem> items = new ArrayList<>();
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected PurchaseOrder() { }
    public PurchaseOrder(String number, Supplier supplier, LocalDate expectedArrival, String notes) { this.id = UUID.randomUUID(); this.number = number; update(supplier, expectedArrival, notes); }
    public void update(Supplier supplier, LocalDate expectedArrival, String notes) { this.supplier = supplier; this.expectedArrival = expectedArrival; this.notes = notes; }
    public void replaceItems(List<PurchaseOrderItem> replacements) { items.clear(); items.addAll(replacements); }
    public void setStatus(PurchaseOrderStatus status) { this.status = status; }
    @PrePersist void createTimestamp() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getNumber() { return number; } public Supplier getSupplier() { return supplier; } public PurchaseOrderStatus getStatus() { return status; } public LocalDate getExpectedArrival() { return expectedArrival; } public String getNotes() { return notes; } public List<PurchaseOrderItem> getItems() { return List.copyOf(items); }
}
