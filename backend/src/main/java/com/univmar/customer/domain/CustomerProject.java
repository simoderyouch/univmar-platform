package com.univmar.customer.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

@Entity @Table(name = "customer_projects")
public class CustomerProject extends BaseEntity {
    @ManyToOne(optional = false) @JoinColumn(name = "customer_id") private User customer;
    @Column(nullable = false) private String name;
    private String projectType;
    private String siteCity;
    private String siteAddress;
    @Column(length = 2000) private String notes;
    protected CustomerProject() { }
    public CustomerProject(User customer, String name, String projectType, String siteCity, String siteAddress, String notes) { this.customer = customer; this.name = name; this.projectType = projectType; this.siteCity = siteCity; this.siteAddress = siteAddress; this.notes = notes; }
    public User getCustomer() { return customer; } public String getName() { return name; } public String getProjectType() { return projectType; } public String getSiteCity() { return siteCity; } public String getSiteAddress() { return siteAddress; } public String getNotes() { return notes; }
    public void update(String name, String projectType, String siteCity, String siteAddress, String notes) { this.name = name; this.projectType = projectType; this.siteCity = siteCity; this.siteAddress = siteAddress; this.notes = notes; }
}
