package com.univmar.inventory.api;

import com.univmar.catalog.domain.Finish;
import com.univmar.inventory.domain.MovementType;
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

public final class InventoryDtos {
    private InventoryDtos() { }
    public record WarehouseInput(@NotBlank @Size(max = 40) String code, @NotBlank @Size(max = 160) String name) { }
    public record LocationInput(@NotBlank @Size(max = 40) String code, @Size(max = 80) String zone) { }
    public record WarehouseResponse(UUID id, String code, String name, boolean active) { }
    public record LocationResponse(UUID id, UUID warehouseId, String code, String zone, boolean active) { }
    public record ReceiptInput(@NotNull UUID variantId, @NotNull UUID warehouseId, @NotNull UUID locationId, @Size(max = 80) String lotNumber, @Size(max = 80) String bundleNumber, @NotNull @DecimalMin(value = "0.001") BigDecimal quantityM2, @DecimalMin(value = "0.00") BigDecimal costPerM2, @Size(max = 160) String supplierName, LocalDate arrivalDate, MovementType type, @Size(max = 2000) String comment) { }
    public record AdjustmentInput(@NotNull MovementType type, @NotNull @DecimalMin(value = "0.001") BigDecimal quantityM2, @NotBlank @Size(max = 500) String reason, @Size(max = 2000) String comment) { }
    public record InventorySummary(UUID id, UUID variantId, UUID materialId, String materialName, String materialSku, String mainImageUrl, BigDecimal thicknessMm, Finish finish, String format, String lotNumber, String bundleNumber, WarehouseResponse warehouse, LocationResponse location, BigDecimal onHandM2, BigDecimal reservedM2, BigDecimal damagedM2, BigDecimal availableM2, BigDecimal costPerM2, String supplierName, LocalDate arrivalDate) { }
    public record MovementResponse(UUID id, MovementType type, BigDecimal quantityM2, String reason, String comment, Instant occurredAt) { }
    public record InventoryDetail(InventorySummary inventory, List<MovementResponse> movements) { }
    public record Totals(BigDecimal onHandM2, BigDecimal reservedM2, BigDecimal damagedM2, BigDecimal availableM2) { }
    public record InventoryPage(List<InventorySummary> content, int page, int size, long totalElements, int totalPages, Totals totals) {
        public static InventoryPage from(Page<InventorySummary> page, Totals totals) { return new InventoryPage(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), totals); }
    }
    public record MaterialInventorySummary(UUID variantId, BigDecimal thicknessMm, Finish finish, String format, BigDecimal availableM2) { }
}
