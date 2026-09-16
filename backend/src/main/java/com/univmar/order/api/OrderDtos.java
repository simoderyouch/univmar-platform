package com.univmar.order.api;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
public final class OrderDtos {
    private OrderDtos() { }
    public record Detail(Long id,String orderNumber,String status,Long customerId,Long quotationId,BigDecimal total,Instant createdAt,List<Line> lines,List<Event> timeline) { }
    public record Line(Long id,Long variantId,String description,BigDecimal quantity,BigDecimal unitPrice,BigDecimal lineTotal) { }
    public record Event(String type,BigDecimal quantityM2,String reason,Long actorId,Instant at) { }
    public record StatusResponse(String status) { }
}
