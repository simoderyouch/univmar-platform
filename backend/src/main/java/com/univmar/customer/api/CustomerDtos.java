package com.univmar.customer.api;
import com.univmar.customer.domain.CustomerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
public final class CustomerDtos {
    private CustomerDtos() { }
    public record Profile(@NotNull CustomerType type, @NotBlank @Size(max=100) String firstName, @NotBlank @Size(max=100) String lastName, @Size(max=180) String companyName, @Size(max=50) String phone, @Size(max=80) String taxId) { }
    public record ProfileResponse(String email, CustomerType type, String firstName, String lastName, String companyName, String phone, String taxId) { }
    public record Address(@NotBlank @Size(max=100) String label, @NotBlank @Size(max=180) String recipientName, @Size(max=50) String phone, @NotBlank @Size(max=220) String line1, @Size(max=220) String line2, @NotBlank @Size(max=120) String city, @Size(max=120) String region, @Size(max=32) String postalCode, @NotBlank @Size(max=100) String country, boolean defaultDelivery) { }
    public record AddressResponse(Long id, String label, String recipientName, String phone, String line1, String line2, String city, String region, String postalCode, String country, boolean defaultDelivery) { }
    public record Project(@NotBlank @Size(max=180) String name, @Size(max=100) String projectType, @Size(max=120) String siteCity, @Size(max=500) String siteAddress, @Size(max=2000) String notes) { }
    public record ProjectResponse(Long id, String name, String projectType, String siteCity, String siteAddress, String notes) { }
}
