package com.univmar.label.api;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.label.LabelService;
import com.univmar.label.api.LabelDtos.*;
import com.univmar.label.domain.LabelTargetType;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/labels")
public class LabelController {
    private final LabelService labels;
    public LabelController(LabelService labels) { this.labels = labels; }
    @PostMapping public ApiResponse<LabelResponse> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ok(labels.create(input), request); }
    @GetMapping public ApiResponse<LabelResponse> get(@RequestParam LabelTargetType targetType, @RequestParam UUID targetId, HttpServletRequest request) { return ok(labels.get(targetType, targetId), request); }
    @GetMapping("/scan/{code}") public ApiResponse<ScanResponse> scan(@PathVariable String code, HttpServletRequest request) { return ok(labels.scan(code), request); }
    @GetMapping(value = "/{code}/qr.png", produces = MediaType.IMAGE_PNG_VALUE) public ResponseEntity<byte[]> qr(@PathVariable String code) throws Exception { BitMatrix matrix = new QRCodeWriter().encode(labels.qrPayload(code), BarcodeFormat.QR_CODE, 480, 480); ByteArrayOutputStream output = new ByteArrayOutputStream(); MatrixToImageWriter.writeToStream(matrix, "PNG", output); return ResponseEntity.ok().cacheControl(CacheControl.maxAge(java.time.Duration.ofDays(30)).cachePublic()).contentType(MediaType.IMAGE_PNG).body(output.toByteArray()); }
    private <T> ApiResponse<T> ok(T data, HttpServletRequest request) { return ApiResponse.of(data, (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE)); }
}
