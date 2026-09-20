package com.univmar.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.*;
import com.univmar.catalog.domain.*;
import com.univmar.common.api.ApiException;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.CustomerInput;
import com.univmar.customer.api.CustomerDtos.CustomerResponse;
import com.univmar.customer.domain.CustomerType;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.*;
import com.univmar.inventory.domain.MovementType;
import com.univmar.order.api.OrderDtos.Response;
import com.univmar.order.domain.OrderStatus;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.*;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.*;
import com.univmar.quotation.domain.QuotationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class OrderReservationIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private InventoryService inventory;
    @Autowired private QuotationService quotations;
    @Autowired private OrderService orders;

    @Test
    void accepts_a_quotation_atomically_reserves_stock_and_releases_it_on_cancellation() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Reservation Ivory " + suffix, null, "RES-" + suffix, StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("W" + suffix, "Reservation warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("A-01", "A"));
        InventorySummary received = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-1", null, new BigDecimal("12.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Atlas " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input input = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("10.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        com.univmar.quotation.api.QuotationDtos.Response quote = quotations.send(quotations.create(input).id());

        Response order = orders.acceptQuotation(quote.id());
        assertThat(order.status()).isEqualTo(OrderStatus.PENDING);
        assertThat(order.items()).singleElement().satisfies(item -> assertThat(item.reservations()).singleElement().satisfies(reservation -> assertThat(reservation.quantityM2()).isEqualByComparingTo("10.000")));
        assertThat(inventory.detail(received.id()).inventory().reservedM2()).isEqualByComparingTo("10.000");
        assertThat(quotations.detail(quote.id()).status()).isEqualTo(QuotationStatus.ACCEPTED);
        assertThatThrownBy(() -> orders.acceptQuotation(quote.id())).isInstanceOf(ApiException.class);

        Input tooLarge = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("3.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        com.univmar.quotation.api.QuotationDtos.Response insufficient = quotations.send(quotations.create(tooLarge).id());
        assertThatThrownBy(() -> orders.acceptQuotation(insufficient.id())).isInstanceOf(ApiException.class);
        assertThat(quotations.detail(insufficient.id()).status()).isEqualTo(QuotationStatus.SENT);
        assertThat(inventory.detail(received.id()).inventory().reservedM2()).isEqualByComparingTo("10.000");

        Response cancelled = orders.cancel(order.id());
        assertThat(cancelled.status()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(inventory.detail(received.id()).inventory().reservedM2()).isEqualByComparingTo("0.000");
    }
}
