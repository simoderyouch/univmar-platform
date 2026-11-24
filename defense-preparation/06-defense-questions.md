# 6. Soutenance questions and practice answers

These are **practice questions**, not a prediction of what your jury will ask. Use the answers to understand the ideas, then explain them in your own words. Adapt claims about your work and the company to your actual experience.

## Business and project

### 1. What is UNIVMAR?

UNIVMAR is a platform for a stone business. It includes an internal management application and a public website. The internal application supports activities such as catalog management, inventory, quotations, orders, deliveries, and invoices. The website presents selected information and accepts inquiries.

### 2. What problem does the project address?

It helps connect commercial information with operational information. For example, when a quotation becomes an order, the application can reserve inventory so that the sales process and stock availability stay connected. Describe the company's actual starting problem using facts from your internship.

### 3. Who uses the platform?

Staff roles include administrators, managers, sales agents, inventory managers, and purchasing managers. Their permissions differ by action. Public visitors can use selected website and catalog features without a staff account.

### 4. Can you describe the main business workflow?

A customer request can lead to a quotation. A quotation can then be accepted and converted into an order, with stock reserved as part of that operation. Staff can handle delivery, invoicing, and recorded payments through their respective workflows. Some steps require user actions and are not automatic.

### 5. What is the difference between an RFQ, a quotation, and an order?

An **RFQ** is the customer's request for an offer. A **quotation** is the proposed offer, including items and prices. An **order** records the resulting commercial commitment after acceptance and is used in fulfillment.

### 6. What is the difference between a stock reservation and a delivery?

A reservation commits available stock to an order; it does not mean the material has already been physically delivered. Delivery handles the fulfillment and dispatch process.

## Architecture

### 7. What is the project's architecture?

The internal React frontend and public Next.js website communicate with a Spring Boot API. The API contains business logic and uses a database for structured data and configurable storage for files. The backend is organized by business feature and deployed as one application.

### 8. Why do you call the backend a modular monolith?

It is one deployable application, but its code is grouped into feature packages such as `order`, `inventory`, and `quotation`. Those packages provide logical organization, although some directly depend on one another. They are not independently deployed microservices.

### 9. What happens when a frontend sends an API request?

The frontend uses HTTP, normally sending a bearer token for authenticated operations. Spring Security processes the request, a controller receives it, and a service applies the business rules. The service may use repositories to read or update database data. The controller then returns a response, generally as JSON.

### 10. What is the responsibility of a controller, service, and repository?

The controller handles the HTTP interface; the service coordinates application behavior and business rules; and the repository provides data access. These are the main conventions used in the project, although some classes differ—for example, the authentication controller directly uses a user repository.

### 11. Why use DTOs instead of returning entities directly?

DTOs define the data needed by the API. They can hide persistence details, restrict which fields are exposed, and allow the API representation to differ from the database model. UNIVMAR often expresses DTOs using Java records.

### 12. What is a REST API?

It is an HTTP interface organized around resources and operations. Clients use methods such as GET and POST and exchange representations, often JSON. In this project, routes include `/api/v1/orders` and order-specific actions.

## Spring Boot and Java

### 13. What is Spring Boot, and how does it differ from Spring?

Spring is a framework with capabilities such as dependency injection, web handling, and transactions. Spring Boot builds on it with automatic configuration, starters, and an embedded server, reducing setup needed to run an application.

### 14. What does `@SpringBootApplication` do?

It combines Spring configuration, auto-configuration, and component scanning. In UNIVMAR, the main class is under `com.univmar`, allowing scanning of components in that package and its subpackages.

### 15. What is dependency injection?

It is a way of supplying an object's dependencies instead of having the object create them itself. For example, Spring supplies `OrderService` to `OrderController` through its constructor. This makes dependencies visible and helps testing.

### 16. What is a Spring bean?

A bean is an object managed by the Spring application context. Spring creates and connects many project components, including controllers and services.

### 17. What is the difference between `@RestController` and `@Service`?

`@RestController` identifies a web component whose return values become HTTP response bodies. `@Service` identifies a service component, typically containing application or business behavior. Both are managed by Spring.

### 18. What do `@PathVariable`, `@RequestParam`, and `@RequestBody` do?

`@PathVariable` extracts a value from the URL path, `@RequestParam` reads a query parameter, and `@RequestBody` converts the request body—typically JSON—into a Java object. The order controller uses these patterns.

### 19. What does `@Valid` do?

It requests validation of an input object using its declared constraints, such as `@NotBlank` or `@Email`. Invalid input is handled as a validation error by the application's exception handler.

### 20. What is the role of Maven?

Maven manages project dependencies and the build lifecycle. The backend's `pom.xml` declares Java and Spring Boot versions, libraries, and the Spring Boot Maven plugin. `mvn test` compiles and runs the test suite.

## Persistence and transactions

### 21. What are JPA and Hibernate?

JPA is a Java specification for object persistence. Hibernate is the implementation used here. It maps entities such as `SalesOrder` to database tables and manages persistence operations.

