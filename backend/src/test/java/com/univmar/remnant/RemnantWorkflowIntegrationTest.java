package com.univmar.remnant;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.*;
import com.univmar.customer.domain.CustomerType;
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
import com.univmar.remnant.api.RemnantDtos.*;
import com.univmar.remnant.domain.RemnantStatus;
import com.univmar.slab.SlabService;
import com.univmar.slab.api.SlabDtos.CreateInput;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class RemnantWorkflowIntegrationTest {
    @Autowired private CatalogService catalog; @Autowired private CustomerService customers; @Autowired private ProjectService projects; @Autowired private InventoryService inventory; @Autowired private QuotationService quotations; @Autowired private OrderService orders; @Autowired private SlabService slabs; @Autowired private RemnantService remnants;

    @Test
    void registers_a_reusable_offcut_and_releases_its_exact_reservation_when_an_order_is_cancelled() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Offcut Stone " + suffix, null, "OFF-" + suffix, StoneType.MARBLE, "Morocco", "Sand", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("R" + suffix, "Remnant warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("R-01", "Recovered stock"));
        InventorySummary received = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-R", null, new BigDecimal("3.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Offcut buyer " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Offcut project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input quotation = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("1.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        com.univmar.quotation.api.QuotationDtos.Response quote = quotations.send(quotations.create(quotation).id());
        Response order = orders.acceptQuotation(quote.id());
        com.univmar.slab.api.SlabDtos.Response parent = slabs.create(new CreateInput("PARENT-" + suffix, received.id(), new BigDecimal("1200"), new BigDecimal("1000"), null, null, null));

        com.univmar.remnant.api.RemnantDtos.Response remnant = remnants.create(new com.univmar.remnant.api.RemnantDtos.CreateInput("OFFCUT-" + suffix, parent.id(), new BigDecimal("900"), new BigDecimal("500"), null, "Recovered after a cut"));
        com.univmar.remnant.api.RemnantDtos.Response reserved = remnants.reserve(remnant.id(), new ReserveInput(order.items().get(0).id()));

        assertThat(reserved.status()).isEqualTo(RemnantStatus.RESERVED);
        assertThat(reserved.surfaceAreaM2()).isEqualByComparingTo("0.450");
        assertThat(reserved.reservedOrderNumber()).isEqualTo(order.number());
        orders.cancel(order.id());
        assertThat(remnants.detail(remnant.id()).status()).isEqualTo(RemnantStatus.AVAILABLE);
    }
}
