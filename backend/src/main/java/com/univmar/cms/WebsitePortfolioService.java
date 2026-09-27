package com.univmar.cms;

import com.univmar.cms.api.PortfolioDtos.*;
import com.univmar.cms.domain.*;
import com.univmar.common.api.ApiException;
import com.univmar.project.domain.*;
import com.univmar.catalog.domain.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class WebsitePortfolioService {
    private final WebsitePortfolioCategoryRepository categories; private final WebsitePortfolioProjectRepository items; private final ProjectRepository projects; private final StoneVariantRepository variants; private final String publicApiUrl;
    public WebsitePortfolioService(WebsitePortfolioCategoryRepository categories, WebsitePortfolioProjectRepository items, ProjectRepository projects, StoneVariantRepository variants, @Value("${univmar.storage.public-api-url}") String publicApiUrl) { this.categories = categories; this.items = items; this.projects = projects; this.variants = variants; this.publicApiUrl = publicApiUrl.replaceAll("/$", ""); }
    @Transactional(readOnly = true) public List<CategoryResponse> categories() { return categories.findAllByOrderBySortOrderAscNameAsc().stream().map(this::categoryResponse).toList(); }
    public CategoryResponse createCategory(CategoryInput input) { categorySlug(input.slug(), null); return categoryResponse(categories.save(new WebsitePortfolioCategory(required(input.name()), slug(input.slug()), input.sortOrder(), input.active()))); }
    public CategoryResponse updateCategory(UUID id, CategoryInput input) { WebsitePortfolioCategory category = category(id); categorySlug(input.slug(), id); category.update(required(input.name()), slug(input.slug()), input.sortOrder(), input.active()); return categoryResponse(category); }
    @Transactional(readOnly = true) public List<ProjectResponse> list() { return items.findAllByOrderBySortOrderAsc().stream().map(this::response).toList(); }
    public ProjectResponse create(ProjectInput input) { if (items.findByProjectId(input.projectId()).isPresent()) throw new ApiException(HttpStatus.CONFLICT, "PORTFOLIO_PROJECT_EXISTS", "This ERP project already has a public portfolio record."); return response(items.save(build(input))); }
    public ProjectResponse update(UUID id, ProjectInput input) { WebsitePortfolioProject item = item(id); WebsitePortfolioProject duplicate = items.findByProjectId(input.projectId()).orElse(null); if (duplicate != null && !duplicate.getId().equals(id)) throw new ApiException(HttpStatus.CONFLICT, "PORTFOLIO_PROJECT_EXISTS", "This ERP project already has a public portfolio record."); item.update(project(input.projectId()), category(input.categoryId()), input.published(), input.featured(), input.sortOrder(), image(input.coverImageUrl()), images(input.galleryImageUrls()), variants(input.variantIds())); return response(item); }
    @Transactional(readOnly = true) public List<CategoryResponse> publicCategories() { return categories.findAllByActiveTrueOrderBySortOrderAscNameAsc().stream().map(this::categoryResponse).toList(); }
    @Transactional(readOnly = true) public List<PublicProjectResponse> publicProjects(Boolean featured, UUID variantId) { List<WebsitePortfolioProject> source = variantId != null ? items.findAllByPublishedTrueAndVariantsIdOrderBySortOrderAsc(variantId) : Boolean.TRUE.equals(featured) ? items.findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAsc() : items.findAllByPublishedTrueOrderBySortOrderAsc(); return source.stream().limit(variantId == null ? Long.MAX_VALUE : 6).map(this::publicResponse).toList(); }
    private WebsitePortfolioProject build(ProjectInput input) { return new WebsitePortfolioProject(project(input.projectId()), category(input.categoryId()), input.published(), input.featured(), input.sortOrder(), image(input.coverImageUrl()), images(input.galleryImageUrls()), variants(input.variantIds())); }
    private Project project(UUID id) { return projects.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "The project was not found.")); }
    private WebsitePortfolioProject item(UUID id) { return items.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PORTFOLIO_PROJECT_NOT_FOUND", "The public portfolio record was not found.")); }
    private WebsitePortfolioCategory category(UUID id) { return categories.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PORTFOLIO_CATEGORY_NOT_FOUND", "The portfolio category was not found.")); }
    private void categorySlug(String value, UUID current) { categories.findBySlugIgnoreCase(slug(value)).filter(item -> !item.getId().equals(current)).ifPresent(item -> { throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_PORTFOLIO_CATEGORY", "This portfolio category URL key is already in use."); }); }
    private String image(String value) { String image = required(value); if (!(image.startsWith("/api/v1/uploads/images/") || image.startsWith(publicApiUrl + "/uploads/images/"))) throw new ApiException(HttpStatus.BAD_REQUEST, "UNTRUSTED_IMAGE_URL", "Use an image uploaded by the ERP."); return image; }
    private List<String> images(List<String> values) { if (values == null) return List.of(); return values.stream().filter(Objects::nonNull).filter(value -> !value.isBlank()).map(this::image).toList(); }
    @Transactional(readOnly = true) public List<PublicProjectResponse> relatedPublicProjects(UUID variantId) { return items.findAllByPublishedTrueAndVariantsIdOrderBySortOrderAsc(variantId).stream().limit(6).map(this::publicResponse).toList(); }
    private List<StoneVariant> variants(List<UUID> ids) { if (ids == null || ids.isEmpty()) return List.of(); List<UUID> distinct = ids.stream().distinct().toList(); if (distinct.size() != ids.size()) throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_VARIANT", "A material may only be linked once."); List<StoneVariant> found = variants.findAllById(ids); if (found.size() != ids.size()) throw new ApiException(HttpStatus.BAD_REQUEST, "VARIANT_NOT_FOUND", "One or more selected material variants were not found."); return ids.stream().map(id -> found.stream().filter(variant -> variant.getId().equals(id)).findFirst().orElseThrow()).toList(); }
    private ProjectResponse response(WebsitePortfolioProject item) { return new ProjectResponse(item.getId(), item.getProject().getId(), item.getProject().getName(), item.getCategory().getId(), item.getCategory().getName(), item.getCategory().getSlug(), item.isPublished(), item.isFeatured(), item.getSortOrder(), item.getCoverImageUrl(), item.getGalleryImageUrls(), item.getVariants().stream().map(StoneVariant::getId).toList()); }
    private PublicProjectResponse publicResponse(WebsitePortfolioProject item) { return new PublicProjectResponse(item.getId().toString(), item.getProject().getName(), item.getCategory().getName(), item.getCategory().getSlug(), item.getCoverImageUrl(), item.getGalleryImageUrls(), item.isFeatured(), item.getSortOrder()); }
    private CategoryResponse categoryResponse(WebsitePortfolioCategory item) { return new CategoryResponse(item.getId(), item.getName(), item.getSlug(), item.getSortOrder(), item.isActive()); }
    private String slug(String value) { return value.trim().toLowerCase(Locale.ROOT); } private String required(String value) { if (value == null || value.isBlank()) throw new ApiException(HttpStatus.BAD_REQUEST, "VALUE_REQUIRED", "A required value is missing."); return value.trim(); }
}
