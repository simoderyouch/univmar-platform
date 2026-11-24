# Diagrams: how to read and defend them

Use this with [the speech](07-complete-defense-speech.md). The most important diagrams are visible on slides 10–14 of [the presentation](../docs/univmar_defense.pdf). Figure references below refer to printed report numbering in [the report](../docs/mohamed%20ed%20deryouch%20report%20internship.pdf), not necessarily PDF page numbers. Report figures are design explanations, not automatic proof that every part of a deployment is live.

## UML notation in one minute

- **Actor**: an external role interacting with a system; one person can play several roles. **System boundary**: the rectangle delimiting what is modeled. **Use case**: a goal, not a screen or a method.
- **Association**: interaction or structural relation depending on diagram type. **Multiplicity** `1`, `0..1`, `0..*`, `1..*` describes allowed numbers on the opposite end. Read both ends, and do not assume the database enforces every drawn multiplicity.
- **Composition**, black diamond: whole/part relation with strong lifecycle ownership in the model. An arrow can indicate navigability or a message depending on diagram; explain the legend/context instead of claiming every arrow has the same meaning.
- **«include»**: required reused behavior in the modeled use case. **«extend»**: conditional additional behavior; the arrow points from extension to base. Neither means ‘happens later’ by itself.
- **Sequence**: participants across the top, time progresses down, messages show calls and responses. `alt` models alternatives; `loop` models repeated work. A **state diagram** shows states and permitted event-triggered transitions; it differs from a sequence diagram, which shows interactions.

## Slide 8: three pillars and business flow

The website attracts and captures demand, ERP manages it internally, and cloud/DevOps provides deployment infrastructure. The arrows at the bottom are a simplified business story, not proof that every order requires every step in that order. A quotation acceptance can fail if stock is insufficient; purchasing may be necessary first; fabrication is conditional; an invoice may be created after confirmation before final delivery.

## Slide 10 / report figure 1.5: sales use cases

The actor is Sales Staff; the rectangle groups sales and customer management. The six goals include RFQ qualification, quotation preparation, accepting a quotation and creating an order, website enquiry follow-up, converting/qualifying an enquiry, and maintaining customers and projects. `include` connects acceptance to reservation, and qualification to customer/project management. The `extend` connection shows enquiry qualification as a conditional extension of follow-up. Describe this as an intended business view; actual authorization and ownership are enforced by backend rules, not by the drawing.

## Slide 11 / report figure 2.4: inventory class diagram

Read it left to right. **StoneMaterial** describes a stone; **StoneVariant** specializes the commercial item (e.g. 20 mm, polished). A **Warehouse** holds stock, and a **WarehouseLocation** identifies a more precise place. An **InventoryItem** identifies stock for a variant at a location/lot and keeps on-hand, reserved and damaged m². An **InventoryReservation** connects an order line to an inventory item and records quantity, consumed amount and status. **DeliveryItem** identifies the amount of a particular order line in a delivery. **StockMovement** provides history, including receipt, reservation, release and delivery. Enumerations list allowed statuses/types.

Example: on-hand 100 m², damaged 5, already reserved 20; available = 75. Reserve 30: on-hand remains 100, reserved becomes 50, available becomes 45. Dispatch 10 of that reservation: on-hand becomes 90, reserved 40, available remains 45. Cancel eligible remaining reservation of 20: reserved falls to 20 and available rises to 65. These are illustrative figures, not measured business results.

Reservation is linked to an order line and can be split across inventory rows. In current code acceptance of a SENT and unexpired quotation creates the pending order and reserves stock transactionally; order confirmation follows. [OrderService](../backend/src/main/java/com/univmar/order/OrderService.java), [InventoryItem](../backend/src/main/java/com/univmar/inventory/domain/InventoryItem.java), [DeliveryService](../backend/src/main/java/com/univmar/delivery/DeliveryService.java).

## Slide 12 / report figures 2.1–2.2: logical architecture

Top: public visitor uses Next.js; authenticated staff use React/TypeScript. Middle: Spring Boot exposes public and protected REST routes, with authentication/role checks and services grouped by business responsibility. Bottom: repositories use JPA to persist data in PostgreSQL. Side connections show storage for images/attachments and email notifications. The arrow direction indicates a dependency or interaction, not that every module directly talks to every other module. A database stores structured operational facts; object storage stores file content. The representation is a modular application, not evidence of independently deployed microservices.

A concrete request: a staff browser sends JSON with a bearer token → security filter validates the token and loads the user → route rules check the role → controller validates/deserializes request → transactional service checks business conditions → repositories read/write entities → response DTO and request ID are returned. Exceptions become API error responses. Database commit/rollback depends on transactional boundaries and exception type.

## Slide 13: pipeline

Developer → GitHub → Actions builds Docker images → ECR → a separate deployment workflow selects the revision → AWS OIDC role → Terraform plan → production environment gate if configured → apply the saved plan → ECS service stability and smoke checks. Build/push and deploy are separate workflows: inspect [container-images.yml](../.github/workflows/container-images.yml) and [production-deploy.yml](../.github/workflows/production-deploy.yml). The production environment declaration does not by itself prove manual reviewers are enabled. Do not state that backend test execution is a pipeline gate unless the workflow actually runs it.

