package com.univmar.rfq.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "quote_request_attachment")
public class QuoteRequestAttachment {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "rfq_id", nullable = false) private QuoteRequest rfq;
    @Column(name = "file_name", nullable = false, length = 255) private String fileName;
    @Column(name = "file_url", nullable = false, length = 1000) private String fileUrl;
    @Column(name = "content_type", length = 120) private String contentType;
    protected QuoteRequestAttachment() { }
    public QuoteRequestAttachment(QuoteRequest rfq, String fileName, String fileUrl, String contentType) { id = UUID.randomUUID(); this.rfq = rfq; this.fileName = fileName; this.fileUrl = fileUrl; this.contentType = contentType; }
    public UUID getId() { return id; } public String getFileName() { return fileName; } public String getFileUrl() { return fileUrl; } public String getContentType() { return contentType; }
}
