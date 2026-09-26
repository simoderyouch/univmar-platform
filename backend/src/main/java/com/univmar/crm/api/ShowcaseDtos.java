package com.univmar.crm.api;

import com.univmar.crm.domain.ShowcaseKind;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

public final class ShowcaseDtos {
    private ShowcaseDtos() { }
    /** A CMS entry is a publication relationship, not a copied product or project. */
    public record Input(UUID materialId, UUID projectId, boolean published, @Min(0) @Max(100000) int sortOrder) { }
    public record InternalResponse(UUID id, ShowcaseKind kind, UUID materialId, String materialName, UUID projectId, String projectName, String publicTitle, String publicSummary, String coverImageUrl, boolean published, Instant publishedAt, int sortOrder, Instant updatedAt) { }
    public record PublicResponse(String publicTitle, String publicSummary, String coverImageUrl, int sortOrder) { }
}
