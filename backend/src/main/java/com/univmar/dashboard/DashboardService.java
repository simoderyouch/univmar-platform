package com.univmar.dashboard;

import com.univmar.dashboard.api.DashboardDtos.*;
import com.univmar.delivery.domain.*;
import com.univmar.invoice.domain.*;
import com.univmar.inventory.domain.*;
import com.univmar.order.domain.*;
import com.univmar.quotation.domain.*;
import java.math.*;
import java.time.LocalDate;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final SalesOrderRepository orders; private final QuotationRepository quotations; private final CustomerInvoiceRepository invoices; private final InventoryItemRepository inventory; private final DeliveryRepository deliveries;
    public DashboardService(SalesOrderRepository orders, QuotationRepository quotations, CustomerInvoiceRepository invoices, InventoryItemRepository inventory, DeliveryRepository deliveries) { this.orders = orders; this.quotations = quotations; this.invoices = invoices; this.inventory = inventory; this.deliveries = deliveries; }
    public Overview overview() {
        List<SalesOrder> allOrders = orders.findAll(); List<Quotation> allQuotes = quotations.findAll(); List<CustomerInvoice> allInvoices = invoices.findAll(); List<InventoryItem> stock = inventory.findAll(); List<Delivery> allDeliveries = deliveries.findAll(); LocalDate today = LocalDate.now();
        List<SalesOrder> liveOrders = allOrders.stream().filter(order -> order.getStatus() != OrderStatus.CANCELLED).toList();
        BigDecimal salesValue = money(liveOrders.stream().map(SalesOrder::getGrandTotal)); BigDecimal average = liveOrders.isEmpty() ? BigDecimal.ZERO : salesValue.divide(BigDecimal.valueOf(liveOrders.size()), 2, RoundingMode.HALF_UP);
        BigDecimal collected = money(allInvoices.stream().filter(invoice -> invoice.getStatus() != InvoiceStatus.VOID).map(CustomerInvoice::paidTotal)); BigDecimal outstanding = money(allInvoices.stream().filter(invoice -> invoice.getStatus() != InvoiceStatus.VOID).map(CustomerInvoice::outstandingTotal));
        BigDecimal available = quantity(stock.stream().map(InventoryItem::getAvailableM2)); BigDecimal reserved = quantity(stock.stream().map(InventoryItem::getReservedM2)); BigDecimal damaged = quantity(stock.stream().map(InventoryItem::getDamagedM2));
        QuoteSummary quoteSummary = new QuoteSummary(countQuotes(allQuotes, QuotationStatus.DRAFT), countQuotes(allQuotes, QuotationStatus.SENT), countQuotes(allQuotes, QuotationStatus.ACCEPTED), allQuotes.stream().filter(quote -> quote.getStatus() == QuotationStatus.SENT && quote.getExpiryDate() != null && !quote.getExpiryDate().isBefore(today) && !quote.getExpiryDate().isAfter(today.plusDays(7))).count(), money(allQuotes.stream().filter(quote -> quote.getStatus() == QuotationStatus.DRAFT || quote.getStatus() == QuotationStatus.SENT).map(Quotation::getGrandTotal)));
        FulfillmentSummary fulfillment = new FulfillmentSummary(countOrders(allOrders, OrderStatus.CONFIRMED), countOrders(allOrders, OrderStatus.PREPARING), countOrders(allOrders, OrderStatus.PARTIALLY_DELIVERED), countDeliveries(allDeliveries, DeliveryStatus.PLANNED), countDeliveries(allDeliveries, DeliveryStatus.DISPATCHED));
        List<DeliverySchedule> upcoming = allDeliveries.stream().filter(delivery -> delivery.getScheduledDate() != null && !delivery.getScheduledDate().isBefore(today) && !delivery.getScheduledDate().isAfter(today.plusDays(7)) && (delivery.getStatus() == DeliveryStatus.PLANNED || delivery.getStatus() == DeliveryStatus.PREPARING || delivery.getStatus() == DeliveryStatus.DISPATCHED)).sorted(Comparator.comparing(Delivery::getScheduledDate)).limit(5).map(delivery -> new DeliverySchedule(delivery.getNumber(), delivery.getOrder().getCustomer().getName(), delivery.getOrder().getProject().getName(), delivery.getScheduledDate(), delivery.getStatus().name())).toList();
        List<StockAlert> alerts = stock.stream().filter(item -> item.getAvailableM2().signum() > 0 && item.getAvailableM2().compareTo(new BigDecimal("5.000")) <= 0).sorted(Comparator.comparing(InventoryItem::getAvailableM2)).limit(5).map(item -> new StockAlert(item.getVariant().getMaterial().getName(), item.getVariant().getThicknessMm() + " mm · " + item.getVariant().getFinish(), item.getWarehouse().getName(), item.getLocation().getCode(), item.getAvailableM2())).toList();
        List<Receivable> receivables = allInvoices.stream().filter(invoice -> invoice.getStatus() != InvoiceStatus.PAID && invoice.getStatus() != InvoiceStatus.VOID).sorted(Comparator.comparing(CustomerInvoice::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()))).limit(5).map(invoice -> new Receivable(invoice.getNumber(), invoice.getOrder().getCustomer().getName(), invoice.getDueDate(), invoice.getStatus().name(), invoice.outstandingTotal())).toList();
        return new Overview(salesValue, liveOrders.size(), average, collected, outstanding, available, reserved, damaged, quoteSummary, fulfillment, upcoming, alerts, receivables);
    }
    private long countQuotes(List<Quotation> quotes, QuotationStatus status) { return quotes.stream().filter(quote -> quote.getStatus() == status).count(); }
    private long countOrders(List<SalesOrder> orders, OrderStatus status) { return orders.stream().filter(order -> order.getStatus() == status).count(); }
    private long countDeliveries(List<Delivery> deliveries, DeliveryStatus status) { return deliveries.stream().filter(delivery -> delivery.getStatus() == status).count(); }
    private BigDecimal money(java.util.stream.Stream<BigDecimal> values) { return values.reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2, RoundingMode.HALF_UP); }
    private BigDecimal quantity(java.util.stream.Stream<BigDecimal> values) { return values.reduce(BigDecimal.ZERO, BigDecimal::add).setScale(3, RoundingMode.HALF_UP); }
}
