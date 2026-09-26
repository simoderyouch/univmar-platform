package com.univmar.inventory;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.domain.StoneType;
import com.univmar.inventory.api.InventoryDtos.AdjustmentInput;
import com.univmar.inventory.api.InventoryDtos.InventoryDetail;
import com.univmar.inventory.api.InventoryDtos.InventorySummary;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.PhysicalRecountInput;
import com.univmar.inventory.api.InventoryDtos.ReceiptInput;
import com.univmar.inventory.api.InventoryDtos.TransferInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.inventory.domain.MovementType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class InventoryWorkflowIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private InventoryService inventory;

    @Test
    void receives_initial_stock_adjusts_damage_and_keeps_an_auditable_history() {
        MaterialDetail material = catalog.create(new MaterialInput(
                "Atlas Ivory", null, "TEST-ATLAS-IVORY", StoneType.MARBLE,
                "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(
                new BigDecimal("20.000"), "Honed", "Slab", "/uploads/atlas-ivory-honed.jpg", List.of("/uploads/atlas-ivory-honed-detail.jpg")));
        assertThat(variant.mainImageUrl()).isEqualTo("/uploads/atlas-ivory-honed.jpg");
        assertThat(variant.galleryImageUrls()).containsExactly("/uploads/atlas-ivory-honed-detail.jpg");
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("CASA", "Casablanca Warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("A-01", "A"));

        InventorySummary received = inventory.receive(new ReceiptInput(
                variant.id(), warehouse.id(), location.id(), "LOT-001", "BUNDLE-001",
                new BigDecimal("20.000"), new BigDecimal("450.00"), "Atlas Stone",
                LocalDate.of(2026, 9, 17), MovementType.INITIAL_STOCK, "Opening balance"));
        assertThat(received.onHandM2()).isEqualByComparingTo("20.000");
        assertThat(received.availableM2()).isEqualByComparingTo("20.000");
        assertThat(received.mainImageUrl()).isEqualTo("/uploads/atlas-ivory-honed.jpg");

        InventorySummary adjusted = inventory.adjust(received.id(), new AdjustmentInput(
                MovementType.DAMAGE, new BigDecimal("3.000"), "Cracked during handling", null));
        assertThat(adjusted.onHandM2()).isEqualByComparingTo("20.000");
        assertThat(adjusted.damagedM2()).isEqualByComparingTo("3.000");
        assertThat(adjusted.availableM2()).isEqualByComparingTo("17.000");

        InventorySummary recounted = inventory.recount(received.id(), new PhysicalRecountInput(new BigDecimal("19.000"), "Verified physical count", "One square metre measurement correction"));
        assertThat(recounted.onHandM2()).isEqualByComparingTo("19.000");
        assertThat(recounted.availableM2()).isEqualByComparingTo("16.000");

        LocationResponse transferLocation = inventory.createLocation(warehouse.id(), new LocationInput("B-01", "B"));
        var transfer = inventory.transfer(received.id(), new TransferInput(warehouse.id(), transferLocation.id(), new BigDecimal("5.000"), "Move to cutting rack", "Relocate matched lot and bundle"));
        assertThat(transfer.source().onHandM2()).isEqualByComparingTo("14.000");
        assertThat(transfer.destination().onHandM2()).isEqualByComparingTo("5.000");
        assertThat(transfer.destination().lotNumber()).isEqualTo("LOT-001");
        assertThat(transfer.destination().bundleNumber()).isEqualTo("BUNDLE-001");

        InventoryDetail detail = inventory.detail(received.id());
        assertThat(detail.movements()).extracting(movement -> movement.type())
                .contains(MovementType.DAMAGE, MovementType.PHYSICAL_RECOUNT_OUT, MovementType.LOCATION_TRANSFER_OUT, MovementType.INITIAL_STOCK);
    }
}
