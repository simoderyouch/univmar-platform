package com.univmar.quotation.api;

import com.univmar.common.api.*;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/quotations")
public class PublicQuotationController {
    private final QuotationService service;
    public PublicQuotationController(QuotationService service) { this.service = service; }
    @GetMapping("/{token}") public ApiResponse<PublicResponse> detail(@PathVariable String token, HttpServletRequest request) { return ok(service.publicDetail(token), request); }
    @PostMapping("/{token}/response") public ApiResponse<PublicResponse> respond(@PathVariable String token, @Valid @RequestBody ClientResponseInput input, HttpServletRequest request) { return ok(service.recordClientResponse(token, input), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
