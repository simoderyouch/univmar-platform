package com.univmar.slab.api;

import com.univmar.common.api.*;
import com.univmar.slab.SlabService;
import com.univmar.slab.api.SlabDtos.*;
import com.univmar.slab.domain.SlabStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/slabs")
public class SlabController {
    private final SlabService slabs; public SlabController(SlabService slabs) { this.slabs = slabs; }
    @GetMapping public ApiResponse<List<Response>> list(@RequestParam(required = false) SlabStatus status, @RequestParam(required = false) UUID inventoryItemId, HttpServletRequest request) { return ok(slabs.list(status, inventoryItemId), request); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(slabs.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(slabs.detail(id), request); }
    @PostMapping("/{id}/hold") public ApiResponse<Response> hold(@PathVariable UUID id, HttpServletRequest request) { return ok(slabs.hold(id), request); }
    @PostMapping("/{id}/reserve") public ApiResponse<Response> reserve(@PathVariable UUID id, @Valid @RequestBody ReserveInput input, HttpServletRequest request) { return ok(slabs.reserve(id, input), request); }
    @PostMapping("/{id}/release") public ApiResponse<Response> release(@PathVariable UUID id, HttpServletRequest request) { return ok(slabs.release(id), request); }
    @PostMapping("/{id}/damage") public ApiResponse<Response> damage(@PathVariable UUID id, HttpServletRequest request) { return ok(slabs.damage(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
