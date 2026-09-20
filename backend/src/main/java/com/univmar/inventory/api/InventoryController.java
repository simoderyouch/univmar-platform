package com.univmar.inventory.api;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class InventoryController {
    private final InventoryService inventory;
    public InventoryController(InventoryService inventory) { this.inventory = inventory; }
    @GetMapping("/warehouses") public ApiResponse<List<WarehouseResponse>> warehouses(HttpServletRequest request) { return ok(inventory.warehouses(), request); }
    @PostMapping("/warehouses") public ResponseEntity<ApiResponse<WarehouseResponse>> createWarehouse(@Valid @RequestBody WarehouseInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(inventory.createWarehouse(input), request)); }
    @PutMapping("/warehouses/{id}") public ApiResponse<WarehouseResponse> updateWarehouse(@PathVariable UUID id, @Valid @RequestBody WarehouseInput input, HttpServletRequest request) { return ok(inventory.updateWarehouse(id, input), request); }
    @GetMapping("/warehouses/{warehouseId}/locations") public ApiResponse<List<LocationResponse>> locations(@PathVariable UUID warehouseId, HttpServletRequest request) { return ok(inventory.locations(warehouseId), request); }
    @PostMapping("/warehouses/{warehouseId}/locations") public ResponseEntity<ApiResponse<LocationResponse>> createLocation(@PathVariable UUID warehouseId, @Valid @RequestBody LocationInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(inventory.createLocation(warehouseId, input), request)); }
    @PutMapping("/warehouses/{warehouseId}/locations/{locationId}") public ApiResponse<LocationResponse> updateLocation(@PathVariable UUID warehouseId, @PathVariable UUID locationId, @Valid @RequestBody LocationInput input, HttpServletRequest request) { return ok(inventory.updateLocation(warehouseId, locationId, input), request); }
    @GetMapping("/inventory") public ApiResponse<InventoryPage> list(@RequestParam(required = false) String search, @RequestParam(required = false) String lot, @RequestParam(required = false) String bundle, @RequestParam(required = false) UUID warehouseId, @PageableDefault(size = 20, sort = "createdAt") Pageable pageable, HttpServletRequest request) { return ok(inventory.list(search, lot, bundle, warehouseId, pageable), request); }
    @PostMapping("/inventory/receipts") public ResponseEntity<ApiResponse<InventorySummary>> receive(@Valid @RequestBody ReceiptInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(inventory.receive(input), request)); }
    @GetMapping("/inventory/{id}") public ApiResponse<InventoryDetail> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(inventory.detail(id), request); }
    @PostMapping("/inventory/{id}/adjustments") public ApiResponse<InventorySummary> adjust(@PathVariable UUID id, @Valid @RequestBody AdjustmentInput input, HttpServletRequest request) { return ok(inventory.adjust(id, input), request); }
    @GetMapping("/inventory/material-summary") public ApiResponse<List<MaterialInventorySummary>> materialSummary(@RequestParam UUID materialId, HttpServletRequest request) { return ok(inventory.materialSummary(materialId), request); }
    @GetMapping("/inventory/variant-availability") public ApiResponse<java.math.BigDecimal> variantAvailability(@RequestParam UUID variantId, HttpServletRequest request) { return ok(inventory.availableForVariant(variantId), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
