# Business logic, scenarios and live-defense rehearsal

The examples are invented for practice, not real customer data. Source of truth: [main workflow integration test](../backend/src/test/java/com/univmar/workflow/MainBusinessWorkflowIntegrationTest.java), service classes, and route authorization in [SecurityConfig](../backend/src/main/java/com/univmar/auth/SecurityConfig.java). The test uses service calls in a Spring context, not a browser; its existence is not proof it passed in this session.

## 1. Understand the business vocabulary

- **Material** = commercial identity, e.g. a marble type. **Variant** = a specific finish/thickness/format. **Inventory item** = actual stock for a variant in a warehouse/location/lot. **Slab** = individually tracked physical piece; **remnant** = reusable offcut.
- **Enquiry** = initial contact. **Customer** = person or company. **Project** = the customer's work/site. **RFQ** = request for quotation describing needed quantities, material and services. **Quotation** = priced offer. **Order** = accepted commercial commitment. **Purchase order** = order placed with a supplier, not a customer sales order.
- **On hand** = physically recorded stock. **Reserved** = stock allocated to commitments. **Damaged** = unusable quantity. **Available** = on hand − reserved − damaged. **Delivery** = physical fulfilment; **invoice** = receivable; **payment entry** = evidence of money received externally, not a card transaction.

## 2. Main scenario: from customer demand to payment

Imagine a customer requests 1.5 m² of polished 20 mm marble for a project in Casablanca. The supplier has delivered 3 m². Amounts and quantities below are examples.

1. **Catalogue and stock setup.** Create or find the material and matching variant. A purchasing user creates a supplier purchase order for 3 m²; confirm it, then record receipt in a warehouse/location. The goods receipt and inventory receipt movement document what physically arrived. Ordering 3 m² is not itself evidence that 3 m² was received. The source test confirms a purchase order directly before receipt; sending is a supported separate action, not a universal prerequisite asserted here.
2. **Capture and qualify demand.** A visitor can submit an enquiry on the public website. A salesperson reviews it and qualifies the need using customer, project and RFQ records. Capture identity, site, requested material, quantity, dates and relevant service details. A website enquiry is not yet an accepted order.
3. **RFQ.** Create an RFQ with an item for the variant and submit it, then start review. The test observes `UNDER_REVIEW`. A quotation may refer to this RFQ, customer and project; sending the quotation updates the RFQ to `QUOTED` in the tested path.
4. **Quotation.** Create a priced quotation with a future expiry and line quantity 1.5 m². Send it or create a share link through supported actions. Customer-facing response and staff acceptance are distinct: a response records customer intent; order conversion is the protected business action. Email delivery depends on configuration and should not be promised during a demo without testing it.
5. **Acceptance and reservation.** A sales user accepts a sent, unexpired quotation with variants on all lines and no existing order. In one transaction the service creates a pending order, locks relevant stock rows, checks the total availability, reserves quantities across rows, marks the quotation accepted and records events. If only 1.0 m² is available, acceptance returns a conflict; it should not silently allocate 1.5 m². If all 3 m² are clean/unreserved, accepting 1.5 leaves 1.5 available. Confirmation is a separate action after acceptance; it does not initiate the reservation in the current code.
6. **Fabrication, when needed.** Create a job for the order and track the workshop stages. The integration test advances DRAWING → MATERIAL_ALLOCATED → CUTTING → FINISHING → QUALITY_CONTROL → READY, assigns material and completes operations at the appropriate stage. Slabs and reusable remnants have their own lifecycle. Allocation/consumption rules matter: do not claim all orders require fabrication or that selecting a slab is the same as order-level reservation.
7. **Delivery.** Create a delivery against the order and lines, prepare if desired, then dispatch. Dispatch consumes active order reservations and decreases both on-hand and reserved stock; a dispatch may be partial. Confirm delivery after dispatch. The order reaches DELIVERED only after the service's checks on reservation consumption and delivery finality pass. A dispatched delivery cannot simply be cancelled through the pre-dispatch cancel path.
8. **Invoice and payments.** A confirmed or fulfilled order can have one invoice created as draft, then issued. Assume an illustrative total of 1,800 MAD: record 600 received by bank transfer and 1,200 remains; recording the remaining 1,200 clears the balance. Payment greater than the outstanding balance is rejected. An invoice with recorded payments cannot be voided. The system records payments; it does not execute the transfer.

### Numerical stock trace

| Event | On hand | Reserved | Damaged | Available |
|---|---:|---:|---:|---:|
| Receive | 3.0 | 0 | 0 | 3.0 |
| Accept quotation | 3.0 | 1.5 | 0 | 1.5 |
| Dispatch 1.0 | 2.0 | 0.5 | 0 | 1.5 |
| Dispatch remaining 0.5 | 1.5 | 0 | 0 | 1.5 |

The example abstracts away separate workshop material consumption and damage. Reservation changes availability but does not physically remove stock; dispatch removes reserved stock. All numbers are m².

## 3. Alternative and error scenarios

