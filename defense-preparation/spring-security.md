# Spring Security in UNIVMAR

Suppose two sales agents, Salma and Karim, are both signed in. Salma can accept her own quotation. Karim tries to accept that same quotation and receives a 403. Both have valid passwords, both hold valid tokens, and both have the sales role. **What does the backend know at each step, and where does it learn who owns the quotation?** Follow these two requests to explain the whole design.

## 1. Where Spring Security sits

In this Spring MVC application, a servlet filter can inspect an HTTP request before Spring MVC selects a controller. Calling `chain.doFilter` passes the request onward. A filter can also end processing and write an HTTP response. This lets the API apply one authentication policy to many controllers. Spring’s `DelegatingFilterProxy` connects the servlet container to the Spring-managed `FilterChainProxy`, which selects the applicable `SecurityFilterChain`. [Spring Security servlet architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)

UNIVMAR defines that chain as a bean. At startup, `HttpSecurity` builds it from the rules in `SecurityConfig`. At request time, the chain runs those rules. The call to `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` places the project’s JWT filter at a known position before authorization. The reference to the username/password filter is an ordering instruction. Staff login itself is a JSON controller method. [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java) · [AuthController.java](../backend/src/main/java/com/univmar/auth/api/AuthController.java)

| Question at request time | Component with the evidence |
| --- | --- |
| Who has presented acceptable credentials? | The login controller checks the password. On later requests the JWT filter verifies the token and loads the account. |
| May someone in this role perform this HTTP operation? | Spring Security evaluates the method and path against the configured rules. |
| May this employee change this particular record? | The business service loads the record and calls the ownership check. |
| Can the operation succeed in the record’s current state? | The business service checks conditions such as quotation status and expiry. |

## 2. The login request exchanges a password for an access token

1. Salma submits her email and password. The React client sends JSON to `POST /api/v1/auth/login`. This method and path have a `permitAll()` rule, so someone without a token can reach the controller. Credential verification still takes place inside that controller.
2. Spring MVC validates `LoginRequest`. For example, a blank email or a password outside the declared length fails input validation. For a well-formed request, the controller trims the email, performs a case-insensitive lookup, and selects an active account.
3. The controller calls `encoder.matches(input.password(), candidate.getPasswordHash())`. BCrypt generates a random salt when a password is encoded and stores the salt and work factor in the encoded value. At login, the encoder uses those stored parameters to check the candidate password. Two accounts can have the same password and different hashes. The work factor makes each guess computationally costly. [Spring’s password storage reference](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)
4. An unknown email, an inactive account, and an incorrect password all produce `401 INVALID_CREDENTIALS` for a well-formed login. This gives the caller the same explanation in all three cases. On success, the response contains `data.accessToken` and a user summary with ID, email, and role. The password hash stays on the server. [AuthController.java](../backend/src/main/java/com/univmar/auth/api/AuthController.java) · [UserAdministrationService.java](../backend/src/main/java/com/univmar/user/UserAdministrationService.java)

## 3. What the JWT proves

A JSON Web Token (JWT) issued here has three dot-separated parts. The header describes the signing algorithm. The payload contains claims. The signature authenticates the encoded header and payload with an HMAC key shared by issuance and verification. A change to the payload invalidates the signature. Anyone holding the token can read its encoded claims, and possession of a valid bearer token is sufficient to present it. This is why protecting the token in transit with HTTPS matters. [JwtService.java](../backend/src/main/java/com/univmar/auth/JwtService.java)

| Claim written by UNIVMAR | How to explain it |
| --- | --- |
| `sub` (subject) | The user UUID. The filter uses this stable identifier to retrieve the account. |
| `email`, `role` | Snapshots from issuance. The filter takes the authority for the current request from the user row. |
| `iat`, `exp` | Time of issue and time of expiry. The configured lifetime is 30 minutes. JJWT checks expiry when parsing the signed claims. |
| `credentialsVersion` | The account’s password-reset counter at issuance. The filter compares it with the current value. |

The signing secret belongs on the backend. The service checks its minimum configured length and rejects the built-in development secret under the production profile. The React client only needs the issued token. [JwtService.java](../backend/src/main/java/com/univmar/auth/JwtService.java) · [application.yml](../backend/src/main/resources/application.yml)

## 4. How the next request acquires an identity

Salma clicks **Accept quotation**. The client sends a new request to `POST /api/v1/orders/from-quotation/{quotationId}` with an `Authorization: Bearer …` header. Her password played its part at login. Here is how the backend decides which employee this new request represents. [Frontend API client](../frontend/src/shared/api/client.ts) · [OrderController.java](../backend/src/main/java/com/univmar/order/api/OrderController.java)

