package com.univmar.catalog.api;
import com.univmar.catalog.CatalogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@RestController @RequestMapping("/api/v1")
public class CatalogController {
 private final CatalogService service; public CatalogController(CatalogService service) { this.service = service; }
 @GetMapping("/materials/categories") public java.util.List<CatalogDtos.CategoryResponse> categories() { return service.categories(); }
 @GetMapping("/materials") public Page<CatalogDtos.MaterialResponse> list(Pageable pageable) { return service.list(pageable); }
 @GetMapping("/materials/{slug}") public CatalogDtos.MaterialResponse detail(@PathVariable String slug) { return service.bySlug(slug); }
 @GetMapping("/public/material-images/{imageId}") public ResponseEntity<Resource> image(@PathVariable Long imageId) { var media = service.media(imageId); return ResponseEntity.ok().contentType(MediaType.parseMediaType(media.contentType())).cacheControl(org.springframework.http.CacheControl.maxAge(java.time.Duration.ofDays(30)).cachePublic()).body(media.resource()); }
 @GetMapping("/admin/materials") @PreAuthorize("hasRole('ADMIN')") public Page<CatalogDtos.MaterialResponse> adminList(Pageable pageable) { return service.adminList(pageable); }
 @PostMapping("/admin/materials") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('ADMIN')") public CatalogDtos.MaterialResponse create(@Valid @RequestBody CatalogDtos.MaterialRequest request) { return service.create(request); }
 @PutMapping("/admin/materials/{id}") @PreAuthorize("hasRole('ADMIN')") public CatalogDtos.MaterialResponse update(@PathVariable Long id, @Valid @RequestBody CatalogDtos.MaterialRequest request) { return service.update(id, request); }
 @DeleteMapping("/admin/materials/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasRole('ADMIN')") public void deactivate(@PathVariable Long id) { service.deactivate(id); }
 @PostMapping(value="/admin/materials/{id}/images", consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('ADMIN')") public CatalogDtos.ImageResponse uploadImage(@PathVariable Long id, @RequestPart("file") MultipartFile file, @RequestPart(value="altText", required=false) String altText) { return service.uploadImage(id, file, altText); }
 @DeleteMapping("/admin/materials/{materialId}/images/{imageId}") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasRole('ADMIN')") public void deleteImage(@PathVariable Long materialId, @PathVariable Long imageId) { service.deleteImage(materialId, imageId); }
 @PostMapping("/admin/materials/{id}/variants") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('ADMIN')") public CatalogDtos.VariantResponse variant(@PathVariable Long id, @Valid @RequestBody CatalogDtos.VariantRequest request) { return service.createVariant(id, request); }
}
