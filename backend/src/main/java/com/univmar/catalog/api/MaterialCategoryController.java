package com.univmar.catalog.api;

import static com.univmar.common.api.ApiResponse.of;
import com.univmar.catalog.MaterialCategoryService;
import com.univmar.catalog.api.MaterialCategoryDtos.*;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/material-categories")
public class MaterialCategoryController {
    private final MaterialCategoryService categories;
    public MaterialCategoryController(MaterialCategoryService categories) { this.categories = categories; }
    @GetMapping public ApiResponse<List<Response>> list(HttpServletRequest request) { return of(categories.list(), id(request)); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody Input input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(of(categories.create(input), id(request))); }
    @PutMapping("/{categoryId}") public ApiResponse<Response> update(@PathVariable UUID categoryId, @Valid @RequestBody Input input, HttpServletRequest request) { return of(categories.update(categoryId, input), id(request)); }
    private String id(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
