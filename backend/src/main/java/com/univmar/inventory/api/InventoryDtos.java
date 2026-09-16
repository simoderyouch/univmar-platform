package com.univmar.inventory.api;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal; import java.time.Instant;
public final class InventoryDtos {
 private InventoryDtos() { }
 public record CreateItemRequest(@NotNull Long variantId, @NotNull @DecimalMin("0.00") BigDecimal minStockM2) { }
 public record UpdateItemRequest(@NotNull @DecimalMin("0.00") BigDecimal minStockM2) { }
 public record MovementRequest(@NotNull @DecimalMin(value = "0.01", inclusive = false) BigDecimal quantityM2, @NotBlank String reason) { }
 public record AdjustmentRequest(@NotNull @DecimalMin("-9999999.99") BigDecimal quantityM2, @NotBlank String reason) { }
 public record ItemResponse(Long id, Long variantId, BigDecimal onHandM2, BigDecimal reservedM2, BigDecimal availableM2, BigDecimal minStockM2, boolean active) { }
 public record MovementResponse(Long id,String type,BigDecimal quantityM2,String referenceType,Long referenceId,String reason,Long actorId,Instant createdAt) { }
}
