package com.univmar.lead;

import com.univmar.audit.AuditService;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.customer.domain.CustomerProfile;
import com.univmar.customer.domain.CustomerProfileRepository;
import com.univmar.customer.domain.CustomerType;
import com.univmar.lead.api.WebsiteLeadDtos;
import com.univmar.lead.domain.WebsiteLeadStatus;
import com.univmar.lead.domain.WebsiteQuoteRequest;
import com.univmar.lead.domain.WebsiteQuoteRequestRepository;
import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.rfq.domain.QuoteRequestItem;
import com.univmar.rfq.domain.QuoteRequestItemRepository;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.api.ErrorCode;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Locale;
import java.util.UUID;

@Service
public class WebsiteLeadService {
    private final WebsiteQuoteRequestRepository requests;
    private final UserRepository users;
    private final CustomerProfileRepository profiles;
    private final QuoteRequestRepository rfqs;
    private final QuoteRequestItemRepository rfqItems;
    private final StoneMaterialRepository materials;
    private final StoneVariantRepository variants;
    private final PasswordEncoder passwords;
    private final AuditService audit;

    public WebsiteLeadService(WebsiteQuoteRequestRepository requests, UserRepository users,
                              CustomerProfileRepository profiles, QuoteRequestRepository rfqs,
                              QuoteRequestItemRepository rfqItems, StoneMaterialRepository materials,
                              StoneVariantRepository variants, PasswordEncoder passwords, AuditService audit) {
        this.requests = requests;
        this.users = users;
        this.profiles = profiles;
        this.rfqs = rfqs;
        this.rfqItems = rfqItems;
        this.materials = materials;
        this.variants = variants;
        this.passwords = passwords;
        this.audit = audit;
    }

    @Transactional
    public WebsiteLeadDtos.ReceivedResponse receive(WebsiteLeadDtos.CreateRequest input) {
        rejectHoneypot(input.website());
        WebsiteQuoteRequest request = requests.save(new WebsiteQuoteRequest(
                nextReference(), clean(input.fullName()), normalEmail(input.email()), clean(input.phone()), clean(input.companyName()),
                clean(input.projectType()), clean(input.city()), clean(input.materialName()), clean(input.materialSlug()), input.quantityM2(),
                clean(input.message()), input.desiredDate(), input.language().toLowerCase(Locale.ROOT)
        ));
        return new WebsiteLeadDtos.ReceivedResponse(request.getReferenceNumber(), request.getStatus(), "Your quote request has been received.");
    }

    @Transactional(readOnly = true)
    public Page<WebsiteLeadDtos.LeadResponse> list(WebsiteLeadStatus status, Pageable pageable) {
        Page<WebsiteQuoteRequest> page = status == null ? requests.findAll(pageable) : requests.findByStatus(status, pageable);
        return page.map(this::response);
    }

    @Transactional
    public WebsiteLeadDtos.LeadResponse changeStatus(Long id, WebsiteLeadStatus status, Long actorId) {
        WebsiteQuoteRequest request = requests.findById(id).orElseThrow(() -> ApiException.notFound("Website quote request"));
        try {
            if (status == WebsiteLeadStatus.CONTACTED) request.contact();
            else if (status == WebsiteLeadStatus.QUALIFIED) request.qualify();
            else if (status == WebsiteLeadStatus.REJECTED) request.reject();
            else
                throw ApiException.conflict(ErrorCode.INVALID_STATE_TRANSITION, "Use conversion to complete a qualified website request");
        } catch (IllegalStateException exception) {
            throw ApiException.conflict("INVALID_STATE_TRANSITION", exception.getMessage());
        }
        audit.record(actorId, "WEBSITE_LEAD_" + status.name(), "WEBSITE_QUOTE_REQUEST", request.getId(), "Lead status updated");
        return response(request);
    }

