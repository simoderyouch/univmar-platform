package com.univmar.invoice;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.audit.AuditService;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.*;
import com.univmar.customer.domain.CustomerType;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.*;
import com.univmar.inventory.domain.MovementType;
import com.univmar.document.DocumentService;
import com.univmar.document.domain.*;
import com.univmar.invoice.api.InvoiceDtos.*;
import com.univmar.invoice.domain.*;
import com.univmar.order.OrderService;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.*;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.Input;
import com.univmar.quotation.api.QuotationDtos.Item;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class InvoiceWorkflowIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private InventoryService inventory;
    @Autowired private QuotationService quotations;
    @Autowired private OrderService orders;
    @Autowired private InvoiceService invoices;
    @Autowired private DocumentService documents;
    @Autowired private AuditService audit;

    @Test
    void tracks_manual_partial_and_full_payment_against_an_issued_invoice() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Invoice Ivory " + suffix, null, "INV-" + suffix, StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("I" + suffix, "Invoice warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("A-01", "A"));
        inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-1", null, new BigDecimal("2.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Invoice customer " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Invoice project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input quoteInput = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", BigDecimal.ONE, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("20"))));
        var quote = quotations.send(quotations.create(quoteInput).id());
        var order = orders.confirm(orders.acceptQuotation(quote.id()).id());

        Response draft = invoices.create(order.id(), new CreateInput(LocalDate.now().plusDays(30), "Bank transfer preferred"));
        assertThat(draft.status()).isEqualTo(InvoiceStatus.DRAFT);
        Response issued = invoices.issue(draft.id());
        assertThat(issued.status()).isEqualTo(InvoiceStatus.ISSUED);
        assertThat(issued.grandTotal()).isEqualByComparingTo("120.00");

        Response partial = invoices.recordPayment(draft.id(), new PaymentInput(LocalDate.now(), new BigDecimal("50.00"), PaymentMethod.BANK_TRANSFER, "TRX-001", null));
        assertThat(partial.status()).isEqualTo(InvoiceStatus.PARTIALLY_PAID);
        assertThat(partial.outstandingTotal()).isEqualByComparingTo("70.00");
        Response paid = invoices.recordPayment(draft.id(), new PaymentInput(LocalDate.now(), new BigDecimal("70.00"), PaymentMethod.CASH, "RCPT-002", null));
        assertThat(paid.status()).isEqualTo(InvoiceStatus.PAID);
        assertThat(paid.outstandingTotal()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(invoices.forOrder(order.id()).payments()).hasSize(2);
        documents.create(new com.univmar.document.api.DocumentDtos.CreateInput(DocumentTargetType.INVOICE, paid.id(), DocumentType.INVOICE, "invoice.pdf", "http://localhost/files/invoice.pdf", "application/pdf", 512));
        assertThat(documents.list(DocumentTargetType.INVOICE, paid.id())).extracting(item -> item.fileName()).containsExactly("invoice.pdf");
        assertThat(audit.list(DocumentTargetType.INVOICE, paid.id())).extracting(item -> item.eventType()).contains("INVOICE_CREATED", "INVOICE_ISSUED", "PAYMENT_RECORDED", "DOCUMENT_ATTACHED");
    }
}
