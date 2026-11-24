# Spring and Spring Security: detailed oral revision

Read alongside the existing [Spring Boot guide](03-spring-boot-revision.md) and [security deep dive](spring-security.md). This guide distinguishes general framework concepts from what this repository actually implements. The backend uses Java 17, Spring Boot 3.3.5, Spring Web, Data JPA, Security, Validation, Flyway, PostgreSQL/H2, JJWT and Actuator: see [pom.xml](../backend/pom.xml).

## 1. Spring, Spring Boot and the container

**Spring Framework** supplies a dependency-injection container and libraries for web, transactions, data access and security. **Spring Boot** builds on it with starters, auto-configuration, externalized settings and an embedded server, reducing setup. Spring MVC, Data JPA and Security are separate pieces in the wider ecosystem; Spring itself is not a database or frontend framework.

A **bean** is an object managed by the Spring application context. Component scanning detects annotated classes such as `@Service`, `@Component` and `@RestController`; a `@Configuration` class can declare a bean through `@Bean`. Constructor injection supplies dependencies. For example, [OrderService](../backend/src/main/java/com/univmar/order/OrderService.java) receives repositories, stock services and access checks through its constructor. This makes dependencies explicit, encourages loose coupling and supports replacement with test doubles. Spring creates the object graph; IoC means object construction and wiring are managed by the container instead of every class manually creating its collaborators.

A singleton bean generally means one instance per application context, not one instance globally in every process. Stateless services are easier to use concurrently; request-specific state should not be stored in mutable singleton fields. `@Value` and configuration properties resolve external settings from sources such as environment variables and YAML. Profiles select environment-specific configuration; sensitive production values should come from a secret manager, not source control.

## 2. HTTP request lifecycle

1. The client sends an HTTP request. Servlet filters, including the security chain, run before controller handling.
2. `DispatcherServlet` routes a request to a matching controller method using path and HTTP method. `@RestController` returns response data, normally serialized as JSON. `@RequestBody` binds JSON to a DTO; `@PathVariable` and `@RequestParam` extract path and query values.
3. `@Valid` triggers Bean Validation constraints such as `@NotBlank`, `@Email` and `@Size`. It validates declared input constraints; it does not replace business checks like sufficient stock.
4. The controller calls a service, the service enforces business invariants and interacts with repositories, and DTOs shape the response. The application has a consistent error handler and request IDs: see [ApiExceptionHandler](../backend/src/main/java/com/univmar/common/api/ApiExceptionHandler.java) and [RequestIdFilter](../backend/src/main/java/com/univmar/common/api/RequestIdFilter.java).
5. Typical HTTP meanings: 200/201 success, 400 invalid input, 401 missing/invalid authentication, 403 authenticated but forbidden, 404 missing resource, 409 conflict with current business state. Exact status depends on the actual handler.

**Why DTOs?** They decouple API input/output from persistence models, restrict exposed fields, support validation and avoid accidental entity serialization. Entity = persistence/domain representation; DTO = contract at a boundary. A repository is not where the HTTP response should be designed.

## 3. JPA, Hibernate, persistence and Flyway

JPA is a Java persistence specification; Hibernate is the ORM implementation typically supplied by Spring Boot's JPA starter. Entities map Java objects/relationships to relational tables, with identifiers and relationships declared by JPA annotations. Spring Data JPA generates standard repository operations and supports custom queries. PostgreSQL executes SQL and enforces constraints. Flyway versioned SQL files under [db/migration](../backend/src/main/resources/db/migration) manage schema evolution; they are not a backup system.

Within a persistence context, managed entities can be changed and flushed by dirty checking, often without a separate explicit `save` for each field change. Lazy relations may require an open persistence context; careless access can produce N+1 queries or lazy-loading failures. `@Transactional(readOnly = true)` communicates a read-oriented transaction and can enable optimizations; it is not a universal security guarantee that no writes can occur.

`@Transactional` gives a transaction boundary, commonly around service methods. Commit persists a successful unit; exceptions normally trigger rollback for unchecked exceptions by default, with specific rollback rules configurable. A proxy normally intercepts calls entering the Spring-managed bean; self-invocation can bypass proxy interception. External side effects, such as an already sent email, are not automatically undone by a database rollback. Transactions do not alone solve all concurrency problems: isolation and locking matter.

**Project example:** acceptance locks the quotation and inventory rows using repository `ForUpdate` operations, verifies state/expiry/stock, creates the order and reservations, and records changes. The transaction helps avoid leaving a half-created business operation. It is sensible to test concurrent behavior on PostgreSQL, not assume H2 guarantees identical locking semantics.

## 4. Spring Security: concepts

Authentication answers “who is this?” Authorization answers “may this identity perform this action on this resource?” A password is a credential; a role/authority expresses permission. The `SecurityContext` contains the current request's authentication information. A `SecurityFilterChain` specifies which filters and authorization rules apply. Rules are evaluated in order; more specific matchers must be placed before broad ones. `hasRole("ADMIN")` corresponds to an authority with the `ROLE_` prefix.

In this application, [SecurityConfig](../backend/src/main/java/com/univmar/auth/SecurityConfig.java) creates a stateless filter chain, allows selected public routes, applies route-and-method role rules, registers the JWT filter before `UsernamePasswordAuthenticationFilter`, configures CORS, and supplies custom 401/403 handlers. Stateless here means the server does not use an HTTP session to persist the security context; the implementation still queries the user database on protected bearer requests.

## 5. Exact login and bearer-token flow

