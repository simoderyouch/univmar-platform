package com.univmar.delivery;

import com.univmar.common.api.ApiException;
import com.univmar.delivery.api.DeliveryDtos.*;
import com.univmar.delivery.domain.*;
import com.univmar.inventory.domain.*;
import com.univmar.order.domain.*;
import com.univmar.slab.SlabService;
import com.univmar.remnant.RemnantService;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DeliveryService {
    private final DeliveryRepository deliveries; private final SalesOrderRepository orders; private final InventoryReservationRepository reservations; private final InventoryItemRepository inventory; private final StockMovementRepository movements; private final SlabService slabs; private final RemnantService remnants;
    public DeliveryService(DeliveryRepository deliveries, SalesOrderRepository orders, InventoryReservationRepository reservations, InventoryItemRepository inventory, StockMovementRepository movements, SlabService slabs, RemnantService remnants) { this.deliveries = deliveries; this.orders = orders; this.reservations = reservations; this.inventory = inventory; this.movements = movements; this.slabs = slabs; this.remnants = remnants; }

    public Response create(CreateInput input) {
        SalesOrder order = orderForUpdate(input.orderId()); ensurePlannable(order);
        Delivery delivery = new Delivery(nextNumber(), order, input.scheduledDate(), trim(input.notes()));
        addItems(delivery, input.items());
        order.preparing(); order.event("DELIVERY_PLANNED", "Delivery " + delivery.getNumber() + " planned");
        return response(deliveries.save(delivery));
    }
    public Response addItems(UUID id, List<ItemInput> input) { Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.PLANNED) throw conflict("DELIVERY_NOT_EDITABLE", "Items can only be added to a planned delivery."); addItems(delivery, input); return response(delivery); }
    public Response prepare(UUID id) { Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.PLANNED) throw conflict("DELIVERY_NOT_PLANNED", "Only a planned delivery can start preparation."); delivery.prepare(); delivery.getOrder().event("DELIVERY_PREPARING", "Delivery " + delivery.getNumber() + " is being prepared"); return response(delivery); }
    public Response dispatch(UUID id) {
        Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.PLANNED && delivery.getStatus() != DeliveryStatus.PREPARING) throw conflict("DELIVERY_NOT_DISPATCHABLE", "Only a planned or preparing delivery can be dispatched.");
        SalesOrder order = orderForUpdate(delivery.getOrder().getId());
        for (DeliveryItem line : delivery.getItems()) consumeReservations(order, delivery, line);
        delivery.dispatch(); order.partiallyDelivered(); order.event("DELIVERY_DISPATCHED", "Delivery " + delivery.getNumber() + " dispatched");
        return response(delivery);
    }
    public Response confirmDelivered(UUID id) { Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.DISPATCHED) throw conflict("DELIVERY_NOT_DISPATCHED", "Only a dispatched delivery can be confirmed delivered."); SalesOrder order = orderForUpdate(delivery.getOrder().getId()); delivery.confirmDelivered(); order.event("DELIVERY_CONFIRMED", "Delivery " + delivery.getNumber() + " confirmed delivered"); if (allReservationsConsumed(order)) { slabs.sellForOrder(order.getId()); remnants.consumeForOrder(order.getId()); order.delivered(); } else order.partiallyDelivered(); return response(delivery); }
    public Response cancel(UUID id) { Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.PLANNED && delivery.getStatus() != DeliveryStatus.PREPARING) throw conflict("DELIVERY_NOT_CANCELLABLE", "A dispatched or delivered delivery cannot be cancelled."); delivery.cancel(); delivery.getOrder().event("DELIVERY_CANCELLED", "Delivery " + delivery.getNumber() + " cancelled"); return response(delivery); }
    public Response fail(UUID id) { Delivery delivery = deliveryForUpdate(id); if (delivery.getStatus() != DeliveryStatus.PLANNED && delivery.getStatus() != DeliveryStatus.PREPARING) throw conflict("DELIVERY_NOT_FAILABLE", "Only a planned or preparing delivery can be marked failed."); delivery.fail(); delivery.getOrder().event("DELIVERY_FAILED", "Delivery " + delivery.getNumber() + " failed before dispatch"); return response(delivery); }
    @Transactional(readOnly = true) public Response detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public PageResult list(DeliveryStatus status, Pageable pageable) { Page<Delivery> page = status == null ? deliveries.findAll(pageable) : deliveries.findAll(org.springframework.data.jpa.domain.Specification.where((root, query, cb) -> cb.equal(root.get("status"), status)), pageable); return PageResult.from(page.map(this::response)); }

    private void addItems(Delivery delivery, List<ItemInput> inputs) {
        if (inputs == null || inputs.isEmpty()) throw conflict("DELIVERY_ITEMS_REQUIRED", "Add at least one order item to a delivery.");
        Map<UUID, BigDecimal> requested = new LinkedHashMap<>(); for (ItemInput input : inputs) requested.merge(input.orderItemId(), input.quantityM2(), BigDecimal::add);
        Map<UUID, SalesOrderItem> orderItems = new HashMap<>(); for (SalesOrderItem item : delivery.getOrder().getItems()) orderItems.put(item.getId(), item);
        for (Map.Entry<UUID, BigDecimal> entry : requested.entrySet()) { SalesOrderItem item = orderItems.get(entry.getKey()); if (item == null) throw conflict("DELIVERY_ITEM_ORDER_MISMATCH", "Every delivery item must belong to the selected order."); BigDecimal available = unplannedReservedQuantity(item); if (available.compareTo(entry.getValue()) < 0) throw conflict("DELIVERY_QUANTITY_EXCEEDS_RESERVATION", "The delivery quantity exceeds remaining reserved stock for " + item.getMaterialName() + "."); }
        for (ItemInput input : inputs) delivery.addItem(new DeliveryItem(delivery, orderItems.get(input.orderItemId()), input.quantityM2()));
    }
    private BigDecimal unplannedReservedQuantity(SalesOrderItem item) { BigDecimal reserved = reservations.findAllByOrderItemIdAndStatusOrderByCreatedAt(item.getId(), ReservationStatus.ACTIVE).stream().map(InventoryReservation::getRemainingM2).reduce(BigDecimal.ZERO, BigDecimal::add); BigDecimal planned = deliveries.findAllByOrderId(item.getOrder().getId()).stream().filter(delivery -> delivery.getStatus() == DeliveryStatus.PLANNED || delivery.getStatus() == DeliveryStatus.PREPARING).flatMap(delivery -> delivery.getItems().stream()).filter(line -> line.getOrderItem().getId().equals(item.getId())).map(DeliveryItem::getQuantityM2).reduce(BigDecimal.ZERO, BigDecimal::add); return reserved.subtract(planned); }
    private void consumeReservations(SalesOrder order, Delivery delivery, DeliveryItem line) { BigDecimal remaining = line.getQuantityM2(); List<InventoryReservation> allocated = reservations.findAllByOrderItemIdAndStatusOrderByCreatedAt(line.getOrderItem().getId(), ReservationStatus.ACTIVE); for (InventoryReservation reservation : allocated) { if (remaining.signum() == 0) break; BigDecimal quantity = remaining.min(reservation.getRemainingM2()); InventoryItem item = inventory.findByIdForUpdate(reservation.getInventoryItem().getId()).orElseThrow(() -> notFound("INVENTORY_NOT_FOUND", "Reserved inventory was not found.")); try { item.deliverReserved(quantity); reservation.consume(quantity); } catch (IllegalArgumentException exception) { throw conflict("DELIVERY_STOCK_MISMATCH", "Reserved stock is no longer available for dispatch."); } movements.save(new StockMovement(item, MovementType.ORDER_DELIVERY, quantity, "Order delivery dispatched", null, Instant.now(), delivery.getNumber(), null)); remaining = remaining.subtract(quantity); } if (remaining.signum() > 0) throw conflict("DELIVERY_QUANTITY_EXCEEDS_RESERVATION", "The delivery quantity exceeds the order's remaining reservation."); }
    private boolean allReservationsConsumed(SalesOrder order) { return order.getItems().stream().flatMap(item -> item.getReservations().stream()).allMatch(item -> item.getStatus() == ReservationStatus.CONSUMED); }
    private void ensurePlannable(SalesOrder order) { if (order.getStatus() != OrderStatus.CONFIRMED && order.getStatus() != OrderStatus.PREPARING && order.getStatus() != OrderStatus.PARTIALLY_DELIVERED) throw conflict("ORDER_NOT_FULFILLABLE", "Only confirmed or active orders can be planned for delivery."); }
    private Delivery entity(UUID id) { return deliveries.findById(id).orElseThrow(() -> notFound("DELIVERY_NOT_FOUND", "Delivery was not found.")); }
    private Delivery deliveryForUpdate(UUID id) { return deliveries.findByIdForUpdate(id).orElseThrow(() -> notFound("DELIVERY_NOT_FOUND", "Delivery was not found.")); }
    private SalesOrder orderForUpdate(UUID id) { return orders.findByIdForUpdate(id).orElseThrow(() -> notFound("ORDER_NOT_FOUND", "Order was not found.")); }
    private Response response(Delivery delivery) { SalesOrder order = delivery.getOrder(); return new Response(delivery.getId(), delivery.getNumber(), order.getId(), order.getNumber(), order.getCustomer().getName(), order.getProject().getName(), delivery.getScheduledDate(), delivery.getStatus(), delivery.getNotes(), delivery.getCreatedAt(), delivery.getDispatchedAt(), delivery.getDeliveredAt(), delivery.getCancelledAt(), delivery.getItems().stream().map(item -> new Item(item.getId(), item.getOrderItem().getId(), item.getOrderItem().getMaterialName(), item.getOrderItem().getVariantLabel(), item.getQuantityM2())).toList()); }
    private String nextNumber() { return "DLV-" + LocalDate.now().toString().replace("-", "") + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
