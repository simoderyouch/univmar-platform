# 4. Code walkthrough: accepting a quotation

This walkthrough follows one real backend operation: converting a quotation into an order and reserving inventory. Read it with the code open. It is an example of the flow, not a description of every part of the application.

## 1. The request reaches the controller

Open [OrderController.java](../backend/src/main/java/com/univmar/order/api/OrderController.java). The class has the base route `/api/v1/orders`. The `accept` method handles:

```text
POST /api/v1/orders/from-quotation/{quotationId}
```

The controller extracts the quotation ID with `@PathVariable` and parses the JSON body into an `AcceptanceInput` with `@RequestBody`. `@Valid` triggers validation of that input. It calls `orders.acceptQuotation(quotationId, input)` and wraps the result in the standard API response. A request ID is attached to help identify requests in responses and logs.

The JWT security filter and route authorization run before the controller for this protected operation. Commercial roles are allowed to perform order mutations according to [SecurityConfig](../backend/src/main/java/com/univmar/auth/SecurityConfig.java).

## 2. The service checks the quotation

Open [OrderService.java](../backend/src/main/java/com/univmar/order/OrderService.java) and find `acceptQuotation`.

The method:

1. Loads the quotation using `findByIdForUpdate`; if missing, it returns an application error.
2. Applies a sales ownership access check.
3. Requires the quotation to be sent and unexpired.
4. Checks that it has not already been converted into an order.
5. Requires quotation items and a material variant on each item.

These are business rules: they express conditions under which the company permits an order to be created. If a check fails, the service throws an `ApiException`; the central exception handler translates it into an HTTP error response.

## 3. The service creates an order and reserves stock

After the checks, the service constructs a `SalesOrder` from the quotation, copies quotation lines into order lines, and records an order event. It then calls the private `reserve(order)` method.

The reservation method groups order lines by variant, fetches stock rows for update, calculates available quantity, and rejects the operation if stock is insufficient. It allocates available stock to order lines, creates reservations, and records stock movements.

**Why reserve instead of immediately reducing all physical stock?** A reservation marks material as committed to an order, so the same available quantity is not offered freely to another order. Physical dispatch is a separate step in the delivery workflow.

## 4. The transaction protects the operation

`OrderService` is annotated `@Transactional`. The quotation change, order creation, and inventory changes are part of the transaction for this operation. If an unchecked exception is thrown during the transaction, Spring normally rolls back the database changes. The row locks in the repository queries help protect relevant data during concurrent operations.

For a defense, explain the reason: two sales operations may try to reserve the same stock at nearly the same time. Locking the stock rows while checking and reserving helps prevent conflicting reservations. Do not claim that transactions alone solve every possible concurrency issue.

## 5. Persistence and the response

After reserving stock, the service changes the quotation status to accepted, records events, saves the order, and maps it to a response DTO. The controller sends the response in JSON. The entity's related items and events use JPA relationships and cascading as defined in [SalesOrder.java](../backend/src/main/java/com/univmar/order/domain/SalesOrder.java).

```text
POST request
  → security checks
  → OrderController.accept
  → OrderService.acceptQuotation
      → load and check quotation
      → create order and lines
      → lock, check and reserve inventory
      → update quotation and save order
  → API response
```

## What happens if the order is cancelled?

The same service checks access and order state, looks for dispatched or delivered items, cancels eligible planned deliveries, releases active stock reservations, and releases slab and remnant reservations before cancelling the order. Read `cancel` to see the precise conditions. This is a good example of why order management touches multiple business features.

## How to explain it in a presentation

> “I will follow a quotation acceptance from the user interface to the database. Spring Security checks access, the controller receives the request, and the service verifies business conditions. The service then creates an order and reserves stock in a transaction. The API returns the result to the interface. This connects the sales process to inventory and helps prevent allocating the same stock twice.”

Adapt “I” to your actual role. Only claim that you personally implemented or designed a component if you did so.

## Related code to inspect

- [Order DTOs](../backend/src/main/java/com/univmar/order/api/OrderDtos.java) — input and output structures.
- [InventoryItemRepository](../backend/src/main/java/com/univmar/inventory/domain/InventoryItemRepository.java) — inventory queries and locking.
- [SalesOrderRepository](../backend/src/main/java/com/univmar/order/domain/SalesOrderRepository.java) — order queries.
- [OrderReservationIntegrationTest](../backend/src/test/java/com/univmar/order/OrderReservationIntegrationTest.java) — examples of reservation behavior tested by the project.
- [MainBusinessWorkflowIntegrationTest](../backend/src/test/java/com/univmar/workflow/MainBusinessWorkflowIntegrationTest.java) — broader business flow.
