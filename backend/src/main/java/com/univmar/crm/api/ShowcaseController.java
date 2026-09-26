package com.univmar.crm.api;

import static com.univmar.common.api.ApiResponse.of;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.crm.ShowcaseService;
import com.univmar.crm.api.ShowcaseDtos.*;
import com.univmar.crm.domain.ShowcaseKind;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cms/showcase")
public class ShowcaseController {
    private final ShowcaseService showcase;
    public ShowcaseController(ShowcaseService showcase) { this.showcase = showcase; }
    @GetMapping("/{kind}") public ApiResponse<List<InternalResponse>> list(@PathVariable ShowcaseKind kind, HttpServletRequest request) { return of(showcase.list(kind), requestId(request)); }
    @PostMapping("/{kind}") public ResponseEntity<ApiResponse<InternalResponse>> create(@PathVariable ShowcaseKind kind, @Valid @RequestBody Input input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(of(showcase.create(kind, input), requestId(request))); }
    @PutMapping("/{id}") public ApiResponse<InternalResponse> update(@PathVariable UUID id, @Valid @RequestBody Input input, HttpServletRequest request) { return of(showcase.update(id, input), requestId(request)); }
    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
