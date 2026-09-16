package com.univmar.lead.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "website_quote_requests")
public class WebsiteQuoteRequest extends BaseEntity {
    @Column(nullable = false, unique = true, length = 48) private String referenceNumber;
    @Column(nullable = false, length = 160) private String fullName;
    @Column(nullable = false, length = 320) private String email;
    @Column(nullable = false, length = 50) private String phone;
    @Column(length = 180) private String companyName;
    @Column(length = 100) private String projectType;
    @Column(length = 120) private String city;
    @Column(length = 180) private String materialName;
    @Column(length = 180) private String materialSlug;
    @Column(name = "quantity_m2", precision = 19, scale = 2) private BigDecimal quantityM2;
    @Column(length = 2000) private String message;
    private LocalDate desiredDate;
    @Column(nullable = false, length = 8) private String language;
    @Column(nullable = false, length = 80) private String source = "universmarbre.com";
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private WebsiteLeadStatus status = WebsiteLeadStatus.NEW;

    protected WebsiteQuoteRequest() { }

    public WebsiteQuoteRequest(String referenceNumber, String fullName, String email, String phone, String companyName,
                               String projectType, String city, String materialName, String materialSlug,
                               BigDecimal quantityM2, String message, LocalDate desiredDate, String language) {
        this.referenceNumber = referenceNumber; this.fullName = fullName; this.email = email; this.phone = phone;
        this.companyName = companyName; this.projectType = projectType; this.city = city; this.materialName = materialName;
        this.materialSlug = materialSlug; this.quantityM2 = quantityM2; this.message = message;
        this.desiredDate = desiredDate; this.language = language;
    }

    public String getReferenceNumber() { return referenceNumber; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getCompanyName() { return companyName; }
    public String getProjectType() { return projectType; }
    public String getCity() { return city; }
    public String getMaterialName() { return materialName; }
    public String getMaterialSlug() { return materialSlug; }
    public BigDecimal getQuantityM2() { return quantityM2; }
    public String getMessage() { return message; }
    public LocalDate getDesiredDate() { return desiredDate; }
    public String getLanguage() { return language; }
    public WebsiteLeadStatus getStatus() { return status; }
    public void qualify() { if (status != WebsiteLeadStatus.NEW) throw new IllegalStateException("Only new website requests can be qualified"); status = WebsiteLeadStatus.QUALIFIED; }
    public void close() { if (status == WebsiteLeadStatus.CLOSED) throw new IllegalStateException("Website request is already closed"); status = WebsiteLeadStatus.CLOSED; }
}
