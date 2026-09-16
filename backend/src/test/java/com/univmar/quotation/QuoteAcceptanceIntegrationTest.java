package com.univmar.quotation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.inventory.domain.InventoryItem;
import com.univmar.inventory.domain.InventoryItemRepository;
import com.univmar.inventory.domain.MovementType;
import com.univmar.inventory.domain.StockMovementRepository;
import com.univmar.order.OrderService;
import com.univmar.order.domain.OrderRepository;
import com.univmar.order.domain.OrderStatus;
import com.univmar.quotation.domain.Quotation;
import com.univmar.quotation.domain.QuotationItem;
import com.univmar.quotation.domain.QuotationItemRepository;
import com.univmar.quotation.domain.QuotationLineType;
import com.univmar.quotation.domain.QuotationRepository;
import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.api.ErrorCode;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class QuoteAcceptanceIntegrationTest {
    @Autowired private QuotationService service;
    @Autowired private UserRepository users;
    @Autowired private StoneMaterialRepository materials;
    @Autowired private StoneVariantRepository variants;
    @Autowired private InventoryItemRepository inventory;
    @Autowired private QuoteRequestRepository requests;
    @Autowired private QuotationRepository quotations;
    @Autowired private QuotationItemRepository quotationItems;
    @Autowired private OrderRepository orders;
    @Autowired private StockMovementRepository movements;
    @Autowired private OrderService orderService;

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
        assertThat(movements.findTop50ByInventoryItemIdOrderByCreatedAtDesc(reloaded.getId()))
                .anyMatch(movement -> movement.getType() == MovementType.RESERVATION);
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

        orderService.transition(order.getId(), OrderStatus.PREPARING, fixture.customer().getId());
        orderService.transition(order.getId(), OrderStatus.READY, fixture.customer().getId());
        orderService.transition(order.getId(), OrderStatus.DELIVERED, fixture.customer().getId());

        InventoryItem reloaded = inventory.findById(fixture.inventoryItem().getId()).orElseThrow();
        assertThat(reloaded.getOnHandM2()).isEqualByComparingTo("20.00");
        assertThat(reloaded.getReservedM2()).isEqualByComparingTo("0.00");
        assertThat(movements.findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc("ORDER", order.getId()))
                .anyMatch(movement -> movement.getType() == MovementType.SALE);
        assertThatThrownBy(() -> orderService.transition(order.getId(), OrderStatus.DELIVERED, fixture.customer().getId()))
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

    private Fixture fixture(String onHand, String requested) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User customer = users.save(new User("customer-" + suffix + "@example.com", "hash", Role.CUSTOMER));
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
        quotation = quotations.save(quotation);
        quotationItems.save(new QuotationItem(quotation, QuotationLineType.MATERIAL, variant, "Acceptance Stone / Poli / 20 mm", new BigDecimal(requested), BigDecimal.ONE));
        return new Fixture(customer, quotation, item);
    }

    private record Fixture(User customer, Quotation quotation, InventoryItem inventoryItem) { }
}
