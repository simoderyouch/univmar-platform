package com.univmar.catalog.api;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.StoneType;
import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/materials")
public class CatalogController {
    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public ApiResponse<PageResult<MaterialSummary>> list(@RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String origin, @RequestParam(required = false) String color, @RequestParam(required = false) Boolean active, @PageableDefault(size = 20, sort = "name") Pageable pageable, HttpServletRequest request) {
        return ok(catalog.list(search, type == null || type.isBlank() ? null : StoneType.from(type), origin, color, active, pageable), request);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaterialDetail>> create(@Valid @RequestBody MaterialInput input, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ok(catalog.create(input), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<MaterialDetail> get(@PathVariable UUID id, HttpServletRequest request) {
        return ok(catalog.get(id), request);
    }

    @PutMapping("/{id}")
    public ApiResponse<MaterialDetail> update(@PathVariable UUID id, @Valid @RequestBody MaterialInput input, HttpServletRequest request) {
        return ok(catalog.update(id, input), request);
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<MaterialDetail> setActive(@PathVariable UUID id, @Valid @RequestBody ActiveInput input, HttpServletRequest request) {
        return ok(catalog.setMaterialActive(id, input.active()), request);
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<ApiResponse<VariantResponse>> createVariant(@PathVariable UUID id, @Valid @RequestBody VariantInput input, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ok(catalog.createVariant(id, input), request));
    }

    @PutMapping("/{materialId}/variants/{variantId}")
    public ApiResponse<VariantResponse> updateVariant(@PathVariable UUID materialId, @PathVariable UUID variantId, @Valid @RequestBody VariantInput input, HttpServletRequest request) {
        return ok(catalog.updateVariant(materialId, variantId, input), request);
    }

    @PatchMapping("/{materialId}/variants/{variantId}/active")
    public ApiResponse<VariantResponse> setVariantActive(@PathVariable UUID materialId, @PathVariable UUID variantId, @Valid @RequestBody ActiveInput input, HttpServletRequest request) {
        return ok(catalog.setVariantActive(materialId, variantId, input.active()), request);
    }

    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) {
        return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE));
    }
}
