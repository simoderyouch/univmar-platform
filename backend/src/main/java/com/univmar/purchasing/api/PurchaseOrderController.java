package com.univmar.purchasing.api;

import com.univmar.common.api.*;
import com.univmar.purchasing.PurchaseOrderService;
import com.univmar.purchasing.api.PurchaseOrderDtos.*;
import com.univmar.purchasing.domain.PurchaseOrderStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {
    private final PurchaseOrderService orders; public PurchaseOrderController(PurchaseOrderService orders) { this.orders = orders; }
    @GetMapping public ApiResponse<PurchaseOrderPage> list(@RequestParam(required = false) String search, @RequestParam(required = false) UUID supplierId, @RequestParam(required = false) PurchaseOrderStatus status, @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, HttpServletRequest request) { return ok(orders.list(search, supplierId, status, pageable), request); }
    @PostMapping public ResponseEntity<ApiResponse<PurchaseOrderDetail>> create(@Valid @RequestBody PurchaseOrderInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(orders.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<PurchaseOrderDetail> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.detail(id), request); }
    @PutMapping("/{id}") public ApiResponse<PurchaseOrderDetail> update(@PathVariable UUID id, @Valid @RequestBody PurchaseOrderInput input, HttpServletRequest request) { return ok(orders.update(id, input), request); }
    @PostMapping("/{id}/send") public ApiResponse<PurchaseOrderDetail> send(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.send(id), request); }
    @PostMapping("/{id}/confirm") public ApiResponse<PurchaseOrderDetail> confirm(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.confirm(id), request); }
    @PostMapping("/{id}/cancel") public ApiResponse<PurchaseOrderDetail> cancel(@PathVariable UUID id, HttpServletRequest request) { return ok(orders.cancel(id), request); }
    @PostMapping("/{id}/receipts") public ApiResponse<PurchaseOrderDetail> receive(@PathVariable UUID id, @Valid @RequestBody ReceiveGoodsInput input, HttpServletRequest request) { return ok(orders.receive(id, input), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