- **Insufficient stock:** a quotation may be prepared, but acceptance fails if required availability is insufficient. Procure/receive material or revise the commercial agreement, then retry. Explain the transaction rollback and locking; do not promise serializability beyond what the database and queries actually enforce.
- **Expired, unsent or already converted quotation:** acceptance rejects it. Every line also needs a variant. Customer acceptance evidence is recorded when staff converts the quote; a public reply is not the same as the order operation.
- **Concurrent customers:** two agents try to reserve the same remaining stock. The service uses database `for update` queries to protect rows during the transaction, checks availability and allocates. The intended result is preventing double allocation; full confidence needs concurrent tests against the production database configuration.
- **Partial receipt:** receiving less than ordered tracks actual receipts and leaves outstanding quantities. A receipt is allocated to a warehouse and inventory item. Follow the status shown in the UI/test rather than inventing status labels.
- **Partial delivery:** dispatch part of an order; the remaining reservation stays allocated. A later delivery handles the balance. The order is only marked delivered after the finality checks succeed.
- **Cancellation before dispatch:** eligible order cancellation releases active remaining reservations and cancels eligible planned/preparing deliveries. With dispatched or delivered deliveries, ordinary cancellation is rejected to preserve physical history.
- **Partial/overpayment:** a partial payment leaves a balance; payment larger than the balance is rejected. Paid or partially paid invoices cannot be voided. Overdue is a date/status calculation, not proof of a collection action.
- **Unauthorized staff:** a purchasing manager can mutate purchasing endpoints, but this does not imply they can mutate invoice endpoints. A salesperson can be restricted by ownership in addition to route role; backend enforcement remains authoritative.
- **Public enquiry failure/email failure:** a public form can validate and persist data according to implementation; do not claim email succeeded just because a browser showed a success screen. Demonstrate an already stored example if external mail is unavailable.

## 4. Jury demo — from public enquiry to billing (3 to 5 minutes)

**Objective:** show how a customer contacts UNIVMAR through the public website and how staff follow the commercial process in the ERP. Aim for **4 minutes**. Use fictitious data and prepared records.

### Prepare before the jury

- Start and check the public website and ERP. Test the contact form and confirm that a submitted enquiry appears in the ERP. Sign in to the ERP beforehand with an authorized account; keep credentials and tokens off screen.
- Prepare a unique fictitious enquiry, for example: **Demo Client**, `demo@example.test`, `0600000002`, “Please quote 2 m² of polished marble for my kitchen in Casablanca.” Use a fresh name or suffix so you can find it quickly. Do not use a real person's contact details.
- Open the public contact page and the ERP enquiry workspace in browser tabs. Rehearse finding and opening the new enquiry. If you plan to qualify it live, rehearse the required fields and call confirmation using test data; qualification creates or links customer and project records.
- Prepare a **separate** sent, unexpired quotation for 2 m² of a specific variant, with sufficient available stock. Prepare an order, delivery and invoice for another completed example, with 2,400 MAD invoiced, 600 MAD recorded as paid and 1,800 MAD outstanding. Open the most useful screens in advance. Make clear that the prepared examples do not come from the enquiry submitted during the demo.
- Keep screenshots of a submitted enquiry and the prepared records as a backup. See the [manual testing guide](11-manual-testing-guide.md) for setup and detailed steps. Check the form before the presentation; email delivery depends on configuration.

### Timed script

**0:00–0:45 — Public website and enquiry**  
Open the public website and briefly show the catalogue or a material. Say: “A customer can explore the materials offered by UNIVMAR and contact the company through the website.” Open the contact form, enter the prepared fictitious details and submit. Point out the acknowledgement if it appears.

**0:45–1:30 — Enquiry in the ERP**  
Switch to the ERP enquiry workspace, refresh if necessary and open the new enquiry. Match its name and request to the form. Say: “The enquiry is now available to staff for follow-up. The team can review the request and qualify it with customer and project information.” If rehearsed and time permits, show the qualification action and its required fields; do not claim it was completed unless you actually complete it.

**1:30–2:30 — Quotation and stock**  
Open the prepared quotation and identify it as a **separate example**. Point to the customer, variant, quantity and price. Show the matching inventory and available stock. Say: “After understanding the customer's needs, staff can prepare a quotation. When an eligible quotation is accepted in the ERP, the system checks availability, creates a pending order and reserves the quantity.” If you have rehearsed acceptance and have a fresh quotation ready, record acceptance and show the resulting order and refreshed reservation. Otherwise, show the prepared order and reservation without claiming a live action occurred.

**2:30–3:30 — Delivery and billing**  
Open the prepared completed order and its delivery and invoice. Say: “Staff can follow the order through dispatch and delivery, then issue an invoice and record payments.” Point to the actual status and balance: “This example has an invoice of 2,400 MAD, with 600 MAD recorded as received and 1,800 MAD still due.” The application records payments; it does not execute a bank transfer.

**3:30–4:00 — Close**  
Say: “The platform connects the public enquiry with staff follow-up and supports the commercial process through stock, delivery and billing.” Invite questions.

### Adapt to the time available

- **3 minutes:** submit the enquiry, show it in the ERP, then show the prepared quotation, order and invoice briefly. Explain reservation and delivery in one sentence each.
- **5 minutes:** use the extra minute to demonstrate enquiry qualification or a rehearsed quotation acceptance. Avoid trying to create every dependent record from scratch.
- **If the enquiry submission fails:** say what happened and show the previously saved enquiry or screenshots. A form acknowledgement alone does not prove an email was delivered. If another action fails, show prepared evidence and describe only what actually happened.

## 5. Self-test: answer aloud

1. Why is a material variant different from an inventory item? 2. How do you calculate available stock? 3. At what exact step does this code reserve? 4. What happens when stock is insufficient? 5. How do you avoid losing consistency if two users reserve at once? 6. What changes at dispatch? 7. What can happen on partial delivery? 8. Why can't a dispatched order simply be cancelled? 9. What is the difference between a purchase order and a goods receipt? 10. When is an invoice allowed, and how many per order? 11. Can this system actually transfer money? 12. Why do you need both route and ownership checks? 13. What happens if a payment exceeds the balance? 14. Is a customer clicking a public response the same as creating an order? 15. Which parts of the demo were tested live today?
