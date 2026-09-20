package com.univmar.rfq.api;

import com.univmar.rfq.domain.RfqStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public final class RfqDtos {
    private RfqDtos() { }
    public record RfqItemInput(@NotNull UUID materialId, @NotNull UUID variantId, @NotNull @DecimalMin("0.001") BigDecimal quantityM2, @NotBlank @Size(max = 20) String unit, @Size(max = 180) String requestedDimensions, @Size(max = 180) String processingService, @Size(max = 4000) String comment) { }
    public record RfqInput(@NotNull UUID customerId, @NotNull UUID projectId, LocalDate requiredDate, @Size(max = 240) String deliveryLocation, @Size(max = 10000) String notes, List<@Valid RfqItemInput> items) { }
    public record AttachmentInput(@NotBlank @Size(max = 255) String fileName, @NotBlank @Size(max = 1000) String fileUrl, @Size(max = 120) String contentType) { }
    public record RfqItemResponse(UUID id, UUID materialId, String materialName, String materialSku, String materialImageUrl, UUID variantId, String variantLabel, BigDecimal quantityM2, String unit, String requestedDimensions, String processingService, String comment, BigDecimal availableM2) { }
    public record AttachmentResponse(UUID id, String fileName, String fileUrl, String contentType) { }
    public record TimelineEvent(UUID id, String message, Instant occurredAt) { }
    public record RfqResponse(UUID id, String number, UUID customerId, String customerName, UUID projectId, String projectName, String createdBy, LocalDate requiredDate, String deliveryLocation, String notes, RfqStatus status, Instant createdAt, List<RfqItemResponse> items, List<AttachmentResponse> attachments, List<TimelineEvent> timeline) { }
    public record RfqPage(List<RfqResponse> content, int page, int size, long totalElements, int totalPages) { public static RfqPage from(Page<RfqResponse> page) { return new RfqPage(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
