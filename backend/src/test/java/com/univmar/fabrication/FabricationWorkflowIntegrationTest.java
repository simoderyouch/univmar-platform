package com.univmar.fabrication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.common.api.ApiException;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.*;
import com.univmar.customer.domain.CustomerType;
import com.univmar.fabrication.api.FabricationDtos.*;
import com.univmar.fabrication.domain.*;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.*;
import com.univmar.inventory.domain.MovementType;
import com.univmar.order.OrderService;
import com.univmar.order.api.OrderDtos.Response;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.*;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class FabricationWorkflowIntegrationTest {
    @Autowired private CatalogService catalog; @Autowired private CustomerService customers; @Autowired private ProjectService projects; @Autowired private InventoryService inventory; @Autowired private QuotationService quotations; @Autowired private OrderService orders; @Autowired private FabricationService fabrication;

    @Test
    void tracks_an_order_from_measurement_to_ready_with_assigned_material_and_operations() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new com.univmar.catalog.api.CatalogDtos.MaterialInput("Workshop Stone " + suffix, null, "FAB-" + suffix, StoneType.MARBLE, "Morocco", "White", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.POLISHED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("F" + suffix, "Fabrication warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("F-01", "Workshop rack"));
        InventorySummary received = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-F", null, new BigDecimal("5.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Workshop buyer " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Workshop project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input quotation = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Polished", new BigDecimal("2.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        com.univmar.quotation.api.QuotationDtos.Response quote = quotations.send(quotations.create(quotation).id());
        Response order = orders.acceptQuotation(quote.id());

        com.univmar.fabrication.api.FabricationDtos.Response job = fabrication.create(new CreateInput(order.id(), "Lobby vanity tops", FabricationPriority.HIGH, LocalDate.now().plusDays(5), "Verify sink-centre dimensions", "https://example.test/drawing.pdf", null, List.of(new OperationInput(FabricationOperationType.CUTTING, null), new OperationInput(FabricationOperationType.POLISHING, null), new OperationInput(FabricationOperationType.QUALITY_CHECK, null))));
        assertThat(job.status()).isEqualTo(FabricationStatus.MEASUREMENT);
        assertThatThrownBy(() -> fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.CUTTING))).isInstanceOf(ApiException.class);

        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.DRAWING));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.MATERIAL_ALLOCATED));
        fabrication.assignMaterial(job.id(), new com.univmar.fabrication.api.FabricationDtos.MaterialInput(FabricationMaterialType.INVENTORY_ITEM, received.id(), "Reserved selection"));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.CUTTING));
        for (Operation operation : fabrication.detail(job.id()).operations()) fabrication.completeOperation(job.id(), operation.id());
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.FINISHING));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.QUALITY_CONTROL));
        com.univmar.fabrication.api.FabricationDtos.Response ready = fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.READY));

        assertThat(ready.status()).isEqualTo(FabricationStatus.READY);
        assertThat(ready.readyAt()).isNotNull();
        assertThat(ready.materials()).singleElement().satisfies(assigned -> assertThat(assigned.materialType()).isEqualTo(FabricationMaterialType.INVENTORY_ITEM));
        assertThat(ready.operations()).allSatisfy(operation -> assertThat(operation.status()).isEqualTo(FabricationOperationStatus.COMPLETED));
    }
}