1. The frontend sends `POST /api/v1/auth/login` with email/password. [AuthController](../backend/src/main/java/com/univmar/auth/api/AuthController.java) validates the request, loads the user by email ignoring case, requires an active account, and uses the password encoder's `matches` against the stored hash. An invalid email/password receives a generic unauthorized response.
2. [JwtService](../backend/src/main/java/com/univmar/auth/JwtService.java) creates a signed JWT containing user ID as subject, email, role, credentials version, issue time and expiry. The configured access-token duration defaults to 30 minutes. It uses an HMAC key; a minimum secret length is enforced and the development default is rejected with the production profile. A signed token provides integrity/authenticity, not secrecy: payload claims are readable and should not contain secrets.
3. [AuthProvider](../frontend/src/features/auth/AuthProvider.tsx) saves the access token in browser localStorage. Subsequent API requests use `Authorization: Bearer <token>`; `/auth/me` restores the user on reload. Logout removes the token locally. This storage choice is exposed to malicious JavaScript if an XSS vulnerability occurs; local logout does not by itself revoke a copied token.
4. [JwtAuthenticationFilter](../backend/src/main/java/com/univmar/auth/JwtAuthenticationFilter.java) extracts and verifies the token, reads its subject and credentials version, reloads the user, requires an active account and matching credentials version, and builds a `ROLE_...` authority from the **current database role**. It places an authenticated token in `SecurityContextHolder`. Invalid tokens leave the request unauthenticated; the chain continues and protected routes trigger 401.
5. Authorization checks the required role. Role changes and inactive users are reflected because the user is reloaded; credentials-version changes invalidate earlier versions. Protected business services may additionally check record ownership. `@AuthenticationPrincipal` is not necessary for this project flow: this implementation retrieves the current authentication or uses its access-control service.

There is no need to claim refresh tokens, OAuth login, server-side token blacklist or server-side logout unless separately implemented. JJWT constructs/parses JWTs; JWT is a token format, not an encryption method or a complete authorization policy.

## 6. Roles and practical examples

Configured roles are ADMIN, MANAGER, SALES_AGENT, INVENTORY_MANAGER and PURCHASING_MANAGER. User administration routes are admin-only; finance POST actions require admin/manager; commercial writes require admin/manager/sales agent; warehouse writes require admin/manager/inventory manager; supplier/purchase-order writes require admin/manager/purchasing manager. Some reads and fallback rules differ; review exact path, method and ordering in SecurityConfig. [AccessControlService](../backend/src/main/java/com/univmar/auth/AccessControlService.java) adds ownership checks in selected workflows. Hiding a frontend button improves usability, but cannot enforce security against a direct HTTP call.

A logged-in sales agent posting to a finance endpoint should get 403 if the matched route denies the role; an unauthenticated client accessing it should get 401. A permitted role can still receive a business conflict, for example insufficient stock or invalid order state. Role permissions and business validity solve different problems.

## 7. Passwords, CSRF, CORS and risk

BCrypt is a deliberately costly, salted password hash: it verifies a password without decrypting a stored plaintext password. Hashing is one-way; encryption is reversible with a key. Password strength, rate limiting and reset procedures still matter.

The API disables CSRF protection and uses explicit bearer authorization with stateless sessions; explain this in the context of the current authentication mechanism, not as a universal best practice. If authentication later relies on automatically sent cookies, reconsider CSRF defenses. CORS determines which browser origins may read responses and send certain cross-origin requests; it is not authentication and does not prevent non-browser clients from calling an API. TLS protects tokens in transit; XSS prevention and careful token storage remain essential.

Public routes for catalogue, contact and selected quotation links are deliberate exceptions. The quotation URL token functions as a bearer capability: anyone with a valid link may be able to use its allowed public operations, so protect it from leakage and discuss expiry/rotation only after checking the actual implementation. Never expose JWT secrets or real customer data during a defense.

## 8. Fast jury questions and strong answers

**Why Spring Boot?** “It gives a mature Java ecosystem, dependency injection, web/security/data integrations and configurable production support. The choice still requires careful design and testing.”

**How does a request reach business logic?** “Filters authenticate and authorize, Spring MVC maps the request to a controller and validates its DTO, the service applies rules inside a transaction, and repositories persist through JPA.”

**Why service and repository layers?** “The service owns business invariants and orchestration; the repository encapsulates database access. This makes responsibilities and tests clearer.”

**JWT versus session?** “A JWT carries signed claims; a server session typically stores session state server-side and sends a session identifier. This application uses stateless security sessions but reloads the user on token requests.”

**What if a token is stolen?** “It can be replayed until expiry or invalidation through mechanisms the application actually enforces. Limit lifetime, protect transport and browser execution, handle account/credential changes, and consider stronger revocation or alternative storage.”

**Can a JWT role be trusted forever?** “No. This filter reloads the active user and derives the authority from the current database role, rather than relying only on the role claim.”

**Why `@Transactional` and row locks?** “The transaction groups related database updates; row locks coordinate concurrent allocation. They address different parts of consistency.”

**JPA versus Hibernate versus PostgreSQL?** “JPA is the API/specification, Hibernate is the ORM provider, and PostgreSQL is the relational database that executes SQL.”

**Can the frontend secure a route?** “No. It can hide controls, but the backend validates identity, role, ownership and business state.”

**Does this mean the application is perfectly secure?** “No. Tests, dependency updates, threat modeling, penetration testing, secret management and operational controls remain necessary.”
