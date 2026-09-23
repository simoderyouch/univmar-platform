package com.univmar.remnant.api;

import com.univmar.remnant.domain.RemnantStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class RemnantDtos {
    private RemnantDtos() { }
    public record CreateInput(@NotBlank @Size(max = 80) String remnantNumber, @NotNull UUID parentSlabId, @NotNull @DecimalMin("0.01") BigDecimal lengthMm, @NotNull @DecimalMin("0.01") BigDecimal widthMm, @Size(max = 1000) String photoUrl, @Size(max = 4000) String notes) { }
    public record ReserveInput(@NotNull UUID orderItemId) { }
    public record Response(UUID id, String remnantNumber, UUID parentSlabId, String parentSlabNumber, UUID variantId, String materialName, String variantLabel, String lotNumber, String bundleNumber, String warehouseName, String locationCode, BigDecimal lengthMm, BigDecimal widthMm, BigDecimal thicknessMm, BigDecimal surfaceAreaM2, String photoUrl, RemnantStatus status, UUID reservedOrderItemId, String reservedOrderNumber, String notes, Instant createdAt) { }
}
