package com.univmar.cms.api;

import static com.univmar.common.api.ApiResponse.of;
import static com.univmar.cms.api.PortfolioDtos.*;
import com.univmar.cms.WebsitePortfolioService;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/cms/portfolio")
public class WebsitePortfolioController {
    private final WebsitePortfolioService portfolio;
    public WebsitePortfolioController(WebsitePortfolioService portfolio) { this.portfolio = portfolio; }
    @GetMapping("/categories") public ApiResponse<List<CategoryResponse>> categories(HttpServletRequest request) { return of(portfolio.categories(), id(request)); }
    @PostMapping("/categories") public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(of(portfolio.createCategory(input), id(request))); }
    @PutMapping("/categories/{categoryId}") public ApiResponse<CategoryResponse> updateCategory(@PathVariable UUID categoryId, @Valid @RequestBody CategoryInput input, HttpServletRequest request) { return of(portfolio.updateCategory(categoryId, input), id(request)); }
    @GetMapping public ApiResponse<List<ProjectResponse>> list(HttpServletRequest request) { return of(portfolio.list(), id(request)); }
    @PostMapping public ResponseEntity<ApiResponse<ProjectResponse>> create(@Valid @RequestBody ProjectInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(of(portfolio.create(input), id(request))); }
    @PutMapping("/{itemId}") public ApiResponse<ProjectResponse> update(@PathVariable UUID itemId, @Valid @RequestBody ProjectInput input, HttpServletRequest request) { return of(portfolio.update(itemId, input), id(request)); }
    private String id(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
