package com.univmar.cms;

import static com.univmar.cms.api.CmsDtos.*;

import com.univmar.auth.AccessControlService;
import com.univmar.cms.domain.*;
import com.univmar.common.api.ApiException;
import com.univmar.customer.domain.*;
import com.univmar.project.domain.*;
import com.univmar.user.domain.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WebsiteCmsService {
    private final WebsiteContactFormSettingsRepository settings;
    private final WebsiteInquiryRepository inquiries;
    private final CustomerRepository customers;
    private final ProjectRepository projects;
    private final UserRepository users;
    private final AccessControlService access;

    public WebsiteCmsService(WebsiteContactFormSettingsRepository settings, WebsiteInquiryRepository inquiries,
            CustomerRepository customers, ProjectRepository projects, UserRepository users, AccessControlService access) {
        this.settings = settings;
        this.inquiries = inquiries;
        this.customers = customers;
        this.projects = projects;
        this.users = users;
        this.access = access;
    }

    @Transactional(readOnly = true)
    public FormSettingsResponse publicSettings() {
        return settings.findAll().stream().findFirst().map(this::settingsResponse)
                .orElse(new FormSettingsResponse(true, "Request a consultation", "Tell us about your stone project and our team will contact you.", "Send enquiry", false, false, null));
    }

    public FormSettingsResponse updateSettings(FormSettingsInput input) {
        WebsiteContactFormSettings setting = settings.findAll().stream().findFirst()
                .orElseGet(() -> settings.save(new WebsiteContactFormSettings()));
        setting.update(input.enabled(), required(input.title()), required(input.description()), required(input.submitLabel()), input.requireEmail(), input.requirePhone());
        return settingsResponse(setting);
    }

    public void submit(PublicInquiryInput input) {
        WebsiteContactFormSettings setting = settings.findAll().stream().findFirst().orElse(null);
        if (input.website() != null && !input.website().isBlank()) return;
        if (setting != null && !setting.isEnabled()) return;
        String email = trim(input.email()), phone = trim(input.phone());
        if ((setting == null || !setting.isRequireEmail()) && (setting == null || !setting.isRequirePhone()) && email == null && phone == null) throw new ApiException(HttpStatus.BAD_REQUEST, "CONTACT_REQUIRED", "Enter an email address or phone number.");
        if (setting != null && setting.isRequireEmail() && email == null) throw new ApiException(HttpStatus.BAD_REQUEST, "EMAIL_REQUIRED", "Enter an email address.");
        if (setting != null && setting.isRequirePhone() && phone == null) throw new ApiException(HttpStatus.BAD_REQUEST, "PHONE_REQUIRED", "Enter a phone number.");
        inquiries.save(new WebsiteInquiry(required(input.fullName()), email, phone, trim(input.subject()), trim(input.message()), trim(input.language()), trim(input.selectedProducts()), trim(input.sourcePage()), trim(input.utmSource()), trim(input.utmMedium()), trim(input.utmCampaign()), trim(input.referrer())));
    }

    @Transactional(readOnly = true)
    public InquiryPage list(WebsiteInquiryStatus status, Pageable pageable) {
        Specification<WebsiteInquiry> specification = status == null ? Specification.where(null) : (root, query, builder) -> builder.equal(root.get("status"), status);
        if (access.isSalesAgent()) {
            UUID userId = currentUserId();
            specification = specification.and((root, query, builder) -> builder.or(builder.isNull(root.get("assignedTo")), builder.equal(root.get("assignedTo").get("id"), userId)));
        }
        return InquiryPage.from(inquiries.findAll(specification, pageable).map(this::response));
    }

    public InquiryResponse claim(UUID id) {
        User salesperson = currentSalesperson();
        WebsiteInquiry inquiry = lockedInquiry(id);
        if (inquiry.getAssignedTo() != null && !inquiry.getAssignedTo().getId().equals(salesperson.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "LEAD_ALREADY_CLAIMED", "This lead has already been claimed by " + inquiry.getAssignedTo().getEmail() + ".");
        }
        if (inquiry.getAssignedTo() == null) inquiry.salesTracking(salesperson, inquiry.getCallOutcome(), inquiry.getCallNotes(), inquiry.getNextFollowUpAt());
        return response(inquiry);
    }

    public InquiryResponse changeStatus(UUID id, InquiryStatusInput input) {
        WebsiteInquiry inquiry = inquiries.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "INQUIRY_NOT_FOUND", "Form submission was not found."));
        requireOwner(inquiry);
        User assignee = input.assignedToUserId() == null ? null : users.findById(input.assignedToUserId())
                .filter(user -> user.isActive() && (user.getRole() == Role.SALES_AGENT || user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "SALES_USER_REQUIRED", "Select an active sales user."));
        if (access.isSalesAgent() && (assignee == null || !assignee.getId().equals(currentUserId()))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "LEAD_REASSIGNMENT_DENIED", "Claim the lead before updating it. Only a manager can reassign it.");
        }
        inquiry.changeStatus(input.status());
        inquiry.salesTracking(assignee, input.callOutcome(), trim(input.callNotes()), input.nextFollowUpAt());
        return response(inquiry);
    }

    public QualificationResponse qualify(UUID id, QualificationInput input) {
        if (!Boolean.TRUE.equals(input.callConfirmed())) throw new ApiException(HttpStatus.CONFLICT, "CALL_NOT_CONFIRMED", "Complete and confirm the sales call before creating records.");
        WebsiteInquiry inquiry = lockedInquiry(id);
        requireOwner(inquiry);
        if (inquiry.getQualifiedProjectId() != null) throw new ApiException(HttpStatus.CONFLICT, "INQUIRY_ALREADY_QUALIFIED", "This enquiry has already been converted into a project.");
        String email = trim(inquiry.getEmail()), phone = trim(inquiry.getPhone());
        Customer customer = email == null ? null : customers.findFirstByEmailIgnoreCase(email).orElse(null);
        if (customer == null && phone != null) customer = customers.findFirstByPhone(phone).orElse(null);
        boolean existing = customer != null;
        if (customer == null) customer = customers.save(new Customer(CustomerType.INDIVIDUAL, inquiry.getFullName().trim(), null, email, phone, "Qualified from website enquiry: " + Optional.ofNullable(inquiry.getMessage()).orElse("")));
        String owner = inquiry.getAssignedTo() == null ? null : inquiry.getAssignedTo().getEmail();
        Project project = projects.save(new Project(customer, required(input.projectName()), trim(input.location()), trim(input.projectType()), trim(inquiry.getMessage()), null, null, null, owner, ProjectStatus.LEAD, "Source: " + Optional.ofNullable(inquiry.getSourcePage()).orElse("Landing")));
        inquiry.qualified(customer.getId(), project.getId());
        inquiry.changeStatus(WebsiteInquiryStatus.READ);
        return new QualificationResponse(inquiry.getId(), customer.getId(), project.getId(), existing);
    }

    private WebsiteInquiry lockedInquiry(UUID id) {
        return inquiries.findByIdForUpdate(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "INQUIRY_NOT_FOUND", "Form submission was not found."));
    }

    private User currentSalesperson() {
        UUID id = currentUserId();
        return users.findById(id).filter(user -> user.isActive() && (user.getRole() == Role.SALES_AGENT || user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER))
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "SALES_USER_REQUIRED", "An active sales user is required."));
    }

    private UUID currentUserId() {
        UUID id = access.currentUserId();
        if (id == null) throw new ApiException(HttpStatus.FORBIDDEN, "AUTHENTICATION_REQUIRED", "Sign in to manage website leads.");
        return id;
    }

    private void requireOwner(WebsiteInquiry inquiry) {
        if (!access.isSalesAgent()) return;
        if (inquiry.getAssignedTo() == null) throw new ApiException(HttpStatus.CONFLICT, "LEAD_NOT_CLAIMED", "Claim this lead before updating or qualifying it.");
        if (!inquiry.getAssignedTo().getId().equals(currentUserId())) throw new ApiException(HttpStatus.FORBIDDEN, "LEAD_OWNED_BY_ANOTHER", "This lead belongs to another salesperson.");
    }

    private FormSettingsResponse settingsResponse(WebsiteContactFormSettings setting) { return new FormSettingsResponse(setting.isEnabled(), setting.getTitle(), setting.getDescription(), setting.getSubmitLabel(), setting.isRequireEmail(), setting.isRequirePhone(), setting.getUpdatedAt()); }
    private InquiryResponse response(WebsiteInquiry inquiry) { return new InquiryResponse(inquiry.getId(), inquiry.getFullName(), inquiry.getEmail(), inquiry.getPhone(), inquiry.getSubject(), inquiry.getMessage(), inquiry.getLanguage(), inquiry.getSelectedProducts(), inquiry.getSourcePage(), inquiry.getUtmSource(), inquiry.getUtmMedium(), inquiry.getUtmCampaign(), inquiry.getStatus(), inquiry.getNotificationStatus(), inquiry.getNotificationError(), inquiry.getQualifiedCustomerId(), inquiry.getQualifiedProjectId(), inquiry.getAssignedTo() == null ? null : inquiry.getAssignedTo().getId(), inquiry.getAssignedTo() == null ? null : inquiry.getAssignedTo().getEmail(), inquiry.getCallOutcome(), inquiry.getCallNotes(), inquiry.getNextFollowUpAt(), inquiry.getCreatedAt(), inquiry.getUpdatedAt()); }
    private String required(String value) { String result = trim(value); if (result == null) throw new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Required value missing."); return result; }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
