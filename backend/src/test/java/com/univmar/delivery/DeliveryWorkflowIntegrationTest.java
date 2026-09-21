package com.univmar.delivery;

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
import com.univmar.delivery.api.DeliveryDtos.CreateInput;
import com.univmar.delivery.api.DeliveryDtos.ItemInput;
import com.univmar.delivery.api.DeliveryDtos.Response;
import com.univmar.delivery.domain.DeliveryStatus;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.InventoryDetail;
import com.univmar.inventory.api.InventoryDtos.InventorySummary;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.ReceiptInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.inventory.domain.MovementType;
import com.univmar.order.OrderService;
import com.univmar.order.api.OrderDtos;
import com.univmar.order.domain.OrderStatus;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.ProjectInput;
import com.univmar.project.api.ProjectDtos.ProjectResponse;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.Input;
import com.univmar.quotation.api.QuotationDtos.Item;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class DeliveryWorkflowIntegrationTest {
    @Autowired private CatalogService catalog;
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private InventoryService inventory;
    @Autowired private QuotationService quotations;
    @Autowired private OrderService orders;
    @Autowired private DeliveryService deliveries;

    @Test
    void dispatches_partial_deliveries_and_consumes_only_the_dispatched_reservation() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MaterialDetail material = catalog.create(new MaterialInput("Delivery Ivory " + suffix, null, "DLV-" + suffix, StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("D" + suffix, "Delivery warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("A-01", "A"));
        InventorySummary stock = inventory.receive(new ReceiptInput(variant.id(), warehouse.id(), location.id(), "LOT-1", null, new BigDecimal("12.000"), null, null, LocalDate.now(), MovementType.INITIAL_STOCK, null));
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Delivery customer " + suffix, null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Delivery project " + suffix, null, null, null, null, null, null, null, ProjectStatus.LEAD, null));
        Input quoteInput = new Input(customer.id(), project.id(), null, LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("10.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20"))));
        var quote = quotations.send(quotations.create(quoteInput).id());
        OrderDtos.Response order = orders.confirm(orders.acceptQuotation(quote.id()).id());

        Response first = deliveries.create(new CreateInput(order.id(), LocalDate.now().plusDays(1), null, List.of(new ItemInput(order.items().get(0).id(), new BigDecimal("4.000")))));
        assertThat(first.status()).isEqualTo(DeliveryStatus.PLANNED);
        assertThat(deliveries.dispatch(deliveries.prepare(first.id()).id()).status()).isEqualTo(DeliveryStatus.DISPATCHED);
        InventoryDetail afterFirstDispatch = inventory.detail(stock.id());
        assertThat(afterFirstDispatch.inventory().onHandM2()).isEqualByComparingTo("8.000");
        assertThat(afterFirstDispatch.inventory().reservedM2()).isEqualByComparingTo("6.000");
        assertThat(afterFirstDispatch.movements()).extracting(movement -> movement.type()).contains(MovementType.ORDER_DELIVERY);
        assertThat(deliveries.confirmDelivered(first.id()).status()).isEqualTo(DeliveryStatus.DELIVERED);
        assertThat(orders.detail(order.id()).status()).isEqualTo(OrderStatus.PARTIALLY_DELIVERED);

        Response finalDelivery = deliveries.create(new CreateInput(order.id(), LocalDate.now().plusDays(2), null, List.of(new ItemInput(order.items().get(0).id(), new BigDecimal("6.000")))));
        deliveries.dispatch(finalDelivery.id());
        deliveries.confirmDelivered(finalDelivery.id());
        InventoryDetail afterFinalDelivery = inventory.detail(stock.id());
        assertThat(afterFinalDelivery.inventory().onHandM2()).isEqualByComparingTo("2.000");
        assertThat(afterFinalDelivery.inventory().reservedM2()).isEqualByComparingTo("0.000");
        assertThat(orders.detail(order.id()).status()).isEqualTo(OrderStatus.DELIVERED);
    }
}
