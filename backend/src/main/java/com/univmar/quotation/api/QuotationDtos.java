package com.univmar.quotation.api;

import com.univmar.quotation.domain.CommercialLineType;
import com.univmar.quotation.domain.UnitType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class QuotationDtos {
    private QuotationDtos() {
    }

    public record Line(@NotNull CommercialLineType type, Long variantId, @NotBlank String description,
                       @NotNull @DecimalMin("0.01") BigDecimal quantity,
                       UnitType unit, @NotNull @DecimalMin("0.00") BigDecimal unitPrice) {
    }

    public record Create(@NotNull Long requestId, @NotNull @FutureOrPresent LocalDate validUntil,
                         @DecimalMin("0.00") BigDecimal discount, @DecimalMin("0.00") BigDecimal tax,
                         @NotEmpty List<@Valid Line> lines) {
    }

    public record Response(Long id, String quoteNumber, String status, BigDecimal total) {
    }

    public record AcceptanceResponse(String orderNumber, String status) {
    }

    public record Detail(Long id, String quoteNumber, String status, LocalDate validUntil, BigDecimal subtotal,
                         BigDecimal discount, BigDecimal tax, BigDecimal total, String currency, int revisionNumber,
                         Long revisionOfId, Long requestId, List<LineDetail> lines, Instant sentAt, Instant acceptedAt) {
    }

    public record LineDetail(Long id, String type, Long variantId, String description, BigDecimal quantity,
                             String unit, BigDecimal unitPrice, BigDecimal lineTotal, int displayOrder) {
    }
}
