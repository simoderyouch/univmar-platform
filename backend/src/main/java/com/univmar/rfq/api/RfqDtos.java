package com.univmar.rfq.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class RfqDtos {
    private RfqDtos() {
    }

    public record Item(Long variantId, String description, @NotNull @DecimalMin("0.01") BigDecimal quantityM2,
                       String note) {
    }

    public record Create(@NotEmpty List<@Valid Item> items, Long projectId, String notes, LocalDate desiredDate) {
    }

    public record Response(Long id, String status, String reference) {
    }

    public record Detail(Long id, String status, String reference, Long customerId, Long projectId, String projectName,
                         String notes,
                         LocalDate desiredDate, Instant submittedAt, Long assigneeId, List<ItemDetail> items) {
    }

    public record ItemDetail(Long id, Long variantId, String materialName, String finish, String description,
                             BigDecimal quantityM2, String note) {
    }

    public record Assign(@NotNull Long salesUserId) {
    }
}
