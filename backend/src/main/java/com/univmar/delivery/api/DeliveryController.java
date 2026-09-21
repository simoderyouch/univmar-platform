package com.univmar.delivery.api;

import com.univmar.common.api.*;
import com.univmar.delivery.DeliveryService;
import com.univmar.delivery.api.DeliveryDtos.*;
import com.univmar.delivery.domain.DeliveryStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/deliveries")
public class DeliveryController {
    private final DeliveryService deliveries; public DeliveryController(DeliveryService deliveries) { this.deliveries = deliveries; }
    @GetMapping public ApiResponse<PageResult> list(@RequestParam(required = false) DeliveryStatus status, @PageableDefault(size = 20, sort = "createdAt") Pageable page, HttpServletRequest request) { return ok(deliveries.list(status, page), request); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(deliveries.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.detail(id), request); }
    @PostMapping("/{id}/items") public ApiResponse<Response> addItems(@PathVariable UUID id, @Valid @RequestBody List<@Valid ItemInput> input, HttpServletRequest request) { return ok(deliveries.addItems(id, input), request); }
    @PostMapping("/{id}/prepare") public ApiResponse<Response> prepare(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.prepare(id), request); }
    @PostMapping("/{id}/dispatch") public ApiResponse<Response> dispatch(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.dispatch(id), request); }
    @PostMapping("/{id}/confirm-delivered") public ApiResponse<Response> delivered(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.confirmDelivered(id), request); }
    @PostMapping("/{id}/cancel") public ApiResponse<Response> cancel(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.cancel(id), request); }
    @PostMapping("/{id}/fail") public ApiResponse<Response> fail(@PathVariable UUID id, HttpServletRequest request) { return ok(deliveries.fail(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
