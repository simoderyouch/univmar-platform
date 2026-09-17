package com.univmar.catalog.api;

import com.univmar.catalog.domain.Finish;
import com.univmar.catalog.domain.StoneType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public final class CatalogDtos {
    private CatalogDtos() {
    }

    public record MaterialInput(@NotBlank @Size(max = 160) String name, @Size(max = 160) String commercialName,
                                @NotBlank @Size(max = 80) String sku, @NotNull StoneType stoneType,
                                @Size(max = 100) String origin, @Size(max = 100) String color,
                                @Size(max = 160) String pattern, @Size(max = 10000) String description,
                                @Size(max = 10000) String applications, @Size(max = 1000) String mainImageUrl,
                                @Size(max = 20) List<@Size(max = 1000) String> galleryImageUrls) {
    }

    public record VariantInput(@NotNull @DecimalMin(value = "0.001") BigDecimal thicknessMm, @NotNull Finish finish,
                               @Size(max = 160) String format) {
    }

    public record ActiveInput(boolean active) {
    }

    public record MaterialSummary(UUID id, String name, String commercialName, String sku, StoneType stoneType,
                                  String origin, String color, String mainImageUrl, boolean active, int variantCount) {
    }

    public record MaterialDetail(UUID id, String name, String commercialName, String sku, StoneType stoneType,
                                 String origin, String color, String pattern, String description, String applications,
                                 String mainImageUrl, List<String> galleryImageUrls, boolean active,
                                 List<VariantResponse> variants) {
    }

    public record VariantResponse(UUID id, BigDecimal thicknessMm, Finish finish, String format, boolean active) {
    }

    public record PageResult<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
        public static <T> PageResult<T> from(Page<T> page) {
            return new PageResult<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
        }
    }
}
