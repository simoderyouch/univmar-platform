package com.univmar.order.api;

import com.univmar.common.api.*;
import com.univmar.order.OrderService;
import com.univmar.order.api.OrderDtos.*;
import com.univmar.order.domain.OrderStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orders; public OrderController(OrderService orders) { this.orders = orders; }
    @GetMapping public ApiResponse<PageResult> list(@RequestParam(required = false) OrderStatus status, @PageableDefault(size = 20, sort = "createdAt") Pageable page, HttpServletRequest request) { return ok(orders.list(status, page), request); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.detail(id), request); }
    @PostMapping("/from-quotation/{quotationId}") public ApiResponse<Response> accept(@PathVariable UUID quotationId, HttpServletRequest request) { return ok(orders.acceptQuotation(quotationId), request); }
    @PostMapping("/{id}/confirm") public ApiResponse<Response> confirm(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.confirm(id), request); }
    @PostMapping("/{id}/cancel") public ApiResponse<Response> cancel(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.cancel(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
