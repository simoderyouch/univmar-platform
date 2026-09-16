package com.univmar.lead.api;

import com.univmar.lead.WebsiteLeadService;
import com.univmar.lead.domain.WebsiteLeadStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class WebsiteLeadController {
    private final WebsiteLeadService service;

    public WebsiteLeadController(WebsiteLeadService service) { this.service = service; }

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
    public WebsiteLeadDtos.LeadResponse status(@PathVariable Long id, @Valid @RequestBody WebsiteLeadDtos.StatusRequest request) {
        return service.changeStatus(id, request.status());
    }
}
