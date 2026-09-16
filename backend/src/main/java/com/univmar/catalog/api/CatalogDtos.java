package com.univmar.catalog.api;

import com.univmar.catalog.domain.MaterialOriginType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public final class CatalogDtos {
    private CatalogDtos() {
    }

    public record ImageRequest(@NotBlank @Size(max = 1000) String url, @Size(max = 300) String altText) {
    }

    public record ImageResponse(Long id, String url, String altText, int displayOrder, boolean primary) {
    }

    public record CategoryResponse(Long id, Integer sourceCategoryId, String slug, String name, int displayOrder,
                                   boolean localMaterial) {
    }

    public record AdminCategoryResponse(Long id, Integer sourceCategoryId, String slug, String name, int displayOrder,
                                        boolean localMaterial, boolean active) {
    }

    public record CategoryRequest(@NotBlank @Size(max = 120) String slug, @NotBlank @Size(max = 100) String name,
                                  @NotNull Integer displayOrder, Boolean localMaterial, Boolean active) {
    }

    public record MaterialRequest(@NotBlank String name, @NotBlank String slug, @NotBlank String category,
                                  String originCountry, MaterialOriginType originType, String primaryColor, String description, String applications,
                                  Boolean active, List<@Valid ImageRequest> images) {
    }

    public record VariantRequest(@Size(max = 100) String sku, @NotBlank String finish, @NotNull @DecimalMin("0.01") BigDecimal thicknessMm,
                                 String grade, @DecimalMin("0.00") BigDecimal indicativePrice, Boolean active) {
    }

    public record VariantResponse(Long id, String sku, String finish, BigDecimal thicknessMm, String grade,
                                  BigDecimal indicativePrice, String availability) {
    }

    public record MaterialResponse(Long id, Long sourceProductId, String name, String slug, String category,
                                   String originCountry, MaterialOriginType originType, String primaryColor, String description, String applications,
                                   boolean active, List<ImageResponse> images, List<VariantResponse> variants) {
    }
}
