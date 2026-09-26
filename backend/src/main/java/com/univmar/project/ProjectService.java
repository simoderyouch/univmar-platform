package com.univmar.project;

import com.univmar.common.api.ApiException;
import com.univmar.cms.domain.WebsiteInquiryRepository;
import com.univmar.cms.domain.WebsitePortfolioProjectRepository;
import com.univmar.crm.domain.PublicShowcaseItemRepository;
import com.univmar.customer.domain.Customer;
import com.univmar.customer.domain.CustomerRepository;
import com.univmar.project.api.ProjectDtos.*;
import com.univmar.project.domain.*;
import com.univmar.rfq.domain.QuoteRequestRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projects;
    private final CustomerRepository customers;
    private final ProjectRealizationImageRepository images;
    private final QuoteRequestRepository rfqs;
    private final WebsiteInquiryRepository inquiries;
    private final WebsitePortfolioProjectRepository portfolio;
    private final PublicShowcaseItemRepository showcase;
    private final String publicApiUrl;

    public ProjectService(ProjectRepository projects, CustomerRepository customers, ProjectRealizationImageRepository images, QuoteRequestRepository rfqs,
            WebsiteInquiryRepository inquiries, WebsitePortfolioProjectRepository portfolio, PublicShowcaseItemRepository showcase,
            @Value("${univmar.storage.public-api-url}") String publicApiUrl) {
        this.projects = projects;
        this.customers = customers;
        this.images = images;
        this.rfqs = rfqs;
        this.inquiries = inquiries;
        this.portfolio = portfolio;
        this.showcase = showcase;
        this.publicApiUrl = publicApiUrl.replaceAll("/$", "");
    }

    public ProjectResponse create(ProjectInput input) { return response(projects.save(build(input))); }

    public ProjectResponse update(UUID id, ProjectInput input) {
        Project project = entity(id);
        Project replacement = build(input);
        project.update(replacement.getCustomer(), replacement.getName(), replacement.getLocation(), replacement.getProjectType(),
                replacement.getDescription(), replacement.getEstimatedValue(), replacement.getStartDate(), replacement.getRequiredDeliveryDate(),
                replacement.getAssignedSalesAgent(), replacement.getStatus(), replacement.getNotes());
        return response(project);
    }

    public void delete(UUID id) {
        Project project = entity(id);
        if (rfqs.existsByProjectId(id)) throw new ApiException(HttpStatus.CONFLICT, "PROJECT_HAS_RFQS", "This project has RFQs and cannot be deleted.");
        if (portfolio.existsByProjectId(id) || showcase.existsByProjectId(id)) throw new ApiException(HttpStatus.CONFLICT, "PROJECT_PUBLISHED", "Remove this project from website publishing before deleting it.");
        inquiries.findByQualifiedProjectId(id).ifPresent(inquiry -> inquiry.clearQualification());
        images.deleteAll(images.findByProjectIdOrderByPositionAscCreatedAtAsc(id));
        projects.delete(project);
    }

    public ProjectImageResponse addImage(UUID projectId, ProjectImageInput input) {
        Project project = entity(projectId);
        ProjectRealizationImage image = new ProjectRealizationImage(project, validatedImageUrl(input.imageUrl()), trim(input.caption()),
                (int) images.countByProjectId(projectId));
        return imageResponse(images.save(image));
    }

    public void removeImage(UUID projectId, UUID imageId) {
        ProjectRealizationImage image = images.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_IMAGE_NOT_FOUND", "The realization image was not found."));
        images.delete(image);
    }

    @Transactional(readOnly = true)
    public ProjectResponse detail(UUID id) { return response(entity(id)); }

    @Transactional(readOnly = true)
    public ProjectPage list(String search, UUID customerId, ProjectStatus status, Pageable page) {
        Specification<Project> specification = Specification.where(null);
        if (search != null && !search.isBlank()) {
            String query = "%" + search.toLowerCase() + "%";
            specification = specification.and((root, ignored, builder) -> builder.like(builder.lower(root.get("name")), query));
        }
        if (customerId != null) specification = specification.and((root, ignored, builder) -> builder.equal(root.get("customer").get("id"), customerId));
        if (status != null) specification = specification.and((root, ignored, builder) -> builder.equal(root.get("status"), status));
        return ProjectPage.from(projects.findAll(specification, page).map(this::response));
    }

    private Project build(ProjectInput input) {
        Customer customer = customers.findById(input.customerId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CUSTOMER_NOT_FOUND", "Customer was not found."));
        return new Project(customer, input.name().trim(), trim(input.location()), trim(input.projectType()), trim(input.description()),
                input.estimatedValue(), input.startDate(), input.requiredDeliveryDate(), trim(input.assignedSalesAgent()), input.status(), trim(input.notes()));
    }

    private Project entity(UUID id) {
        return projects.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "Project was not found."));
    }

    private ProjectResponse response(Project project) {
        return new ProjectResponse(project.getId(), project.getCustomer().getId(), project.getCustomer().getName(), project.getName(),
                project.getLocation(), project.getProjectType(), project.getDescription(), project.getEstimatedValue(), project.getStartDate(),
                project.getRequiredDeliveryDate(), project.getAssignedSalesAgent(), project.getStatus(), project.getNotes(),
                images.findByProjectIdOrderByPositionAscCreatedAtAsc(project.getId()).stream().map(this::imageResponse).toList());
    }

    private ProjectImageResponse imageResponse(ProjectRealizationImage image) {
        return new ProjectImageResponse(image.getId(), image.getImageUrl(), image.getCaption(), image.getPosition(), image.getCreatedAt());
    }

    private String validatedImageUrl(String value) {
        String result = trim(value);
        if (result == null || !(result.startsWith("/api/v1/uploads/images/") || result.startsWith(publicApiUrl + "/uploads/images/"))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "UNTRUSTED_IMAGE_URL", "Use an image uploaded by the ERP.");
        }
        return result;
    }

    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
