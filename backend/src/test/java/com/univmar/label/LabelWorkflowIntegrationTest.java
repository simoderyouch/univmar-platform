package com.univmar.label;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.domain.Finish;
import com.univmar.catalog.domain.StoneType;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.InventorySummary;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.ReceiptInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.inventory.domain.MovementType;
import com.univmar.label.api.LabelDtos.CreateInput;
import com.univmar.label.api.LabelDtos.LabelResponse;
import com.univmar.label.api.LabelDtos.ScanResponse;
import com.univmar.label.domain.LabelTargetType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class LabelWorkflowIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private InventoryService inventory;
    @Autowired private LabelService labels;

    @Test
    void issues_a_stable_qr_label_and_resolves_its_live_inventory_context() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Label Stone " + suffix, null, "LBL-" + suffix, StoneType.MARBLE, "Morocco", "Sand", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("30.000"), Finish.POLISHED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("L" + suffix, "Label warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("L-01", "Labels"));
        InventorySummary received = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-LABEL", "BUNDLE-1", new BigDecimal("4.500"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));

        LabelResponse issued = labels.create(new CreateInput(LabelTargetType.INVENTORY_ITEM, received.id()));
        LabelResponse repeated = labels.create(new CreateInput(LabelTargetType.INVENTORY_ITEM, received.id()));
        ScanResponse scanned = labels.scan(issued.code());

        assertThat(repeated.code()).isEqualTo(issued.code());
        assertThat(issued.scanUrl()).contains("code=" + issued.code());
        assertThat(scanned.targetType()).isEqualTo(LabelTargetType.INVENTORY_ITEM);
        assertThat(scanned.materialName()).isEqualTo(material.name());
        assertThat(scanned.locationCode()).isEqualTo("L-01");
        assertThat(scanned.availableM2()).isEqualByComparingTo("4.500");
    }
}