### 22. What is an entity?

An entity is a persistent Java object mapped to database data. `SalesOrder`, for example, is annotated with `@Entity` and mapped to the `customer_order` table. Its ID and relationships are declared using JPA annotations.

### 23. What do `@ManyToOne` and `@OneToMany` mean?

They describe relationships between entity types. Many orders can be associated with one customer, while one order can have many order items. The database stores these relationships through keys, and JPA maps them to Java references or collections.

### 24. What is lazy loading?

Lazy loading means related data is generally fetched when it is accessed rather than immediately with the original entity. It can avoid unnecessary loading, but code must access the relation within an appropriate persistence context and remain aware of extra queries.

### 25. What does `JpaRepository` provide?

It provides common persistence operations such as saving and finding entities. Spring Data also supports methods derived from names, such as `findByQuotationId`, and explicit queries when needed.

### 26. What is a transaction, and why is it useful here?

A transaction groups database changes into one unit of work. When quotation acceptance creates an order and reserves inventory, a failure should roll back the related database changes rather than leave a partially completed operation. Spring's `@Transactional` manages that boundary for the service operation.

### 27. How does the application deal with two users trying to reserve the same stock?

The reservation flow queries relevant stock rows for update and performs the availability check and reservation inside a transaction. Database locking helps coordinate concurrent operations. This reduces the risk of conflicting reservations; the exact behavior also depends on the database and transaction configuration.

### 28. What is Flyway, and why is it used?

Flyway applies versioned database migrations. It gives the schema a history and helps apply database changes consistently across environments. UNIVMAR stores SQL migrations under `backend/src/main/resources/db/migration`.

### 29. Why use PostgreSQL and H2?

The configured development stack uses PostgreSQL, while H2 offers an in-memory fallback useful for local work and tests. They are different database engines, so success on H2 does not guarantee identical behavior in every PostgreSQL scenario.

## Security

Practice tracing one staff request aloud with the [Spring Security deep dive](spring-security.md).

### 30. What is the difference between authentication and authorization?

Authentication establishes who the user is. Authorization determines whether that user is permitted to perform a particular action.

### 31. How does JWT login work in this project?

The login endpoint finds an active user and compares the supplied password against the stored hash. It returns an access token. The frontend sends the token as a bearer token on subsequent requests; the JWT filter processes it and Spring Security applies route permissions. Some services also enforce ownership rules.

### 32. Are passwords stored in plain text?

The login implementation compares the password using a `PasswordEncoder`, and the security configuration provides BCrypt. Explain password hashing rather than saying that passwords are encrypted and later decrypted.

### 33. Is every endpoint protected by authentication?

No. Login and selected public website, catalog, image, and health routes are accessible without a staff session. Staff routes are protected by authentication and role rules.

### 34. What is CORS?

CORS is a browser mechanism governing whether a web page from one origin may access a resource from another origin. The backend configures allowed origins, methods, and headers in `SecurityConfig`.

## Validation, deployment, and limitations

### 35. How is the project tested?

It includes unit and integration tests. Integration tests cover workflows such as inventory, order reservation, delivery, invoices, and authorization. Describe only the tests you actually ran or wrote as your personal contribution.

### 36. What is the difference between a unit and an integration test?

A unit test focuses on a small component in isolation. An integration test verifies interactions between components, such as a Spring service, repositories, and a database. Both are useful, but neither alone proves that every user scenario works.

### 37. What is Docker's role?

Docker packages and runs applications in containers. The project's Compose configuration defines local services including PostgreSQL, MinIO, the API, and the web applications. This helps reproduce the development stack.

### 38. Why use object storage for images and documents?

The application supports local files and S3-compatible storage so file handling can be configured for different environments. In the Docker development stack, MinIO provides S3-compatible storage. Database records and file contents have different storage needs.

### 39. What are the limitations or possible improvements?

Choose improvements you have verified and can explain. Examples of discussion topics include additional coverage for critical workflows, checking production database concurrency behavior, improving observability, or refining module boundaries. Distinguish a proposed improvement from an existing defect; support specific claims with evidence.

### 40. What was your personal contribution?

Prepare an honest, specific answer: identify the features you worked on, your decisions, the code or tests you wrote, and your collaboration with others. Avoid presenting the entire repository as individual work unless that is accurate.

### 41. What was your biggest technical difficulty?

Use a real example. Explain the initial problem, why it was difficult, how you investigated it, the solution you chose, and how you verified the result. If you cannot substantiate an example, do not invent one.

### 42. What did you learn during the internship?

Connect technical learning to practical work: for example, how a transaction protects a business operation, how to structure a Spring application, or how to communicate requirements with users. Replace these examples with what you actually learned.

## Practice routine

1. Answer each question aloud in one or two minutes without reading.
2. Open the relevant source file and verify any implementation detail.
3. Ask a colleague to challenge your answer with “why?” and “what happens if this fails?”
4. Mark the personal questions and prepare evidence from your internship.
5. If you do not know an answer during the defense, say what you know and where you would verify the rest.
