package com.univmar.quotation;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.customer.domain.CustomerAddress;
import com.univmar.customer.domain.CustomerAddressRepository;
import com.univmar.customer.domain.AddressType;
import com.univmar.inventory.domain.InventoryItem;
import com.univmar.inventory.domain.InventoryItemRepository;
import com.univmar.inventory.domain.MovementType;
import com.univmar.inventory.domain.StockMovementRepository;
import com.univmar.order.OrderService;
import com.univmar.order.domain.OrderRepository;
import com.univmar.order.domain.OrderAddressRepository;
import com.univmar.order.domain.OrderStatus;
import com.univmar.quotation.domain.*;
import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.rfq.domain.RfqStatus;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.api.ErrorCode;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class QuoteAcceptanceIntegrationTest {
    @Autowired
    private QuotationService service;
    @Autowired
    private UserRepository users;
    @Autowired
    private StoneMaterialRepository materials;
    @Autowired
    private StoneVariantRepository variants;
    @Autowired
    private InventoryItemRepository inventory;
    @Autowired
    private QuoteRequestRepository requests;
    @Autowired
    private CustomerAddressRepository addresses;
    @Autowired
    private QuotationRepository quotations;
    @Autowired
    private QuotationItemRepository quotationItems;
    @Autowired
    private OrderRepository orders;
    @Autowired
    private OrderAddressRepository orderAddresses;
    @Autowired
    private StockMovementRepository movements;
    @Autowired
    private OrderService orderService;

    @Test
    void acceptingAValidQuotationCreatesOneOrderAndReservesStock() {
        Fixture fixture = fixture("100.00", "80.00");

        var order = service.accept(fixture.quotation().getId(), fixture.customer().getId());

        InventoryItem reloaded = inventory.findById(fixture.inventoryItem().getId()).orElseThrow();
        assertThat(order.getOrderNumber()).startsWith("ORD-");
        assertThat(orders.existsByQuotationId(fixture.quotation().getId())).isTrue();
        assertThat(reloaded.getOnHandM2()).isEqualByComparingTo("100.00");
        assertThat(reloaded.getReservedM2()).isEqualByComparingTo("80.00");
        assertThat(reloaded.availableM2()).isEqualByComparingTo("20.00");
        assertThat(requests.findById(fixture.quotation().getRequest().getId()).orElseThrow().getStatus())
                .isEqualTo(RfqStatus.CLOSED);
        assertThat(movements.findTop50ByInventoryItemIdOrderByCreatedAtDesc(reloaded.getId()))
                .anyMatch(movement -> movement.getType() == MovementType.RESERVATION
                        && movement.getSourceOrderItem() != null);
    }

    @Test
    void insufficientStockCreatesNoOrderReservationOrMovement() {
        Fixture fixture = fixture("50.00", "80.00");

        assertThatThrownBy(() -> service.accept(fixture.quotation().getId(), fixture.customer().getId()))
                .isInstanceOf(ApiException.class)
                .satisfies(exception -> assertThat(((ApiException) exception).code()).isEqualTo(ErrorCode.INSUFFICIENT_STOCK));

        InventoryItem reloaded = inventory.findById(fixture.inventoryItem().getId()).orElseThrow();
        assertThat(orders.existsByQuotationId(fixture.quotation().getId())).isFalse();
        assertThat(reloaded.getReservedM2()).isEqualByComparingTo("0.00");
        assertThat(movements.findTop50ByInventoryItemIdOrderByCreatedAtDesc(reloaded.getId())).isEmpty();
    }

    @Test
    void deliveringAnOrderConsumesReservedStockExactlyOnce() {
        Fixture fixture = fixture("100.00", "80.00");
        var order = service.accept(fixture.quotation().getId(), fixture.customer().getId());

        orderService.transition(order.getId(), OrderStatus.PROCESSING, fixture.customer().getId());
        orderService.transition(order.getId(), OrderStatus.READY, fixture.customer().getId());
        orderService.transition(order.getId(), OrderStatus.COMPLETED, fixture.customer().getId());

        InventoryItem reloaded = inventory.findById(fixture.inventoryItem().getId()).orElseThrow();
        assertThat(reloaded.getOnHandM2()).isEqualByComparingTo("20.00");
        assertThat(reloaded.getReservedM2()).isEqualByComparingTo("0.00");
        assertThat(movements.findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc("ORDER", order.getId()))
                .anyMatch(movement -> movement.getType() == MovementType.ISSUE);
        assertThatThrownBy(() -> orderService.transition(order.getId(), OrderStatus.COMPLETED, fixture.customer().getId()))
                .isInstanceOf(ApiException.class)
                .satisfies(exception -> assertThat(((ApiException) exception).code()).isEqualTo(ErrorCode.INVALID_STATE_TRANSITION));
    }

    @Test
    void cancellingAnOrderReleasesItsReservationExactlyOnce() {
        Fixture fixture = fixture("100.00", "80.00");
        var order = service.accept(fixture.quotation().getId(), fixture.customer().getId());

        orderService.transition(order.getId(), OrderStatus.CANCELLED, fixture.customer().getId());

        InventoryItem reloaded = inventory.findById(fixture.inventoryItem().getId()).orElseThrow();
        assertThat(reloaded.getOnHandM2()).isEqualByComparingTo("100.00");
        assertThat(reloaded.getReservedM2()).isEqualByComparingTo("0.00");
        assertThat(movements.findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc("ORDER", order.getId()))
                .anyMatch(movement -> movement.getType() == MovementType.RESERVATION_RELEASED);
        assertThatThrownBy(() -> orderService.transition(order.getId(), OrderStatus.CANCELLED, fixture.customer().getId()))
                .isInstanceOf(ApiException.class)
                .satisfies(exception -> assertThat(((ApiException) exception).code()).isEqualTo(ErrorCode.INVALID_STATE_TRANSITION));
    }

    @Test
    void aDifferentCustomerCannotAcceptTheQuotation() {
        Fixture fixture = fixture("100.00", "80.00");
        User otherCustomer = users.save(new User("other-" + UUID.randomUUID() + "@example.com", "hash", Role.CUSTOMER));

        assertThatThrownBy(() -> service.accept(fixture.quotation().getId(), otherCustomer.getId()))
                .isInstanceOf(ApiException.class)
                .satisfies(exception -> assertThat(((ApiException) exception).code()).isEqualTo(ErrorCode.ACCESS_DENIED));
        assertThat(orders.existsByQuotationId(fixture.quotation().getId())).isFalse();
    }

    @Test
    void acceptingAQuotationCopiesAnOptionalBillingAddressSnapshot() {
        Fixture fixture = fixture("100.00", "80.00");
        addresses.save(new CustomerAddress(fixture.customer(), AddressType.BILLING, "Billing", "Accounts Team",
                null, "2 Finance Square", null, "Casablanca", null, "20000", "Morocco", "MA", false, true));

        var order = service.accept(fixture.quotation().getId(), fixture.customer().getId());

        assertThat(orderAddresses.findByOrderId(order.getId()))
                .extracting(address -> address.getType())
                .containsExactlyInAnyOrder(AddressType.DELIVERY, AddressType.BILLING);
    }

    private Fixture fixture(String onHand, String requested) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User customer = users.save(new User("customer-" + suffix + "@example.com", "hash", Role.CUSTOMER));
        addresses.save(new CustomerAddress(customer, "Delivery", "Test Customer", "+212600000000", "1 Stone Avenue", null, "Rabat", null, null, "Morocco", true));
        StoneMaterial material = materials.save(new StoneMaterial("Acceptance Stone " + suffix, "acceptance-stone-" + suffix, "Marble", "Morocco", "Beige", "Test material", "Walls"));
        StoneVariant variant = variants.save(new StoneVariant(material, "Poli", new BigDecimal("20.00"), "Test", new BigDecimal("100.00")));
        InventoryItem item = new InventoryItem(variant, new BigDecimal("10.00"));
        item.stockIn(new BigDecimal(onHand));
        item = inventory.save(item);
        QuoteRequest request = requests.save(new QuoteRequest(customer, "Acceptance test", LocalDate.now().plusDays(10)));
        request.submit();
        request.review(customer.getId());
        Quotation quotation = quotations.save(new Quotation(request, "QUO-TEST-" + suffix, LocalDate.now().plusDays(5), new BigDecimal(requested), BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal(requested)));
        quotation.send();
        requests.save(request);
        quotation = quotations.save(quotation);
        quotationItems.save(new QuotationItem(quotation, CommercialLineType.MATERIAL, variant, "Acceptance Stone / Poli / 20 mm", new BigDecimal(requested), UnitType.M2, BigDecimal.ONE, 0));
        return new Fixture(customer, quotation, item);
    }

    private record Fixture(User customer, Quotation quotation, InventoryItem inventoryItem) {
    }
}
