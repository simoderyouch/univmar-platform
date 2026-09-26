package com.univmar.catalog.api;

import static com.univmar.common.api.ApiResponse.of;
import com.univmar.catalog.PublicCatalogService;
import com.univmar.catalog.api.PublicCatalogDtos.*;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/public/catalog")
public class PublicCatalogController {
    private final PublicCatalogService catalog;
    public PublicCatalogController(PublicCatalogService catalog) { this.catalog = catalog; }
    @GetMapping("/categories") public ApiResponse<List<CategoryResponse>> categories(HttpServletRequest request) { return of(catalog.categories(), id(request)); }
    @GetMapping("/products") public ApiResponse<List<ProductResponse>> products(@RequestParam(required = false) String category, HttpServletRequest request) { return of(catalog.products(category), id(request)); }
    @GetMapping("/products/{id}") public ApiResponse<ProductResponse> product(@PathVariable UUID id, HttpServletRequest request) { return of(catalog.product(id), id(request)); }
    private String id(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
