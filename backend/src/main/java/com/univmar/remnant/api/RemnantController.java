package com.univmar.remnant.api;

import com.univmar.common.api.*;
import com.univmar.remnant.RemnantService;
import com.univmar.remnant.api.RemnantDtos.*;
import com.univmar.remnant.domain.RemnantStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/remnants")
public class RemnantController {
    private final RemnantService remnants; public RemnantController(RemnantService remnants) { this.remnants = remnants; }
    @GetMapping public ApiResponse<List<Response>> list(@RequestParam(required = false) RemnantStatus status, HttpServletRequest request) { return ok(remnants.list(status), request); }
    @PostMapping public org.springframework.http.ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return org.springframework.http.ResponseEntity.status(HttpStatus.CREATED).body(ok(remnants.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(remnants.detail(id), request); }
    @PostMapping("/{id}/hold") public ApiResponse<Response> hold(@PathVariable UUID id, HttpServletRequest request) { return ok(remnants.hold(id), request); }
    @PostMapping("/{id}/reserve") public ApiResponse<Response> reserve(@PathVariable UUID id, @Valid @RequestBody ReserveInput input, HttpServletRequest request) { return ok(remnants.reserve(id, input), request); }
    @PostMapping("/{id}/release") public ApiResponse<Response> release(@PathVariable UUID id, HttpServletRequest request) { return ok(remnants.release(id), request); }
    @PostMapping("/{id}/damage") public ApiResponse<Response> damage(@PathVariable UUID id, HttpServletRequest request) { return ok(remnants.damage(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
