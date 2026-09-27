package com.univmar.cms.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "website_inquiry_attachment")
public class WebsiteInquiryAttachment {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "inquiry_id", nullable = false) private WebsiteInquiry inquiry;
    @Column(name = "document_url", nullable = false, length = 1000) private String documentUrl;
    @Column(name = "original_filename", nullable = false, length = 500) private String originalFilename;
    @Column(name = "content_type", nullable = false, length = 100) private String contentType;
    @Column(name = "file_size", nullable = false) private long fileSize;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    protected WebsiteInquiryAttachment() { }
    public WebsiteInquiryAttachment(WebsiteInquiry inquiry, String documentUrl, String originalFilename, String contentType, long fileSize) { this.id = UUID.randomUUID(); this.inquiry = inquiry; this.documentUrl = documentUrl; this.originalFilename = originalFilename; this.contentType = contentType; this.fileSize = fileSize; }
    @PrePersist void created() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public String getDocumentUrl() { return documentUrl; } public String getOriginalFilename() { return originalFilename; } public String getContentType() { return contentType; } public long getFileSize() { return fileSize; }
}
