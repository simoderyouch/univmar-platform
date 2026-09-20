package com.univmar.order.api;

import com.univmar.order.domain.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.data.domain.Page;

public final class OrderDtos {
    private OrderDtos() { }
    public record Reservation(UUID id, UUID inventoryItemId, String materialName, String warehouseName, String locationCode, String lotNumber, String bundleNumber, BigDecimal quantityM2, ReservationStatus status) { }
    public record Item(UUID id, UUID variantId, String materialName, String variantLabel, BigDecimal quantityM2, BigDecimal unitPrice, BigDecimal lineTotal, List<Reservation> reservations) { }
    public record Event(UUID id, String type, String message, Instant occurredAt) { }
    public record Response(UUID id, String number, UUID quotationId, String quotationNumber, UUID customerId, String customerName, UUID projectId, String projectName, OrderStatus status, BigDecimal subtotal, BigDecimal taxTotal, BigDecimal transport, BigDecimal grandTotal, Instant createdAt, Instant confirmedAt, Instant cancelledAt, List<Item> items, List<Event> events) { }
    public record PageResult(List<Response> content, int page, int size, long totalElements, int totalPages) { public static PageResult from(Page<Response> page) { return new PageResult(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
