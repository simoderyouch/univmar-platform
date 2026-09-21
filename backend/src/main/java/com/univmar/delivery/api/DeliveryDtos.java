package com.univmar.delivery.api;

import com.univmar.delivery.domain.DeliveryStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.Page;

public final class DeliveryDtos {
    private DeliveryDtos() { }
    public record ItemInput(@NotNull UUID orderItemId, @NotNull @DecimalMin("0.001") BigDecimal quantityM2) { }
    public record CreateInput(@NotNull UUID orderId, LocalDate scheduledDate, @Size(max = 4000) String notes, @NotEmpty List<@Valid ItemInput> items) { }
    public record Item(UUID id, UUID orderItemId, String materialName, String variantLabel, BigDecimal quantityM2) { }
    public record Response(UUID id, String number, UUID orderId, String orderNumber, String customerName, String projectName, LocalDate scheduledDate, DeliveryStatus status, String notes, Instant createdAt, Instant dispatchedAt, Instant deliveredAt, Instant cancelledAt, List<Item> items) { }
    public record PageResult(List<Response> content, int page, int size, long totalElements, int totalPages) { public static PageResult from(Page<Response> page) { return new PageResult(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
