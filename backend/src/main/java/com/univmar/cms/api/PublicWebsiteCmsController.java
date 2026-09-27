package com.univmar.cms.api;

import static com.univmar.common.api.ApiResponse.of;
import static com.univmar.cms.api.CmsDtos.*;

import com.univmar.cms.WebsiteCmsService;
import com.univmar.cms.WebsiteFormRateLimiter;
import com.univmar.common.api.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/contact-form")
public class PublicWebsiteCmsController {
    private final WebsiteCmsService cms; private final WebsiteFormRateLimiter limiter;
    public PublicWebsiteCmsController(WebsiteCmsService cms, WebsiteFormRateLimiter limiter) { this.cms = cms; this.limiter = limiter; }
    @GetMapping public ApiResponse<FormSettingsResponse> settings(HttpServletRequest request) { return of(cms.publicSettings(), requestId(request)); }
    @PostMapping("/submissions") public ApiResponse<PublicAcknowledgement> submit(@Valid @RequestBody PublicInquiryInput input, HttpServletRequest request) { if (limiter.allow(request.getRemoteAddr())) cms.submit(input); return of(new PublicAcknowledgement("Thank you. Our team will contact you shortly."), requestId(request)); }
    @PostMapping(value = "/submissions-with-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) public ApiResponse<PublicAcknowledgement> submitWithFiles(@Valid @RequestPart("payload") PublicInquiryInput input, @RequestPart(value = "files", required = false) java.util.List<MultipartFile> files, HttpServletRequest request) { if (limiter.allow(request.getRemoteAddr())) cms.submit(input, files); return of(new PublicAcknowledgement("Thank you. Our team will contact you shortly."), requestId(request)); }
    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
