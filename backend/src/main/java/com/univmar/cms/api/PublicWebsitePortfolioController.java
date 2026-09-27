package com.univmar.cms.api;

import static com.univmar.common.api.ApiResponse.of;
import com.univmar.cms.WebsitePortfolioService;
import com.univmar.cms.api.PortfolioDtos.*;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/public/portfolio")
public class PublicWebsitePortfolioController {
    private final WebsitePortfolioService portfolio;
    public PublicWebsitePortfolioController(WebsitePortfolioService portfolio) { this.portfolio = portfolio; }
    @GetMapping("/categories") public ApiResponse<List<CategoryResponse>> categories(HttpServletRequest request) { return of(portfolio.publicCategories(), id(request)); }
    @GetMapping("/projects") public ApiResponse<List<PublicProjectResponse>> projects(@RequestParam(required = false) Boolean featured, @RequestParam(required = false) UUID variantId, HttpServletRequest request) { return of(portfolio.publicProjects(featured, variantId), id(request)); }
    private String id(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
