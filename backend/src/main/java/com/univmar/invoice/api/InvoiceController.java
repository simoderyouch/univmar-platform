package com.univmar.invoice.api;

import com.univmar.common.api.*;
import com.univmar.invoice.InvoiceService;
import com.univmar.invoice.api.InvoiceDtos.*;
import com.univmar.invoice.domain.InvoiceStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invoices")
public class InvoiceController {
    private final InvoiceService invoices; public InvoiceController(InvoiceService invoices) { this.invoices = invoices; }
    @GetMapping public ApiResponse<PageResult> list(@RequestParam(required = false) InvoiceStatus status, @PageableDefault(size = 20, sort = "createdAt") Pageable page, HttpServletRequest request) { return ok(invoices.list(status, page), request); }
    @PostMapping("/from-order/{orderId}") public ResponseEntity<ApiResponse<Response>> create(@PathVariable UUID orderId, @Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(invoices.create(orderId, input), request)); }
    @GetMapping("/order/{orderId}") public ApiResponse<Response> forOrder(@PathVariable UUID orderId, HttpServletRequest request) { return ok(invoices.forOrder(orderId), request); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(invoices.detail(id), request); }
    @PostMapping("/{id}/issue") public ApiResponse<Response> issue(@PathVariable UUID id, HttpServletRequest request) { return ok(invoices.issue(id), request); }
    @PostMapping("/{id}/payments") public ApiResponse<Response> payment(@PathVariable UUID id, @Valid @RequestBody PaymentInput input, HttpServletRequest request) { return ok(invoices.recordPayment(id, input), request); }
    @PostMapping("/{id}/void") public ApiResponse<Response> voidInvoice(@PathVariable UUID id, HttpServletRequest request) { return ok(invoices.voidInvoice(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
