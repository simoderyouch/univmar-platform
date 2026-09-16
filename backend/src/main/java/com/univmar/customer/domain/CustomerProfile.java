package com.univmar.customer.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

@Entity
@Table(name = "customer_profiles")
public class CustomerProfile extends BaseEntity {
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private CustomerType type;
    @Column(nullable = false, length = 100)
    private String firstName;
    @Column(nullable = false, length = 100)
    private String lastName;
    @Column(length = 180)
    private String companyName;
    @Column(length = 50)
    private String phone;
    @Column(length = 80)
    private String taxId;

    protected CustomerProfile() {
    }

    public CustomerProfile(User user, CustomerType type, String firstName, String lastName, String companyName, String phone) {
        this.user = user;
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.phone = phone;
    }

    public User getUser() {
        return user;
    }

    public CustomerType getType() {
        return type;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getPhone() {
        return phone;
    }

    public String getTaxId() {
        return taxId;
    }

    public void update(CustomerType type, String firstName, String lastName, String companyName, String phone, String taxId) {
        if (type == CustomerType.PROFESSIONAL && (companyName == null || companyName.isBlank()))
            throw new IllegalArgumentException("companyName is required for a professional customer");
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.phone = phone;
        this.taxId = taxId;
    }
}
