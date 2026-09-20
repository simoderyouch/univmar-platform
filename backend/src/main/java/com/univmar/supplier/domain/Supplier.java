package com.univmar.supplier.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "supplier")
public class Supplier {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 180) private String name;
    @Column(length = 120) private String contactName;
    @Column(length = 100) private String country;
    @Column(length = 180) private String email;
    @Column(length = 60) private String phone;
    @Column(columnDefinition = "text") private String address;
    @Column(columnDefinition = "text") private String materialsSupplied;
    @Column(length = 160) private String paymentTerms;
    private Integer leadTimeDays;
    @Column(columnDefinition = "text") private String notes;
    @Column(nullable = false) private boolean active = true;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected Supplier() { }
    public Supplier(String name, String contactName, String country, String email, String phone, String address, String materialsSupplied, String paymentTerms, Integer leadTimeDays, String notes) { this.id = UUID.randomUUID(); update(name, contactName, country, email, phone, address, materialsSupplied, paymentTerms, leadTimeDays, notes); }
    public void update(String name, String contactName, String country, String email, String phone, String address, String materialsSupplied, String paymentTerms, Integer leadTimeDays, String notes) { this.name = name; this.contactName = contactName; this.country = country; this.email = email; this.phone = phone; this.address = address; this.materialsSupplied = materialsSupplied; this.paymentTerms = paymentTerms; this.leadTimeDays = leadTimeDays; this.notes = notes; }
    public void setActive(boolean active) { this.active = active; }
    @PrePersist void createTimestamp() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }
    public UUID getId() { return id; } public String getName() { return name; } public String getContactName() { return contactName; } public String getCountry() { return country; } public String getEmail() { return email; } public String getPhone() { return phone; } public String getAddress() { return address; } public String getMaterialsSupplied() { return materialsSupplied; } public String getPaymentTerms() { return paymentTerms; } public Integer getLeadTimeDays() { return leadTimeDays; } public String getNotes() { return notes; } public boolean isActive() { return active; }
}
