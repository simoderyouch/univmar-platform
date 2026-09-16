package com.univmar.lead.api;

import com.univmar.lead.domain.WebsiteLeadStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public final class WebsiteLeadDtos {
    private WebsiteLeadDtos() { }

    public record CreateRequest(
            @NotBlank @Size(max = 160) String fullName,
            @NotBlank @Email @Size(max = 320) String email,
            @NotBlank @Size(max = 50) String phone,
            @Size(max = 180) String companyName,
            @Size(max = 100) String projectType,
            @Size(max = 120) String city,
            @Size(max = 180) String materialName,
            @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*", message = "materialSlug must be a lowercase URL slug") String materialSlug,
            @DecimalMin(value = "0.01", message = "quantityM2 must be greater than zero") BigDecimal quantityM2,
            @Size(max = 2000) String message,
            LocalDate desiredDate,
            @NotBlank @Pattern(regexp = "fr|en|ar", message = "language must be fr, en, or ar") String language,
            @Size(max = 120) String website
    ) { }

    public record ReceivedResponse(String referenceNumber, WebsiteLeadStatus status, String message) { }

    public record LeadResponse(Long id, String referenceNumber, String fullName, String email, String phone,
                               String companyName, String projectType, String city, String materialName,
                               String materialSlug, BigDecimal quantityM2, String message, LocalDate desiredDate,
                               String language, String source, WebsiteLeadStatus status, Instant createdAt) { }

    public record StatusRequest(@NotNull WebsiteLeadStatus status) { }
}
