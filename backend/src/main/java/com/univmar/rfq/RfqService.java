package com.univmar.rfq;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.common.api.ApiException;
import com.univmar.customer.domain.Customer;
import com.univmar.customer.domain.CustomerRepository;
import com.univmar.inventory.InventoryService;
import com.univmar.project.domain.Project;
import com.univmar.project.domain.ProjectRepository;
import com.univmar.rfq.api.RfqDtos.*;
import com.univmar.rfq.domain.*;
import com.univmar.user.domain.UserRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RfqService {
    private final QuoteRequestRepository rfqs;
    private final CustomerRepository customers;
    private final ProjectRepository projects;
    private final StoneMaterialRepository materials;
    private final StoneVariantRepository variants;
    private final InventoryService inventory;
    private final UserRepository users;

    public RfqService(QuoteRequestRepository rfqs, CustomerRepository customers, ProjectRepository projects, StoneMaterialRepository materials, StoneVariantRepository variants, InventoryService inventory, UserRepository users) {
        this.rfqs = rfqs; this.customers = customers; this.projects = projects; this.materials = materials; this.variants = variants; this.inventory = inventory; this.users = users;
    }

    public RfqResponse create(RfqInput input) {
        References refs = references(input.customerId(), input.projectId());
        QuoteRequest rfq = new QuoteRequest(nextNumber(), refs.customer(), refs.project(), currentUser(), input.requiredDate(), trim(input.deliveryLocation()), trim(input.notes()));
        rfq.recordEvent("RFQ draft created");
        if (input.items() != null) input.items().forEach(item -> rfq.addItem(newItem(rfq, item)));
        return response(rfqs.save(rfq));
    }

    public RfqResponse update(UUID id, RfqInput input) {
        QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.DRAFT, "Only a draft RFQ can be edited.");
        References refs = references(input.customerId(), input.projectId());
        if (!rfq.getCustomer().getId().equals(refs.customer().getId()) || !rfq.getProject().getId().equals(refs.project().getId())) throw conflict("RFQ_REFERENCE_IMMUTABLE", "Customer and project cannot be changed after the draft is created.");
        rfq.update(input.requiredDate(), trim(input.deliveryLocation()), trim(input.notes()));
        return response(rfq);
    }

    public RfqResponse addItem(UUID id, RfqItemInput input) { QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.DRAFT, "Items can only be changed on a draft RFQ."); rfq.addItem(newItem(rfq, input)); return response(rfq); }
    public RfqResponse removeItem(UUID id, UUID itemId) { QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.DRAFT, "Items can only be changed on a draft RFQ."); boolean exists = rfq.getItems().stream().anyMatch(item -> item.getId().equals(itemId)); if (!exists) throw notFound("RFQ_ITEM_NOT_FOUND", "RFQ item was not found."); rfq.removeItem(itemId); return response(rfq); }
    public RfqResponse addAttachment(UUID id, AttachmentInput input) { QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.DRAFT, "Attachments can only be changed on a draft RFQ."); rfq.addAttachment(new QuoteRequestAttachment(rfq, required(input.fileName()), required(input.fileUrl()), trim(input.contentType()))); return response(rfq); }

    public RfqResponse submit(UUID id) { QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.DRAFT, "Only a draft RFQ can be submitted."); verifySubmittable(rfq); rfq.transitionTo(RfqStatus.SUBMITTED); return response(rfq); }
    public RfqResponse startReview(UUID id) { QuoteRequest rfq = entity(id); requireStatus(rfq, RfqStatus.SUBMITTED, "Only a submitted RFQ can move to review."); rfq.transitionTo(RfqStatus.UNDER_REVIEW); return response(rfq); }
    public RfqResponse cancel(UUID id) { QuoteRequest rfq = entity(id); if (rfq.getStatus() == RfqStatus.QUOTED || rfq.getStatus() == RfqStatus.CANCELLED) throw conflict("INVALID_RFQ_STATUS", "This RFQ cannot be cancelled."); rfq.transitionTo(RfqStatus.CANCELLED); return response(rfq); }

    @Transactional(readOnly = true) public RfqResponse detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public RfqPage list(String search, UUID customerId, UUID projectId, RfqStatus status, LocalDate from, LocalDate to, Pageable pageable) {
        Specification<QuoteRequest> spec = Specification.where(null);
        if (search != null && !search.isBlank()) { String q = "%" + search.trim().toLowerCase(Locale.ROOT) + "%"; spec = spec.and((root, query, cb) -> cb.or(cb.like(cb.lower(root.get("number")), q), cb.like(cb.lower(root.get("customer").get("name")), q), cb.like(cb.lower(root.get("project").get("name")), q))); }
        if (customerId != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("customer").get("id"), customerId));
        if (projectId != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("project").get("id"), projectId));
        if (status != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        if (from != null) spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("requiredDate"), from));
        if (to != null) spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("requiredDate"), to));
        Page<QuoteRequest> page = rfqs.findAll(spec, pageable); return RfqPage.from(page.map(this::response));
    }

    private QuoteRequestItem newItem(QuoteRequest rfq, RfqItemInput input) {
        StoneMaterial material = materials.findById(input.materialId()).orElseThrow(() -> notFound("MATERIAL_NOT_FOUND", "Material was not found."));
        StoneVariant variant = variants.findByIdAndMaterialId(input.variantId(), material.getId()).orElseThrow(() -> notFound("VARIANT_NOT_FOUND", "Material variant was not found."));
        if (!material.isActive() || !variant.isActive()) throw conflict("INACTIVE_MATERIAL", "Only active material variants can be requested.");
        return new QuoteRequestItem(rfq, material, variant, input.quantityM2(), required(input.unit()), trim(input.requestedDimensions()), trim(input.processingService()), trim(input.comment()));
    }
    private void verifySubmittable(QuoteRequest rfq) { references(rfq.getCustomer().getId(), rfq.getProject().getId()); if (rfq.getItems().isEmpty()) throw conflict("RFQ_ITEMS_REQUIRED", "Add at least one material before submitting this RFQ."); }
    private References references(UUID customerId, UUID projectId) { Customer customer = customers.findById(customerId).orElseThrow(() -> notFound("CUSTOMER_NOT_FOUND", "Customer was not found.")); Project project = projects.findById(projectId).orElseThrow(() -> notFound("PROJECT_NOT_FOUND", "Project was not found.")); if (!project.getCustomer().getId().equals(customer.getId())) throw conflict("PROJECT_CUSTOMER_MISMATCH", "The selected project does not belong to this customer."); return new References(customer, project); }
    private RfqResponse response(QuoteRequest rfq) { return new RfqResponse(rfq.getId(), rfq.getNumber(), rfq.getCustomer().getId(), rfq.getCustomer().getName(), rfq.getProject().getId(), rfq.getProject().getName(), rfq.getCreatedBy(), rfq.getRequiredDate(), rfq.getDeliveryLocation(), rfq.getNotes(), rfq.getStatus(), rfq.getCreatedAt(), rfq.getItems().stream().map(item -> new RfqItemResponse(item.getId(), item.getMaterial().getId(), item.getMaterial().getName(), item.getMaterial().getSku(), item.getMaterial().getMainImageUrl(), item.getVariant().getId(), item.getVariant().getThicknessMm() + " mm · " + item.getVariant().getFinish() + (item.getVariant().getFormat() == null ? "" : " · " + item.getVariant().getFormat()), item.getQuantityM2(), item.getUnit(), item.getRequestedDimensions(), item.getProcessingService(), item.getComment(), inventory.availableForVariant(item.getVariant().getId()))).toList(), rfq.getAttachments().stream().map(item -> new AttachmentResponse(item.getId(), item.getFileName(), item.getFileUrl(), item.getContentType())).toList(), rfq.getEvents().stream().sorted(java.util.Comparator.comparing(QuoteRequestEvent::getOccurredAt)).map(item -> new TimelineEvent(item.getId(), item.getMessage(), item.getOccurredAt())).toList()); }
    private QuoteRequest entity(UUID id) { return rfqs.findById(id).orElseThrow(() -> notFound("RFQ_NOT_FOUND", "RFQ was not found.")); }
    private String nextNumber() { return "RFQ-" + LocalDate.now().toString().replace("-", "") + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT); }
    private String currentUser() { var authentication = SecurityContextHolder.getContext().getAuthentication(); if (authentication == null || authentication.getName() == null) return "System"; try { return users.findById(UUID.fromString(authentication.getName())).map(user -> user.getEmail()).orElse("System"); } catch (IllegalArgumentException ignored) { return "System"; } }
    private void requireStatus(QuoteRequest rfq, RfqStatus expected, String message) { if (rfq.getStatus() != expected) throw conflict("INVALID_RFQ_STATUS", message); }
    private String required(String value) { String result = trim(value); if (result == null) throw new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Required value missing."); return result; }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
    private record References(Customer customer, Project project) { }
}
