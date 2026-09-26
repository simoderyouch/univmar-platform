package com.univmar.dashboard.api;

import com.univmar.common.api.*;
import com.univmar.dashboard.DashboardService;
import com.univmar.dashboard.api.DashboardDtos.Overview;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboard; public DashboardController(DashboardService dashboard) { this.dashboard = dashboard; }
    @GetMapping("/overview") public ApiResponse<Overview> overview(HttpServletRequest request) { return ApiResponse.of(dashboard.overview(), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
