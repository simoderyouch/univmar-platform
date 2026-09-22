package com.univmar.common.storage;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadController {
    private final LocalImageStorage storage;
    private final LocalDocumentStorage documents;
    public UploadController(LocalImageStorage storage, LocalDocumentStorage documents) { this.storage = storage; this.documents = documents; }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LocalImageStorage.UploadedImage> uploadImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        return ApiResponse.of(storage.store(file), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE));
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LocalDocumentStorage.UploadedDocument> uploadDocument(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        return ApiResponse.of(documents.store(file), (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE));
    }
}
