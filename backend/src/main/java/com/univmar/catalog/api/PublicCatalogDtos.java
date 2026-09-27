package com.univmar.catalog.api;

import java.util.*;

public final class PublicCatalogDtos {
    private PublicCatalogDtos() { }
    public record CategoryResponse(String id, String name, String slug, int sortOrder, long productCount) { }
    public record PublicAvailability(String code, String label) { }
    public record ProductResponse(String id, String slug, String name, String category, String categorySlug,
                                  String color, String origin, String pattern,
                                  String description, String applications, String coverImageUrl,
                                  List<String> galleryImageUrls, List<VariantResponse> variants,
                                  PublicAvailability availability, List<String> recommendedUses,
                                  String careSummary, String indoorOutdoor) { }
    public record VariantResponse(String id, String name, java.math.BigDecimal thicknessMm, String format,
                                  String coverImageUrl, List<String> galleryImageUrls, PublicAvailability availability) { }
}
