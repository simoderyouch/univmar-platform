package com.univmar.fabrication.api;

import com.univmar.common.api.*;
import com.univmar.fabrication.FabricationService;
import com.univmar.fabrication.api.FabricationDtos.*;
import com.univmar.fabrication.domain.FabricationStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fabrication")
public class FabricationController {
    private final FabricationService fabrication; public FabricationController(FabricationService fabrication) { this.fabrication = fabrication; }
    @GetMapping public ApiResponse<List<Response>> list(@RequestParam(required = false) FabricationStatus status, HttpServletRequest request) { return ok(fabrication.list(status), request); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(fabrication.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(fabrication.detail(id), request); }
    @PostMapping("/{id}/advance") public ApiResponse<Response> advance(@PathVariable UUID id, @Valid @RequestBody AdvanceInput input, HttpServletRequest request) { return ok(fabrication.advance(id, input), request); }
    @PostMapping("/{id}/operations") public ApiResponse<Response> addOperation(@PathVariable UUID id, @Valid @RequestBody OperationInput input, HttpServletRequest request) { return ok(fabrication.addOperation(id, input), request); }
    @PostMapping("/{id}/operations/{operationId}/complete") public ApiResponse<Response> completeOperation(@PathVariable UUID id, @PathVariable UUID operationId, HttpServletRequest request) { return ok(fabrication.completeOperation(id, operationId), request); }
    @PostMapping("/{id}/materials") public ApiResponse<Response> material(@PathVariable UUID id, @Valid @RequestBody MaterialInput input, HttpServletRequest request) { return ok(fabrication.assignMaterial(id, input), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
