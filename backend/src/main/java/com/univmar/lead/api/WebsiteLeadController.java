package com.univmar.lead.api;

import com.univmar.lead.WebsiteLeadService;
import com.univmar.lead.domain.WebsiteLeadStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class WebsiteLeadController {
    private final WebsiteLeadService service;

    public WebsiteLeadController(WebsiteLeadService service) {
        this.service = service;
    }

    @PostMapping("/public/quote-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public WebsiteLeadDtos.ReceivedResponse receive(@Valid @RequestBody WebsiteLeadDtos.CreateRequest request) {
        return service.receive(request);
    }

    @GetMapping("/sales/website-quote-requests")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public Page<WebsiteLeadDtos.LeadResponse> list(@RequestParam(required = false) WebsiteLeadStatus status, Pageable pageable) {
        return service.list(status, pageable);
    }

    @PatchMapping("/sales/website-quote-requests/{id}/status")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public WebsiteLeadDtos.LeadResponse status(@PathVariable Long id, @Valid @RequestBody WebsiteLeadDtos.StatusRequest request, Authentication authentication) {
        return service.changeStatus(id, request.status(), (Long) authentication.getPrincipal());
    }

    @PostMapping("/sales/website-quote-requests/{id}/convert")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public WebsiteLeadDtos.LeadResponse convert(@PathVariable Long id, Authentication authentication) {
        return service.convert(id, (Long) authentication.getPrincipal());
    }
}
