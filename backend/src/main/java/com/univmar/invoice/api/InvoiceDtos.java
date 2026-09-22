package com.univmar.invoice.api;

import com.univmar.invoice.domain.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.Page;

public final class InvoiceDtos {
    private InvoiceDtos() { }
    public record CreateInput(LocalDate dueDate, @Size(max = 4000) String notes) { }
    public record PaymentInput(@NotNull LocalDate paymentDate, @NotNull @DecimalMin("0.01") BigDecimal amount, @NotNull PaymentMethod method, @Size(max = 120) String reference, @Size(max = 4000) String notes) { }
    public record Payment(UUID id, LocalDate paymentDate, BigDecimal amount, PaymentMethod method, String reference, String notes, Instant createdAt) { }
    public record Response(UUID id, String number, UUID orderId, String orderNumber, String customerName, String projectName, LocalDate issueDate, LocalDate dueDate, InvoiceStatus status, BigDecimal subtotal, BigDecimal taxTotal, BigDecimal transport, BigDecimal grandTotal, BigDecimal paidTotal, BigDecimal outstandingTotal, String notes, Instant createdAt, Instant issuedAt, Instant voidedAt, List<Payment> payments) { }
    public record PageResult(List<Response> content, int page, int size, long totalElements, int totalPages) { public static PageResult from(Page<Response> page) { return new PageResult(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
