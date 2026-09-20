package com.univmar.purchasing.api;

import com.univmar.catalog.domain.Finish;
import com.univmar.purchasing.domain.PurchaseOrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.Page;

public final class PurchaseOrderDtos {
    private PurchaseOrderDtos() { }
    public record PurchaseItemInput(@NotNull UUID variantId, @NotNull @DecimalMin(value = "0.001") BigDecimal orderedM2, @DecimalMin(value = "0.00") BigDecimal costPerM2, @Size(max = 4000) String notes) { }
    public record PurchaseOrderInput(@NotNull UUID supplierId, LocalDate expectedArrival, @Size(max = 4000) String notes, @NotEmpty List<@Valid PurchaseItemInput> items) { }
    public record ReceiveGoodsInput(@NotNull UUID itemId, @NotNull UUID warehouseId, @NotNull UUID locationId, @Size(max = 80) String lotNumber, @Size(max = 80) String bundleNumber, @NotNull @DecimalMin(value = "0.001") BigDecimal quantityM2, @DecimalMin(value = "0.00") BigDecimal costPerM2, @Size(max = 2000) String comment) { }
    public record PurchaseItemResponse(UUID id, UUID variantId, String materialName, String materialSku, BigDecimal thicknessMm, Finish finish, String format, BigDecimal orderedM2, BigDecimal receivedM2, BigDecimal remainingM2, BigDecimal costPerM2, String notes, List<ReceiptResponse> receipts) { }
    public record ReceiptResponse(UUID id, BigDecimal quantityM2, Instant receivedAt, String note) { }
    public record PurchaseOrderSummary(UUID id, String number, UUID supplierId, String supplierName, PurchaseOrderStatus status, LocalDate expectedArrival, BigDecimal orderedM2, BigDecimal receivedM2) { }
    public record PurchaseOrderDetail(UUID id, String number, UUID supplierId, String supplierName, PurchaseOrderStatus status, LocalDate expectedArrival, String notes, List<PurchaseItemResponse> items) { }
    public record PurchaseOrderPage(List<PurchaseOrderSummary> content, int page, int size, long totalElements, int totalPages) { public static PurchaseOrderPage from(Page<PurchaseOrderSummary> page) { return new PurchaseOrderPage(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
