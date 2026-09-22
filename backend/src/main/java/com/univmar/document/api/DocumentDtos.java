package com.univmar.document.api;

import com.univmar.document.domain.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

public final class DocumentDtos {
    private DocumentDtos() { }
    public record CreateInput(@NotNull DocumentTargetType targetType, @NotNull UUID targetId, @NotNull DocumentType documentType, @NotBlank @Size(max = 255) String fileName, @NotBlank @Size(max = 1000) String fileUrl, @NotBlank @Size(max = 120) String contentType, @PositiveOrZero long fileSize) { }
    public record Response(UUID id, DocumentTargetType targetType, UUID targetId, DocumentType documentType, String fileName, String fileUrl, String contentType, long fileSize, String uploadedBy, Instant createdAt) { }
}