1. `JwtAuthenticationFilter` extends `OncePerRequestFilter`. In its normal request dispatch it reads the authorization header, recognizes the bearer prefix, and passes the token to `JwtService.parse`.
2. JJWT verifies the signature using the configured key and checks the token’s expiration. The filter uses the verified subject as a UUID to look up the user. The account must exist, be active, and have a matching credentials version. A legacy token missing the version claim is accepted by this comparison only while the stored version is zero.
3. For a matching account, the filter builds an `Authentication` object using the three-argument `UsernamePasswordAuthenticationToken` constructor. The principal is the UUID string, the credentials field is `null`, and the authority list contains a value such as `ROLE_SALES_AGENT`. This object is Spring’s in-memory representation of the authenticated employee. The JWT was the evidence used to construct it.
4. The filter puts that object into `SecurityContextHolder`. The security context makes the identity available to authorization and downstream application code during this request. For example, `authentication.getName()` yields the UUID string. An ownership check that needs an email resolves the UUID through the user repository.
5. The filter calls `chain.doFilter`. With a missing bearer header, it simply continues. With a malformed or expired JWT, it clears the context and continues. A failed account check supplies no staff identity. The downstream route rule determines the result. A public catalog read can proceed anonymously, while the protected order request requires an authenticated employee. [JwtAuthenticationFilter.java](../backend/src/main/java/com/univmar/auth/JwtAuthenticationFilter.java) · [AccessControlService.java](../backend/src/main/java/com/univmar/auth/AccessControlService.java)

**Why query the database if the JWT is signed?** A signature establishes what the server issued at login. Only the current account row tells the filter whether Salma is still active and which role she holds now. `SessionCreationPolicy.STATELESS` means Spring Security does not use an HTTP session to remember her identity between requests. Each bearer request reconstructs that identity and incurs a user lookup. This is the trade-off UNIVMAR makes for applying account changes on the next request. [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java) · [JwtAuthenticationFilter.java](../backend/src/main/java/com/univmar/auth/JwtAuthenticationFilter.java)

## 5. How the route gets a yes or a no

Spring evaluates the authorization matchers in declaration order and uses the **first match**. Read a rule as a combination of HTTP method, path, and required authority. `hasRole("ADMIN")` looks for `ROLE_ADMIN`. `hasAnyRole(COMMERCIAL)` accepts any role named in the commercial group. Those groups are explicit arrays in UNIVMAR, so a manager’s permissions depend on which arrays include `MANAGER`. [Spring’s request authorization reference](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html) · [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java)

| Example request | First applicable policy |
| --- | --- |
| `GET /api/v1/public/catalog/…` | Public catalog reads are permitted anonymously. |
| `GET /api/v1/users` | User administration requires `ADMIN`, including for reads. |
| `POST /api/v1/orders/from-quotation/{quotationId}` | Commercial group: admin, manager, or sales agent. |
| `POST /api/v1/inventory/receipts` | Warehouse group: admin, manager, or inventory manager. |
| `POST /api/v1/suppliers` | Procurement group: admin, manager, or purchasing manager. |
| `POST /api/v1/invoices/{id}/payments` | Admin or manager. |
| `GET /api/v1/materials` | The general ERP read rule allows all five staff roles. |

Order matters twice in this configuration. First, the user administration rule precedes the general staff read rule, so a sales agent cannot list users. Second, the general `GET /api/v1/**` rule precedes `anyRequest().denyAll()`. A newly added API read therefore already matches the staff rule unless it has an earlier restriction. A new write outside the listed rules falls through to denial. This distinction matters when explaining what “deny by default” covers. [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java)

## 6. Why Salma and Karim get different results

Assume the quotation exists, the acceptance form is valid, and both employees still have the sales role. The route rule allows both to enter the order controller. The controller then calls `OrderService.acceptQuotation`, which loads the quotation with `findByIdForUpdate` and passes the stored sales agent to `requireSalesOwnership`. The service now has the one fact the URL rule lacked: the owner of this particular quotation. [OrderController.java](../backend/src/main/java/com/univmar/order/api/OrderController.java) · [OrderService.java](../backend/src/main/java/com/univmar/order/OrderService.java)

| Caller and situation | Where the decision happens | Result |
| --- | --- | --- |
| Caller has no usable token | Security chain, before the controller | `401 UNAUTHENTICATED` |
| A signed-in inventory manager submits the request | Commercial route rule | `403 FORBIDDEN` |
| Karim submits Salma’s quotation | Ownership check compares the current user’s email with the quotation’s sales agent, ignoring case | `403 RECORD_ACCESS_DENIED` |
| Salma submits her own quotation, but its expiry date has passed and its status is still `SENT` | Order service checks the expiry date after ownership and status | `409 QUOTATION_EXPIRED` |
| Salma submits her own eligible quotation with sufficient stock | Identity, role, ownership, and business checks all pass | The service creates the order and reserves stock in the transaction. |

An admin or manager also passes the commercial route rule. The ownership restriction in this method applies specifically to sales agents. The quotation’s status, expiry, and stock conditions still apply to management. That distinction explains how a manager can assist another employee while the workflow continues to enforce valid orders. [AccessControlService.java](../backend/src/main/java/com/univmar/auth/AccessControlService.java) · [Quotation-to-order walkthrough](04-code-walkthrough.md)

