package com.univmar.slab;

import com.univmar.common.api.ApiException;
import com.univmar.inventory.domain.*;
import com.univmar.order.domain.*;
import com.univmar.slab.api.SlabDtos.*;
import com.univmar.slab.domain.*;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SlabService {
    private final StoneSlabRepository slabs; private final InventoryItemRepository inventory; private final SalesOrderRepository orders;
    public SlabService(StoneSlabRepository slabs, InventoryItemRepository inventory, SalesOrderRepository orders) { this.slabs = slabs; this.inventory = inventory; this.orders = orders; }
    public Response create(CreateInput input) { String number = input.slabNumber().trim().toUpperCase(Locale.ROOT); if (slabs.existsBySlabNumberIgnoreCase(number)) throw conflict("DUPLICATE_SLAB_NUMBER", "This slab number already exists."); InventoryItem item = inventory.findById(input.inventoryItemId()).orElseThrow(() -> notFound("INVENTORY_NOT_FOUND", "Inventory was not found.")); return response(slabs.save(new StoneSlab(number, item, input.lengthMm(), input.widthMm(), trim(input.photoUrl()), input.cost(), trim(input.notes())))); }
    public Response hold(UUID id) { StoneSlab slab = entity(id); try { slab.hold(); } catch (IllegalStateException exception) { throw conflict("SLAB_NOT_AVAILABLE", "Only an available slab can be held."); } return response(slab); }
    public Response reserve(UUID id, ReserveInput input) { StoneSlab slab = entity(id); SalesOrderItem line = orders.findAll().stream().flatMap(candidate -> candidate.getItems().stream()).filter(item -> item.getId().equals(input.orderItemId())).findFirst().orElseThrow(() -> notFound("ORDER_ITEM_NOT_FOUND", "Order item was not found.")); ensureReservable(line, slab); try { slab.reserve(line); } catch (IllegalStateException exception) { throw conflict("SLAB_NOT_AVAILABLE", "Only an available or held slab can be reserved."); } return response(slab); }
    public Response release(UUID id) { StoneSlab slab = entity(id); try { slab.release(); } catch (IllegalStateException exception) { throw conflict("SLAB_NOT_RELEASABLE", "Only a held or reserved slab can be released."); } return response(slab); }
    public Response damage(UUID id) { StoneSlab slab = entity(id); try { slab.damage(); } catch (IllegalStateException exception) { throw conflict("SLAB_NOT_DAMAGEABLE", "Only an available or held slab can be marked damaged."); } return response(slab); }
    @Transactional(readOnly = true) public Response detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public List<Response> list(SlabStatus status, UUID inventoryItemId) { return slabs.findAll().stream().filter(slab -> status == null || slab.getStatus() == status).filter(slab -> inventoryItemId == null || slab.getInventoryItem().getId().equals(inventoryItemId)).sorted(Comparator.comparing(StoneSlab::getCreatedAt).reversed()).map(this::response).toList(); }
    public void releaseForOrder(UUID orderId) { slabs.findAllByReservedOrderItemOrderId(orderId).forEach(slab -> { if (slab.getStatus() == SlabStatus.RESERVED) slab.release(); }); }
    public void sellForOrder(UUID orderId) { slabs.findAllByReservedOrderItemOrderId(orderId).forEach(slab -> { if (slab.getStatus() == SlabStatus.RESERVED) slab.sell(); }); }
    private void ensureReservable(SalesOrderItem line, StoneSlab slab) { if (line.getOrder().getStatus() == OrderStatus.CANCELLED || line.getOrder().getStatus() == OrderStatus.DELIVERED) throw conflict("ORDER_NOT_RESERVABLE", "Only an active order can receive slab selections."); if (!line.getVariantId().equals(slab.getInventoryItem().getVariant().getId())) throw conflict("SLAB_VARIANT_MISMATCH", "The slab variant does not match this order item."); BigDecimal inventoryReserved = line.getReservations().stream().filter(reservation -> reservation.getStatus() == ReservationStatus.ACTIVE).map(InventoryReservation::getRemainingM2).reduce(BigDecimal.ZERO, BigDecimal::add); BigDecimal selected = slabs.findAllByReservedOrderItemId(line.getId()).stream().filter(selectedSlab -> selectedSlab.getStatus() == SlabStatus.RESERVED).map(StoneSlab::getSurfaceAreaM2).reduce(BigDecimal.ZERO, BigDecimal::add); if (selected.add(slab.getSurfaceAreaM2()).compareTo(inventoryReserved) > 0) throw conflict("SLAB_AREA_EXCEEDS_RESERVATION", "The selected slab area exceeds the order item's remaining reserved stock."); }
    private StoneSlab entity(UUID id) { return slabs.findById(id).orElseThrow(() -> notFound("SLAB_NOT_FOUND", "Slab was not found.")); }
    private Response response(StoneSlab slab) { InventoryItem item = slab.getInventoryItem(); var variant = item.getVariant(); var material = variant.getMaterial(); SalesOrderItem orderItem = slab.getReservedOrderItem(); return new Response(slab.getId(), slab.getSlabNumber(), item.getId(), variant.getId(), material.getName(), variant.getThicknessMm() + " mm · " + variant.getFinish() + (variant.getFormat() == null ? "" : " · " + variant.getFormat()), item.getLotNumber(), item.getBundleNumber(), item.getWarehouse().getName(), item.getLocation().getCode(), slab.getLengthMm(), slab.getWidthMm(), variant.getThicknessMm(), slab.getSurfaceAreaM2(), slab.getPhotoUrl(), slab.getCost(), slab.getStatus(), orderItem == null ? null : orderItem.getId(), orderItem == null ? null : orderItem.getOrder().getNumber(), slab.getNotes(), slab.getCreatedAt()); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); } private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
