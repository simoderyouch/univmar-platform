package com.univmar.audit.api;

import com.univmar.audit.AuditService;
import com.univmar.audit.api.AuditDtos.Response;
import com.univmar.common.api.*;
import com.univmar.document.domain.DocumentTargetType;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activity")
public class AuditController {
    private final AuditService audit; public AuditController(AuditService audit) { this.audit = audit; }
    @GetMapping public ApiResponse<List<Response>> list(@RequestParam DocumentTargetType targetType, @RequestParam UUID targetId, HttpServletRequest request) { return ApiResponse.of(audit.list(targetType, targetId), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
