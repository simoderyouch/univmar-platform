package com.univmar.customer.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "customer_projects")
public class CustomerProject extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;
    @Column(nullable = false, unique = true, length = 64)
    private String reference;
    @Column(nullable = false)
    private String name;
    private String projectType;
    private String siteCity;
    private String siteAddress;
    @Column(length = 2000)
    private String notes;
    @Column(length = 2000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.ACTIVE;
    @Column(length = 2)
    private String siteCountry;

    protected CustomerProject() {
    }

    public CustomerProject(User customer, String name, String projectType, String siteCity, String siteAddress, String notes) {
        this(customer, name, projectType, siteCity, siteAddress, notes, notes, null, ProjectStatus.ACTIVE);
    }

    public CustomerProject(User customer, String name, String projectType, String siteCity, String siteAddress,
                           String notes, String description, String siteCountry, ProjectStatus status) {
        this.customer = customer;
        reference = "PRJ-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase(Locale.ROOT);
        this.name = name;
        this.projectType = projectType;
        this.siteCity = siteCity;
        this.siteAddress = siteAddress;
        this.notes = notes;
        this.description = description;
        this.siteCountry = siteCountry;
        this.status = status == null ? ProjectStatus.ACTIVE : status;
    }

    public User getCustomer() {
        return customer;
    }

    public String getName() {
        return name;
    }

    public String getReference() {
        return reference;
    }

    public String getProjectType() {
        return projectType;
    }

    public String getSiteCity() {
        return siteCity;
    }

    public String getSiteAddress() {
        return siteAddress;
    }

    public String getNotes() {
        return notes;
    }

    public String getDescription() {
        return description;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public String getSiteCountry() {
        return siteCountry;
    }

    public void update(String name, String projectType, String siteCity, String siteAddress, String notes) {
        update(name, projectType, siteCity, siteAddress, notes, notes, null, null);
    }

    public void update(String name, String projectType, String siteCity, String siteAddress, String notes,
                       String description, String siteCountry, ProjectStatus status) {
        this.name = name;
        this.projectType = projectType;
        this.siteCity = siteCity;
        this.siteAddress = siteAddress;
        this.notes = notes;
        this.description = description;
        this.siteCountry = siteCountry;
        if (status != null) this.status = status;
    }
}
