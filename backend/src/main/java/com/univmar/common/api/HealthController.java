package com.univmar.common.api;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    @GetMapping("/health")
    ApiResponse<Map<String, String>> health(HttpServletRequest request) {
        return ApiResponse.of(Map.of("status", "UP"), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE));
    }
}
