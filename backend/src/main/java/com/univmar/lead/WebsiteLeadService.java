package com.univmar.lead;

import com.univmar.lead.api.WebsiteLeadDtos;
import com.univmar.lead.domain.WebsiteLeadStatus;
import com.univmar.lead.domain.WebsiteQuoteRequest;
import com.univmar.lead.domain.WebsiteQuoteRequestRepository;
import com.univmar.shared.api.ApiException;
import java.time.Year;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WebsiteLeadService {
    private final WebsiteQuoteRequestRepository requests;

    public WebsiteLeadService(WebsiteQuoteRequestRepository requests) { this.requests = requests; }

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
    public WebsiteLeadDtos.LeadResponse changeStatus(Long id, WebsiteLeadStatus status) {
        WebsiteQuoteRequest request = requests.findById(id).orElseThrow(() -> ApiException.notFound("Website quote request"));
        try {
            if (status == WebsiteLeadStatus.QUALIFIED) request.qualify();
            else if (status == WebsiteLeadStatus.CLOSED) request.close();
            else throw ApiException.conflict("INVALID_STATE_TRANSITION", "A website quote request cannot return to NEW");
        } catch (IllegalStateException exception) {
            throw ApiException.conflict("INVALID_STATE_TRANSITION", exception.getMessage());
        }
        return response(request);
    }

    private String nextReference() { return "WEB-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT); }
    private void rejectHoneypot(String website) { if (website != null && !website.isBlank()) throw ApiException.conflict("SPAM_REJECTED", "Unable to receive quote request"); }
    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private String normalEmail(String value) { return value.trim().toLowerCase(Locale.ROOT); }
    private WebsiteLeadDtos.LeadResponse response(WebsiteQuoteRequest request) {
        return new WebsiteLeadDtos.LeadResponse(request.getId(), request.getReferenceNumber(), request.getFullName(), request.getEmail(), request.getPhone(),
                request.getCompanyName(), request.getProjectType(), request.getCity(), request.getMaterialName(), request.getMaterialSlug(), request.getQuantityM2(),
                request.getMessage(), request.getDesiredDate(), request.getLanguage(), "universmarbre.com", request.getStatus(), request.getCreatedAt());
    }
}
