package com.univmar.order.api;
import com.univmar.order.OrderService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/orders") @PreAuthorize("hasRole('CUSTOMER')")
public class CustomerOrderController {
    private final OrderService service; public CustomerOrderController(OrderService service){this.service=service;}
    @GetMapping public List<OrderDtos.Detail> mine(Authentication auth){return service.mine((Long)auth.getPrincipal());}
    @GetMapping("/{id}") public OrderDtos.Detail detail(@PathVariable Long id,Authentication auth){return service.mineDetail(id,(Long)auth.getPrincipal());}
}
