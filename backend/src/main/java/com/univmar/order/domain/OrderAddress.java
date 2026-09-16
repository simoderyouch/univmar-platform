package com.univmar.order.domain;

import com.univmar.customer.domain.AddressType;
import com.univmar.customer.domain.CustomerAddress;
import jakarta.persistence.*;

@Entity
@Table(name = "order_addresses")
public class OrderAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AddressType type;
    @Column(nullable = false, length = 180)
    private String recipientName;
    @Column(length = 180)
    private String companyName;
    @Column(length = 50)
    private String phone;
    @Column(nullable = false, length = 220)
    private String addressLine1;
    @Column(length = 220)
    private String addressLine2;
    @Column(nullable = false, length = 120)
    private String city;
    @Column(length = 120)
    private String region;
    @Column(length = 32)
    private String postalCode;
    @Column(nullable = false, length = 2)
    private String countryCode;

    protected OrderAddress() {
    }

    public OrderAddress(Order order, CustomerAddress source, AddressType type) {
        this.order = order;
        this.type = type;
        recipientName = source.getRecipientName();
        phone = source.getPhone();
        addressLine1 = source.getLine1();
        addressLine2 = source.getLine2();
        city = source.getCity();
        region = source.getRegion();
        postalCode = source.getPostalCode();
        countryCode = source.getCountryCode();
    }

    public Long getId() { return id; }
    public AddressType getType() { return type; }
    public String getRecipientName() { return recipientName; }
    public String getCompanyName() { return companyName; }
    public String getPhone() { return phone; }
    public String getAddressLine1() { return addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public String getCity() { return city; }
    public String getRegion() { return region; }
    public String getPostalCode() { return postalCode; }
    public String getCountryCode() { return countryCode; }
}
