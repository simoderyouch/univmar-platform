package com.univmar.document.api;

import com.univmar.common.api.*;
import com.univmar.document.DocumentService;
import com.univmar.document.api.DocumentDtos.*;
import com.univmar.document.domain.DocumentTargetType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {
    private final DocumentService documents; public DocumentController(DocumentService documents) { this.documents = documents; }
    @GetMapping public ApiResponse<List<Response>> list(@RequestParam DocumentTargetType targetType, @RequestParam UUID targetId, HttpServletRequest request) { return ok(documents.list(targetType, targetId), request); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(documents.create(input), request)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable UUID id) { documents.delete(id); return ResponseEntity.noContent().build(); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
