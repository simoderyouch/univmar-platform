package com.univmar.rfq.api;
import com.univmar.rfq.RfqService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/sales/quote-requests") @PreAuthorize("hasAnyRole('SALES','ADMIN')")
public class SalesRfqController {
    private final RfqService service; public SalesRfqController(RfqService service) { this.service = service; }
    @GetMapping public Page<RfqDtos.Detail> list(Pageable pageable) { return service.sales(pageable); }
    @GetMapping("/{id}") public RfqDtos.Detail detail(@PathVariable Long id) { return service.salesDetail(id); }
    @PostMapping("/{id}/assign") public RfqDtos.Detail assign(@PathVariable Long id, @Valid @RequestBody RfqDtos.Assign input) { return service.assignAndReview(id, input.salesUserId()); }
}
