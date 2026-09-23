package com.univmar.label.api;

import com.univmar.label.domain.LabelTargetType;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class LabelDtos {
    private LabelDtos() { }
    public record CreateInput(@NotNull LabelTargetType targetType, @NotNull UUID targetId) { }
    public record LabelResponse(UUID id, String code, LabelTargetType targetType, UUID targetId, String qrImageUrl, String scanUrl, Instant createdAt) { }
    public record ScanResponse(String code, LabelTargetType targetType, String title, String materialName, String variantLabel, String lotNumber, String bundleNumber, String warehouseName, String locationCode, String status, BigDecimal onHandM2, BigDecimal availableM2, BigDecimal reservedM2, BigDecimal lengthMm, BigDecimal widthMm, BigDecimal thicknessMm, BigDecimal surfaceAreaM2, String photoUrl, String relatedOrderNumber, String relatedProjectName) { }
}
