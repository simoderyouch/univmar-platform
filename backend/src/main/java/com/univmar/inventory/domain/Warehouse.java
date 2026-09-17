package com.univmar.inventory.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "warehouse")
public class Warehouse {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 40) private String code;
    @Column(nullable = false, length = 160) private String name;
    @Column(nullable = false) private boolean active = true;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected Warehouse() { }
    public Warehouse(String code, String name) { this.id = UUID.randomUUID(); update(code, name); }
    public void update(String code, String name) { this.code = code; this.name = name; }
    public void setActive(boolean active) { this.active = active; }
    @PrePersist void createTimestamp() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public boolean isActive() { return active; }
}
