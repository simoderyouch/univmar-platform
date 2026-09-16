package com.univmar.order;

import com.univmar.audit.AuditService;
import com.univmar.inventory.domain.*;
import com.univmar.order.api.OrderDtos;
import com.univmar.order.domain.*;
import com.univmar.shared.api.ApiException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service public class OrderService {
    private final OrderRepository orders; private final OrderItemRepository items; private final InventoryReservationRepository reservations; private final StockMovementRepository movements; private final AuditService audit;
    public OrderService(OrderRepository orders,OrderItemRepository items,InventoryReservationRepository reservations,StockMovementRepository movements,AuditService audit){this.orders=orders;this.items=items;this.reservations=reservations;this.movements=movements;this.audit=audit;}
    @Transactional public OrderStatus transition(Long id,OrderStatus target,Long actorId){Order order=find(id);try{order.transition(target);}catch(IllegalStateException e){throw ApiException.conflict("INVALID_STATE_TRANSITION",e.getMessage());}if(target==OrderStatus.CANCELLED)for(var r:reservations.findByOrderItem_Order_IdAndStatus(id,ReservationStatus.ACTIVE)){r.getInventoryItem().release(r.getQuantityM2());r.release();movements.save(new StockMovement(r.getInventoryItem(),MovementType.RESERVATION_RELEASED,r.getQuantityM2(),"ORDER",id,"Order cancelled",actorId));}if(target==OrderStatus.DELIVERED)for(var r:reservations.findByOrderItem_Order_IdAndStatus(id,ReservationStatus.ACTIVE)){r.getInventoryItem().consume(r.getQuantityM2());r.consume();movements.save(new StockMovement(r.getInventoryItem(),MovementType.SALE,r.getQuantityM2(),"ORDER",id,"Order delivered",actorId));}audit.record(actorId,"ORDER_"+target.name(),"ORDER",id,"Order status changed to "+target.name());return order.getStatus();}
    @Transactional(readOnly=true) public List<OrderDtos.Detail> mine(Long customerId){return orders.findByCustomerIdOrderByCreatedAtDesc(customerId).stream().map(this::detail).toList();}
    @Transactional(readOnly=true) public OrderDtos.Detail mineDetail(Long id,Long customerId){return detail(orders.findByIdAndCustomerId(id,customerId).orElseThrow(ApiException::forbidden));}
    @Transactional(readOnly=true) public List<OrderDtos.Detail> sales(){return orders.findAll().stream().map(this::detail).toList();}
    @Transactional(readOnly=true) public OrderDtos.Detail salesDetail(Long id){return detail(find(id));}
    private Order find(Long id){return orders.findById(id).orElseThrow(()->ApiException.notFound("Order"));}
    private OrderDtos.Detail detail(Order order){var lines=items.findByOrderId(order.getId()).stream().map(x->new OrderDtos.Line(x.getId(),x.getVariant()==null?null:x.getVariant().getId(),x.getDescriptionSnapshot(),x.getQuantity(),x.getUnitPrice(),x.getLineTotal())).toList();var timeline=movements.findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc("ORDER",order.getId()).stream().map(x->new OrderDtos.Event(x.getType().name(),x.getQuantityM2(),x.getReason(),x.getActorId(),x.getCreatedAt())).toList();return new OrderDtos.Detail(order.getId(),order.getOrderNumber(),order.getStatus().name(),order.getCustomer().getId(),order.getQuotation().getId(),order.getTotalSnapshot(),order.getCreatedAt(),lines,timeline);}
}
