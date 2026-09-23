package com.univmar.remnant;

import com.univmar.common.api.ApiException;
import com.univmar.order.domain.*;
import com.univmar.remnant.api.RemnantDtos.*;
import com.univmar.remnant.domain.*;
import com.univmar.slab.domain.StoneSlab;
import com.univmar.slab.domain.StoneSlabRepository;
import com.univmar.slab.domain.SlabStatus;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RemnantService {
    private final StoneRemnantRepository remnants; private final StoneSlabRepository slabs; private final SalesOrderRepository orders;
    public RemnantService(StoneRemnantRepository remnants, StoneSlabRepository slabs, SalesOrderRepository orders) { this.remnants = remnants; this.slabs = slabs; this.orders = orders; }
    public Response create(CreateInput input) { String number = input.remnantNumber().trim().toUpperCase(Locale.ROOT); if (remnants.existsByRemnantNumberIgnoreCase(number)) throw conflict("DUPLICATE_REMNANT_NUMBER", "This remnant number already exists."); StoneSlab parent = slabs.findById(input.parentSlabId()).orElseThrow(() -> notFound("SLAB_NOT_FOUND", "Parent slab was not found.")); if (parent.getStatus() == SlabStatus.SOLD || parent.getStatus() == SlabStatus.DAMAGED) throw conflict("SLAB_NOT_CUTTABLE", "A sold or damaged slab cannot produce a reusable offcut."); return response(remnants.save(new StoneRemnant(number, parent, input.lengthMm(), input.widthMm(), trim(input.photoUrl()), trim(input.notes())))); }
    public Response hold(UUID id) { StoneRemnant remnant = entity(id); try { remnant.hold(); } catch (IllegalStateException exception) { throw conflict("REMNANT_NOT_AVAILABLE", "Only an available remnant can be held."); } return response(remnant); }
    public Response reserve(UUID id, ReserveInput input) { StoneRemnant remnant = entity(id); SalesOrderItem line = orders.findAll().stream().flatMap(order -> order.getItems().stream()).filter(item -> item.getId().equals(input.orderItemId())).findFirst().orElseThrow(() -> notFound("ORDER_ITEM_NOT_FOUND", "Order item was not found.")); ensureReservable(line, remnant); try { remnant.reserve(line); } catch (IllegalStateException exception) { throw conflict("REMNANT_NOT_AVAILABLE", "Only an available or held remnant can be reserved."); } return response(remnant); }
    public Response release(UUID id) { StoneRemnant remnant = entity(id); try { remnant.release(); } catch (IllegalStateException exception) { throw conflict("REMNANT_NOT_RELEASABLE", "Only a held or reserved remnant can be released."); } return response(remnant); }
    public Response damage(UUID id) { StoneRemnant remnant = entity(id); try { remnant.damage(); } catch (IllegalStateException exception) { throw conflict("REMNANT_NOT_DAMAGEABLE", "Only an available or held remnant can be marked damaged."); } return response(remnant); }
    @Transactional(readOnly = true) public Response detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public List<Response> list(RemnantStatus status) { return remnants.findAll().stream().filter(remnant -> status == null || remnant.getStatus() == status).sorted(Comparator.comparing(StoneRemnant::getCreatedAt).reversed()).map(this::response).toList(); }
    public void releaseForOrder(UUID orderId) { remnants.findAllByReservedOrderItemOrderId(orderId).forEach(remnant -> { if (remnant.getStatus() == RemnantStatus.RESERVED) remnant.release(); }); }
    public void consumeForOrder(UUID orderId) { remnants.findAllByReservedOrderItemOrderId(orderId).forEach(remnant -> { if (remnant.getStatus() == RemnantStatus.RESERVED) remnant.consume(); }); }
    private void ensureReservable(SalesOrderItem line, StoneRemnant remnant) { if (line.getOrder().getStatus() == OrderStatus.CANCELLED || line.getOrder().getStatus() == OrderStatus.DELIVERED) throw conflict("ORDER_NOT_RESERVABLE", "Only an active order can receive remnant selections."); if (!line.getVariantId().equals(remnant.getParentSlab().getInventoryItem().getVariant().getId())) throw conflict("REMNANT_VARIANT_MISMATCH", "The remnant variant does not match this order item."); BigDecimal inventoryReserved = line.getReservations().stream().filter(reservation -> reservation.getStatus() == ReservationStatus.ACTIVE).map(InventoryReservation::getRemainingM2).reduce(BigDecimal.ZERO, BigDecimal::add); BigDecimal selected = remnants.findAllByReservedOrderItemId(line.getId()).stream().filter(item -> item.getStatus() == RemnantStatus.RESERVED).map(StoneRemnant::getSurfaceAreaM2).reduce(BigDecimal.ZERO, BigDecimal::add); if (selected.add(remnant.getSurfaceAreaM2()).compareTo(inventoryReserved) > 0) throw conflict("REMNANT_AREA_EXCEEDS_RESERVATION", "The selected remnant area exceeds the order item's remaining reserved stock."); }
    private StoneRemnant entity(UUID id) { return remnants.findById(id).orElseThrow(() -> notFound("REMNANT_NOT_FOUND", "Remnant was not found.")); }
    private Response response(StoneRemnant remnant) { StoneSlab parent = remnant.getParentSlab(); var item = parent.getInventoryItem(); var variant = item.getVariant(); SalesOrderItem orderItem = remnant.getReservedOrderItem(); return new Response(remnant.getId(), remnant.getRemnantNumber(), parent.getId(), parent.getSlabNumber(), variant.getId(), variant.getMaterial().getName(), variant.getThicknessMm() + " mm · " + variant.getFinish() + (variant.getFormat() == null ? "" : " · " + variant.getFormat()), item.getLotNumber(), item.getBundleNumber(), item.getWarehouse().getName(), item.getLocation().getCode(), remnant.getLengthMm(), remnant.getWidthMm(), variant.getThicknessMm(), remnant.getSurfaceAreaM2(), remnant.getPhotoUrl(), remnant.getStatus(), orderItem == null ? null : orderItem.getId(), orderItem == null ? null : orderItem.getOrder().getNumber(), remnant.getNotes(), remnant.getCreatedAt()); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); } private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
