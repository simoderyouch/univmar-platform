package com.univmar.inventory.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "warehouse_location", uniqueConstraints = @UniqueConstraint(name = "uk_location_warehouse_code", columnNames = {"warehouse_id", "code"}))
public class WarehouseLocation {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "warehouse_id", nullable = false) private Warehouse warehouse;
    @Column(nullable = false, length = 40) private String code;
    @Column(length = 80) private String zone;
    @Column(nullable = false) private boolean active = true;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected WarehouseLocation() { }
    public WarehouseLocation(Warehouse warehouse, String code, String zone) { this.id = UUID.randomUUID(); this.warehouse = warehouse; update(code, zone); }
    public void update(String code, String zone) { this.code = code; this.zone = zone; }
    public void setActive(boolean active) { this.active = active; }
    @PrePersist void createTimestamp() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public Warehouse getWarehouse() { return warehouse; }
    public String getCode() { return code; }
    public String getZone() { return zone; }
    public boolean isActive() { return active; }
}
