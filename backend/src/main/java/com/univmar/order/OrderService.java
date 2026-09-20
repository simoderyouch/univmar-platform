package com.univmar.order;

import com.univmar.common.api.ApiException;
import com.univmar.inventory.domain.*;
import com.univmar.order.api.OrderDtos.*;
import com.univmar.order.domain.*;
import com.univmar.quotation.domain.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderService {
    private final SalesOrderRepository orders; private final QuotationRepository quotations; private final InventoryItemRepository inventory; private final InventoryReservationRepository reservations; private final StockMovementRepository movements;
    public OrderService(SalesOrderRepository orders, QuotationRepository quotations, InventoryItemRepository inventory, InventoryReservationRepository reservations, StockMovementRepository movements) { this.orders = orders; this.quotations = quotations; this.inventory = inventory; this.reservations = reservations; this.movements = movements; }

    public Response acceptQuotation(UUID quotationId) {
        Quotation quote = quotations.findByIdForUpdate(quotationId).orElseThrow(() -> notFound("QUOTATION_NOT_FOUND", "Quotation was not found."));
        if (quote.getStatus() != QuotationStatus.SENT) throw conflict("QUOTATION_NOT_ACCEPTABLE", "Only a sent quotation can be accepted.");
        if (quote.getExpiryDate() == null || quote.getExpiryDate().isBefore(LocalDate.now())) throw conflict("QUOTATION_EXPIRED", "An expired quotation cannot be accepted.");
        if (orders.findByQuotationId(quotationId).isPresent()) throw conflict("QUOTATION_ALREADY_CONVERTED", "This quotation already has an order.");
        if (quote.getItems().isEmpty()) throw conflict("QUOTATION_ITEMS_REQUIRED", "The quotation has no items to reserve.");
        for (QuotationItem item : quote.getItems()) if (item.getVariantId() == null) throw conflict("QUOTE_ITEM_VARIANT_REQUIRED", "Every quotation item must have a material variant before acceptance.");
        SalesOrder order = new SalesOrder(nextNumber(), quote);
        quote.getItems().forEach(item -> order.addItem(new SalesOrderItem(order, item)));
        order.event("ORDER_CREATED", "Order created from quotation " + quote.getNumber());
        reserve(order);
        quote.status(QuotationStatus.ACCEPTED);
        order.event("QUOTATION_ACCEPTED", "Quotation accepted and inventory reserved");
        return response(orders.save(order));
    }

    public Response confirm(UUID id) { SalesOrder order = entity(id); if (order.getStatus() != OrderStatus.PENDING) throw conflict("ORDER_NOT_PENDING", "Only a pending order can be confirmed."); order.confirm(); return response(order); }
    public Response cancel(UUID id) { SalesOrder order = entity(id); if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) throw conflict("ORDER_NOT_CANCELLABLE", "This order cannot be cancelled."); for (SalesOrderItem line : order.getItems()) for (InventoryReservation reservation : line.getReservations()) if (reservation.getStatus() == ReservationStatus.ACTIVE) { InventoryItem item = reservation.getInventoryItem(); item.releaseReservation(reservation.getQuantityM2()); reservation.release(); movements.save(new StockMovement(item, MovementType.ORDER_RESERVATION_RELEASE, reservation.getQuantityM2(), "Order reservation released", null, Instant.now(), order.getNumber(), null)); } order.cancel(); return response(order); }
    @Transactional(readOnly = true) public Response detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public PageResult list(OrderStatus status, Pageable pageable) { Page<SalesOrder> page = status == null ? orders.findAll(pageable) : orders.findAll(org.springframework.data.jpa.domain.Specification.where((root, query, cb) -> cb.equal(root.get("status"), status)), pageable); return PageResult.from(page.map(this::response)); }

    private void reserve(SalesOrder order) {
        Map<UUID, List<SalesOrderItem>> grouped = new TreeMap<>(Comparator.comparing(UUID::toString));
        for (SalesOrderItem item : order.getItems()) grouped.computeIfAbsent(item.getVariantId(), ignored -> new ArrayList<>()).add(item);
        for (List<SalesOrderItem> lines : grouped.values()) {
            BigDecimal required = lines.stream().map(SalesOrderItem::getQuantityM2).reduce(BigDecimal.ZERO, BigDecimal::add);
            List<InventoryItem> stock = inventory.findAllByVariantIdForUpdate(lines.get(0).getVariantId());
            BigDecimal available = stock.stream().map(InventoryItem::getAvailableM2).reduce(BigDecimal.ZERO, BigDecimal::add);
            if (available.compareTo(required) < 0) throw conflict("INSUFFICIENT_AVAILABLE_STOCK", "Insufficient available stock for " + lines.get(0).getMaterialName() + ". Required " + required + " m²; available " + available + " m².");
            Iterator<InventoryItem> rows = stock.iterator(); InventoryItem current = rows.hasNext() ? rows.next() : null; BigDecimal leftAtRow = current == null ? BigDecimal.ZERO : current.getAvailableM2();
            for (SalesOrderItem line : lines) { BigDecimal remaining = line.getQuantityM2(); while (remaining.signum() > 0) { while (leftAtRow.signum() == 0 && rows.hasNext()) { current = rows.next(); leftAtRow = current.getAvailableM2(); } if (current == null || leftAtRow.signum() == 0) throw conflict("INSUFFICIENT_AVAILABLE_STOCK", "Stock changed while reserving this order."); BigDecimal allocation = remaining.min(leftAtRow); current.reserve(allocation); InventoryReservation reservation = new InventoryReservation(line, current, allocation); line.addReservation(reservation); movements.save(new StockMovement(current, MovementType.ORDER_RESERVATION, allocation, "Order stock reserved", null, Instant.now(), order.getNumber(), null)); remaining = remaining.subtract(allocation); leftAtRow = leftAtRow.subtract(allocation); } }
        }
    }
    private SalesOrder entity(UUID id) { return orders.findById(id).orElseThrow(() -> notFound("ORDER_NOT_FOUND", "Order was not found.")); }
    private Response response(SalesOrder order) { return new Response(order.getId(), order.getNumber(), order.getQuotation().getId(), order.getQuotation().getNumber(), order.getCustomer().getId(), order.getCustomer().getName(), order.getProject().getId(), order.getProject().getName(), order.getStatus(), order.getSubtotal(), order.getTaxTotal(), order.getTransport(), order.getGrandTotal(), order.getCreatedAt(), order.getConfirmedAt(), order.getCancelledAt(), order.getItems().stream().map(line -> new Item(line.getId(), line.getVariantId(), line.getMaterialName(), line.getVariantLabel(), line.getQuantityM2(), line.getUnitPrice(), line.getLineTotal(), line.getReservations().stream().map(this::reservation).toList())).toList(), order.getEvents().stream().sorted(Comparator.comparing(OrderEvent::getOccurredAt)).map(event -> new Event(event.getId(), event.getType(), event.getMessage(), event.getOccurredAt())).toList()); }
    private Reservation reservation(InventoryReservation item) { InventoryItem stock = item.getInventoryItem(); return new Reservation(item.getId(), stock.getId(), stock.getVariant().getMaterial().getName(), stock.getWarehouse().getName(), stock.getLocation().getCode(), stock.getLotNumber(), stock.getBundleNumber(), item.getQuantityM2(), item.getStatus()); }
    private String nextNumber() { return "ORD-" + LocalDate.now().toString().replace("-", "") + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
