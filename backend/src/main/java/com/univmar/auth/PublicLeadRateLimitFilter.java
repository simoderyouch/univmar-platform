package com.univmar.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univmar.shared.api.ErrorCode;
import com.univmar.shared.api.RequestIdFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class PublicLeadRateLimitFilter extends OncePerRequestFilter {
    private final int maxPerMinute;
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper json;

    public PublicLeadRateLimitFilter(@Value("${univmar.web-lead.max-per-minute:12}") int maxPerMinute, ObjectMapper json) {
        this.maxPerMinute = maxPerMinute;
        this.json = json;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !("POST".equals(request.getMethod()) && "/api/v1/public/quote-requests".equals(request.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        long minute = System.currentTimeMillis() / 60_000;
        Bucket next = buckets.compute(clientIp(request), (key, old) -> old == null || old.minute() != minute ? new Bucket(minute, 1) : new Bucket(minute, old.count() + 1));
        if (next.count() > maxPerMinute) {
            response.setStatus(429);
            response.setContentType("application/problem+json");
            var body = new LinkedHashMap<String, Object>();
            body.put("code", ErrorCode.RATE_LIMITED.name());
            body.put("title", ErrorCode.RATE_LIMITED.name());
            body.put("detail", "Too many quote requests. Please try again shortly.");
            body.put("timestamp", Instant.now());
            body.put("path", request.getRequestURI());
            body.put("requestId", request.getAttribute(RequestIdFilter.ATTRIBUTE));
            json.writeValue(response.getOutputStream(), body);
            return;
        }
        if (buckets.size() > 10_000) buckets.entrySet().removeIf(entry -> entry.getValue().minute() < minute - 2);
        chain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded == null || forwarded.isBlank() ? request.getRemoteAddr() : forwarded.split(",")[0].trim();
    }

    private record Bucket(long minute, int count) {
    }
}
