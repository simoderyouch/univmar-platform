# UNIVMAR

UNIVMAR is a quote-led natural-stone sales and operations platform. It supports a public material catalogue, customer projects and requests for quotation (RFQs), commercial quotations, stock reservations, order fulfilment, and an auditable inventory ledger.

The product is deliberately a modular monolith: a React client communicates with a Spring Boot REST API, and PostgreSQL is the system of record. It is designed to keep the core commercial lifecycle correct before optional polish is added.

This repository contains application source code only. Private media, local environment files, generated output, PDFs, text exports, and internal documentation are intentionally excluded.

## Product boundary

The implemented V1 lifecycle is:

```text
Browse catalogue -> create project/RFQ -> sales sends quotation
-> customer accepts -> stock is atomically reserved -> order is created
-> authorised staff prepare/deliver or cancel -> ledger records the change
```

In scope: identity and roles, customer profiles, catalogue, projects, RFQs, quotations, variant-level inventory, orders, audit-friendly stock movements, REST APIs, OpenAPI, and a responsive customer/back-office client.

Out of scope: payments, supplier purchasing, accounting, multiple warehouses, individual slab/barcode tracking, fabrication, fleet routing, currency conversion, and microservices. Those items must not be added until the core lifecycle is stable.

## Repository layout

```text
backend/                 Spring Boot API
  src/main/java/         modular domain code
  src/main/resources/    configuration and database migrations
  src/test/              unit and integration tests
frontend/                React + TypeScript client
landing/                 Next.js public website source (private media mounted at runtime)
docker-compose.yml       local PostgreSQL, API, and client orchestration
```

## Architecture

The API is split by business capability rather than by global controller/service/repository folders:

```text
com.univmar
  auth/ customer/ catalog/ project/ rfq/ quotation/
  inventory/ order/ dashboard/ shared/
```

Controllers only map HTTP, validate requests, and pass the authenticated principal to application services. Services own authorization, transactional boundaries, and business invariants. JPA entities never cross the HTTP boundary; controllers return DTOs. PostgreSQL persists business data and uploaded files are represented by metadata, not database blobs.

## Non-negotiable business rules

- Quantities use `BigDecimal` in square metres; money uses `BigDecimal`, never `double`.
- `availableM2 = onHandM2 - reservedM2`, and it may never be negative.
- Draft and sent quotations do not reserve stock.
- Only the quotation owner can accept a `SENT`, non-expired quotation.
- Acceptance is one database transaction: re-check stock, create reservations and movements, create exactly one order, then mark the quote accepted.
- A unique database constraint prevents multiple orders for one quotation.
- Inventory balances use optimistic locking; a concurrent change returns a conflict and creates no partial reservation.
- Stock movements are append-only. Corrections use a compensating `ADJUSTMENT` with a required reason.
- Order and quotation lines are immutable commercial snapshots.
- Resource ownership is checked in services as well as role access at routes.

## Data model

| Area | Main records |
| --- | --- |
| Identity | `User`, `CustomerProfile`, `Address` |
| Catalogue | `StoneMaterial`, `StoneVariant`, `MaterialImage` |
| Customer work | `Project`, `ProjectFile`, `QuoteRequest`, `QuoteRequestItem` |
| Commercial | `Quotation`, `QuotationItem`, `Order`, `OrderItem`, `OrderStatusHistory` |
| Inventory | `InventoryItem`, `InventoryReservation`, `StockMovement` |

Key relationships: a material has variants; a quotation has one or more snapshot lines and at most one order; an inventory item belongs to one variant; an order item may reserve one or more inventory items. V1 uses one active inventory balance per variant by default. Lot allocation can be introduced later without changing the public quotation or order model.

## States

```text
Quotation: DRAFT -> SENT -> ACCEPTED | REJECTED | EXPIRED | SUPERSEDED
                   DRAFT -> CANCELLED

Order: CONFIRMED -> RESERVED -> PROCESSING -> READY -> COMPLETED
       CONFIRMED/RESERVED/PROCESSING -> CANCELLED

RFQ: DRAFT -> SUBMITTED -> UNDER_REVIEW -> QUOTED -> CLOSED
     DRAFT/SUBMITTED/UNDER_REVIEW -> CANCELLED
```

