package com.univmar.rfq.domain;
import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;
@Entity @Table(name="rfq_attachments")
public class RfqAttachment extends BaseEntity {
    @ManyToOne(optional=false) @JoinColumn(name="request_id") private QuoteRequest request;
    @Column(nullable=false) private String originalFilename; @Column(nullable=false) private String contentType; @Column(nullable=false) private long sizeBytes; @Column(nullable=false,unique=true) private String storageKey; @ManyToOne(optional=false) @JoinColumn(name="uploaded_by") private User uploadedBy;
    protected RfqAttachment() { }
    public RfqAttachment(QuoteRequest request,String originalFilename,String contentType,long sizeBytes,String storageKey,User uploadedBy){this.request=request;this.originalFilename=originalFilename;this.contentType=contentType;this.sizeBytes=sizeBytes;this.storageKey=storageKey;this.uploadedBy=uploadedBy;}
    public QuoteRequest getRequest(){return request;} public String getOriginalFilename(){return originalFilename;} public String getContentType(){return contentType;} public long getSizeBytes(){return sizeBytes;} public String getStorageKey(){return storageKey;} public User getUploadedBy(){return uploadedBy;}
}
