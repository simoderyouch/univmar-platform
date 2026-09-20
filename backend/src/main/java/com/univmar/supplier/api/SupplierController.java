package com.univmar.supplier.api;

import com.univmar.common.api.*;
import com.univmar.supplier.SupplierService;
import com.univmar.supplier.api.SupplierDtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/suppliers")
public class SupplierController {
    private final SupplierService suppliers; public SupplierController(SupplierService suppliers) { this.suppliers = suppliers; }
    @GetMapping public ApiResponse<SupplierPage> list(@RequestParam(required = false) String search, @RequestParam(required = false) String country, @RequestParam(required = false) Boolean active, @PageableDefault(size = 20, sort = "name") Pageable pageable, HttpServletRequest request) { return ok(suppliers.list(search, country, active, pageable), request); }
    @PostMapping public ResponseEntity<ApiResponse<SupplierResponse>> create(@Valid @RequestBody SupplierInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(suppliers.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<SupplierResponse> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(suppliers.detail(id), request); }
    @PutMapping("/{id}") public ApiResponse<SupplierResponse> update(@PathVariable UUID id, @Valid @RequestBody SupplierInput input, HttpServletRequest request) { return ok(suppliers.update(id, input), request); }
    @PatchMapping("/{id}/active") public ApiResponse<SupplierResponse> active(@PathVariable UUID id, @Valid @RequestBody ActiveInput input, HttpServletRequest request) { return ok(suppliers.active(id, input.active()), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
