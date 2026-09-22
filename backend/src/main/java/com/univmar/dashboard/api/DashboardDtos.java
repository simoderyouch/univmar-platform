package com.univmar.dashboard.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class DashboardDtos {
    private DashboardDtos() { }
    public record Overview(BigDecimal salesValue, long orderCount, BigDecimal averageOrderValue, BigDecimal collected, BigDecimal outstanding, BigDecimal availableM2, BigDecimal reservedM2, BigDecimal damagedM2, QuoteSummary quotations, FulfillmentSummary fulfillment, List<DeliverySchedule> upcomingDeliveries, List<StockAlert> stockAlerts, List<Receivable> receivables) { }
    public record QuoteSummary(long drafts, long sent, long accepted, long expiringSoon, BigDecimal activeValue) { }
    public record FulfillmentSummary(long confirmedOrders, long preparingOrders, long partiallyDeliveredOrders, long plannedDeliveries, long dispatchedDeliveries) { }
    public record DeliverySchedule(String number, String customerName, String projectName, LocalDate scheduledDate, String status) { }
    public record StockAlert(String materialName, String variantLabel, String warehouseName, String locationCode, BigDecimal availableM2) { }
    public record Receivable(String number, String customerName, LocalDate dueDate, String status, BigDecimal outstandingTotal) { }
}
