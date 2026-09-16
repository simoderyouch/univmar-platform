package com.univmar.shared.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    public record HealthResponse(String status, String service) { }
    @GetMapping("/health") public HealthResponse health() { return new HealthResponse("UP", "univmar-api"); }
}
