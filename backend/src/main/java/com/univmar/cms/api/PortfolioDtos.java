package com.univmar.cms.api;

import jakarta.validation.constraints.*;
import java.util.*;

public final class PortfolioDtos {
    private PortfolioDtos() { }
    public record CategoryInput(@NotBlank @Size(max = 100) String name, @NotBlank @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*") @Size(max = 100) String slug, @Min(0) @Max(100000) int sortOrder, boolean active) { }
    public record CategoryResponse(UUID id, String name, String slug, int sortOrder, boolean active) { }
    public record ProjectInput(@NotNull UUID projectId, @NotNull UUID categoryId, boolean published, boolean featured, @Min(0) @Max(100000) int sortOrder, @NotBlank @Size(max = 1000) String coverImageUrl, @Size(max = 30) List<@Size(max = 1000) String> galleryImageUrls, @Size(max = 12) List<UUID> variantIds) { }
    public record ProjectResponse(UUID id, UUID projectId, String projectName, UUID categoryId, String categoryName, String categorySlug, boolean published, boolean featured, int sortOrder, String coverImageUrl, List<String> galleryImageUrls, List<UUID> variantIds) { }
    public record PublicProjectResponse(String id, String title, String category, String categorySlug, String coverImageUrl, List<String> galleryImageUrls, boolean featured, int sortOrder) { }
}
