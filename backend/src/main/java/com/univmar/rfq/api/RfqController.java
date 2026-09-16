package com.univmar.rfq.api;

import com.univmar.rfq.RfqService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quote-requests")
@PreAuthorize("hasRole('CUSTOMER')")
public class RfqController {
    private final RfqService service;

    public RfqController(RfqService s) {
        service = s;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RfqDtos.Response create(@Valid @RequestBody RfqDtos.Create request, Authentication auth) {
        return service.create((Long) auth.getPrincipal(), request);
    }

    @GetMapping
    public java.util.List<RfqDtos.Detail> mine(Authentication auth) {
        return service.mine((Long) auth.getPrincipal());
    }

    @GetMapping("/{id}")
    public RfqDtos.Detail detail(@PathVariable Long id, Authentication auth) {
        return service.mineDetail((Long) auth.getPrincipal(), id);
    }

    @PostMapping("/{id}/submit")
    public RfqDtos.Response submit(@PathVariable Long id, Authentication auth) {
        return service.submit((Long) auth.getPrincipal(), id);
    }

    @PostMapping("/{id}/cancel")
    public RfqDtos.Response cancel(@PathVariable Long id, Authentication auth) {
        return service.cancel((Long) auth.getPrincipal(), id);
    }
}
