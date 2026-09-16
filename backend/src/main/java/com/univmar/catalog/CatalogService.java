package com.univmar.catalog;

import com.univmar.catalog.api.CatalogDtos;
import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialImage;
import com.univmar.catalog.domain.StoneMaterialImageRepository;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.catalog.domain.CatalogCategoryRepository;
import com.univmar.inventory.domain.InventoryItemRepository;
import com.univmar.shared.api.ApiException;
import java.math.BigDecimal;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

@Service
public class CatalogService {
 private final StoneMaterialRepository materials; private final StoneVariantRepository variants; private final InventoryItemRepository inventory; private final StoneMaterialImageRepository images; private final CatalogCategoryRepository categories;
 @Value("${univmar.storage.root:./data/uploads}") private String storageRoot;
 @Value("${univmar.storage.public-api-url:http://localhost:8080/api/v1}") private String publicApiUrl;
 public CatalogService(StoneMaterialRepository materials, StoneVariantRepository variants, InventoryItemRepository inventory, StoneMaterialImageRepository images, CatalogCategoryRepository categories) { this.materials = materials; this.variants = variants; this.inventory = inventory; this.images = images; this.categories = categories; }
 @Transactional(readOnly = true) public Page<CatalogDtos.MaterialResponse> list(Pageable pageable) { return materials.findByActiveTrue(pageable).map(this::response); }
 @Transactional(readOnly = true) public CatalogDtos.MaterialResponse bySlug(String slug) { return response(materials.findBySlugAndActiveTrue(slug).orElseThrow(() -> ApiException.notFound("Material"))); }
 @Transactional(readOnly = true) public Page<CatalogDtos.MaterialResponse> adminList(Pageable pageable) { return materials.findAll(pageable).map(this::response); }
 @Transactional(readOnly = true) public List<CatalogDtos.CategoryResponse> categories() { return categories.findByActiveTrueOrderByDisplayOrderAsc().stream().map(x -> new CatalogDtos.CategoryResponse(x.getId(), x.getSourceCategoryId(), x.getSlug(), x.getName(), x.getDisplayOrder(), x.isLocalMaterial())).toList(); }
 @Transactional(readOnly = true) public List<CatalogDtos.AdminCategoryResponse> adminCategories() { return categories.findAllByOrderByDisplayOrderAsc().stream().map(this::categoryResponse).toList(); }
 @Transactional public CatalogDtos.AdminCategoryResponse createCategory(CatalogDtos.CategoryRequest request) {
   String slug = request.slug().trim().toLowerCase(); String name = request.name().trim();
   if (categories.findByNameIgnoreCase(name).isPresent() || categories.existsBySlugAndIdNot(slug, -1L)) throw ApiException.conflict("DUPLICATE_CATEGORY", "A category already uses this name or slug");
   return categoryResponse(categories.save(new com.univmar.catalog.domain.CatalogCategory(slug, name, request.displayOrder(), Boolean.TRUE.equals(request.localMaterial()))));
 }
 @Transactional public CatalogDtos.AdminCategoryResponse updateCategory(Long id, CatalogDtos.CategoryRequest request) {
   var category = categories.findById(id).orElseThrow(() -> ApiException.notFound("Category")); String slug = request.slug().trim().toLowerCase(); String name = request.name().trim();
   if (categories.existsBySlugAndIdNot(slug, id) || categories.existsByNameIgnoreCaseAndIdNot(name, id)) throw ApiException.conflict("DUPLICATE_CATEGORY", "A category already uses this name or slug");
   category.update(slug, name, request.displayOrder(), Boolean.TRUE.equals(request.localMaterial()), request.active() == null || request.active()); return categoryResponse(category);
 }
 @Transactional public CatalogDtos.MaterialResponse create(CatalogDtos.MaterialRequest request) {
   if (materials.existsBySlug(request.slug())) throw ApiException.conflict("DUPLICATE_SLUG", "A material already uses this slug");
   StoneMaterial material = materials.save(new StoneMaterial(request.name().trim(), request.slug().trim().toLowerCase(), request.category().trim(), request.originCountry(), request.primaryColor(), request.description(), request.applications()));
   if (request.active() != null && !request.active()) material.update(request.name().trim(), request.category().trim(), request.originCountry(), request.primaryColor(), request.description(), request.applications(), false);
   replaceImages(material, request.images()); return response(material);
 }
 @Transactional public CatalogDtos.MaterialResponse update(Long id, CatalogDtos.MaterialRequest request) {
   StoneMaterial material = materials.findById(id).orElseThrow(() -> ApiException.notFound("Material"));
   material.update(request.name().trim(), request.category().trim(), request.originCountry(), request.primaryColor(), request.description(), request.applications(), request.active() == null || request.active()); replaceImages(material, request.images()); return response(material);
 }
 @Transactional public CatalogDtos.VariantResponse createVariant(Long materialId, CatalogDtos.VariantRequest request) {
   StoneMaterial material = materials.findById(materialId).orElseThrow(() -> ApiException.notFound("Material"));
   return variantResponse(variants.save(new StoneVariant(material, request.finish().trim(), request.thicknessMm(), request.grade(), request.indicativePrice())));
 }
 @Transactional public CatalogDtos.VariantResponse updateVariant(Long materialId, Long variantId, CatalogDtos.VariantRequest request) { StoneVariant variant = variants.findById(variantId).filter(x -> x.getMaterial().getId().equals(materialId)).orElseThrow(() -> ApiException.notFound("Variant")); variant.update(request.finish().trim(), request.thicknessMm(), blank(request.grade()), request.indicativePrice(), request.active() == null || request.active()); return variantResponse(variant); }
 @Transactional public void deactivateVariant(Long materialId, Long variantId) { StoneVariant variant = variants.findById(variantId).filter(x -> x.getMaterial().getId().equals(materialId)).orElseThrow(() -> ApiException.notFound("Variant")); variant.update(variant.getFinish(), variant.getThicknessMm(), variant.getGrade(), variant.getIndicativePrice(), false); }
 @Transactional public CatalogDtos.ImageResponse uploadImage(Long materialId, MultipartFile file, String altText) {
   StoneMaterial material = materials.findById(materialId).orElseThrow(() -> ApiException.notFound("Material")); validateImage(file);
   String key = "catalogue/" + UUID.randomUUID() + extension(file.getOriginalFilename(), file.getContentType());
   Path root = mediaRoot(); Path target = root.resolve(key).normalize();
   if (!target.startsWith(root)) throw ApiException.forbidden();
   try { Files.createDirectories(target.getParent()); Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING); }
   catch (IOException exception) { throw new ApiException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "MEDIA_STORAGE_ERROR", "Product image could not be stored"); }
   try {
     int order = images.findByMaterialIdOrderByDisplayOrderAsc(materialId).size();
     StoneMaterialImage saved = images.save(new StoneMaterialImage(material, "stored://" + key, blank(altText), order, order == 0, key, file.getContentType()));
     return imageResponse(saved);
   } catch (RuntimeException exception) { try { Files.deleteIfExists(target); } catch (IOException ignored) { } throw exception; }
 }
 @Transactional public void deleteImage(Long materialId, Long imageId) {
   StoneMaterialImage image = images.findByIdAndMaterialId(imageId, materialId).orElseThrow(() -> ApiException.notFound("Product image"));
   images.delete(image); deleteStoredFile(image.getStorageKey());
 }
 @Transactional public void deactivate(Long id) { StoneMaterial material = materials.findById(id).orElseThrow(() -> ApiException.notFound("Material")); material.update(material.getName(), material.getCategory(), material.getOriginCountry(), material.getPrimaryColor(), material.getDescription(), material.getApplications(), false); }
 @Transactional(readOnly = true) public Download media(Long imageId) {
   StoneMaterialImage image = images.findById(imageId).orElseThrow(() -> ApiException.notFound("Product image"));
   if (image.getStorageKey() == null) throw ApiException.notFound("Product image file");
   try { var resource = new org.springframework.core.io.UrlResource(mediaRoot().resolve(image.getStorageKey()).normalize().toUri()); if (!resource.exists() || !resource.isReadable()) throw ApiException.notFound("Product image file"); return new Download(resource, image.getContentType()); }
   catch (java.net.MalformedURLException exception) { throw ApiException.notFound("Product image file"); }
 }
 private void replaceImages(StoneMaterial material, List<CatalogDtos.ImageRequest> requested) {
   if (requested == null) return;
   List<StoneMaterialImage> existing = images.findByMaterialIdOrderByDisplayOrderAsc(material.getId());
   Set<StoneMaterialImage> retained = new java.util.HashSet<>();
   for (int index = 0; index < requested.size(); index++) { var request = requested.get(index); String url = request.url().trim(); StoneMaterialImage image = existing.stream().filter(item -> item.getImageUrl().equals(url) || imageResponse(item).url().equals(url)).findFirst().orElse(null); if (image == null) images.save(new StoneMaterialImage(material, url, blank(request.altText()), index, index == 0)); else { retained.add(image); image.updatePresentation(blank(request.altText()), index, index == 0); } }
   existing.stream().filter(image -> !retained.contains(image)).forEach(image -> { images.delete(image); deleteStoredFile(image.getStorageKey()); });
 }
 private String blank(String value) { return value == null || value.isBlank() ? null : value.trim(); }
 private CatalogDtos.MaterialResponse response(StoneMaterial material) { return new CatalogDtos.MaterialResponse(material.getId(), material.getSourceProductId(), material.getName(), material.getSlug(), material.getCategory(), material.getOriginCountry(), material.getPrimaryColor(), material.getDescription(), material.getApplications(), material.isActive(), images.findByMaterialIdOrderByDisplayOrderAsc(material.getId()).stream().map(this::imageResponse).toList(), variants.findByMaterialIdAndActiveTrue(material.getId()).stream().map(this::variantResponse).toList()); }
 private CatalogDtos.AdminCategoryResponse categoryResponse(com.univmar.catalog.domain.CatalogCategory category) { return new CatalogDtos.AdminCategoryResponse(category.getId(), category.getSourceCategoryId(), category.getSlug(), category.getName(), category.getDisplayOrder(), category.isLocalMaterial(), category.isActive()); }
 private CatalogDtos.ImageResponse imageResponse(StoneMaterialImage image) { return new CatalogDtos.ImageResponse(image.getId(), image.getStorageKey() == null ? image.getImageUrl() : mediaUrl(image.getId()), image.getAltText(), image.getDisplayOrder(), image.isPrimaryImage()); }
 private Path mediaRoot() { return Path.of(storageRoot).toAbsolutePath().normalize(); }
 private String mediaUrl(Long imageId) { return publicApiUrl.replaceAll("/$", "") + "/public/material-images/" + imageId; }
 private void deleteStoredFile(String key) { if (key == null) return; try { Files.deleteIfExists(mediaRoot().resolve(key).normalize()); } catch (IOException ignored) { } }
 private void validateImage(MultipartFile file) { if (file == null || file.isEmpty() || file.getSize() > 10L * 1024 * 1024 || !Set.of("image/jpeg", "image/png", "image/webp").contains(file.getContentType())) throw new ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "INVALID_PRODUCT_IMAGE", "Use a JPEG, PNG, or WebP image up to 10 MB"); }
 private String extension(String filename, String type) { if ("image/png".equals(type)) return ".png"; if ("image/webp".equals(type)) return ".webp"; return ".jpg"; }
 public record Download(org.springframework.core.io.Resource resource, String contentType) { }
 private CatalogDtos.VariantResponse variantResponse(StoneVariant variant) {
   String band = inventory.findByVariantId(variant.getId()).map(item -> item.availableM2().compareTo(BigDecimal.ZERO) == 0 ? "OUT_OF_STOCK" : item.availableM2().compareTo(item.getMinStockM2()) <= 0 ? "LOW_STOCK" : "IN_STOCK").orElse("OUT_OF_STOCK");
   return new CatalogDtos.VariantResponse(variant.getId(), variant.getFinish(), variant.getThicknessMm(), variant.getGrade(), variant.getIndicativePrice(), band);
 }
}
