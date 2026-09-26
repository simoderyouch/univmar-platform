package com.univmar.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univmar.audit.AuditService;
import com.univmar.common.api.ApiExceptionHandler.ErrorResponse;
import com.univmar.common.api.RequestIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class ApiAccessDeniedHandler implements AccessDeniedHandler {
    private final AuditService audit;
    private final ObjectMapper objectMapper;

    public ApiAccessDeniedHandler(AuditService audit, ObjectMapper objectMapper) { this.audit = audit; this.objectMapper = objectMapper; }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception) throws IOException {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String principal = authentication == null ? null : authentication.getName();
        try { audit.recordAccessDenied(principal, request.getMethod() + " " + request.getRequestURI()); } catch (RuntimeException ignored) { }
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), new ErrorResponse("FORBIDDEN", "You do not have permission to perform this action.", Map.of(), Instant.now(), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)));
    }
}
