package com.univmar.slab;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.domain.Finish;
import com.univmar.catalog.domain.StoneType;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.CustomerInput;
import com.univmar.customer.api.CustomerDtos.CustomerResponse;
import com.univmar.customer.domain.CustomerType;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.InventorySummary;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.ReceiptInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.inventory.domain.MovementType;
import com.univmar.order.OrderService;
import com.univmar.order.api.OrderDtos.Response;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.ProjectInput;
import com.univmar.project.api.ProjectDtos.ProjectResponse;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.Input;
import com.univmar.quotation.api.QuotationDtos.Item;
import com.univmar.slab.api.SlabDtos.CreateInput;
import com.univmar.slab.api.SlabDtos.ReserveInput;
import com.univmar.slab.domain.SlabStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SlabWorkflowIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private InventoryService inventory;
    @Autowired private QuotationService quotations;
    @Autowired private OrderService orders;
    @Autowired private SlabService slabs;

    @Test
    void reserves_the_exact_slab_for_an_eligible_order_line_and_releases_it_with_the_order() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Slab Ivory " + suffix, null, "SLB-" + suffix, StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("S" + suffix, "Slab warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("S-01", "Slab rack"));
        InventorySummary received = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-S", null, new BigDecimal("2.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Slab buyer " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Slab project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input quoteInput = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("1.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        com.univmar.quotation.api.QuotationDtos.Response quote = quotations.send(quotations.create(quoteInput).id());
        Response order = orders.acceptQuotation(quote.id());

        com.univmar.slab.api.SlabDtos.Response slab = slabs.create(new CreateInput("SLAB-" + suffix, received.id(), new BigDecimal("1000"), new BigDecimal("900"), null, new BigDecimal("1000"), "First choice piece"));
        com.univmar.slab.api.SlabDtos.Response reserved = slabs.reserve(slab.id(), new ReserveInput(order.items().get(0).id()));

        assertThat(reserved.status()).isEqualTo(SlabStatus.RESERVED);
        assertThat(reserved.surfaceAreaM2()).isEqualByComparingTo("0.900");
        assertThat(reserved.reservedOrderNumber()).isEqualTo(order.number());

        orders.cancel(order.id());
        assertThat(slabs.detail(slab.id()).status()).isEqualTo(SlabStatus.AVAILABLE);
    }
}
