package com.univmar.catalog;

import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.common.api.ApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class CatalogService {
    private final StoneMaterialRepository materials;
    private final StoneVariantRepository variants;
    private final MaterialCategoryRepository categories;

    public CatalogService(StoneMaterialRepository materials, StoneVariantRepository variants, MaterialCategoryRepository categories) {
        this.materials = materials;
        this.variants = variants;
        this.categories = categories;
    }

    public MaterialDetail create(MaterialInput input) {
        ensureUniqueSku(input.sku(), null);
        MaterialCategory category = category(input.categoryId(), input.stoneType());
        StoneMaterial material = new StoneMaterial(input.name().trim(), trim(input.commercialName()), normalizeSku(input.sku()), legacyType(category), category, trim(input.origin()), trim(input.color()), trim(input.pattern()), trim(input.description()), trim(input.applications()));
        material.updatePublicDiscovery(trim(input.publicUses()), trim(input.careSummary()), trim(input.indoorOutdoor()));
        return detail(materials.save(material));
    }

    public MaterialDetail update(UUID id, MaterialInput input) {
        StoneMaterial material = material(id);
        ensureUniqueSku(input.sku(), id);
        MaterialCategory category = category(input.categoryId(), input.stoneType());
        material.update(input.name().trim(), trim(input.commercialName()), normalizeSku(input.sku()), legacyType(category), category, trim(input.origin()), trim(input.color()), trim(input.pattern()), trim(input.description()), trim(input.applications()));
        material.updatePublicDiscovery(trim(input.publicUses()), trim(input.careSummary()), trim(input.indoorOutdoor()));
        return detail(material);
    }

    @Transactional(readOnly = true)
    public MaterialDetail get(UUID id) {
        return detail(material(id));
    }

    @Transactional(readOnly = true)
    public PageResult<MaterialSummary> list(String search, UUID categoryId, String type, String origin, String color, Boolean active, Pageable pageable) {
        Specification<StoneMaterial> spec = Specification.where(null);
        if (search != null && !search.isBlank()) {
            String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(cb.like(cb.lower(root.get("name")), value), cb.like(cb.lower(root.get("sku")), value), cb.like(cb.lower(root.get("commercialName")), value)));
        }
        if (categoryId != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        else if (type != null && !type.isBlank()) { MaterialCategory category = category(null, type); spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), category.getId())); }
        if (origin != null && !origin.isBlank())
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("origin")), origin.trim().toLowerCase(Locale.ROOT)));
        if (color != null && !color.isBlank())
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("color")), color.trim().toLowerCase(Locale.ROOT)));
        if (active != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("active"), active));
        Page<StoneMaterial> page = materials.findAll(spec, pageable);
        return PageResult.from(page.map(this::summary));
    }

    public MaterialDetail setMaterialActive(UUID id, boolean active) {
        StoneMaterial item = material(id);
        item.setActive(active);
        return detail(item);
    }

    public VariantResponse createVariant(UUID materialId, VariantInput input) {
        StoneMaterial material = material(materialId);
        ensureUniqueVariant(materialId, input, null);
        StoneVariant variant = new StoneVariant(material, input.thicknessMm(), trim(input.format()), trim(input.mainImageUrl()), input.galleryImageUrls(), required(input.variantName()));
        variant.setPublicAvailabilityPolicy(input.publicAvailabilityPolicy());
        material.addVariant(variant);
        return variant(variant);
    }

    public VariantResponse updateVariant(UUID materialId, UUID variantId, VariantInput input) {
        StoneVariant item = variant(materialId, variantId);
        ensureUniqueVariant(materialId, input, variantId);
        item.update(input.thicknessMm(), trim(input.format()), trim(input.mainImageUrl()), input.galleryImageUrls(), required(input.variantName()));
        item.setPublicAvailabilityPolicy(input.publicAvailabilityPolicy());
        return variant(item);
    }

    public VariantResponse setVariantActive(UUID materialId, UUID variantId, boolean active) {
        StoneVariant item = variant(materialId, variantId);
        item.setActive(active);
        return variant(item);
    }

    private StoneMaterial material(UUID id) {
        return materials.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MATERIAL_NOT_FOUND", "Material was not found."));
    }

    private StoneVariant variant(UUID materialId, UUID id) {
        return variants.findByIdAndMaterialId(id, materialId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "VARIANT_NOT_FOUND", "Material variant was not found."));
    }

    private void ensureUniqueSku(String sku, UUID currentId) {
        materials.findBySkuIgnoreCase(normalizeSku(sku)).filter(item -> !item.getId().equals(currentId)).ifPresent(item -> {
            throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_SKU", "A material with this SKU already exists.");
        });
    }

    private void ensureUniqueVariant(UUID materialId, VariantInput input, UUID currentId) {
        variants.findAllByMaterialId(materialId).stream().filter(item -> item.getThicknessMm().compareTo(input.thicknessMm()) == 0 && java.util.Objects.equals(item.getFormat(), trim(input.format())) && java.util.Objects.equals(item.getVariantName(), trim(input.variantName())) && !item.getId().equals(currentId)).findAny().ifPresent(item -> {
            throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_VARIANT", "This surface variation, thickness, and format variant already exists.");
        });
    }

    private MaterialSummary summary(StoneMaterial item) {
        String mainImageUrl = item.getVariants().stream()
                .map(StoneVariant::getMainImageUrl)
                .filter(url -> url != null && !url.isBlank())
                .findFirst()
                .orElse(null);
        return new MaterialSummary(item.getId(), item.getName(), item.getCommercialName(), item.getSku(), item.getCategory().getId(), item.getCategory().getName(), item.getCategory().getSlug(), item.getStoneType().name(), item.getOrigin(), item.getColor(), item.isActive(), item.getVariants().size(), mainImageUrl);
    }

    private MaterialDetail detail(StoneMaterial item) {
        return new MaterialDetail(item.getId(), item.getName(), item.getCommercialName(), item.getSku(), item.getCategory().getId(), item.getCategory().getName(), item.getCategory().getSlug(), item.getStoneType().name(), item.getOrigin(), item.getColor(), item.getPattern(), item.getDescription(), item.getApplications(), item.getPublicUses(), item.getCareSummary(), item.getIndoorOutdoor(), item.isActive(), item.getVariants().stream().map(this::variant).toList());
    }

    private VariantResponse variant(StoneVariant item) {
        return new VariantResponse(item.getId(), item.getThicknessMm(), item.getVariantName(), item.getFormat(), item.getMainImageUrl(), item.getGalleryImageUrls(), item.isActive(), item.getPublicAvailabilityPolicy());
    }

    private String normalizeSku(String value) {
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private String trim(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String required(String value) {
        String result = trim(value);
        if (result == null) throw new ApiException(HttpStatus.BAD_REQUEST, "SURFACE_VARIATION_REQUIRED", "A surface variation is required.");
        return result;
    }

    private MaterialCategory category(UUID id, String legacyType) { if (id != null) return categories.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "The material category was not found.")); String slug = switch (legacyType == null ? "" : legacyType.trim().toUpperCase(Locale.ROOT)) { case "GRANITE" -> "granit"; case "ONYX" -> "onyx"; case "QUARTZITE" -> "quartz"; default -> "marbre"; }; return categories.findBySlugIgnoreCase(slug).orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "CATEGORY_REQUIRED", "Choose a material category.")); }
    private StoneType legacyType(MaterialCategory category) { String slug = category.getSlug(); if (slug.equals("granit")) return StoneType.GRANITE; if (slug.equals("onyx")) return StoneType.ONYX; if (slug.equals("quartz")) return StoneType.QUARTZITE; return StoneType.MARBLE; }
}
