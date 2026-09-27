package com.univmar.catalog;

import com.univmar.catalog.api.PublicCatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.common.api.ApiException;
import java.text.Normalizer;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PublicCatalogService {
    private final StoneMaterialRepository materials; private final MaterialCategoryRepository categories; private final PublicAvailabilityService availability;
    public PublicCatalogService(StoneMaterialRepository materials, MaterialCategoryRepository categories, PublicAvailabilityService availability) { this.materials = materials; this.categories = categories; this.availability = availability; }
    public List<CategoryResponse> categories() { List<StoneMaterial> publicMaterials = publicMaterials(); return categories.findAllByActiveTrueAndWebsiteVisibleTrueOrderBySortOrderAscNameAsc().stream().map(category -> new CategoryResponse(category.getId().toString(), category.getName(), category.getSlug(), category.getSortOrder(), publicMaterials.stream().filter(material -> material.getCategory().getId().equals(category.getId())).count())).toList(); }
    public List<ProductResponse> products(String categorySlug) { return publicMaterials().stream().filter(material -> categorySlug == null || categorySlug.isBlank() || material.getCategory().getSlug().equalsIgnoreCase(categorySlug.trim())).map(this::response).toList(); }
    public ProductResponse product(UUID id) { return publicMaterials().stream().filter(material -> material.getId().equals(id)).findFirst().map(this::response).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PUBLIC_PRODUCT_NOT_FOUND", "The product is not available.")); }
    private List<StoneMaterial> publicMaterials() { return materials.findAll().stream().filter(StoneMaterial::isActive).filter(material -> material.getCategory().isActive() && material.getCategory().isWebsiteVisible()).filter(material -> material.getVariants().stream().anyMatch(variant -> availability.visible(variant) && image(variant) != null)).sorted(Comparator.comparing((StoneMaterial item) -> item.getCategory().getSortOrder()).thenComparing(StoneMaterial::getName, String.CASE_INSENSITIVE_ORDER)).toList(); }
    private ProductResponse response(StoneMaterial item) { StoneVariant primary = item.getVariants().stream().filter(variant -> availability.visible(variant) && image(variant) != null).findFirst().orElseThrow(); List<String> gallery = gallery(primary); List<VariantResponse> variants = item.getVariants().stream().filter(variant -> availability.visible(variant) && image(variant) != null).map(this::variant).toList(); return new ProductResponse(item.getId().toString(), slug(item), displayName(item), item.getCategory().getName(), item.getCategory().getSlug(), item.getColor(), item.getOrigin(), item.getPattern(), item.getDescription(), item.getApplications(), image(primary), List.copyOf(gallery), variants, availability.response(primary), tags(item.getPublicUses(), item.getApplications()), item.getCareSummary(), item.getIndoorOutdoor()); }
    private String image(StoneVariant variant) { if (variant.getMainImageUrl() != null && !variant.getMainImageUrl().isBlank()) return variant.getMainImageUrl(); return variant.getGalleryImageUrls().stream().filter(value -> value != null && !value.isBlank()).findFirst().orElse(null); }
    private List<String> gallery(StoneVariant variant) { List<String> gallery = new ArrayList<>(); if (variant.getMainImageUrl() != null && !variant.getMainImageUrl().isBlank()) gallery.add(variant.getMainImageUrl()); variant.getGalleryImageUrls().stream().filter(value -> value != null && !value.isBlank()).forEach(gallery::add); return List.copyOf(gallery); }
    private VariantResponse variant(StoneVariant item) { return new VariantResponse(item.getId().toString(), item.getVariantName(), item.getThicknessMm(), item.getFormat(), image(item), gallery(item), availability.response(item)); }
    private List<String> tags(String explicit, String fallback) { String source = explicit == null || explicit.isBlank() ? fallback : explicit; if (source == null || source.isBlank()) return List.of(); return Arrays.stream(source.split("[,;\\n]")).map(String::trim).filter(value -> !value.isBlank()).limit(12).toList(); }
    private String displayName(StoneMaterial item) { return item.getName() == null || item.getName().isBlank() ? item.getCommercialName() : item.getName(); }
    private String slug(StoneMaterial item) { String normalized = Normalizer.normalize(displayName(item), Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""); return normalized + "-" + item.getId(); }
}
