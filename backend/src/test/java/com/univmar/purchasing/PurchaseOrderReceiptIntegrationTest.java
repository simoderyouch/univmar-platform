package com.univmar.purchasing;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.domain.StoneType;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.purchasing.api.PurchaseOrderDtos.PurchaseItemInput;
import com.univmar.purchasing.api.PurchaseOrderDtos.PurchaseOrderDetail;
import com.univmar.purchasing.api.PurchaseOrderDtos.PurchaseOrderInput;
import com.univmar.purchasing.api.PurchaseOrderDtos.ReceiveGoodsInput;
import com.univmar.purchasing.domain.GoodsReceipt;
import com.univmar.purchasing.domain.GoodsReceiptRepository;
import com.univmar.supplier.SupplierService;
import com.univmar.supplier.api.SupplierDtos.SupplierInput;
import com.univmar.supplier.api.SupplierDtos.SupplierResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class PurchaseOrderReceiptIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private InventoryService inventory;
    @Autowired private SupplierService suppliers;
    @Autowired private PurchaseOrderService purchaseOrders;
    @Autowired private GoodsReceiptRepository receipts;

    @Test
    void receiving_a_purchase_order_keeps_the_exact_inventory_record_on_the_goods_receipt() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Receipt stone " + suffix, null, "REC-" + suffix, StoneType.MARBLE, null, null, null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), "Polished", "Slab"));
        SupplierResponse supplier = suppliers.create(new SupplierInput("Receipt supplier " + suffix, null, null, null, null, null, null, null, null, null));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("R" + suffix, "Receiving warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("R-01", "Receiving bay"));
        PurchaseOrderDetail created = purchaseOrders.create(new PurchaseOrderInput(supplier.id(), null, null, List.of(new PurchaseItemInput(variant.id(), new BigDecimal("3.000"), new BigDecimal("350.00"), null))));
        PurchaseOrderDetail nextCreated = purchaseOrders.create(new PurchaseOrderInput(supplier.id(), null, null, List.of(new PurchaseItemInput(variant.id(), new BigDecimal("1.000"), new BigDecimal("350.00"), null))));
        assertThat(created.number()).matches("PO-\\d{4}-\\d{6}");
        assertThat(nextCreated.number()).matches("PO-\\d{4}-\\d{6}").isNotEqualTo(created.number());
        PurchaseOrderDetail confirmed = purchaseOrders.confirm(created.id());

        PurchaseOrderDetail received = purchaseOrders.receive(confirmed.id(), new ReceiveGoodsInput(created.items().get(0).id(), warehouse.id(), location.id(), "LOT-RECEIPT", "BUNDLE-1", new BigDecimal("3.000"), null, "Verified at receiving"));

        var receiptResponse = received.items().get(0).receipts().get(0);
        GoodsReceipt storedReceipt = receipts.findById(receiptResponse.id()).orElseThrow();
        assertThat(receiptResponse.inventoryItemId()).isNotNull();
        assertThat(storedReceipt.getInventoryItem()).isNotNull();
        assertThat(storedReceipt.getInventoryItem().getId()).isEqualTo(receiptResponse.inventoryItemId());
    }
}
