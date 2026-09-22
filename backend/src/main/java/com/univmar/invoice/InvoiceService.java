package com.univmar.invoice;

import com.univmar.common.api.ApiException;
import com.univmar.invoice.api.InvoiceDtos.*;
import com.univmar.invoice.domain.*;
import com.univmar.order.domain.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InvoiceService {
    private final CustomerInvoiceRepository invoices; private final SalesOrderRepository orders;
    public InvoiceService(CustomerInvoiceRepository invoices, SalesOrderRepository orders) { this.invoices = invoices; this.orders = orders; }

    public Response create(UUID orderId, CreateInput input) {
        SalesOrder order = orders.findByIdForUpdate(orderId).orElseThrow(() -> notFound("ORDER_NOT_FOUND", "Order was not found."));
        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CANCELLED) throw conflict("ORDER_NOT_INVOICEABLE", "Only confirmed or fulfilled orders can be invoiced.");
        if (invoices.findByOrderId(orderId).isPresent()) throw conflict("ORDER_ALREADY_INVOICED", "This order already has an invoice.");
        CustomerInvoice invoice = new CustomerInvoice(nextNumber(), order, input.dueDate(), trim(input.notes()));
        order.event("INVOICE_CREATED", "Invoice " + invoice.getNumber() + " created as draft");
        return response(invoices.save(invoice));
    }
    public Response issue(UUID id) {
        CustomerInvoice invoice = entityForUpdate(id);
        if (invoice.getStatus() != InvoiceStatus.DRAFT) throw conflict("INVOICE_NOT_DRAFT", "Only a draft invoice can be issued.");
        invoice.issue(LocalDate.now()); invoice.getOrder().event("INVOICE_ISSUED", "Invoice " + invoice.getNumber() + " issued");
        return response(invoice);
    }
    public Response recordPayment(UUID id, PaymentInput input) {
        CustomerInvoice invoice = entityForUpdate(id); invoice.refreshStatus(LocalDate.now());
        if (invoice.getStatus() == InvoiceStatus.DRAFT || invoice.getStatus() == InvoiceStatus.VOID) throw conflict("INVOICE_NOT_PAYABLE", "Payments can only be recorded against an issued invoice.");
        if (input.amount().compareTo(invoice.outstandingTotal()) > 0) throw conflict("PAYMENT_EXCEEDS_BALANCE", "The payment exceeds the invoice's outstanding balance.");
        invoice.addPayment(new InvoicePayment(invoice, input.paymentDate(), input.amount(), input.method(), trim(input.reference()), trim(input.notes())));
        invoice.getOrder().event("PAYMENT_RECORDED", "Payment of " + input.amount() + " recorded for invoice " + invoice.getNumber());
        return response(invoice);
    }
    public Response voidInvoice(UUID id) {
        CustomerInvoice invoice = entityForUpdate(id);
        if (invoice.getStatus() == InvoiceStatus.VOID) throw conflict("INVOICE_ALREADY_VOID", "This invoice is already void.");
        if (invoice.paidTotal().signum() > 0) throw conflict("INVOICE_HAS_PAYMENTS", "A paid or partially paid invoice cannot be voided.");
        invoice.voidInvoice(); invoice.getOrder().event("INVOICE_VOIDED", "Invoice " + invoice.getNumber() + " voided");
        return response(invoice);
    }
    @Transactional(readOnly = true) public Response detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public Response forOrder(UUID orderId) { return response(invoices.findByOrderId(orderId).orElseThrow(() -> notFound("INVOICE_NOT_FOUND", "No invoice exists for this order."))); }
    @Transactional(readOnly = true) public PageResult list(InvoiceStatus status, Pageable pageable) {
        Page<CustomerInvoice> page = status == null ? invoices.findAll(pageable) : invoices.findAll(org.springframework.data.jpa.domain.Specification.where((root, query, cb) -> cb.equal(root.get("status"), status)), pageable);
        return PageResult.from(page.map(this::response));
    }

    private CustomerInvoice entity(UUID id) { return invoices.findById(id).orElseThrow(() -> notFound("INVOICE_NOT_FOUND", "Invoice was not found.")); }
    private CustomerInvoice entityForUpdate(UUID id) { return invoices.findByIdForUpdate(id).orElseThrow(() -> notFound("INVOICE_NOT_FOUND", "Invoice was not found.")); }
    private Response response(CustomerInvoice invoice) {
        invoice.refreshStatus(LocalDate.now()); SalesOrder order = invoice.getOrder();
        return new Response(invoice.getId(), invoice.getNumber(), order.getId(), order.getNumber(), order.getCustomer().getName(), order.getProject().getName(), invoice.getIssueDate(), invoice.getDueDate(), invoice.getStatus(), invoice.getSubtotal(), invoice.getTaxTotal(), invoice.getTransport(), invoice.getGrandTotal(), invoice.paidTotal(), invoice.outstandingTotal(), invoice.getNotes(), invoice.getCreatedAt(), invoice.getIssuedAt(), invoice.getVoidedAt(), invoice.getPayments().stream().sorted(Comparator.comparing(InvoicePayment::getPaymentDate).reversed()).map(payment -> new Payment(payment.getId(), payment.getPaymentDate(), payment.getAmount(), payment.getMethod(), payment.getReference(), payment.getNotes(), payment.getCreatedAt())).toList());
    }
    private String nextNumber() { return "INV-" + LocalDate.now().toString().replace("-", "") + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
