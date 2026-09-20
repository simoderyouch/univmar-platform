package com.univmar.rfq.api;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.rfq.RfqService;
import com.univmar.rfq.api.RfqDtos.*;
import com.univmar.rfq.domain.RfqStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rfqs")
public class RfqController {
    private final RfqService rfqs;
    public RfqController(RfqService rfqs) { this.rfqs = rfqs; }
    @GetMapping public ApiResponse<RfqPage> list(@RequestParam(required = false) String search, @RequestParam(required = false) UUID customerId, @RequestParam(required = false) UUID projectId, @RequestParam(required = false) RfqStatus status, @RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to, @PageableDefault(size = 20, sort = "createdAt") Pageable pageable, HttpServletRequest request) { return ok(rfqs.list(search, customerId, projectId, status, from, to, pageable), request); }
    @PostMapping public ResponseEntity<ApiResponse<RfqResponse>> create(@Valid @RequestBody RfqInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ok(rfqs.create(input), request)); }
    @GetMapping("/{id}") public ApiResponse<RfqResponse> detail(@PathVariable UUID id, HttpServletRequest request) { return ok(rfqs.detail(id), request); }
    @PutMapping("/{id}") public ApiResponse<RfqResponse> update(@PathVariable UUID id, @Valid @RequestBody RfqInput input, HttpServletRequest request) { return ok(rfqs.update(id, input), request); }
    @PostMapping("/{id}/items") public ApiResponse<RfqResponse> addItem(@PathVariable UUID id, @Valid @RequestBody RfqItemInput input, HttpServletRequest request) { return ok(rfqs.addItem(id, input), request); }
    @DeleteMapping("/{id}/items/{itemId}") public ApiResponse<RfqResponse> removeItem(@PathVariable UUID id, @PathVariable UUID itemId, HttpServletRequest request) { return ok(rfqs.removeItem(id, itemId), request); }
    @PostMapping("/{id}/attachments") public ApiResponse<RfqResponse> addAttachment(@PathVariable UUID id, @Valid @RequestBody AttachmentInput input, HttpServletRequest request) { return ok(rfqs.addAttachment(id, input), request); }
    @PostMapping("/{id}/submit") public ApiResponse<RfqResponse> submit(@PathVariable UUID id, HttpServletRequest request) { return ok(rfqs.submit(id), request); }
    @PostMapping("/{id}/start-review") public ApiResponse<RfqResponse> startReview(@PathVariable UUID id, HttpServletRequest request) { return ok(rfqs.startReview(id), request); }
    @PostMapping("/{id}/cancel") public ApiResponse<RfqResponse> cancel(@PathVariable UUID id, HttpServletRequest request) { return ok(rfqs.cancel(id), request); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
