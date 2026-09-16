package com.univmar.quotation;

import com.univmar.audit.AuditService;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.customer.domain.AddressType;
import com.univmar.customer.domain.CustomerAddressRepository;
import com.univmar.customer.domain.CustomerProfileRepository;
import com.univmar.inventory.domain.*;
import com.univmar.order.domain.*;
import com.univmar.quotation.api.QuotationDtos;
import com.univmar.quotation.domain.*;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.rfq.domain.RfqStatus;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.api.ErrorCode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QuotationService {
    private final QuotationRepository quotes;
    private final QuotationItemRepository quoteItems;
    private final QuoteRequestRepository requests;
    private final StoneVariantRepository variants;
    private final InventoryItemRepository inventory;
    private final OrderRepository orders;
    private final OrderItemRepository orderItems;
    private final OrderAddressRepository orderAddresses;
    private final CustomerAddressRepository customerAddresses;
    private final CustomerProfileRepository customerProfiles;
    private final InventoryReservationRepository reservations;
    private final StockMovementRepository movements;
    private final AuditService audit;

    public QuotationService(QuotationRepository quotes, QuotationItemRepository quoteItems, QuoteRequestRepository requests, StoneVariantRepository variants, InventoryItemRepository inventory, OrderRepository orders, OrderItemRepository orderItems, OrderAddressRepository orderAddresses, CustomerAddressRepository customerAddresses, CustomerProfileRepository customerProfiles, InventoryReservationRepository reservations, StockMovementRepository movements, AuditService audit) {
        this.quotes = quotes;
        this.quoteItems = quoteItems;
        this.requests = requests;
        this.variants = variants;
        this.inventory = inventory;
        this.orders = orders;
        this.orderItems = orderItems;
        this.orderAddresses = orderAddresses;
        this.customerAddresses = customerAddresses;
        this.customerProfiles = customerProfiles;
        this.reservations = reservations;
        this.movements = movements;
        this.audit = audit;
    }

    @Transactional
    public QuotationDtos.Response create(QuotationDtos.Create input) {
        return response(createQuote(input, null, 1));
    }

    @Transactional
    public QuotationDtos.Detail revise(Long id, QuotationDtos.Create input, Long actorId) {
        Quotation original = find(id);
        if (original.getStatus() == QuotationStatus.ACCEPTED)
            throw ApiException.conflict("INVALID_STATE_TRANSITION", "An accepted quotation cannot be revised");
        if (!original.getRequest().getId().equals(input.requestId()))
            throw ApiException.conflict("INVALID_REVISION", "A revision must use the same RFQ");
        try {
            original.supersede();
        } catch (IllegalStateException e) {
            throw ApiException.conflict("INVALID_STATE_TRANSITION", e.getMessage());
        }
        Quotation revision = createQuote(input, original, original.getRevisionNumber() + 1);
        audit.record(actorId, "QUOTATION_REVISED", "QUOTATION", revision.getId(), "Revision of quotation " + original.getId());
        return detail(revision);
    }

    @Transactional
    public QuotationDtos.Response send(Long id, Long actorId) {
        Quotation quote = find(id);
        try {
            quote.send();
        } catch (IllegalStateException e) {
            throw ApiException.conflict("INVALID_STATE_TRANSITION", e.getMessage());
        }
        audit.record(actorId, "QUOTATION_SENT", "QUOTATION", id, "Sent " + quote.getQuoteNumber());
        return response(quote);
    }

    @Transactional
    public QuotationDtos.Detail reject(Long id, Long customerId) {
        Quotation quote = owned(id, customerId);
        try {
            quote.reject();
        } catch (IllegalStateException e) {
            throw ApiException.conflict("INVALID_STATE_TRANSITION", e.getMessage());
        }
        audit.record(customerId, "QUOTATION_REJECTED", "QUOTATION", id, "Rejected by customer");
        return detail(quote);
    }

    @Transactional
    public QuotationDtos.Detail expire(Long id, Long actorId) {
        Quotation quote = find(id);
        quote.expire();
        audit.record(actorId, "QUOTATION_EXPIRED", "QUOTATION", id, "Expired by staff");
        return detail(quote);
    }

    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void expirePastDue() {
        for (Quotation quote : quotes.findByStatusAndValidUntilBefore(QuotationStatus.SENT, LocalDate.now())) {
            quote.expire();
            audit.record(null, "QUOTATION_AUTO_EXPIRED", "QUOTATION", quote.getId(), "Validity date passed");
        }
    }

    @Transactional(readOnly = true)
    public List<QuotationDtos.Detail> mine(Long customerId) {
        return quotes.findByRequestCustomerIdOrderByCreatedAtDesc(customerId).stream().map(this::detail).toList();
    }

    @Transactional(readOnly = true)
    public QuotationDtos.Detail mineDetail(Long id, Long customerId) {
        return detail(owned(id, customerId));
    }

    @Transactional(readOnly = true)
    public List<QuotationDtos.Detail> sales() {
        return quotes.findAll().stream().map(this::detail).toList();
    }

    @Transactional(readOnly = true)
    public QuotationDtos.Detail salesDetail(Long id) {
        return detail(find(id));
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Order accept(Long quoteId, Long customerId) {
        Quotation quote = quotes.findOwnedForAcceptance(quoteId, customerId).orElseThrow(ApiException::forbidden);
        if (quote.getStatus() != QuotationStatus.SENT)
            throw ApiException.conflict("INVALID_STATE_TRANSITION", "Only a sent quotation can be accepted");
        if (quote.getValidUntil().isBefore(LocalDate.now()))
            throw ApiException.conflict("QUOTATION_EXPIRED", "Quotation has expired");
        if (orders.existsByQuotationId(quoteId))
            throw ApiException.conflict("DUPLICATE_ORDER", "An order already exists for this quotation");
        List<QuotationItem> lines = quoteItems.findByQuotationId(quoteId);
        Map<Long, BigDecimal> needed = new LinkedHashMap<>();
        for (QuotationItem line : lines)
            if (line.getType() == CommercialLineType.MATERIAL) {
                if (line.getVariant() == null)
                    throw ApiException.conflict("INVALID_QUOTATION", "A material line must identify a variant");
                if (!line.getVariant().isActive() || !line.getVariant().getMaterial().isActive())
                    throw ApiException.conflict("INACTIVE_MATERIAL", "A quoted material is no longer active");
                needed.merge(line.getVariant().getId(), line.getQuantity(), BigDecimal::add);
            }
        Map<Long, InventoryItem> stock = new LinkedHashMap<>();
        for (var required : needed.entrySet()) {
            InventoryItem item = inventory.findForReservationByVariantId(required.getKey()).orElseThrow(() -> ApiException.conflict("INSUFFICIENT_STOCK", "No inventory exists for a quoted material"));
            if (item.availableM2().compareTo(required.getValue()) < 0)
                throw ApiException.conflict("INSUFFICIENT_STOCK", "Insufficient available stock for " + item.getVariant().getMaterial().getName());
            stock.put(required.getKey(), item);
        }
        Order order = orders.save(new Order(quote, reference("ORD")));
        var deliveryAddress = customerAddresses.findByCustomerIdAndDefaultDeliveryTrue(customerId).stream().findFirst()
                .or(() -> customerAddresses.findByCustomerIdOrderByCreatedAtDesc(customerId).stream().findFirst())
                .orElseThrow(() -> ApiException.conflict(ErrorCode.DELIVERY_ADDRESS_REQUIRED, "A delivery address is required before accepting a quotation"));
        String companyName = customerProfiles.findByUserId(customerId).map(profile -> profile.getCompanyName()).orElse(null);
        orderAddresses.save(new OrderAddress(order, deliveryAddress, AddressType.DELIVERY, companyName));
        customerAddresses.findByCustomerIdAndTypeOrderByCreatedAtDesc(customerId, AddressType.BILLING).stream()
                .findFirst()
                .ifPresent(billingAddress -> orderAddresses.save(new OrderAddress(order, billingAddress, AddressType.BILLING, companyName)));
        for (QuotationItem line : lines) {
            OrderItem item = orderItems.save(new OrderItem(order, line.getType(), line.getVariant(), line.getDescriptionSnapshot(), line.getQuantity(), line.getUnit(), line.getUnitPrice(), line.getLineTotal(), line.getDisplayOrder()));
            if (line.getType() == CommercialLineType.MATERIAL) {
                InventoryItem balance = stock.get(line.getVariant().getId());
                balance.reserve(line.getQuantity());
                reservations.save(new InventoryReservation(item, balance, line.getQuantity()));
                movements.save(new StockMovement(balance, MovementType.RESERVATION, line.getQuantity(), "ORDER", order.getId(), "Quotation accepted", customerId, item));
            }
        }
        if (lines.stream().anyMatch(line -> line.getType() == CommercialLineType.MATERIAL))
            order.reserve();
        quote.accept();
        orders.flush();
        audit.record(customerId, "QUOTATION_ACCEPTED", "QUOTATION", quoteId, "Created order " + order.getOrderNumber());
        return order;
    }

    private Quotation createQuote(QuotationDtos.Create input, Quotation revisionOf, int revision) {
        BigDecimal subtotal = input.lines().stream().map(line -> line.quantity().multiply(line.unitPrice())).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discount = nz(input.discount());
        BigDecimal tax = nz(input.tax());
        if (discount.compareTo(subtotal) > 0)
            throw ApiException.conflict("INVALID_DISCOUNT", "Discount cannot exceed subtotal");
        var request = requests.findById(input.requestId()).orElseThrow(() -> ApiException.notFound("RFQ"));
        if (revisionOf == null && request.getStatus() != RfqStatus.UNDER_REVIEW)
            throw ApiException.conflict("INVALID_STATE_TRANSITION", "Only an RFQ under review can receive its first quotation");
        Quotation quote = quotes.save(new Quotation(request, revisionOf, revision, reference("QUO"), input.validUntil(), subtotal, discount, tax, subtotal.subtract(discount).add(tax)));
        for (int index = 0; index < input.lines().size(); index++) {
            var line = input.lines().get(index);
            if (line.type() == CommercialLineType.MATERIAL && line.variantId() == null)
                throw ApiException.conflict("VALIDATION_ERROR", "Material lines require variantId");
            if (line.type() != CommercialLineType.MATERIAL && line.variantId() != null)
                throw ApiException.conflict("VALIDATION_ERROR", "Only material lines may identify a variant");
            UnitType unit = line.unit() == null ? (line.type() == CommercialLineType.MATERIAL ? UnitType.M2 : UnitType.SERVICE) : line.unit();
            if (line.type() == CommercialLineType.MATERIAL && unit != UnitType.M2)
                throw ApiException.conflict("VALIDATION_ERROR", "Material lines must use M2");
            quoteItems.save(new QuotationItem(quote, line.type(), line.variantId() == null ? null : variants.findById(line.variantId()).orElseThrow(() -> ApiException.notFound("Variant")), line.description(), line.quantity(), unit, line.unitPrice(), index));
        }
        return quote;
    }

    private String reference(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    private Quotation owned(Long id, Long customerId) {
        return quotes.findByIdAndRequestCustomerId(id, customerId).orElseThrow(ApiException::forbidden);
    }

    private Quotation find(Long id) {
        return quotes.findById(id).orElseThrow(() -> ApiException.notFound("Quotation"));
    }

    private BigDecimal nz(BigDecimal n) {
        return n == null ? BigDecimal.ZERO : n;
    }

    private QuotationDtos.Response response(Quotation q) {
        return new QuotationDtos.Response(q.getId(), q.getQuoteNumber(), q.getStatus().name(), q.getTotal());
    }

    private QuotationDtos.Detail detail(Quotation q) {
        var lines = quoteItems.findByQuotationId(q.getId()).stream().map(x -> new QuotationDtos.LineDetail(x.getId(), x.getType().name(), x.getVariant() == null ? null : x.getVariant().getId(), x.getDescriptionSnapshot(), x.getQuantity(), x.getUnit().name(), x.getUnitPrice(), x.getLineTotal(), x.getDisplayOrder())).toList();
        return new QuotationDtos.Detail(q.getId(), q.getQuoteNumber(), q.getStatus().name(), q.getValidUntil(), q.getSubtotal(), q.getDiscount(), q.getTax(), q.getTotal(), q.getCurrency(), q.getRevisionNumber(), q.getRevisionOf() == null ? null : q.getRevisionOf().getId(), q.getRequest().getId(), lines, q.getSentAt(), q.getAcceptedAt());
    }
}
