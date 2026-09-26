package com.univmar.workflow;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.MaterialCategoryService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.api.MaterialCategoryDtos;
import com.univmar.common.storage.ImageStorage;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.CustomerInput;
import com.univmar.customer.domain.CustomerType;
import com.univmar.delivery.DeliveryService;
import com.univmar.delivery.api.DeliveryDtos.ItemInput;
import com.univmar.delivery.domain.DeliveryStatus;
import com.univmar.fabrication.FabricationService;
import com.univmar.fabrication.api.FabricationDtos.AdvanceInput;
import com.univmar.fabrication.domain.FabricationMaterialType;
import com.univmar.fabrication.domain.FabricationStatus;
import com.univmar.invoice.InvoiceService;
import com.univmar.invoice.api.InvoiceDtos.PaymentInput;
import com.univmar.invoice.domain.InvoiceStatus;
import com.univmar.invoice.domain.PaymentMethod;
import com.univmar.inventory.InventoryService;
import com.univmar.inventory.api.InventoryDtos.LocationInput;
import com.univmar.inventory.api.InventoryDtos.LocationResponse;
import com.univmar.inventory.api.InventoryDtos.WarehouseInput;
import com.univmar.inventory.api.InventoryDtos.WarehouseResponse;
import com.univmar.order.OrderService;
import com.univmar.order.domain.OrderStatus;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.ProjectInput;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.purchasing.PurchaseOrderService;
import com.univmar.purchasing.api.PurchaseOrderDtos.PurchaseItemInput;
import com.univmar.purchasing.api.PurchaseOrderDtos.PurchaseOrderInput;
import com.univmar.purchasing.api.PurchaseOrderDtos.ReceiveGoodsInput;
import com.univmar.purchasing.domain.PurchaseOrderStatus;
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.Input;
import com.univmar.quotation.api.QuotationDtos.Item;
import com.univmar.rfq.RfqService;
import com.univmar.rfq.api.RfqDtos.RfqInput;
import com.univmar.rfq.api.RfqDtos.RfqItemInput;
import com.univmar.rfq.domain.RfqStatus;
import com.univmar.remnant.RemnantService;
import com.univmar.remnant.api.RemnantDtos.ReserveInput;
import com.univmar.remnant.domain.RemnantStatus;
import com.univmar.slab.SlabService;
import com.univmar.slab.api.SlabDtos;
import com.univmar.supplier.SupplierService;
import com.univmar.supplier.api.SupplierDtos.SupplierInput;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class MainBusinessWorkflowIntegrationTest {
    @Autowired private MaterialCategoryService categories;
    @Autowired private CatalogService catalog;
    @Autowired private ImageStorage images;
    @Autowired private SupplierService suppliers;
    @Autowired private PurchaseOrderService purchaseOrders;
    @Autowired private InventoryService inventory;
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private RfqService rfqs;
    @Autowired private QuotationService quotations;
    @Autowired private OrderService orders;
    @Autowired private SlabService slabs;
    @Autowired private RemnantService remnants;
    @Autowired private FabricationService fabrication;
    @Autowired private DeliveryService deliveries;
    @Autowired private InvoiceService invoices;

    @Test
    void completes_the_operational_stone_sales_workflow_with_persisted_records() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        MaterialCategoryDtos.Response category = categories.create(
                new MaterialCategoryDtos.Input("Acceptance stone " + suffix, "acceptance-" + suffix, 99999, true, false));
        MaterialDetail material = catalog.create(new MaterialInput(
                "Acceptance Calacatta " + suffix, "Acceptance Calacatta", "AT-" + suffix,
                category.id(), null, "Italy", "White", "Veined", "Acceptance-test material", "Countertops"));
        ImageStorage.UploadedImage uploadedImage = images.store(new MockMultipartFile(
                "file", "acceptance-" + suffix + ".png", "image/png", new byte[] {1, 2, 3, 4}));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(
                new BigDecimal("20.000"), "Polished", "Slab", uploadedImage.url(), List.of(uploadedImage.url())));
        assertThat(catalog.get(material.id()).variants()).singleElement().satisfies(saved -> {
            assertThat(saved.mainImageUrl()).isEqualTo(uploadedImage.url());
            assertThat(saved.galleryImageUrls()).containsExactly(uploadedImage.url());
        });

        var supplier = suppliers.create(new SupplierInput("Acceptance supplier " + suffix, null, "Italy", null, null, null, null, null, null, null));
        WarehouseResponse warehouse = inventory.createWarehouse(new WarehouseInput("AT" + suffix, "Acceptance warehouse"));
        LocationResponse location = inventory.createLocation(warehouse.id(), new LocationInput("A-01", "Acceptance rack"));
        var purchaseOrder = purchaseOrders.create(new PurchaseOrderInput(supplier.id(), LocalDate.now(), "Acceptance replenishment", List.of(
                new PurchaseItemInput(variant.id(), new BigDecimal("3.000"), new BigDecimal("450.00"), null))));
        purchaseOrders.confirm(purchaseOrder.id());
        var received = purchaseOrders.receive(purchaseOrder.id(), new ReceiveGoodsInput(
                purchaseOrder.items().get(0).id(), warehouse.id(), location.id(), "LOT-" + suffix, "BUNDLE-" + suffix,
                new BigDecimal("3.000"), null, "Acceptance receipt"));
        var receipt = received.items().get(0).receipts().get(0);
        assertThat(received.status()).isEqualTo(PurchaseOrderStatus.RECEIVED);
        assertThat(receipt.inventoryItemId()).isNotNull();

        var slab = slabs.create(new SlabDtos.CreateInput("SLAB-" + suffix, receipt.inventoryItemId(),
                new BigDecimal("1200"), new BigDecimal("1000"), uploadedImage.url(), new BigDecimal("540.00"), "Accepted slab"));
        var offcut = remnants.create(new com.univmar.remnant.api.RemnantDtos.CreateInput("OFFCUT-" + suffix, slab.id(),
                new BigDecimal("900"), new BigDecimal("500"), uploadedImage.url(), "Reusable acceptance offcut"));
        assertThat(slabs.detail(slab.id()).remainingSurfaceAreaM2()).isEqualByComparingTo("0.750");

        var customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Acceptance customer " + suffix, null, null, null, null, List.of(), List.of()));
        var project = projects.create(new ProjectInput(customer.id(), "Acceptance project " + suffix, "Casablanca", "Residential", null,
                null, null, LocalDate.now().plusDays(14), null, ProjectStatus.LEAD, null));
        var submittedRfq = rfqs.submit(rfqs.create(new RfqInput(customer.id(), project.id(), LocalDate.now().plusDays(14), "Casablanca", "Acceptance requirement", List.of(
                new RfqItemInput(material.id(), variant.id(), new BigDecimal("1.500"), "m²", "150 × 100 cm", "Polishing", null)))).id());
        var reviewedRfq = rfqs.startReview(submittedRfq.id());
        assertThat(reviewedRfq.status()).isEqualTo(RfqStatus.UNDER_REVIEW);

        var sentQuotation = quotations.send(quotations.create(new Input(customer.id(), project.id(), reviewedRfq.id(),
                LocalDate.now().plusDays(7), BigDecimal.ZERO, "Due on delivery", "Acceptance quote", List.of(
                new Item(variant.id(), material.name(), "20 mm · Polished", new BigDecimal("1.500"), new BigDecimal("1000.00"), BigDecimal.ZERO, new BigDecimal("20.00"))))).id());
        assertThat(rfqs.detail(reviewedRfq.id()).status()).isEqualTo(RfqStatus.QUOTED);

        var order = orders.confirm(orders.acceptQuotation(sentQuotation.id()).id());
        assertThat(order.status()).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(order.items()).singleElement().satisfies(line -> assertThat(line.reservations()).singleElement()
                .satisfies(reservation -> assertThat(reservation.quantityM2()).isEqualByComparingTo("1.500")));
        var reservedOffcut = remnants.reserve(offcut.id(), new ReserveInput(order.items().get(0).id()));
        assertThat(reservedOffcut.status()).isEqualTo(RemnantStatus.RESERVED);

        var job = fabrication.create(new com.univmar.fabrication.api.FabricationDtos.CreateInput(order.id(), "Acceptance fabrication", null, LocalDate.now().plusDays(7),
                "Confirmed dimensions", null, null, List.of()));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.DRAWING));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.MATERIAL_ALLOCATED));
        fabrication.assignMaterial(job.id(), new com.univmar.fabrication.api.FabricationDtos.MaterialInput(FabricationMaterialType.INVENTORY_ITEM, receipt.inventoryItemId(),
                new BigDecimal("0.250"), "Workshop allowance"));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.CUTTING));
        fabrication.detail(job.id()).operations().forEach(operation -> fabrication.completeOperation(job.id(), operation.id()));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.FINISHING));
        fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.QUALITY_CONTROL));
        assertThat(fabrication.advance(job.id(), new AdvanceInput(FabricationStatus.READY)).status()).isEqualTo(FabricationStatus.READY);

        var delivery = deliveries.create(new com.univmar.delivery.api.DeliveryDtos.CreateInput(order.id(), LocalDate.now(), "Acceptance dispatch", List.of(
                new ItemInput(order.items().get(0).id(), new BigDecimal("1.500")))));
        assertThat(deliveries.dispatch(deliveries.prepare(delivery.id()).id()).status()).isEqualTo(DeliveryStatus.DISPATCHED);
        assertThat(deliveries.confirmDelivered(delivery.id()).status()).isEqualTo(DeliveryStatus.DELIVERED);
        assertThat(orders.detail(order.id()).status()).isEqualTo(OrderStatus.DELIVERED);
        assertThat(remnants.detail(offcut.id()).status()).isEqualTo(RemnantStatus.CONSUMED);

        var issuedInvoice = invoices.issue(invoices.create(order.id(), new com.univmar.invoice.api.InvoiceDtos.CreateInput(
                LocalDate.now().plusDays(30), "Acceptance invoice")).id());
        assertThat(issuedInvoice.status()).isEqualTo(InvoiceStatus.ISSUED);
        var paidInvoice = invoices.recordPayment(issuedInvoice.id(), new PaymentInput(LocalDate.now(), issuedInvoice.grandTotal(),
                PaymentMethod.BANK_TRANSFER, "AT-" + suffix, "Acceptance payment"));
        assertThat(paidInvoice.status()).isEqualTo(InvoiceStatus.PAID);
        assertThat(paidInvoice.outstandingTotal()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(paidInvoice.payments()).singleElement().satisfies(payment -> assertThat(payment.amount()).isEqualByComparingTo(issuedInvoice.grandTotal()));
    }
}
