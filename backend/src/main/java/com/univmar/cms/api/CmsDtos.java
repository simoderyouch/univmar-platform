package com.univmar.cms.api;

import com.univmar.cms.domain.WebsiteInquiryStatus;
import com.univmar.cms.domain.WebsiteInquiryNotificationStatus;
import com.univmar.cms.domain.WebsiteInquiryCallOutcome;
import com.univmar.customer.domain.CustomerType;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.*;
import org.springframework.data.domain.Page;

public final class CmsDtos {
    private CmsDtos() { }
    public record FormSettingsInput(boolean enabled, @NotBlank @Size(max = 180) String title, @NotBlank @Size(max = 1000) String description, @NotBlank @Size(max = 80) String submitLabel, boolean requireEmail, boolean requirePhone) { }
    public record FormSettingsResponse(boolean enabled, String title, String description, String submitLabel, boolean requireEmail, boolean requirePhone, Instant updatedAt) { }
    public record PublicInquiryInput(@NotBlank @Size(max = 180) String fullName, @Email @Size(max = 320) String email, @Size(max = 80) String phone, @Size(max = 160) String subject, @Size(max = 10000) String message, @Size(max = 12) String language, @Size(max = 2000) String selectedProducts, @Size(max = 500) String sourcePage, @Size(max = 160) String utmSource, @Size(max = 160) String utmMedium, @Size(max = 160) String utmCampaign, @Size(max = 1000) String referrer, @Size(max = 200) String website) { }
    public record InquiryAttachmentResponse(UUID id, String documentUrl, String originalFilename, String contentType, long fileSize) { }
    public record InquiryResponse(UUID id, String fullName, String email, String phone, String subject, String message, String language, String selectedProducts, String sourcePage, String utmSource, String utmMedium, String utmCampaign, WebsiteInquiryStatus status, WebsiteInquiryNotificationStatus notificationStatus, String notificationError, UUID qualifiedCustomerId, UUID qualifiedProjectId, UUID assignedToUserId, String assignedToEmail, WebsiteInquiryCallOutcome callOutcome, String callNotes, Instant nextFollowUpAt, List<InquiryAttachmentResponse> attachments, Instant createdAt, Instant updatedAt) { }
    public record InquiryPage(List<InquiryResponse> content, int page, int size, long totalElements, int totalPages) { public static InquiryPage from(Page<InquiryResponse> page) { return new InquiryPage(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
    public record InquiryStatusInput(@NotNull WebsiteInquiryStatus status, UUID assignedToUserId, WebsiteInquiryCallOutcome callOutcome, @Size(max = 4000) String callNotes, Instant nextFollowUpAt) { }
    public record QualificationInput(@NotBlank @Size(max = 180) String projectName, @Size(max = 180) String projectType, @Size(max = 180) String location, @NotNull Boolean callConfirmed) { }
    public record QualificationResponse(UUID inquiryId, UUID customerId, UUID projectId, boolean existingCustomer) { }
    public record PublicAcknowledgement(String message) { }
}