    @Transactional
    public WebsiteLeadDtos.LeadResponse convert(Long id, Long actorId) {
        WebsiteQuoteRequest lead = requests.findById(id).orElseThrow(() -> ApiException.notFound("Website quote request"));
        try {
            User customerUser = customerUser(lead);
            CustomerProfile customer = profiles.findByUserId(customerUser.getId())
                    .orElseGet(() -> profiles.save(new CustomerProfile(customerUser, customerType(lead), firstName(lead), lastName(lead), clean(lead.getCompanyName()), clean(lead.getPhone()))));
            QuoteRequest rfq = rfqs.save(new QuoteRequest(customerUser, lead.getMessage(), lead.getDesiredDate()));
            var variant = requestedVariant(lead).orElseThrow(() -> ApiException.conflict(ErrorCode.INACTIVE_MATERIAL,
                    "The website lead must identify an active material variant before conversion"));
            rfqItems.save(new QuoteRequestItem(rfq, variant, lead.getQuantityM2(), lead.getMaterialName()));
            lead.convert(customer, rfq);
            audit.record(actorId, "WEBSITE_LEAD_CONVERTED", "WEBSITE_QUOTE_REQUEST", lead.getId(), "Created customer " + customer.getId() + " and RFQ " + rfq.getId());
            return response(lead);
        } catch (IllegalStateException exception) {
            throw ApiException.conflict(ErrorCode.INVALID_STATE_TRANSITION, exception.getMessage());
        }
    }

    private String nextReference() {
        return "WEB-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    private void rejectHoneypot(String website) {
        if (website != null && !website.isBlank())
            throw ApiException.conflict("SPAM_REJECTED", "Unable to receive quote request");
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String normalEmail(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private User customerUser(WebsiteQuoteRequest lead) {
        var existing = users.findByEmailIgnoreCase(lead.getEmail());
        if (existing.isPresent()) {
            if (existing.get().getRole() != Role.CUSTOMER)
                throw ApiException.conflict(ErrorCode.EMAIL_ALREADY_EXISTS, "The lead email belongs to a non-customer account");
            return existing.get();
        }
        return users.findByEmailIgnoreCase(lead.getEmail()).orElseGet(() -> {
            User user = new User(lead.getEmail(), passwords.encode(UUID.randomUUID().toString()), Role.CUSTOMER);
            user.markPending();
            return users.save(user);
        });
    }

    private CustomerType customerType(WebsiteQuoteRequest lead) {
        return lead.getCompanyName() == null || lead.getCompanyName().isBlank() ? CustomerType.INDIVIDUAL : CustomerType.PROFESSIONAL;
    }

    private String firstName(WebsiteQuoteRequest lead) {
        String[] names = lead.getFullName().trim().split("\\s+", 2);
        return names[0];
    }

    private String lastName(WebsiteQuoteRequest lead) {
        String[] names = lead.getFullName().trim().split("\\s+", 2);
        return names.length == 2 ? names[1] : "-";
    }

    private java.util.Optional<com.univmar.catalog.domain.StoneVariant> requestedVariant(WebsiteQuoteRequest lead) {
        if (lead.getMaterialSlug() == null || lead.getMaterialSlug().isBlank() || lead.getQuantityM2() == null)
            return java.util.Optional.empty();
        return materials.findBySlugAndActiveTrue(lead.getMaterialSlug())
                .flatMap(material -> variants.findByMaterialIdAndActiveTrue(material.getId()).stream().findFirst());
    }

    private WebsiteLeadDtos.LeadResponse response(WebsiteQuoteRequest request) {
        return new WebsiteLeadDtos.LeadResponse(request.getId(), request.getReferenceNumber(), request.getFullName(), request.getEmail(), request.getPhone(),
                request.getCompanyName(), request.getProjectType(), request.getCity(), request.getMaterialName(), request.getMaterialSlug(), request.getQuantityM2(),
                request.getMessage(), request.getDesiredDate(), request.getLanguage(), "universmarbre.com", request.getStatus(), request.getCreatedAt(),
                request.getConvertedCustomer() == null ? null : request.getConvertedCustomer().getId(),
                request.getConvertedRfq() == null ? null : request.getConvertedRfq().getId(), request.getConvertedAt());
    }
}
