package com.univmar.cms.api;

import static com.univmar.common.api.ApiResponse.of;
import static com.univmar.cms.api.CmsDtos.*;

import com.univmar.cms.WebsiteCmsService;
import com.univmar.cms.domain.WebsiteInquiryStatus;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

@RestController
@RequestMapping("/api/v1/cms")
public class WebsiteCmsController {
    private final WebsiteCmsService cms;
    public WebsiteCmsController(WebsiteCmsService cms) { this.cms = cms; }
    @GetMapping("/contact-form") public ApiResponse<FormSettingsResponse> settings(HttpServletRequest request) { return of(cms.publicSettings(), requestId(request)); }
    @PutMapping("/contact-form") public ApiResponse<FormSettingsResponse> updateSettings(@Valid @RequestBody FormSettingsInput input, HttpServletRequest request) { return of(cms.updateSettings(input), requestId(request)); }
    @GetMapping("/contact-submissions") public ApiResponse<InquiryPage> inquiries(@RequestParam(required = false) WebsiteInquiryStatus status, @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable, HttpServletRequest request) { return of(cms.list(status, pageable), requestId(request)); }
    @PostMapping("/contact-submissions/{id}/claim") public ApiResponse<InquiryResponse> claim(@PathVariable UUID id, HttpServletRequest request) { return of(cms.claim(id), requestId(request)); }
    @PatchMapping("/contact-submissions/{id}") public ApiResponse<InquiryResponse> status(@PathVariable UUID id, @Valid @RequestBody InquiryStatusInput input, HttpServletRequest request) { return of(cms.changeStatus(id, input), requestId(request)); }
    @PostMapping("/contact-submissions/{id}/qualify") public ApiResponse<QualificationResponse> qualify(@PathVariable UUID id, @Valid @RequestBody QualificationInput input, HttpServletRequest request) { return of(cms.qualify(id, input), requestId(request)); }
    @GetMapping("/contact-submissions/{id}/attachments/{attachmentId}") public ResponseEntity<org.springframework.core.io.ByteArrayResource> attachment(@PathVariable UUID id, @PathVariable UUID attachmentId) { var file = cms.attachment(id, attachmentId); MediaType type; try { type = MediaType.parseMediaType(file.contentType()); } catch (Exception ignored) { type = MediaType.APPLICATION_OCTET_STREAM; } return ResponseEntity.ok().contentType(type).header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.originalFilename()).build().toString()).body(file.resource()); }
    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
