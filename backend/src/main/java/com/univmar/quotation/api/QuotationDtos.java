package com.univmar.quotation.api;

import com.univmar.quotation.domain.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.Page;

public final class QuotationDtos {
    private QuotationDtos() { }
    public record Item(@NotNull UUID variantId, @NotBlank String materialName, @NotBlank String variantLabel, @NotNull @DecimalMin("0.001") BigDecimal quantityM2, @NotNull @DecimalMin("0") BigDecimal unitPrice, @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal discountPercent, @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal taxPercent) { }
    public record Input(@NotNull UUID customerId, @NotNull UUID projectId, UUID rfqId, LocalDate expiryDate, @NotNull @DecimalMin("0") BigDecimal transport, String paymentTerms, String notes, @NotEmpty List<@Valid Item> items) { }
    public record Line(UUID id, UUID variantId, String materialName, String variantLabel, BigDecimal quantityM2, BigDecimal unitPrice, BigDecimal discountPercent, BigDecimal taxPercent, BigDecimal net, BigDecimal tax, BigDecimal total) { }
    public record Dispatch(UUID id, QuotationDispatchChannel channel, QuotationDispatchStatus status, String recipientEmail, String ccEmails, String subject, String sentBy, Instant sentAt, String failureReason, QuotationClientResponse clientResponse, String respondedBy, String responseMessage, Instant respondedAt, Instant createdAt) { }
    public record Response(UUID id, String number, UUID customerId, String customerName, String customerEmail, UUID projectId, String projectName, UUID rfqId, String salesAgent, LocalDate expiryDate, BigDecimal transport, String paymentTerms, String notes, QuotationStatus status, int revision, BigDecimal subtotal, BigDecimal taxTotal, BigDecimal grandTotal, UUID orderId, int deliveryCount, Instant createdAt, List<Line> items, List<Dispatch> dispatches) { }
    public record SendInput(@NotBlank @Email @Size(max = 320) String recipientEmail, @Size(max = 1500) String ccEmails, @Size(max = 500) String subject, @Size(max = 8000) String message) { }
    public record SendResult(Response quotation, Dispatch dispatch, String publicUrl) { }
    public record ClientResponseInput(@NotNull QuotationClientResponse response, @NotBlank @Size(max = 180) String name, @Email @Size(max = 320) String email, @Size(max = 4000) String message) { }
    public record PublicResponse(String number, String customerName, String projectName, LocalDate expiryDate, String paymentTerms, String notes, QuotationStatus status, BigDecimal subtotal, BigDecimal taxTotal, BigDecimal transport, BigDecimal grandTotal, List<Line> items, QuotationClientResponse clientResponse) { }
    public record PageResult(List<Response> content, int page, int size, long totalElements, int totalPages) { public static PageResult from(Page<Response> p) { return new PageResult(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages()); } }
}
