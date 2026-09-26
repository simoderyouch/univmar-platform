package com.univmar.catalog.api;

import jakarta.validation.constraints.*;
import java.util.UUID;

public final class MaterialCategoryDtos {
    private MaterialCategoryDtos() { }
    public record Input(@NotBlank @Size(max = 100) String name, @NotBlank @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*", message = "Use lowercase letters, numbers, and hyphens only.") @Size(max = 100) String slug, @Min(0) @Max(100000) int sortOrder, boolean active, boolean websiteVisible) { }
    public record Response(UUID id, String name, String slug, int sortOrder, boolean active, boolean websiteVisible) { }
}
