package com.univmar.customer.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

@Entity @Table(name = "customer_addresses")
public class CustomerAddress extends BaseEntity {
    @ManyToOne(optional = false) @JoinColumn(name = "customer_id") private User customer;
    @Column(nullable = false) private String label;
    @Column(nullable = false) private String recipientName;
    private String phone;
    @Column(nullable = false) private String line1;
    private String line2;
    @Column(nullable = false) private String city;
    private String region;
    private String postalCode;
    @Column(nullable = false) private String country;
    @Column(nullable = false) private boolean defaultDelivery;
    protected CustomerAddress() { }
    public CustomerAddress(User customer, String label, String recipientName, String phone, String line1, String line2, String city, String region, String postalCode, String country, boolean defaultDelivery) {
        this.customer = customer; this.label = label; this.recipientName = recipientName; this.phone = phone; this.line1 = line1; this.line2 = line2; this.city = city; this.region = region; this.postalCode = postalCode; this.country = country; this.defaultDelivery = defaultDelivery;
    }
    public User getCustomer() { return customer; } public String getLabel() { return label; } public String getRecipientName() { return recipientName; } public String getPhone() { return phone; } public String getLine1() { return line1; } public String getLine2() { return line2; } public String getCity() { return city; } public String getRegion() { return region; } public String getPostalCode() { return postalCode; } public String getCountry() { return country; } public boolean isDefaultDelivery() { return defaultDelivery; }
    public void update(String label, String recipientName, String phone, String line1, String line2, String city, String region, String postalCode, String country, boolean defaultDelivery) { this.label = label; this.recipientName = recipientName; this.phone = phone; this.line1 = line1; this.line2 = line2; this.city = city; this.region = region; this.postalCode = postalCode; this.country = country; this.defaultDelivery = defaultDelivery; }
    public void clearDefaultDelivery() { defaultDelivery = false; }
}
