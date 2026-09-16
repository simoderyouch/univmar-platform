package com.univmar.rfq.api;
import java.time.Instant;
public final class RfqAttachmentDtos { private RfqAttachmentDtos(){} public record Response(Long id,String filename,String contentType,long sizeBytes,Long uploadedBy,Instant createdAt){} }
