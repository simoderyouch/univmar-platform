package com.univmar.customer.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

@Entity
@Table(name = "customer_addresses")
public class CustomerAddress extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AddressType type = AddressType.OTHER;
    @Column(nullable = false)
    private String label;
    @Column(nullable = false)
    private String recipientName;
    private String phone;
    @Column(nullable = false)
    private String line1;
    private String line2;
    @Column(nullable = false)
    private String city;
    private String region;
    private String postalCode;
    @Column(nullable = false)
    private String country;
    @Column(nullable = false, length = 2)
    private String countryCode;
    @Column(nullable = false)
    private boolean defaultDelivery;
    @Column(nullable = false)
    private boolean defaultAddress;

    protected CustomerAddress() {
    }

    public CustomerAddress(User customer, String label, String recipientName, String phone, String line1, String line2, String city, String region, String postalCode, String country, boolean defaultDelivery) {
        this(customer, AddressType.OTHER, label, recipientName, phone, line1, line2, city, region, postalCode, country, "MA", defaultDelivery, defaultDelivery);
    }

    public CustomerAddress(User customer, AddressType type, String label, String recipientName, String phone, String line1,
                           String line2, String city, String region, String postalCode, String country, String countryCode,
                           boolean defaultDelivery, boolean defaultAddress) {
        this.customer = customer;
        this.type = type == null ? AddressType.OTHER : type;
        this.label = label;
        this.recipientName = recipientName;
        this.phone = phone;
        this.line1 = line1;
        this.line2 = line2;
        this.city = city;
        this.region = region;
        this.postalCode = postalCode;
        this.country = country;
        this.countryCode = countryCode;
        this.defaultDelivery = defaultDelivery;
        this.defaultAddress = defaultAddress;
    }

    public User getCustomer() {
        return customer;
    }

    public String getLabel() {
        return label;
    }

    public AddressType getType() {
        return type;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public String getPhone() {
        return phone;
    }

    public String getLine1() {
        return line1;
    }

    public String getLine2() {
        return line2;
    }

    public String getCity() {
        return city;
    }

    public String getRegion() {
        return region;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCountry() {
        return country;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public boolean isDefaultDelivery() {
        return defaultDelivery;
    }

    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    public void update(String label, String recipientName, String phone, String line1, String line2, String city, String region, String postalCode, String country, boolean defaultDelivery) {
        update(type, label, recipientName, phone, line1, line2, city, region, postalCode, country, countryCode, defaultDelivery, defaultDelivery);
    }

    public void update(AddressType type, String label, String recipientName, String phone, String line1, String line2,
                       String city, String region, String postalCode, String country, String countryCode,
                       boolean defaultDelivery, boolean defaultAddress) {
        this.type = type == null ? AddressType.OTHER : type;
        this.label = label;
        this.recipientName = recipientName;
        this.phone = phone;
        this.line1 = line1;
        this.line2 = line2;
        this.city = city;
        this.region = region;
        this.postalCode = postalCode;
        this.country = country;
        this.countryCode = countryCode;
        this.defaultDelivery = defaultDelivery;
        this.defaultAddress = defaultAddress;
    }

    public void clearDefaultDelivery() {
        defaultDelivery = false;
    }

    public void clearDefaultAddress() {
        defaultAddress = false;
    }
}