`validUntil` is an inclusive date in the configured business timezone. V1 is single-currency (MAD) and has two decimal places for money and square metres. These decisions eliminate ambiguous acceptance and rounding behaviour.

## Running locally

Prerequisites: Docker and Docker Compose. Java and Node are only needed when running the services outside containers.

```bash
docker compose up --build
```

Once running:

- API: `http://localhost:8080`
- OpenAPI UI: `http://localhost:8080/swagger-ui/index.html`
- Web app: `http://localhost:5173`
- PostgreSQL: `localhost:5432` (`univmar` / `univmar`)

For backend-only development, set `SPRING_PROFILES_ACTIVE=dev`; the dev profile uses an in-memory H2 database and seeds an administrator (`admin@univmar.local` / `ChangeMe123!`) and a sales user (`sales@univmar.local` / `ChangeMe123!`). Change these credentials in any non-local deployment.

## Implementation order

Work in this dependency order. Each checkpoint must be demonstrable before the next begins.

1. **Foundation** — run PostgreSQL, Flyway migrations, global Problem Details errors, health endpoint, API documentation, and test configuration.
2. **Identity** — registration, login, refresh/logout, password hashing, account status, roles, customer profiles, addresses, ownership helpers, and security tests.
3. **Catalogue** — material/variant administration, public filtering/pagination/detail, image metadata, and public stock bands.
4. **Customer work** — projects, attachment metadata, RFQ draft/submit, and sales assignment/review queue.
5. **Quoting** — server-calculated line totals, discounts/tax validation, immutable sent snapshots, revision policy, sending, rejection, and expiration checks.
6. **Inventory** — stock-in, adjustments, available-stock query, low-stock view, movement ledger, and optimistic locking.
7. **Acceptance transaction** — inventory allocation, reservations, `409` conflicts, idempotent one-order creation, and audit data. This is the central vertical slice.
8. **Fulfilment** — order timeline, legal status transitions, cancellation/release, and delivery/consumption.
9. **Client workflows** — public catalogue, customer account/RFQ/quote/order pages, back-office queues and forms, validation, loading/empty/error states.
10. **Quality and delivery** — integration tests against PostgreSQL, cross-customer authorization tests, seed data, Docker, CI, screenshots, and a safe deployment configuration.

## Core acceptance tests

| Scenario | Expected result |
| --- | --- |
| Accept a quote needing 80m² with 230m² available | One confirmed order; reserved increases by 80m²; available becomes 150m². |
| Accept a quote needing 80m² with 50m² available | `409 INSUFFICIENT_STOCK`; no order, reservation, or stock movement. |
| Two customers accept against the same balance | No oversell; losing request receives a conflict and rolls back fully. |
| Cancel an active reserved order | Reservations are released in the same transaction and available stock rises. |
| Deliver an active order | On-hand and reserved quantities both decrease; a consumption movement and timeline event exist. |
| Customer A requests Customer B's quote/order/project | `403` or deliberately masked `404`; no record data leaks. |

## API conventions

Routes are versioned under `/api/v1`. Lists are paginated and filterable. Business transitions use action routes where a plain update would bypass invariants, for example `POST /quotations/{id}/accept` and `POST /sales/orders/{id}/status`. Errors are RFC 9457-style Problem Details with a stable application code such as `INSUFFICIENT_STOCK`, `INVALID_STATE_TRANSITION`, or `CONCURRENT_MODIFICATION`.

## Definition of done

The project is ready when a fresh database can be migrated and seeded, the catalogue-to-delivery flow works through the UI and API, inventory never becomes negative through normal workflows, critical mutations are audited, protected records cannot be accessed cross-customer, OpenAPI matches the deployed API, and the project starts from Docker with documented demo credentials.
