package com.univmar.quotation.api;

import com.univmar.quotation.QuotationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class QuotationController {
    private final QuotationService service;

    public QuotationController(QuotationService s) {
        service = s;
    }

    @PostMapping("/sales/quotations")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public QuotationDtos.Response create(@Valid @RequestBody QuotationDtos.Create input) {
        return service.create(input);
    }

    @GetMapping("/sales/quotations")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public java.util.List<QuotationDtos.Detail> sales() {
        return service.sales();
    }

    @GetMapping("/sales/quotations/{id}")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public QuotationDtos.Detail salesDetail(@PathVariable Long id) {
        return service.salesDetail(id);
    }

    @PostMapping("/sales/quotations/{id}/send")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public QuotationDtos.Response send(@PathVariable Long id, Authentication auth) {
        return service.send(id, (Long) auth.getPrincipal());
    }

    @PostMapping("/sales/quotations/{id}/revise")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public QuotationDtos.Detail revise(@PathVariable Long id, @Valid @RequestBody QuotationDtos.Create input, Authentication auth) {
        return service.revise(id, input, (Long) auth.getPrincipal());
    }

    @PostMapping("/sales/quotations/{id}/expire")
    @PreAuthorize("hasAnyRole('SALES','ADMIN')")
    public QuotationDtos.Detail expire(@PathVariable Long id, Authentication auth) {
        return service.expire(id, (Long) auth.getPrincipal());
    }

    @GetMapping("/quotations")
    @PreAuthorize("hasRole('CUSTOMER')")
    public java.util.List<QuotationDtos.Detail> mine(Authentication auth) {
        return service.mine((Long) auth.getPrincipal());
    }

    @GetMapping("/quotations/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public QuotationDtos.Detail detail(@PathVariable Long id, Authentication auth) {
        return service.mineDetail(id, (Long) auth.getPrincipal());
    }

    @PostMapping("/quotations/{id}/accept")
    @PreAuthorize("hasRole('CUSTOMER')")
    public QuotationDtos.AcceptanceResponse accept(@PathVariable Long id, Authentication auth) {
        var order = service.accept(id, (Long) auth.getPrincipal());
        return new QuotationDtos.AcceptanceResponse(order.getOrderNumber(), order.getStatus().name());
    }

    @PostMapping("/quotations/{id}/reject")
    @PreAuthorize("hasRole('CUSTOMER')")
    public QuotationDtos.Detail reject(@PathVariable Long id, Authentication auth) {
        return service.reject(id, (Long) auth.getPrincipal());
    }
}
