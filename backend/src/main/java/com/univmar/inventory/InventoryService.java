package com.univmar.inventory;

import com.univmar.audit.AuditService;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.inventory.api.InventoryDtos;
import com.univmar.inventory.domain.*;
import com.univmar.shared.api.ApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventoryService {
    private final InventoryItemRepository items;
    private final StoneVariantRepository variants;
    private final StockMovementRepository movements;
    private final AuditService audit;

    public InventoryService(InventoryItemRepository items, StoneVariantRepository variants, StockMovementRepository movements, AuditService audit) {
        this.items = items;
        this.variants = variants;
        this.movements = movements;
        this.audit = audit;
    }

    @Transactional
    public InventoryDtos.ItemResponse create(InventoryDtos.CreateItemRequest request) {
        if (items.findByVariantId(request.variantId()).isPresent())
            throw ApiException.conflict("DUPLICATE_INVENTORY", "Inventory already exists for this variant");
        InventoryItem item = items.save(new InventoryItem(variants.findById(request.variantId()).orElseThrow(() -> ApiException.notFound("Variant")), request.minStockM2()));
        return response(item);
    }

    @Transactional
    public InventoryDtos.ItemResponse update(Long id, InventoryDtos.UpdateItemRequest request, Long actorId) {
        InventoryItem item = find(id);
        item.updateMinStock(request.minStockM2());
        audit.record(actorId, "INVENTORY_MIN_STOCK_UPDATED", "INVENTORY_ITEM", id, "Minimum stock updated");
        return response(item);
    }

    @Transactional
    public void archive(Long id, Long actorId) {
        InventoryItem item = find(id);
        item.archive();
        audit.record(actorId, "INVENTORY_ARCHIVED", "INVENTORY_ITEM", id, "Inventory item archived");
    }

    @Transactional
    public InventoryDtos.ItemResponse stockIn(Long id, InventoryDtos.MovementRequest request, Long actorId) {
        InventoryItem item = find(id);
        item.stockIn(request.quantityM2());
        movements.save(new StockMovement(item, MovementType.RECEIPT, request.quantityM2(), "INVENTORY_ITEM", item.getId(), request.reason(), actorId));
        audit.record(actorId, "INVENTORY_STOCK_IN", "INVENTORY_ITEM", id, request.reason());
        return response(item);
    }

    @Transactional
    public InventoryDtos.ItemResponse returnIn(Long id, InventoryDtos.MovementRequest request, Long actorId) {
        InventoryItem item = find(id);
        item.stockIn(request.quantityM2());
        movements.save(new StockMovement(item, MovementType.RETURN_IN, request.quantityM2(), "INVENTORY_ITEM", item.getId(), request.reason(), actorId));
        audit.record(actorId, "INVENTORY_RETURN_IN", "INVENTORY_ITEM", id, request.reason());
        return response(item);
    }

    @Transactional
    public InventoryDtos.ItemResponse adjust(Long id, InventoryDtos.AdjustmentRequest request, Long actorId) {
        if (request.quantityM2().compareTo(BigDecimal.ZERO) == 0)
            throw ApiException.conflict("INVALID_INVENTORY_ADJUSTMENT", "Adjustment must be non-zero");
        InventoryItem item = find(id);
        item.adjust(request.quantityM2());
        movements.save(new StockMovement(item, request.quantityM2().signum() > 0 ? MovementType.ADJUSTMENT_IN : MovementType.ADJUSTMENT_OUT, request.quantityM2().abs(), "INVENTORY_ITEM", item.getId(), request.reason(), actorId));
        audit.record(actorId, "INVENTORY_ADJUSTED", "INVENTORY_ITEM", id, request.reason());
        return response(item);
    }

    @Transactional(readOnly = true)
    public InventoryDtos.ItemResponse get(Long id) {
        return response(find(id));
    }

    @Transactional(readOnly = true)
    public Page<InventoryDtos.ItemResponse> list(Pageable pageable) {
        return items.findByActiveTrue(pageable).map(this::response);
    }

    @Transactional(readOnly = true)
    public Page<InventoryDtos.ItemResponse> lowStock(Pageable pageable) {
        return items.findLowStock(pageable).map(this::response);
    }

    @Transactional(readOnly = true)
    public List<InventoryDtos.MovementResponse> movements(Long id) {
        find(id);
        return movements.findTop50ByInventoryItemIdOrderByCreatedAtDesc(id).stream().map(x -> new InventoryDtos.MovementResponse(x.getId(), x.getType().name(), x.getQuantityM2(), x.getReferenceType(), x.getReferenceId(), x.getReason(), x.getActorId(), x.getSourceOrderItem() == null ? null : x.getSourceOrderItem().getId(), x.getCreatedAt())).toList();
    }

    private InventoryItem find(Long id) {
        return items.findById(id).orElseThrow(() -> ApiException.notFound("Inventory item"));
    }

    private InventoryDtos.ItemResponse response(InventoryItem item) {
        return new InventoryDtos.ItemResponse(item.getId(), item.getVariant().getId(), item.getOnHandM2(), item.getReservedM2(), item.availableM2(), item.getMinStockM2(), item.isActive());
    }
}
