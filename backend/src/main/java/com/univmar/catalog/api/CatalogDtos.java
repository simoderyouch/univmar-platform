package com.univmar.catalog.api;

import com.univmar.catalog.domain.StoneType;
import com.univmar.catalog.domain.PublicAvailabilityPolicy;
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
                                @NotBlank @Size(max = 80) String sku, UUID categoryId, @Size(max = 100) String stoneType,
                                @Size(max = 100) String origin, @Size(max = 100) String color,
                                @Size(max = 160) String pattern, @Size(max = 10000) String description,
                                @Size(max = 10000) String applications, @Size(max = 500) String publicUses,
                                @Size(max = 1000) String careSummary, @Size(max = 20) String indoorOutdoor) {
        /** Temporary source compatibility for service callers compiled against the former material-image input. */
        public MaterialInput(String name, String commercialName, String sku, StoneType stoneType, String origin,
                             String color, String pattern, String description, String applications,
                             String ignoredMainImageUrl, List<String> ignoredGalleryImageUrls) {
            this(name, commercialName, sku, legacyCategory(stoneType), stoneType.name(), origin, color, pattern, description, applications, null, null, null);
        }
        /** Compatibility for callers using the category-based record before public discovery fields existed. */
        public MaterialInput(String name, String commercialName, String sku, UUID categoryId, String stoneType,
                             String origin, String color, String pattern, String description, String applications) {
            this(name, commercialName, sku, categoryId, stoneType, origin, color, pattern, description, applications, null, null, null);
        }
        private static UUID legacyCategory(StoneType type) { return switch (type) { case GRANITE -> UUID.fromString("00000000-0000-0000-0000-000000000043"); case ONYX -> UUID.fromString("00000000-0000-0000-0000-000000000045"); case QUARTZITE -> UUID.fromString("00000000-0000-0000-0000-000000000046"); default -> UUID.fromString("00000000-0000-0000-0000-000000000044"); }; }
    }

    public record VariantInput(@NotNull @DecimalMin(value = "0.001") BigDecimal thicknessMm, @NotBlank @Size(max = 100) String variantName,
                               @Size(max = 160) String format, @Size(max = 1000) String mainImageUrl,
                               @Size(max = 20) List<@Size(max = 1000) String> galleryImageUrls, PublicAvailabilityPolicy publicAvailabilityPolicy) {
        public VariantInput(BigDecimal thicknessMm, String variantName, String format) {
            this(thicknessMm, variantName, format, null, List.of(), PublicAvailabilityPolicy.AUTO);
        }
        /** Compatibility for callers using image fields before public availability policy existed. */
        public VariantInput(BigDecimal thicknessMm, String variantName, String format, String mainImageUrl, List<String> galleryImageUrls) {
            this(thicknessMm, variantName, format, mainImageUrl, galleryImageUrls, PublicAvailabilityPolicy.AUTO);
        }

    }

    public record ActiveInput(boolean active) {
    }

    public record MaterialSummary(UUID id, String name, String commercialName, String sku, UUID categoryId, String categoryName, String categorySlug, String stoneType,
                                  String origin, String color, boolean active, int variantCount, String mainImageUrl) {
    }

    public record MaterialDetail(UUID id, String name, String commercialName, String sku, UUID categoryId, String categoryName, String categorySlug, String stoneType,
                                 String origin, String color, String pattern, String description, String applications, String publicUses, String careSummary, String indoorOutdoor, boolean active,
                                 List<VariantResponse> variants) {
    }

    public record VariantResponse(UUID id, BigDecimal thicknessMm, String variantName, String format, String mainImageUrl,
                                  List<String> galleryImageUrls, boolean active, PublicAvailabilityPolicy publicAvailabilityPolicy) {
    }

    public record PageResult<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
        public static <T> PageResult<T> from(Page<T> page) {
            return new PageResult<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
        }
    }
}
