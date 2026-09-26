package com.univmar.crm;

import com.univmar.audit.AuditService;
import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.common.api.ApiException;
import com.univmar.crm.api.ShowcaseDtos.*;
import com.univmar.crm.domain.*;
import com.univmar.document.domain.DocumentTargetType;
import com.univmar.project.domain.Project;
import com.univmar.project.domain.ProjectRepository;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ShowcaseService {
    private final PublicShowcaseItemRepository items; private final StoneMaterialRepository materials; private final ProjectRepository projects; private final AuditService audit;
    public ShowcaseService(PublicShowcaseItemRepository items, StoneMaterialRepository materials, ProjectRepository projects, AuditService audit) { this.items = items; this.materials = materials; this.projects = projects; this.audit = audit; }
    public InternalResponse create(ShowcaseKind kind, Input input) {
        StoneMaterial material = material(kind, input.materialId()); Project project = project(kind, input.projectId()); requireSource(kind, material, project);
        if (exists(kind, material, project)) throw new ApiException(HttpStatus.CONFLICT, "ALREADY_IN_SHOWCASE", "This record is already in the website showcase.");
        PublicShowcaseItem item = items.save(new PublicShowcaseItem(kind, material, project, input.published(), input.sortOrder()));
        audit.record(DocumentTargetType.SHOWCASE, item.getId(), "SHOWCASE_PUBLISHED", "Added existing " + kind + " record to the website showcase");
        return response(item);
    }
    public InternalResponse update(UUID id, Input input) {
        PublicShowcaseItem item = entity(id); StoneMaterial material = material(item.getKind(), input.materialId()); Project project = project(item.getKind(), input.projectId()); requireSource(item.getKind(), material, project);
        if (existsOther(item.getId(), item.getKind(), material, project)) throw new ApiException(HttpStatus.CONFLICT, "ALREADY_IN_SHOWCASE", "This record is already in the website showcase.");
        item.update(material, project, input.published(), input.sortOrder()); audit.record(DocumentTargetType.SHOWCASE, item.getId(), "SHOWCASE_UPDATED", "Updated website publication settings"); return response(item);
    }
    @Transactional(readOnly = true) public List<InternalResponse> list(ShowcaseKind kind) { return items.findAllByKindOrderBySortOrderAscCreatedAtDesc(kind).stream().map(this::response).toList(); }
    @Transactional(readOnly = true) public List<PublicResponse> publicList(ShowcaseKind kind) { return items.findAllByKindAndPublishedTrueOrderBySortOrderAscCreatedAtDesc(kind).stream().map(item -> new PublicResponse(title(item), summary(item), image(item), item.getSortOrder())).toList(); }
    private boolean exists(ShowcaseKind kind, StoneMaterial material, Project project) { return existsOther(null, kind, material, project); }
    private boolean existsOther(UUID id, ShowcaseKind kind, StoneMaterial material, Project project) { return items.findAllByKindOrderBySortOrderAscCreatedAtDesc(kind).stream().anyMatch(item -> !item.getId().equals(id) && (kind == ShowcaseKind.PRODUCT ? item.getMaterial() != null && item.getMaterial().getId().equals(material.getId()) : item.getProject() != null && item.getProject().getId().equals(project.getId()))); }
    private StoneMaterial material(ShowcaseKind kind, UUID id) { if (kind != ShowcaseKind.PRODUCT) return null; return id == null ? null : materials.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MATERIAL_NOT_FOUND", "Material was not found.")); }
    private Project project(ShowcaseKind kind, UUID id) { if (kind != ShowcaseKind.PROJECT) return null; return id == null ? null : projects.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "Project was not found.")); }
    private void requireSource(ShowcaseKind kind, StoneMaterial material, Project project) { if ((kind == ShowcaseKind.PRODUCT && material == null) || (kind == ShowcaseKind.PROJECT && project == null)) throw new ApiException(HttpStatus.BAD_REQUEST, "SHOWCASE_SOURCE_REQUIRED", "Select an existing " + kind.name().toLowerCase() + " to publish."); }
    private PublicShowcaseItem entity(UUID id) { return items.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SHOWCASE_ITEM_NOT_FOUND", "Showcase item was not found.")); }
    private InternalResponse response(PublicShowcaseItem item) { StoneMaterial material = item.getMaterial(); Project project = item.getProject(); return new InternalResponse(item.getId(), item.getKind(), material == null ? null : material.getId(), material == null ? null : material.getName(), project == null ? null : project.getId(), project == null ? null : project.getName(), title(item), summary(item), image(item), item.isPublished(), item.getPublishedAt(), item.getSortOrder(), item.getUpdatedAt()); }
    private String title(PublicShowcaseItem item) { if (present(item.getPublicTitle())) return item.getPublicTitle(); if (item.getKind() == ShowcaseKind.PRODUCT) { StoneMaterial material = item.getMaterial(); return present(material.getCommercialName()) ? material.getCommercialName() : material.getName(); } return item.getProject().getName(); }
    private String summary(PublicShowcaseItem item) { if (present(item.getPublicSummary())) return item.getPublicSummary(); if (item.getKind() == ShowcaseKind.PRODUCT) { StoneMaterial material = item.getMaterial(); if (present(material.getDescription())) return material.getDescription(); return join(material.getStoneType() == null ? null : material.getStoneType().name(), material.getOrigin()); } Project project = item.getProject(); return join(project.getProjectType(), project.getLocation()); }
    private String image(PublicShowcaseItem item) { if (present(item.getCoverImageUrl())) return item.getCoverImageUrl(); if (item.getKind() == ShowcaseKind.PROJECT) return null; return item.getMaterial().getVariants().stream().filter(StoneVariant::isActive).map(variant -> present(variant.getMainImageUrl()) ? variant.getMainImageUrl() : variant.getGalleryImageUrls().stream().findFirst().orElse(null)).filter(Objects::nonNull).findFirst().orElse(null); }
    private String join(String first, String second) { return Arrays.stream(new String[] { first, second }).filter(this::present).reduce((a, b) -> a + " · " + b).orElse("Featured stone collection"); }
    private boolean present(String value) { return value != null && !value.isBlank(); }
}
