package com.univmar.inventory;

import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.common.api.ApiException;
import com.univmar.inventory.api.InventoryDtos.*;
import com.univmar.inventory.domain.*;
import jakarta.persistence.criteria.Join;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {
    private final WarehouseRepository warehouses;
    private final WarehouseLocationRepository locations;
    private final InventoryItemRepository items;
    private final StockMovementRepository movements;
    private final StoneVariantRepository variants;

    public InventoryService(WarehouseRepository warehouses, WarehouseLocationRepository locations, InventoryItemRepository items, StockMovementRepository movements, StoneVariantRepository variants) {
        this.warehouses = warehouses; this.locations = locations; this.items = items; this.movements = movements; this.variants = variants;
    }

    @Transactional(readOnly = true) public List<WarehouseResponse> warehouses() { return warehouses.findAll().stream().sorted(Comparator.comparing(Warehouse::getName)).map(this::warehouse).toList(); }
    public WarehouseResponse createWarehouse(WarehouseInput input) { String code = upper(input.code()); warehouses.findByCodeIgnoreCase(code).ifPresent(existing -> { throw conflict("DUPLICATE_WAREHOUSE_CODE", "A warehouse with this code already exists."); }); return warehouse(warehouses.save(new Warehouse(code, required(input.name())))); }
    public WarehouseResponse updateWarehouse(UUID id, WarehouseInput input) { Warehouse warehouse = warehouseEntity(id); String code = upper(input.code()); warehouses.findByCodeIgnoreCase(code).filter(existing -> !existing.getId().equals(id)).ifPresent(existing -> { throw conflict("DUPLICATE_WAREHOUSE_CODE", "A warehouse with this code already exists."); }); warehouse.update(code, required(input.name())); return warehouse(warehouse); }
    @Transactional(readOnly = true) public List<LocationResponse> locations(UUID warehouseId) { warehouseEntity(warehouseId); return locations.findAllByWarehouseIdOrderByCode(warehouseId).stream().map(this::location).toList(); }
    public LocationResponse createLocation(UUID warehouseId, LocationInput input) { Warehouse warehouse = warehouseEntity(warehouseId); String code = upper(input.code()); locations.findByWarehouseIdAndCodeIgnoreCase(warehouseId, code).ifPresent(existing -> { throw conflict("DUPLICATE_LOCATION_CODE", "This warehouse already has a location with this code."); }); return location(locations.save(new WarehouseLocation(warehouse, code, trim(input.zone())))); }
    public LocationResponse updateLocation(UUID warehouseId, UUID locationId, LocationInput input) { WarehouseLocation location = locationEntity(warehouseId, locationId); String code = upper(input.code()); locations.findByWarehouseIdAndCodeIgnoreCase(warehouseId, code).filter(existing -> !existing.getId().equals(locationId)).ifPresent(existing -> { throw conflict("DUPLICATE_LOCATION_CODE", "This warehouse already has a location with this code."); }); location.update(code, trim(input.zone())); return location(location); }

    public InventorySummary receive(ReceiptInput input) {
        StoneVariant variant = variants.findById(input.variantId()).orElseThrow(() -> notFound("VARIANT_NOT_FOUND", "Material variant was not found."));
        Warehouse warehouse = warehouseEntity(input.warehouseId());
        WarehouseLocation location = locationEntity(warehouse.getId(), input.locationId());
        if (!variant.isActive() || !warehouse.isActive() || !location.isActive()) throw conflict("INACTIVE_REFERENCE", "Stock can only be received into active material variants and locations.");
        String lot = trim(input.lotNumber()); String bundle = trim(input.bundleNumber());
        InventoryItem item = items.findByVariantIdAndWarehouseIdAndLocationIdAndLotNumberAndBundleNumber(variant.getId(), warehouse.getId(), location.getId(), lot, bundle)
            .orElseGet(() -> new InventoryItem(variant, warehouse, location, lot, bundle, input.costPerM2(), trim(input.supplierName()), input.arrivalDate()));
        MovementType type = input.type() == null ? MovementType.PURCHASE_RECEIPT : input.type();
        if (!EnumSet.of(MovementType.INITIAL_STOCK, MovementType.PURCHASE_RECEIPT).contains(type)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_RECEIPT_TYPE", "Choose Initial stock or Purchase receipt.");
        }
        item.receive(input.quantityM2());
        items.save(item);
        movements.save(new StockMovement(item, type, input.quantityM2(), type == MovementType.INITIAL_STOCK ? "Initial stock recorded" : "Stock received", trim(input.comment()), Instant.now()));
        return inventory(item);
    }

    public InventorySummary adjust(UUID id, AdjustmentInput input) {
        InventoryItem item = item(id);
        if (!EnumSet.of(MovementType.ADJUSTMENT_IN, MovementType.ADJUSTMENT_OUT, MovementType.DAMAGE, MovementType.RETURN).contains(input.type())) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ADJUSTMENT_TYPE", "Choose Adjustment in, Adjustment out, Damage, or Return.");
        try {
            switch (input.type()) {
                case ADJUSTMENT_IN, RETURN -> item.adjustIn(input.quantityM2());
                case ADJUSTMENT_OUT -> item.adjustOut(input.quantityM2());
                case DAMAGE -> item.markDamaged(input.quantityM2());
                default -> throw new IllegalStateException();
            }
        } catch (IllegalArgumentException exception) { throw conflict("INSUFFICIENT_AVAILABLE_STOCK", "The adjustment exceeds the available stock."); }
        movements.save(new StockMovement(item, input.type(), input.quantityM2(), required(input.reason()), trim(input.comment()), Instant.now()));
        return inventory(item);
    }

    @Transactional(readOnly = true)
    public InventoryPage list(String search, String lot, String bundle, UUID warehouseId, Pageable pageable) {
        Specification<InventoryItem> spec = specification(search, lot, bundle, warehouseId);
        Page<InventorySummary> page = items.findAll(spec, pageable).map(this::inventory);
        List<InventoryItem> matching = items.findAll(spec);
        BigDecimal onHand = matching.stream().map(InventoryItem::getOnHandM2).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal reserved = matching.stream().map(InventoryItem::getReservedM2).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal damaged = matching.stream().map(InventoryItem::getDamagedM2).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal available = matching.stream().map(InventoryItem::getAvailableM2).reduce(BigDecimal.ZERO, BigDecimal::add);
        return InventoryPage.from(page, new Totals(onHand, reserved, damaged, available));
    }

    @Transactional(readOnly = true) public InventoryDetail detail(UUID id) { InventoryItem item = item(id); return new InventoryDetail(inventory(item), movements.findAllByInventoryItemIdOrderByOccurredAtDesc(id).stream().map(this::movement).toList()); }
    @Transactional(readOnly = true) public List<MaterialInventorySummary> materialSummary(UUID materialId) { return items.findAll().stream().filter(item -> item.getVariant().getMaterial().getId().equals(materialId)).collect(java.util.stream.Collectors.groupingBy(InventoryItem::getVariant)).entrySet().stream().map(entry -> new MaterialInventorySummary(entry.getKey().getId(), entry.getKey().getThicknessMm(), entry.getKey().getFinish(), entry.getKey().getFormat(), entry.getValue().stream().map(InventoryItem::getAvailableM2).reduce(BigDecimal.ZERO, BigDecimal::add))).sorted(Comparator.comparing(MaterialInventorySummary::thicknessMm)).toList(); }

    private Specification<InventoryItem> specification(String search, String lot, String bundle, UUID warehouseId) { return (root, query, cb) -> {
        List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
        if (search != null && !search.isBlank()) { String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%"; Join<?, ?> variant = root.join("variant"); Join<?, ?> material = variant.join("material"); predicates.add(cb.or(cb.like(cb.lower(material.<String>get("name")), value), cb.like(cb.lower(material.<String>get("sku")), value))); }
        if (lot != null && !lot.isBlank()) predicates.add(cb.like(cb.lower(root.<String>get("lotNumber")), "%" + lot.trim().toLowerCase(Locale.ROOT) + "%"));
        if (bundle != null && !bundle.isBlank()) predicates.add(cb.like(cb.lower(root.<String>get("bundleNumber")), "%" + bundle.trim().toLowerCase(Locale.ROOT) + "%"));
        if (warehouseId != null) predicates.add(cb.equal(root.get("warehouse").get("id"), warehouseId));
        return cb.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
    }; }
    private Warehouse warehouseEntity(UUID id) { return warehouses.findById(id).orElseThrow(() -> notFound("WAREHOUSE_NOT_FOUND", "Warehouse was not found.")); }
    private WarehouseLocation locationEntity(UUID warehouseId, UUID id) { return locations.findByIdAndWarehouseId(id, warehouseId).orElseThrow(() -> notFound("LOCATION_NOT_FOUND", "Warehouse location was not found.")); }
    private InventoryItem item(UUID id) { return items.findById(id).orElseThrow(() -> notFound("INVENTORY_NOT_FOUND", "Inventory item was not found.")); }
    private WarehouseResponse warehouse(Warehouse item) { return new WarehouseResponse(item.getId(), item.getCode(), item.getName(), item.isActive()); }
    private LocationResponse location(WarehouseLocation item) { return new LocationResponse(item.getId(), item.getWarehouse().getId(), item.getCode(), item.getZone(), item.isActive()); }
    private InventorySummary inventory(InventoryItem item) { StoneVariant variant = item.getVariant(); var material = variant.getMaterial(); return new InventorySummary(item.getId(), variant.getId(), material.getId(), material.getName(), material.getSku(), material.getMainImageUrl(), variant.getThicknessMm(), variant.getFinish(), variant.getFormat(), item.getLotNumber(), item.getBundleNumber(), warehouse(item.getWarehouse()), location(item.getLocation()), item.getOnHandM2(), item.getReservedM2(), item.getDamagedM2(), item.getAvailableM2(), item.getCostPerM2(), item.getSupplierName(), item.getArrivalDate()); }
    private MovementResponse movement(StockMovement item) { return new MovementResponse(item.getId(), item.getType(), item.getQuantityM2(), item.getReason(), item.getComment(), item.getOccurredAt()); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private String required(String value) { String result = trim(value); if (result == null) throw new IllegalArgumentException("A value is required."); return result; }
    private String upper(String value) { return required(value).toUpperCase(Locale.ROOT); }
}
