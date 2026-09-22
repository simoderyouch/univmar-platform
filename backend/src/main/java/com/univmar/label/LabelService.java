package com.univmar.label;

import com.univmar.common.api.ApiException;
import com.univmar.inventory.domain.InventoryItem;
import com.univmar.inventory.domain.InventoryItemRepository;
import com.univmar.label.api.LabelDtos.*;
import com.univmar.label.domain.*;
import com.univmar.slab.domain.StoneSlab;
import com.univmar.slab.domain.StoneSlabRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LabelService {
    private final InventoryLabelRepository labels; private final InventoryItemRepository inventory; private final StoneSlabRepository slabs; private final String scanBaseUrl;
    public LabelService(InventoryLabelRepository labels, InventoryItemRepository inventory, StoneSlabRepository slabs, @Value("${univmar.qr.scan-base-url:http://localhost:5173/scan}") String scanBaseUrl) { this.labels = labels; this.inventory = inventory; this.slabs = slabs; this.scanBaseUrl = scanBaseUrl.replaceAll("/$", ""); }
    public LabelResponse create(CreateInput input) { ensureTarget(input.targetType(), input.targetId()); InventoryLabel label = labels.findByTargetTypeAndTargetId(input.targetType(), input.targetId()).orElseGet(() -> labels.save(new InventoryLabel(input.targetType(), input.targetId()))); return response(label); }
    @Transactional(readOnly = true) public LabelResponse get(LabelTargetType targetType, UUID targetId) { return response(labels.findByTargetTypeAndTargetId(targetType, targetId).orElseThrow(() -> notFound("LABEL_NOT_FOUND", "No label has been issued for this record."))); }
    @Transactional(readOnly = true) public ScanResponse scan(String code) { InventoryLabel label = labels.findByLabelCode(code).orElseThrow(() -> notFound("LABEL_NOT_FOUND", "This QR label is not recognized.")); return label.getTargetType() == LabelTargetType.SLAB ? slabResult(label, slabs.findById(label.getTargetId()).orElseThrow(() -> notFound("SLAB_NOT_FOUND", "The labelled slab no longer exists."))) : inventoryResult(label, inventory.findById(label.getTargetId()).orElseThrow(() -> notFound("INVENTORY_NOT_FOUND", "The labelled inventory item no longer exists."))); }
    @Transactional(readOnly = true) public String qrPayload(String code) { InventoryLabel label = labels.findByLabelCode(code).orElseThrow(() -> notFound("LABEL_NOT_FOUND", "This QR label is not recognized.")); return scanBaseUrl + "?code=" + label.getLabelCode(); }
    private void ensureTarget(LabelTargetType type, UUID targetId) { if (type == LabelTargetType.SLAB) { if (!slabs.existsById(targetId)) throw notFound("SLAB_NOT_FOUND", "Slab was not found."); } else if (!inventory.existsById(targetId)) throw notFound("INVENTORY_NOT_FOUND", "Inventory item was not found."); }
    private LabelResponse response(InventoryLabel label) { String root = "/api/v1/labels/" + label.getLabelCode(); return new LabelResponse(label.getId(), label.getLabelCode(), label.getTargetType(), label.getTargetId(), root + "/qr.png", scanBaseUrl + "?code=" + label.getLabelCode(), label.getCreatedAt()); }
    private ScanResponse inventoryResult(InventoryLabel label, InventoryItem item) { var variant = item.getVariant(); return new ScanResponse(label.getLabelCode(), LabelTargetType.INVENTORY_ITEM, item.getLotNumber() == null ? "Inventory position" : "Lot " + item.getLotNumber(), variant.getMaterial().getName(), variant.getThicknessMm() + " mm · " + variant.getFinish(), item.getLotNumber(), item.getBundleNumber(), item.getWarehouse().getName(), item.getLocation().getCode(), "AVAILABLE " + item.getAvailableM2() + " m²", item.getOnHandM2(), item.getAvailableM2(), item.getReservedM2(), null, null, variant.getThicknessMm(), null, null, null, null); }
    private ScanResponse slabResult(InventoryLabel label, StoneSlab slab) { InventoryItem item = slab.getInventoryItem(); var variant = item.getVariant(); var order = slab.getReservedOrderItem() == null ? null : slab.getReservedOrderItem().getOrder(); return new ScanResponse(label.getLabelCode(), LabelTargetType.SLAB, slab.getSlabNumber(), variant.getMaterial().getName(), variant.getThicknessMm() + " mm · " + variant.getFinish(), item.getLotNumber(), item.getBundleNumber(), item.getWarehouse().getName(), item.getLocation().getCode(), slab.getStatus().name(), item.getOnHandM2(), item.getAvailableM2(), item.getReservedM2(), slab.getLengthMm(), slab.getWidthMm(), variant.getThicknessMm(), slab.getSurfaceAreaM2(), slab.getPhotoUrl(), order == null ? null : order.getNumber(), order == null ? null : order.getProject().getName()); }
    private ApiException notFound(String code, String message) { return new ApiException(HttpStatus.NOT_FOUND, code, message); }
}
