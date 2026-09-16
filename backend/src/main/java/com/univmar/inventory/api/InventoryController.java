package com.univmar.inventory.api;
import com.univmar.inventory.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/inventory") @PreAuthorize("hasAnyRole('INVENTORY_MANAGER','ADMIN')")
public class InventoryController {
 private final InventoryService service; public InventoryController(InventoryService service) { this.service = service; }
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public InventoryDtos.ItemResponse create(@Valid @RequestBody InventoryDtos.CreateItemRequest request) { return service.create(request); }
 @PutMapping("/{id}") public InventoryDtos.ItemResponse update(@PathVariable Long id, @Valid @RequestBody InventoryDtos.UpdateItemRequest request, Authentication auth) { return service.update(id, request, (Long) auth.getPrincipal()); }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void archive(@PathVariable Long id, Authentication auth) { service.archive(id, (Long) auth.getPrincipal()); }
 @GetMapping public org.springframework.data.domain.Page<InventoryDtos.ItemResponse> list(org.springframework.data.domain.Pageable pageable) { return service.list(pageable); }
 @GetMapping("/low-stock") public org.springframework.data.domain.Page<InventoryDtos.ItemResponse> lowStock(org.springframework.data.domain.Pageable pageable) { return service.lowStock(pageable); }
 @GetMapping("/{id}") public InventoryDtos.ItemResponse get(@PathVariable Long id) { return service.get(id); }
 @GetMapping("/{id}/movements") public java.util.List<InventoryDtos.MovementResponse> movements(@PathVariable Long id) { return service.movements(id); }
 @PostMapping("/{id}/stock-in") public InventoryDtos.ItemResponse stockIn(@PathVariable Long id, @Valid @RequestBody InventoryDtos.MovementRequest request, Authentication auth) { return service.stockIn(id, request, (Long) auth.getPrincipal()); }
 @PostMapping("/{id}/adjustments") public InventoryDtos.ItemResponse adjust(@PathVariable Long id, @Valid @RequestBody InventoryDtos.AdjustmentRequest request, Authentication auth) { return service.adjust(id, request, (Long) auth.getPrincipal()); }
}
