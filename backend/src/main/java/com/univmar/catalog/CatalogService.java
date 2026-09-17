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

    public CatalogService(StoneMaterialRepository materials, StoneVariantRepository variants) {
        this.materials = materials;
        this.variants = variants;
    }

    public MaterialDetail create(MaterialInput input) {
        ensureUniqueSku(input.sku(), null);
        return detail(materials.save(new StoneMaterial(input.name().trim(), trim(input.commercialName()), normalizeSku(input.sku()), input.stoneType(), trim(input.origin()), trim(input.color()), trim(input.pattern()), trim(input.description()), trim(input.applications()), trim(input.mainImageUrl()), input.galleryImageUrls())));
    }

    public MaterialDetail update(UUID id, MaterialInput input) {
        StoneMaterial material = material(id);
        ensureUniqueSku(input.sku(), id);
        material.update(input.name().trim(), trim(input.commercialName()), normalizeSku(input.sku()), input.stoneType(), trim(input.origin()), trim(input.color()), trim(input.pattern()), trim(input.description()), trim(input.applications()), trim(input.mainImageUrl()), input.galleryImageUrls());
        return detail(material);
    }

    @Transactional(readOnly = true)
    public MaterialDetail get(UUID id) {
        return detail(material(id));
    }

    @Transactional(readOnly = true)
    public PageResult<MaterialSummary> list(String search, StoneType type, String origin, String color, Boolean active, Pageable pageable) {
        Specification<StoneMaterial> spec = Specification.where(null);
        if (search != null && !search.isBlank()) {
            String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(cb.like(cb.lower(root.get("name")), value), cb.like(cb.lower(root.get("sku")), value), cb.like(cb.lower(root.get("commercialName")), value)));
        }
        if (type != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("stoneType"), type));
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
        StoneVariant variant = new StoneVariant(material, input.thicknessMm(), input.finish(), trim(input.format()));
        material.addVariant(variant);
        variants.save(variant);
        return variant(variant);
    }

    public VariantResponse updateVariant(UUID materialId, UUID variantId, VariantInput input) {
        StoneVariant item = variant(materialId, variantId);
        ensureUniqueVariant(materialId, input, variantId);
        item.update(input.thicknessMm(), input.finish(), trim(input.format()));
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
        variants.findAllByMaterialId(materialId).stream().filter(item -> item.getThicknessMm().compareTo(input.thicknessMm()) == 0 && item.getFinish() == input.finish() && java.util.Objects.equals(item.getFormat(), trim(input.format())) && !item.getId().equals(currentId)).findAny().ifPresent(item -> {
            throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_VARIANT", "This thickness, finish, and format variant already exists.");
        });
    }

    private MaterialSummary summary(StoneMaterial item) {
        return new MaterialSummary(item.getId(), item.getName(), item.getCommercialName(), item.getSku(), item.getStoneType(), item.getOrigin(), item.getColor(), item.getMainImageUrl(), item.isActive(), item.getVariants().size());
    }

    private MaterialDetail detail(StoneMaterial item) {
        return new MaterialDetail(item.getId(), item.getName(), item.getCommercialName(), item.getSku(), item.getStoneType(), item.getOrigin(), item.getColor(), item.getPattern(), item.getDescription(), item.getApplications(), item.getMainImageUrl(), item.getGalleryImageUrls(), item.isActive(), item.getVariants().stream().map(this::variant).toList());
    }

    private VariantResponse variant(StoneVariant item) {
        return new VariantResponse(item.getId(), item.getThicknessMm(), item.getFinish(), item.getFormat(), item.isActive());
    }

    private String normalizeSku(String value) {
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private String trim(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