**Who writes the error?** The authentication entry point writes the chain’s JSON 401. The access-denied handler writes the chain’s JSON 403 and attempts to audit the denied method and URI. Both include a request ID. An ownership denial is an application `ApiException` handled by MVC, which explains why it has a different error code even though its HTTP status is also 403. [Authentication entry point](../backend/src/main/java/com/univmar/auth/ApiAuthenticationEntryPoint.java) · [Access-denied handler](../backend/src/main/java/com/univmar/auth/ApiAccessDeniedHandler.java) · [MVC exception handler](../backend/src/main/java/com/univmar/common/api/ApiExceptionHandler.java)

## 7. What happens after login, logout, or an account change?

| Event | What happens on the next request |
| --- | --- |
| Salma reloads the browser tab | React finds the token in local storage and calls `/auth/me`. The filter authenticates the request, then the controller returns the current user summary. |
| An admin changes her role | The filter builds the authority from the updated account row. The UI may still show the old role until its user state refreshes. The backend applies the new role immediately on the next request. |
| An admin deactivates her account | The active-account check fails, so her existing token cannot establish an identity while the account is inactive. |
| An admin resets her password | The reset stores a new BCrypt hash and increments `credentialsVersion`. All previously issued tokens for the account fail the version comparison, even before expiry. |
| The token expires | A protected API call returns 401. The shared API client removes the token and signals the auth provider to clear the user. Signing in again obtains a new token. |
| Salma clicks logout | React deletes its local token and clears the user. Logout performs no server-side revocation, so another copy remains usable until expiry or a failing server-side account check. |

For example, a token issued at version 3 can still have ten minutes left when the admin resets the password. The next request compares 3 from the signed token with 4 in the database. It fails immediately. The same person logging in with the new password receives a token carrying 4. [User.java](../backend/src/main/java/com/univmar/user/domain/User.java) · [JwtAuthenticationFilter.java](../backend/src/main/java/com/univmar/auth/JwtAuthenticationFilter.java) · [AuthProvider.tsx](../frontend/src/features/auth/AuthProvider.tsx) · [Frontend API client](../frontend/src/shared/api/client.ts)

## 8. Browser security questions the jury may ask

**Why configure CORS if every write already has a role rule?** CORS governs which other origins a browser allows to call the API and read the response. An origin consists of scheme, host, and port. For a cross-origin request carrying an authorization header, the browser normally sends an `OPTIONS` preflight asking whether the origin, method, and headers are allowed. UNIVMAR configures an origin allowlist and allows headers including `Authorization`. An approved preflight lets the browser send the actual request, which still goes through authentication and authorization. [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java)

**Why disable CSRF protection here?** Cross-site request forgery matters when a browser automatically attaches a user’s credentials to a request initiated from another site. In this staff client, JavaScript explicitly reads the token and attaches the bearer header. A form submitted from another origin does not acquire that header. The choice depends on credential delivery. Moving authentication into an automatically sent cookie would require revisiting CSRF protection, even if the cookie contained a JWT. [Frontend API client](../frontend/src/shared/api/client.ts) · [Spring’s CSRF reference](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)

**What trade-off comes with local storage?** It keeps the user signed in across page reloads and lets the client attach the bearer header. Scripts running in the application’s origin can read it, so a cross-site scripting flaw could expose the token. Hiding a navigation item serves a different purpose: it guides the employee through the interface. The backend still enforces permission on every protected operation. [AuthProvider.tsx](../frontend/src/features/auth/AuthProvider.tsx) · [Frontend permissions](../frontend/src/features/auth/permissions.ts)

## 9. How to demonstrate the design at the defense

Open `salesCanReadCatalogButCannotAdjustInventory`. The test gives a mock sales user two operations. Reading materials returns 200. Posting an inventory receipt returns 403. The same identity makes both requests, so the differing results isolate the route permissions. The parameterized test in the same class tries each staff role against representative routes. For allowed combinations it accepts outcomes other than 401 and 403 because an authorized request can still fail input validation. These tests supply the identity directly, so they exercise authorization independently of password login and token parsing. [RoleAuthorizationIntegrationTest.java](../backend/src/test/java/com/univmar/auth/RoleAuthorizationIntegrationTest.java)

Next, open `salesAgentCannotChangeAnotherAgentsQuotation` alongside `salesAgentCanChangeOwnQuotation`. Here the role stays constant and the record owner changes. Together the two test classes let you demonstrate, with one variable changing at a time, why UNIVMAR needs both route permissions and record ownership. [AccessControlServiceTest.java](../backend/src/test/java/com/univmar/auth/AccessControlServiceTest.java)

**One-minute answer to rehearse**

> “When Salma signs in, our login controller checks her password with BCrypt and issues a signed, time-limited token. When she accepts a quotation, the browser sends that token in the authorization header. Our filter verifies it, loads her current account, and records her ID and role in Spring’s security context for this request. Spring then checks whether her role may create an order. A sales agent passes that check. The order service still has to load the quotation and check whether it belongs to her. That explains three outcomes: an expired login gets 401, another agent’s quotation gets 403, and her own expired quotation gets 409. Each answer tells us which decision stopped the operation.”
