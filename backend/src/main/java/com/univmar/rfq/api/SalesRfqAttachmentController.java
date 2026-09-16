package com.univmar.rfq.api;

import com.univmar.rfq.RfqAttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@PreAuthorize("hasAnyRole('SALES','ADMIN')")
public class SalesRfqAttachmentController {
    private final RfqAttachmentService service;

    public SalesRfqAttachmentController(RfqAttachmentService service) {
        this.service = service;
    }

    @GetMapping("/quote-requests/{id}/attachments")
    public List<RfqAttachmentDtos.Response> list(@PathVariable Long id) {
        return service.sales(id);
    }

    @GetMapping("/attachments/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        var d = service.salesDownload(id);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(d.contentType())).header("Content-Disposition", ContentDisposition.attachment().filename(d.filename()).build().toString()).body(d.resource());
    }
}
