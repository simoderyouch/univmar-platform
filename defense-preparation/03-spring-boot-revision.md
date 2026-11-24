# 3. Spring Boot revision using UNIVMAR

## 1. What are Spring and Spring Boot?

**Spring Framework** provides tools for building Java applications, including dependency injection, web applications, transactions, and data access. **Spring Boot** builds on Spring: it supplies automatic configuration, starter dependencies, and an embedded web server so an application can start with less manual setup.

The project's [pom.xml](../backend/pom.xml) uses Maven, Java 17, and Spring Boot 3.3.5. Maven manages dependencies and builds the project. Starters include `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, and `spring-boot-starter-validation`.

## 2. Application startup

See [UnivmarApplication.java](../backend/src/main/java/com/univmar/UnivmarApplication.java):

```java
@SpringBootApplication
@EnableScheduling
public class UnivmarApplication {
    public static void main(String[] args) {
        SpringApplication.run(UnivmarApplication.class, args);
    }
}
```

`@SpringBootApplication` combines configuration, automatic configuration, and component scanning. Since the application class is in `com.univmar`, Spring scans that package and its subpackages for components. `@EnableScheduling` enables scheduled tasks configured elsewhere in the application.

## 3. Beans and dependency injection

A **bean** is an object managed by Spring's application context. Rather than a controller constructing its service manually, Spring provides the service through the constructor:

```java
private final OrderService orders;

public OrderController(OrderService orders) {
    this.orders = orders;
}
```

This is **constructor injection**. Spring creates and connects the required components. It makes dependencies explicit and also makes components easier to test with substitutes. `@Service`, `@RestController`, and `@Configuration` identify different kinds of Spring-managed components.

## 4. REST controllers

A controller receives HTTP requests and returns a response. In [OrderController](../backend/src/main/java/com/univmar/order/api/OrderController.java):

```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    // ...
    @GetMapping("/{id}")
    public ApiResponse<Response> detail(@PathVariable UUID id, HttpServletRequest request) {
        return ok(orders.detail(id), request);
    }
}
```

`@RestController` makes return values HTTP response bodies, normally serialized to JSON. `@RequestMapping` sets the common route; `@GetMapping` defines the GET endpoint. `@PathVariable` extracts the ID from the URL. Other annotations in the project include `@PostMapping`, `@RequestParam`, and `@RequestBody`.

For example, `GET /api/v1/orders/{id}` reads an order, while `POST /api/v1/orders/{id}/confirm` requests a state-changing action. The endpoint is subject to security rules.

## 5. DTOs and validation

A **data transfer object (DTO)** defines data entering or leaving the API. It allows the API contract to differ from the database entity. UNIVMAR often uses Java `record` types for DTOs; records are concise classes designed for carrying data.

In [AuthController](../backend/src/main/java/com/univmar/auth/api/AuthController.java), the login request uses `@NotBlank`, `@Email`, and `@Size`. The controller's `@Valid` asks Spring to validate the input before the method runs. Validation failures are handled centrally by [ApiExceptionHandler](../backend/src/main/java/com/univmar/common/api/ApiExceptionHandler.java).

## 6. Services and business rules

A service contains application behavior. [OrderService](../backend/src/main/java/com/univmar/order/OrderService.java) checks quotation status and stock before creating an order. It coordinates multiple domain objects and repositories. Some state-changing behavior also lives on domain entities, such as `SalesOrder.confirm()`.

Keeping HTTP handling separate from business rules helps a reader locate responsibilities. The separation is a convention in this project, not a rule enforced by Java: for example, `AuthController` directly uses a repository, password encoder, and JWT service.

## 7. JPA, Hibernate and entities

**JPA** is the Java persistence specification. **Hibernate** is the JPA implementation used by Spring Boot here. An entity maps a Java class to persistent data:

```java
@Entity
@Table(name = "customer_order")
public class SalesOrder {
    @Id private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
```

This is an excerpt from [SalesOrder](../backend/src/main/java/com/univmar/order/domain/SalesOrder.java). `@Entity` marks a persistent class, `@Table` specifies its table, and `@Id` identifies its primary key. `@ManyToOne` describes the relationship with a customer; `LAZY` means the related data is generally loaded when needed within a suitable persistence context. The same entity uses `@OneToOne`, `@OneToMany`, `@Column`, and `@Enumerated`.

## 8. Repositories

Spring Data JPA provides repository implementations. In [SalesOrderRepository](../backend/src/main/java/com/univmar/order/domain/SalesOrderRepository.java), extending `JpaRepository<SalesOrder, UUID>` provides common operations such as `findById` and `save`. Spring Data also derives a query from `findByQuotationId`. A custom JPQL query and pessimistic lock are used by `findByIdForUpdate`.

`JpaSpecificationExecutor` supports dynamic criteria, used by the service when listing orders with filters.

## 9. Transactions and concurrency

`@Transactional` on `OrderService` defines transaction boundaries for its public operations when invoked through Spring. A transaction groups database changes: if an unchecked exception causes a rollback, the associated changes in that transaction are rolled back. Read methods can use `@Transactional(readOnly = true)` to indicate read-only intent.

This matters when accepting a quotation: creating an order and reserving inventory need to succeed together. The code also uses database locking on relevant rows to protect concurrent operations. A transaction by itself does not automatically prevent all concurrency problems; the lock and the database's behavior are relevant too.

## 10. Security and JWT

Spring Security runs filters before a protected request reaches its controller. In this project, the login endpoint verifies credentials against a BCrypt password hash and issues a JWT. The frontend sends the token in the `Authorization` header; the JWT filter processes it, and [SecurityConfig](../backend/src/main/java/com/univmar/auth/SecurityConfig.java) applies route and role rules. Some service methods perform additional ownership checks.

**Authentication** answers “who are you?” **Authorization** answers “are you allowed to do this?” A signed JWT is not the same thing as encryption: do not assume its contents are secret.

For a step-by-step explanation of BCrypt, the filter chain, token validity, and quotation ownership, read the [Spring Security deep dive](spring-security.md).

## 11. Configuration and migrations

[application.yml](../backend/src/main/resources/application.yml) supplies defaults and references environment variables for settings such as datasource and storage. Configuration changes by environment; production must use appropriate secrets rather than development defaults.

Flyway executes versioned migrations such as `V11__orders_and_inventory_reservations.sql`. This gives the schema a tracked history and provides a repeatable way to apply changes to a database.

## 12. Error handling and tests

`@RestControllerAdvice` on [ApiExceptionHandler](../backend/src/main/java/com/univmar/common/api/ApiExceptionHandler.java) centralizes API error responses. The project maps application errors and input validation errors to structured responses with status codes, messages, and request IDs.

JUnit and Spring test support are used in the test suite. A unit test focuses on a small component, while an integration test checks components working together. The project's integration tests use the Spring application context and database configuration; they do not prove every production environment or scenario works.
