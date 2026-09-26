package com.univmar.quotation.api;

import com.univmar.common.api.*;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.*;
import com.univmar.quotation.domain.QuotationStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quotations")
public class QuotationController {

    private final QuotationService service;

    public QuotationController(QuotationService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResult> list(
        @RequestParam(required = false) QuotationStatus status,
        @PageableDefault(size = 20, sort = "createdAt") Pageable page,
        HttpServletRequest request
    ) {
        return ok(service.list(status, page), request);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Response>> create(
        @Valid @RequestBody Input input,
        HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ok(service.create(input), request)
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<Response> detail(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        return ok(service.detail(id), request);
    }

    @PutMapping("/{id}")
    public ApiResponse<Response> update(
        @PathVariable UUID id,
        @Valid @RequestBody Input input,
        HttpServletRequest request
    ) {
        return ok(service.update(id, input), request);
    }

    @PostMapping("/{id}/send-email")
    public ApiResponse<SendResult> sendEmail(
        @PathVariable UUID id,
        @Valid @RequestBody SendInput input,
        HttpServletRequest request
    ) {
        return ok(service.send(id, input), request);
    }

    @PostMapping("/{id}/share-link")
    public ApiResponse<SendResult> shareLink(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        return ok(service.createShareLink(id), request);
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Response> reject(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        return ok(service.reject(id), request);
    }

    @PostMapping("/{id}/expire")
    public ApiResponse<Response> expire(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        return ok(service.expire(id), request);
    }

    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) {
        return ApiResponse.of(
            data,
            (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)
        );
    }
}