## Slide 14 / report figure 4.1: physical AWS view

Follow a request from user → DNS → edge/CDN and WAF as drawn → application load balancer → ECS application task → private PostgreSQL. The VPC contains public load-balancer subnets, private application subnets and private database subnets in two availability zones. ECR provides images; Secrets Manager provides secrets; CloudWatch receives operational data; S3 holds assets and separate infrastructure state. VPC endpoints provide private service access where configured. Security groups and network policies control traffic, and TLS protects connections where configured.

**Critical design/reality distinction:** the picture shows a Multi-AZ primary/standby database and application boxes in both zones. Current [database.tf](../infra/production/database.tf) sets `multi_az = false`; [API service](../infra/production/api-service.tf) and [web services](../infra/production/web-services.tf) each set `desired_count = 1`. Two subnets do not alone create two running tasks or a standby database. Treat CloudFront/WAF and other pictured elements as design unless verified in the deployed configuration. Check real AWS state before claiming live availability or failover.

## Remaining report diagrams and figures

- **1.1–1.3:** host/client relationship, project roadmap, and stakeholder/access boundaries. Explain who owns or uses the solution, stages of work, and why public visitors and staff have different permissions.
- **1.4:** public visitor views content/catalogue and submits an enquiry; access to the public site is not a staff login. Public routes remain a limited API surface.
- **1.6:** catalogue and operational use cases cover material definitions, inventory, reservations, purchasing, fabrication and deliveries. Distinguish a catalogue variant from actual stock.
- **1.7:** finance, documents and administration. Management issues invoices/records payments, staff access records according to permissions, administrators manage users. See actual route and ownership controls before stating a role can perform an action.
- **2.3:** overview of catalogue, customer/project/RFQ/quotation/order, operational and financial entities. Read relationships by business meaning: a project belongs to a customer; quotation/order lines capture what was offered or sold; order reservations connect to stock; invoices and payments track receivables. The picture is conceptual: inspect entity mappings before giving exact cardinalities.
- **2.5:** order, delivery, invoice and payment. One order may be fulfilled through multiple delivery lines; invoice creation is restricted to one invoice per order in this implementation; multiple payments can reduce a balance. Payment here is recorded money, not online payment processing.
- **2.6:** supplier purchase order and lines → goods receipt → inventory movement → fabrication job and materials. Ordering does not equal receiving; partial receipts distinguish what is expected from what is physically received.
- **2.7:** commercial lifecycle overview from demand to payment. Explain the main happy path first and name branches for insufficient stock, cancellation, partial delivery and partial payment.
- **2.8:** visitor → website → public API → enquiry record → staff review/qualification → customer/project and quotation response. Time runs downward; staff follow-up is separate from the synchronous public form response. A public response is not equivalent to automatically creating an order.
- **2.9:** sales acceptance → order/reservation → delivery dispatch → invoice/payment. The alternative for partial payment leaves a balance. Current code reserves at quotation acceptance, then confirmation is a separate action; the report text sometimes places reservation at confirmation.
- **2.10:** purchasing creates/sends or confirms a PO; receipt records actual quantity by line and location; inventory and a receipt movement update transactionally. Partial receipts do not mean the order is fully received. In current route authorization purchasing roles handle purchase-order mutations; do not assume warehouse staff can receive through that route solely from the conceptual diagram.
- **2.11:** order-state view. A transition is event + guard + effect; cancellation cannot erase a dispatched physical event. Cross-check the actual enum and services before stating exact transitions. Report prose incorrectly puts reservation at confirmation relative to the current code.
- **3.1–3.2:** implementation sequence and SEO elements. Explain design → implementation → verification and how titles, content and technical metadata support discovery; no guarantee of rankings.
- **3.3–3.16:** application screenshots, not UML: website home/catalogue/contact, ERP login/dashboard/catalogue/quotation/orders/enquiry/fabrication/delivery/invoice. For each, identify user, action, displayed information and resulting business record. Avoid claiming that a screenshot proves the whole workflow works.
- **3.17–3.21:** historical Search Console and search result screenshots. Three-month view reports 231 clicks, 9.99k impressions, 2.3% CTR, average position 9.8; six-month view reports 266 clicks, 11.4k impressions, 2.3% CTR, 10.7. The windows overlap and must not be added. They do not establish causality or present-day ranking.
- **4.2–4.3:** deployment approval screen and Terraform/ECS log evidence. Explain what the screenshot shows at that moment, without claiming continuing uptime or a permanent approval configuration.

## A good answer to ‘Why these diagrams?’

“Use cases show user goals, class diagrams show the information and associations, sequence diagrams explain collaboration over time, and state diagrams constrain the lifecycle of a particular record. The logical component diagram explains software responsibilities; the deployment diagram explains where the components run. Together they provide complementary perspectives.”
