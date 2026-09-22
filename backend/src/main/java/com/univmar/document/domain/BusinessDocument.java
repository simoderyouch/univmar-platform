package com.univmar.document.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "business_document")
public class BusinessDocument {
    @Id private UUID id;
    @Enumerated(EnumType.STRING) @Column(name = "target_type", nullable = false, length = 30) private DocumentTargetType targetType;
    @Column(name = "target_id", nullable = false) private UUID targetId;
    @Enumerated(EnumType.STRING) @Column(name = "document_type", nullable = false, length = 40) private DocumentType documentType;
    @Column(name = "file_name", nullable = false, length = 255) private String fileName;
    @Column(name = "file_url", nullable = false, length = 1000) private String fileUrl;
    @Column(name = "content_type", nullable = false, length = 120) private String contentType;
    @Column(name = "file_size", nullable = false) private long fileSize;
    @Column(name = "uploaded_by", nullable = false, length = 320) private String uploadedBy;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    protected BusinessDocument() { }
    public BusinessDocument(DocumentTargetType targetType, UUID targetId, DocumentType documentType, String fileName, String fileUrl, String contentType, long fileSize, String uploadedBy) { id = UUID.randomUUID(); this.targetType = targetType; this.targetId = targetId; this.documentType = documentType; this.fileName = fileName; this.fileUrl = fileUrl; this.contentType = contentType; this.fileSize = fileSize; this.uploadedBy = uploadedBy; }
    @PrePersist void timestamp() { createdAt = Instant.now(); }
    public UUID getId() { return id; } public DocumentTargetType getTargetType() { return targetType; } public UUID getTargetId() { return targetId; } public DocumentType getDocumentType() { return documentType; } public String getFileName() { return fileName; } public String getFileUrl() { return fileUrl; } public String getContentType() { return contentType; } public long getFileSize() { return fileSize; } public String getUploadedBy() { return uploadedBy; } public Instant getCreatedAt() { return createdAt; }
}
