package com.univmar.order.api;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OrderDtos {
    private OrderDtos() {
    }

    public record Detail(Long id, String orderNumber, String status, Long customerId, Long quotationId,
                         BigDecimal total, Instant createdAt, List<Line> lines, List<Event> timeline,
                         String currency, Instant confirmedAt, Instant cancelledAt, List<Address> addresses) {
    }

    public record Line(Long id, String lineType, Long variantId, String description, BigDecimal quantity, String unit,
                       BigDecimal unitPrice, BigDecimal lineTotal, int displayOrder) {
    }

    public record Event(String type, BigDecimal quantityM2, String reason, Long actorId, Instant at) {
    }

    public record Address(Long id, String type, String recipientName, String companyName, String phone,
                          String addressLine1, String addressLine2, String city, String region,
                          String postalCode, String countryCode) {
    }

    public record StatusResponse(String status) {
    }
}
