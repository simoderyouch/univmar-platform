package com.univmar.common.storage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Streams private S3 documents only after Spring Security has authorized staff access. */
@RestController
@RequestMapping("/api/v1/uploads/documents")
@ConditionalOnBean(S3ImageStorage.class)
public class S3DocumentController {
    private final LocalDocumentStorage documents;

    public S3DocumentController(LocalDocumentStorage documents) { this.documents = documents; }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<ByteArrayResource> download(@PathVariable String filename) {
        LocalDocumentStorage.StoredDocument document = documents.loadManagedDocument("/api/v1/uploads/documents/" + filename);
        MediaType contentType;
        try { contentType = MediaType.parseMediaType(document.contentType()); }
        catch (IllegalArgumentException ignored) { contentType = MediaType.APPLICATION_OCTET_STREAM; }
        return ResponseEntity.ok().contentType(contentType).body(document.resource());
    }
}
