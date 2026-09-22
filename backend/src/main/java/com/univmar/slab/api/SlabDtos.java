package com.univmar.slab.api;

import com.univmar.slab.domain.SlabStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class SlabDtos {
    private SlabDtos() { }
    public record CreateInput(@NotBlank @Size(max = 80) String slabNumber, @NotNull UUID inventoryItemId, @NotNull @DecimalMin("0.01") BigDecimal lengthMm, @NotNull @DecimalMin("0.01") BigDecimal widthMm, @Size(max = 1000) String photoUrl, @DecimalMin("0") BigDecimal cost, @Size(max = 4000) String notes) { }
    public record ReserveInput(@NotNull UUID orderItemId) { }
    public record Response(UUID id, String slabNumber, UUID inventoryItemId, UUID variantId, String materialName, String variantLabel, String lotNumber, String bundleNumber, String warehouseName, String locationCode, BigDecimal lengthMm, BigDecimal widthMm, BigDecimal thicknessMm, BigDecimal surfaceAreaM2, String photoUrl, BigDecimal cost, SlabStatus status, UUID reservedOrderItemId, String reservedOrderNumber, String notes, Instant createdAt) { }
}
