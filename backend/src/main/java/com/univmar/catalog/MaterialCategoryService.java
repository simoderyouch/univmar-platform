package com.univmar.catalog;

import com.univmar.catalog.api.MaterialCategoryDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.common.api.ApiException;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MaterialCategoryService {
    private final MaterialCategoryRepository categories;
    public MaterialCategoryService(MaterialCategoryRepository categories) { this.categories = categories; }
    @Transactional(readOnly = true) public List<Response> list() { return categories.findAllByOrderBySortOrderAscNameAsc().stream().map(this::response).toList(); }
    public Response create(Input input) { duplicate(input.slug(), null); return response(categories.save(new MaterialCategory(required(input.name()), slug(input.slug()), input.sortOrder(), input.active(), input.websiteVisible()))); }
    public Response update(UUID id, Input input) { MaterialCategory category = entity(id); duplicate(input.slug(), id); category.update(required(input.name()), slug(input.slug()), input.sortOrder(), input.active(), input.websiteVisible()); return response(category); }
    private MaterialCategory entity(UUID id) { return categories.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "The material category was not found.")); }
    private void duplicate(String value, UUID current) { categories.findBySlugIgnoreCase(slug(value)).filter(item -> !item.getId().equals(current)).ifPresent(item -> { throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_CATEGORY_SLUG", "This category URL key is already in use."); }); }
    private Response response(MaterialCategory item) { return new Response(item.getId(), item.getName(), item.getSlug(), item.getSortOrder(), item.isActive(), item.isWebsiteVisible()); }
    private String required(String value) { if (value == null || value.isBlank()) throw new ApiException(HttpStatus.BAD_REQUEST, "CATEGORY_NAME_REQUIRED", "A category name is required."); return value.trim(); }
    private String slug(String value) { return value.trim().toLowerCase(Locale.ROOT); }
}
