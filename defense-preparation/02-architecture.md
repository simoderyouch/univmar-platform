# 2. Project architecture and technologies

## Overall view

```text
Public visitor ──> Public website (Next.js) ──┐
                                             │ HTTP / REST
Staff user ─────> ERP frontend (React) ──────┼──> Spring Boot API
                                             │        ├── PostgreSQL database
                                             │        └── Local or S3-compatible file storage
```

The repository has several applications and supporting directories:

- [backend/](../backend/) — Spring Boot API, business rules, persistence and tests.
- [frontend/](../frontend/) — internal ERP interface built with React, TypeScript and Vite.
- [landing/](../landing/) — public website built with Next.js.
- [docker-compose.yml](../docker-compose.yml) — a local stack with PostgreSQL, MinIO, API, ERP frontend and public website.
- [infra/production/](../infra/production/) — Terraform files for production infrastructure.
- [diagrams/](../diagrams/) — existing project diagrams.

The API can use PostgreSQL or an H2 in-memory database depending on configuration. Docker Compose supplies PostgreSQL and MinIO; H2 and local filesystem storage are available as alternatives. See [application.yml](../backend/src/main/resources/application.yml) and the root [README](../README.md).

## Backend architecture

The backend is a **modular monolith**: one deployable Spring Boot application contains packages grouped by business feature. It is not a set of independently deployed microservices.

Examples of feature packages: `catalog`, `inventory`, `customer`, `rfq`, `quotation`, `order`, `delivery`, `invoice`, `purchasing`, `fabrication`, and `cms`. The `auth` and `common` packages provide shared capabilities.

A typical feature has:

```text
order/
├── api/OrderController.java   # HTTP endpoints
├── api/OrderDtos.java         # Input and output models
├── OrderService.java          # Business rules and workflow
└── domain/                    # Entities, repositories, statuses
```

The feature packages are logical boundaries; they are not fully isolated. For instance, the order service uses quotation and inventory repositories and services from other features.

## Request path

```text
React interface
  → fetch / HTTP request
  → Spring Security filter chain
  → controller
  → service
  → repository / JPA
  → database
  → response returned as JSON
```

The [frontend API client](../frontend/src/shared/api/client.ts) sends requests with `fetch`, attaches the stored access token when available, and reads the response's `data` field. The backend also supports public endpoints used by the website.

## Database and storage

**PostgreSQL** stores structured data such as orders and customers. JPA/Hibernate maps Java objects to database tables. **Flyway** applies versioned SQL files from [db/migration](../backend/src/main/resources/db/migration/). In configuration, Hibernate uses `ddl-auto: validate`, so it checks the schema against mappings instead of creating the schema itself.

Files use a different concern: the application supports local storage and S3-compatible object storage such as MinIO. The API exposes routes for serving images and protects document access according to its security rules. Storage provider configuration is in [application.yml](../backend/src/main/resources/application.yml).

## Security

The API uses Spring Security with stateless JWT authentication. Login verifies the user's password and returns a token. On subsequent requests the client can send `Authorization: Bearer <token>`. The JWT filter authenticates valid tokens, while security rules and service-level checks control access. Not all routes require a token: login and selected public website endpoints are open.

Key files: [AuthController](../backend/src/main/java/com/univmar/auth/api/AuthController.java), [JwtAuthenticationFilter](../backend/src/main/java/com/univmar/auth/JwtAuthenticationFilter.java), [SecurityConfig](../backend/src/main/java/com/univmar/auth/SecurityConfig.java), and [AccessControlService](../backend/src/main/java/com/univmar/auth/AccessControlService.java).

## Testing

The backend contains unit and Spring integration tests in [src/test](../backend/src/test/java/com/univmar/). They cover authorization and several business workflows, including stock reservation, delivery, invoicing, and the main business flow. Integration tests exercise interactions between components, not only one method in isolation.
