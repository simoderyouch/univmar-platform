package com.univmar.document;

import com.univmar.audit.AuditService;
import com.univmar.common.api.ApiException;
import com.univmar.customer.domain.CustomerRepository;
import com.univmar.delivery.domain.DeliveryRepository;
import com.univmar.document.api.DocumentDtos.*;
import com.univmar.document.domain.*;
import com.univmar.invoice.domain.CustomerInvoiceRepository;
import com.univmar.order.domain.SalesOrderRepository;
import com.univmar.project.domain.ProjectRepository;
import com.univmar.quotation.domain.QuotationRepository;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.user.domain.UserRepository;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DocumentService {
    private final BusinessDocumentRepository documents; private final AuditService audit; private final CustomerRepository customers; private final ProjectRepository projects; private final QuoteRequestRepository rfqs; private final QuotationRepository quotations; private final SalesOrderRepository orders; private final DeliveryRepository deliveries; private final CustomerInvoiceRepository invoices; private final UserRepository users;
    public DocumentService(BusinessDocumentRepository documents, AuditService audit, CustomerRepository customers, ProjectRepository projects, QuoteRequestRepository rfqs, QuotationRepository quotations, SalesOrderRepository orders, DeliveryRepository deliveries, CustomerInvoiceRepository invoices, UserRepository users) { this.documents = documents; this.audit = audit; this.customers = customers; this.projects = projects; this.rfqs = rfqs; this.quotations = quotations; this.orders = orders; this.deliveries = deliveries; this.invoices = invoices; this.users = users; }
    public Response create(CreateInput input) { verifyTarget(input.targetType(), input.targetId()); BusinessDocument document = documents.save(new BusinessDocument(input.targetType(), input.targetId(), input.documentType(), input.fileName().trim(), input.fileUrl().trim(), input.contentType().trim(), input.fileSize(), actor())); audit.record(input.targetType(), input.targetId(), "DOCUMENT_ATTACHED", input.fileName().trim() + " attached"); return response(document); }
    @Transactional(readOnly = true) public List<Response> list(DocumentTargetType targetType, UUID targetId) { verifyTarget(targetType, targetId); return documents.findAllByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId).stream().map(this::response).toList(); }
    public void delete(UUID id) { BusinessDocument document = documents.findById(id).orElseThrow(() -> notFound("DOCUMENT_NOT_FOUND", "Document was not found.")); documents.delete(document); audit.record(document.getTargetType(), document.getTargetId(), "DOCUMENT_REMOVED", document.getFileName() + " removed"); }
    private void verifyTarget(DocumentTargetType type, UUID id) { boolean exists = switch (type) { case CUSTOMER -> customers.existsById(id); case PROJECT -> projects.existsById(id); case RFQ -> rfqs.existsById(id); case QUOTATION -> quotations.existsById(id); case ORDER -> orders.existsById(id); case DELIVERY -> deliveries.existsById(id); case INVOICE -> invoices.existsById(id); }; if (!exists) throw notFound("DOCUMENT_TARGET_NOT_FOUND", "The record to attach this document to was not found."); }
    private Response response(BusinessDocument document) { return new Response(document.getId(), document.getTargetType(), document.getTargetId(), document.getDocumentType(), document.getFileName(), document.getFileUrl(), document.getContentType(), document.getFileSize(), document.getUploadedBy(), document.getCreatedAt()); }
    private String actor() { var authentication = SecurityContextHolder.getContext().getAuthentication(); try { return authentication == null ? "System" : users.findById(UUID.fromString(authentication.getName())).map(user -> user.getEmail()).orElse("System"); } catch (Exception ignored) { return "System"; } }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
}
