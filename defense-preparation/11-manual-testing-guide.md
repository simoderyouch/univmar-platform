# UNIVMAR manual testing guide: data, steps and expected results

This guide covers the current repository's public website, ERP screens, and important backend-only operations. It is a **test plan**, not a record that the tests have passed. Use a local test database and fictitious data; several tests change stock, financial records or user access. Do not use production or real customer email addresses. UI wording can change; use the named module and action closest to the description. Some API functions are not exposed in the UI and are marked **API only**.

## 0. Prepare the environment

1. Install Java 17+, Maven, Node.js 20+, and Docker for the recommended PostgreSQL/MinIO mode. Install the frontend and landing dependencies if needed, following the repository READMEs.
2. From the repository root run `./scripts/dev.sh local`. This starts PostgreSQL and MinIO in Docker and the API and ERP locally. Open ERP at `http://localhost:5173`; API health: `http://localhost:8080/api/v1/health`. Startup is asynchronous; check `.run/api.log` and `.run/web.log` if the page is not ready. Stop with `./scripts/dev-stop.sh local`.
3. For a disposable alternative run `./scripts/dev.sh h2`; the H2 database is in memory and is lost when the API stops. Use the same mode to stop it. Do not assume H2 concurrency behaves the same as PostgreSQL.
4. To test the public website, set `ERP_PUBLIC_API_URL=http://localhost:8080/api/v1` in `landing/.env.local`, then in a separate terminal run `cd landing` and `npm run dev`; open the local address printed by Next.js. The ERP startup script does **not** start the landing site. The default quotation link base points to port 3001; set `UNIVMAR_QUOTATION_PUBLIC_BASE_URL` before starting the API to match the landing site address and locale, e.g. `http://localhost:3000/fr/quote` when the site is on port 3000. If the form, catalogue or link cannot reach its service, record the configuration issue.
5. Local startup scripts default to `admin@univmar.local` / `ChangeMe123!` for initial admin bootstrap. Existing databases, environment overrides, or an existing account may use different credentials. These values are only for local testing.
6. Email delivery for website notifications and quotations is disabled by default in `application.yml`. A local share link is preferable for testing quotations; email needs working SMTP and explicit configuration. A successful save is not evidence an email was delivered.
7. Before testing uploads, prepare a small valid JPEG/PNG `stone-test.jpg` and a harmless PDF `plan-test.pdf`. Create a unique suffix for every run, e.g. `D01`, and replace `D01` in all example values. Use tomorrow or a future date relative to your test day; do not use expired fixed dates.

**Record for every test:** test ID, date/environment, user role, result PASS/FAIL/BLOCKED, observed result and screenshot/request ID if a failure occurs. A button hidden for a role is a UI result; verify server-side rejection separately using an authenticated API client when testing authorization.

## 1. Shared sample dataset and order of execution

Create these records in the sequence below. Copy actual generated IDs/numbers into your notes; do not invent IDs.

| Data | Value |
|---|---|
| Test suffix | `D01` (change on each run) |
| Customer | `Test Client D01`, email `client-d01@example.test`, phone `0600000001` |
| Project | `Kitchen D01`, Casablanca, status `LEAD`, delivery in 14 days |
| Supplier | `Stone Supplier D01`, Morocco, `supplier-d01@example.test` |
| Material | `Marble Test D01`, commercial name `Marble Demo D01`, SKU `MAR-D01` |
| Variant | surface variation `Polished`, thickness `20` mm, format `Slab` |
| Warehouse / location | code `WH-D01`, name `Warehouse Demo D01`; location `A-D01`, zone `A` |
| Purchase order | `10.000` m², `450.00` MAD/m²; future expected arrival |
| Stock receipt | `LOT-D01`, `BUNDLE-D01`; first `6.000` m² then `4.000` m² |
| RFQ / quotation | `2.000` m²; unit price `1000.00`; discount `0%`; tax `20%`; transport `0`; expiry in 7 days |
| Invoice example | quotation total expected `2400.00` MAD; first payment `600.00`, remainder `1800.00` |
| Staff password for new test accounts | `TestOnly-2026!` (local test environment only) |

Core sequence: login → supplier → catalog → warehouse → purchase order and receipts → customer/project → RFQ → quotation → accept/reserve → confirm → fabrication (optional) → delivery → invoice/payment. Before running damage, slab, cancellation or alternate-flow tests, use additional records or note the stock changes; otherwise they change the numbers expected in the main flow. If using a preseeded environment, create a new variant with its own stock so unrelated inventory is not included.

## 2. Authentication and access

### AUTH-01: login, session restoration and logout

1. Open ERP; sign in with the local admin account.
2. Confirm Dashboard or the workspace opens and the signed-in user is visible.
3. Refresh the browser: the session should be restored while the token remains valid.
4. Log out; revisit a protected workspace page. Expect login or denied access.
5. Enter the correct email with an incorrect password. Expect a generic invalid-credentials message; no session is established.

### AUTH-02: roles and account management

1. As admin, open **People & access**. Create `sales-d01@example.test` as `SALES_AGENT`, `warehouse-d01@example.test` as `INVENTORY_MANAGER`, and `buy-d01@example.test` as `PURCHASING_MANAGER`, using the sample test password. New account passwords require at least 12 characters.
2. Log in as the sales agent: verify customer/RFQ/quotation access. Attempt a stock adjustment or user administration; expect the UI to hide/deny the action, and a direct forbidden API mutation to return 403.
3. Log in as inventory manager: attempt customer creation; expect 403 from the backend. Log in as purchasing manager: attempt invoice payment recording; expect 403.
4. As admin, change one test user's role; log in again and verify access changes. Disable that test user and verify login and subsequent authenticated access fail. Re-enable as needed. Reset a test user's password and verify the new password works and an old token is no longer accepted after credentials-version change.
5. Open a protected endpoint without a token: expect 401. Do not expose bearer tokens in screenshots or share them.

Source: `SecurityConfig`, `AccessControlService`, `UserAdministrationService`; ownership can further restrict an authorized sales agent to their own records.

## 3. Dashboard

### DASH-01: indicators and navigation

1. Open **Dashboard** as admin. Note the displayed indicators and recent records.
2. After creating and confirming the order and delivery in later tests, refresh the dashboard.
3. Expect relevant counts/activity to reflect persisted records; exact totals can include existing data. Click a supported link and verify it opens the relevant module. Do not compare absolute totals against the sample dataset on a seeded database.

## 4. Supplier and purchasing

### PUR-01: create and edit supplier

1. Open **Suppliers**, create the sample supplier with country Morocco and test email. Save.
2. Search for `Stone Supplier D01`, open/edit it, add payment terms `30 days`, and save. Expect the updated record in the directory.
3. On a separate disposable supplier, deactivate/reactivate if the interface exposes it; otherwise use the supplier `/{id}/active` API. Verify status changes and do not reuse an inactive supplier for the main order.

### CAT-01: material and variant

1. Open **Catalog** → create material. Enter the sample name, SKU, commercial name, stone type/category `Marble` if available, origin `Morocco`, color `White`, and description `Manual defense test`.
2. Save, search by SKU and open the material. Add the `Polished`, `20` mm, `Slab` variant and upload `stone-test.jpg` if available.
3. Expect the material and variant in their respective lists and the image on detail. Edit the description and verify after refresh.
4. Try an empty material name or SKU, and a variant thickness of `0`. Expect validation; no invalid item should be saved. On a separate unused test material/variant, archive then reactivate and verify active filters.

### INV-01: warehouse and location

1. In **Inventory**, open warehouse/location management. Create `WH-D01` / `Warehouse Demo D01`, then location `A-D01`, zone `A` within that warehouse.
2. Edit the warehouse name to `Warehouse Demo D01 Updated`, save, and reopen. Expect the edit to persist and the location to remain linked to the warehouse.

### PUR-02: order and partial receipt

1. Open **Suppliers** → **Purchase orders** → new order. Select the sample supplier and future expected date. Add the sample variant, quantity `10.000` m², cost `450.00`, then save. Expect a draft order with an ordered quantity of 10.
2. Open it; send if desired, then confirm. Confirm is allowed from draft or sent in the current service. Before confirmation, attempt receipt using a disposable PO: expect it to be rejected.
3. On the confirmed main PO, record receipt of `6.000` m² into `WH-D01` / `A-D01`, lot `LOT-D01`, bundle `BUNDLE-D01`. Expect partially received, received 6, remaining 4 and an inventory record/receipt movement.
4. Attempt to receive `5.000` when only 4 remains. Expect rejection and no change in receipts or stock.
5. Receive the remaining `4.000` using the same variant/location/lot/bundle. Expect order `RECEIVED`, total received 10, and inventory on hand `10.000` if this is an isolated new stock row. Record the inventory row ID/label for later tests.
6. On a separate confirmed PO with no receipts, test cancel; expect cancelled. A PO with received goods should not be cancellable.

## 5. Inventory, slabs, offcuts and labels

### INV-02: receipt and movement history

1. Open the main stock item from **Inventory**. Confirm variant, location, lot and bundle. Expect on hand `10`, reserved `0`, damaged `0`, available `10`, assuming no other operation has touched the sample row.
2. Open movement history: verify receipt entries reflect the quantities received. Search/filter by SKU, warehouse and lot and verify the result.
3. On a separate stock row, use **Receive stock** with `INITIAL_STOCK`, quantity `5.000` m². Expect on hand and available to increase by 5 with an initial-stock movement. This is separate from receiving against a PO.

### INV-03: damage, adjustments, recount and transfer

Use the separate 5 m² row, not the main row.

1. Record `DAMAGE` of `1.000` with reason `Test damaged edge`. Expect on hand 5, damaged 1, reserved 0 and available 4. Verify movement history.
2. Record `ADJUSTMENT_OUT` of `1.000`, reason `Manual test correction`; expect on hand 4, damaged 1, available 3. Attempt an outgoing adjustment larger than the available amount; expect rejection.
3. Record `ADJUSTMENT_IN` of `1.000`, reason `Manual test correction`; expect on hand 5 and available 4. Test return on another row if needed.
4. **API only if the current UI has no action:** use `/inventory/{id}/recounts` to record a physical count, and `/inventory/{id}/transfers` to move stock to another configured location. Use Swagger/OpenAPI to inspect the current DTO fields. Verify the recorded movement and source/destination balances; reject a count below reserved plus damaged or a transfer above available. Do not guess endpoint payloads.

### SLAB-01: create and trace an individual slab

1. Open **Slabs**; create `SLAB-D01` linked to the main inventory record, length `1200` mm, width `1000` mm, cost `540` and the sample image if available.
2. Expect a surface area of `1.200` m²; verify material, lot and location match the inventory item. Edit a note and search by slab number.
3. On a separate slab, test hold and release. For reservation, first create an eligible order line for the same variant, then reserve that slab against it; verify its status and linked order. Cancel the eligible order and verify release. Try reserving for an incompatible order line and expect rejection. Test damage on a separate unused slab.

### REM-01: register reusable offcut

1. In **Offcuts**, create `OFFCUT-D01` from `SLAB-D01`, length `900` mm and width `500` mm. Expect offcut area `0.450` m² and the parent slab's remaining area to become `0.750` m² (provided it started at 1.200 and has no other offcuts).
2. Edit a note; exercise hold/release on an unused offcut. After an eligible matching order line exists, reserve the offcut and verify its link and status. Order cancellation releases an eligible reservation; completed delivery may consume it. Use separate offcuts to test damage or conflicting reservations.
3. Try an offcut whose area exceeds the remaining slab surface; expect a validation/conflict response and unchanged parent area.

### LABEL-01: generate and scan a QR label

1. Open **Scan labels**. Select the main inventory item or slab and generate a label. Save the displayed code.
2. Scan it using the page's scanner or enter the code manually. Expect the correct target, material, lot/location and live stock/status details. Open the target via the available navigation action.
3. Generate a label again for the same target: verify whether the existing stable label is returned. Scan an unknown code and expect a clear not-found result. Use a real camera only if permissions and HTTPS/local browser conditions allow it.

## 6. Customers, projects and enquiries

### CRM-01: customers and projects

1. Open **Customers**, create `Test Client D01`, with `client-d01@example.test` and the sample phone; choose individual or company consistently. Add a test contact/address if the UI offers it; save.
2. Search and open the customer. Edit a note and verify it persists. An invalid email should be rejected.
3. Open **Projects**, create `Kitchen D01` for this customer, location `Casablanca`, status `LEAD`, required delivery in 14 days. Save, search by project/customer and reopen. Update a note or location and verify persistence. Add a project image if the screen provides this action.
4. On disposable records without dependent business records, try delete if shown; report the observed result. Do not delete the main customer or project while running linked tests.

### WEB-01: website enquiry and staff qualification

1. Start the landing site, open its contact form, and enter `Web Test D01`, `web-d01@example.test`, phone `0600000002`, subject `Kitchen marble`, message `Please quote 2 m² of polished marble`, with a small attachment if offered. Submit.
2. Expect a public acknowledgement. In ERP **Website CMS**, open enquiries and locate the new submission; check name, message and attachment. If email is disabled, do not expect a notification email.
3. As a sales user, claim the enquiry, update follow-up status and add call notes. Qualify it with project name `Web Kitchen D01`, type `Residential`, location `Casablanca`, and required call confirmation as directed by the form. Expect a customer/project link in the result; inspect whether an existing customer was reused.
4. On a separate test submission, try missing a required name/email/phone according to active CMS settings; expect validation. Verify a sales user can work enquiries but cannot change CMS settings.

### WEB-02: CMS settings, portfolio and public catalogue

1. As admin/manager, open **Website CMS** contact settings. Record the existing settings, update the title to `Contact UNIVMAR Test D01`, save and refresh the public form. Expect the changed title if the public site is connected and enabled. Restore the original setting after testing.
2. In the CMS portfolio section create a test item `Kitchen Project D01` with an allowed category and sample image; publish/enable it if the interface offers that option. Verify its public appearance, then unpublish/disable or restore the test content.
3. Open the public catalogue, search/filter the material and variant. Availability depends on public policy, active state and actual inventory; `HIDDEN` should keep a variant out of the public catalogue. Test this on a disposable variant and restore it.

## 7. RFQ, quotation and order

### RFQ-01: create, submit and review

1. In **RFQs**, create a request for `Test Client D01` and `Kitchen D01`. Add the sample material/variant, quantity `2.000` m², unit `m²`, required date in 14 days, dimensions `2000 × 1000 mm`, processing `Polishing`, and location `Casablanca`.
2. Save as draft, reopen, submit and start review. Expect the state to move to `UNDER_REVIEW` and the timeline to reflect actions.
3. Check inventory: creating/submitting the RFQ alone must not reserve the 2 m². On a separate draft, try submitting without the required item; expect validation/conflict. On a separate draft test item editing/removal and cancellation when allowed. Add a small attachment if supported in the screen.

### QUO-01: prepare and share a quotation

1. Open **Quotations** → create; choose the submitted/reviewed sample RFQ. Enter expiry 7 days in the future, transport `0`, payment terms `Bank transfer`, quantity `2`, price `1000`, discount `0`, tax `20%`. Save.
2. Expect subtotal `2000.00`, tax `400.00` and total `2400.00` MAD for this single line. If the UI computes a different amount, record it and inspect line/transport fields before assuming a defect.
3. Open the quotation, generate the client share link, copy it and open in a private browser window. Verify the public quotation and allowed customer response. The UI's share-link action is also the no-email way to move through the sent workflow; confirm the resulting status is `SENT` before accepting.
4. Customer response and internal order conversion are separate steps. If testing acceptance or revision request on the public page, check the recorded response in staff view; do not assume a customer click alone has created an order.
5. Email sending requires enabled SMTP. If configured with a controlled mailbox, send a separate quotation and verify delivery there; otherwise mark email test BLOCKED, not failed. Test reject and expire on separate quotations.

### ORD-01: accept quotation and reserve stock

1. Return to the staff quotation. Confirm it is sent, not expired, has a valid variant, and there is at least `2.000` m² available.
2. Choose **Record customer acceptance**, using method `Phone`, accepted by `Test Client D01`, note `Test acceptance confirmed by phone`. Submit.
3. Expect an order created in `PENDING`, quotation accepted, and a reservation for `2.000` m². For the isolated main row: on hand `10`, reserved `2`, available `8`. The reservation occurs at acceptance, not at confirmation.
4. In **Orders**, open the order, verify the customer, line, reserved stock and timeline, then confirm. Expect `CONFIRMED`; stock should not be reserved a second time. Save the order number and order-line ID.
5. Attempt to accept the same quotation again: expect rejection and no duplicate order or reservation. On separate quotes try a past expiry, insufficient stock, or an invalid state: expect rejection and no partially created order.

### ORD-02: cancel and release

1. Create a **second** quotation for `1.000` m², share/send and accept it. Note the stock reservation before cancellation.
2. Cancel this second order before any dispatch. Expect cancellation, release of its remaining reservation and an increase of available stock by the released quantity. Related eligible planned/preparing deliveries are cancelled.
3. On another order with a dispatched delivery, attempt ordinary order cancellation; expect rejection. Do not cancel the main order used in later tests.

## 8. Fabrication and delivery

### FAB-01: workshop workflow

1. Use the confirmed main order. Open **Fabrication** and create a job `Kitchen cut D01`, due in 7 days, measurement notes `2000 × 1000 mm; polished edge`. Verify it begins at measurement.
2. Advance through `DRAWING`, `MATERIAL_ALLOCATED`, `CUTTING`, `FINISHING`, `QUALITY_CONTROL`, `READY` as the interface and guards permit. Add/complete an operation such as `CUTTING` or `POLISHING`; complete all listed operations before READY.
3. If testing material assignment, use an additional valid inventory item, slab or offcut that matches the job's rules. Record balances before/after: fabrication material assignment/consumption can affect stock independently of the order reservation. Avoid modifying the main numerical example without recalculating.
4. Before completing operations, attempt to mark ready; expect rejection. On a separate job, test cancellation and verify assigned materials are released where eligible. Do not assume all sales require a fabrication job.

### DEL-01: two partial deliveries

1. Confirm main order remains active and has 2 m² reserved. Open **Deliveries** → **Plan delivery**, select order, enter `1.000` m² and a future scheduled date; save. Verify planned delivery and correct order line.
2. Prepare, then dispatch. Expect status `DISPATCHED`; on the isolated main row, on hand goes `10 → 9`, reserved `2 → 1`, available stays `8`. Verify an order delivery movement. Confirm delivered; order remains partly fulfilled because `1` m² remains reserved.
3. Create a second delivery for remaining `1.000`; prepare/dispatch and confirm delivered. Expect on hand `8`, reserved `0`, available `8`, and order `DELIVERED` after the finality checks.
4. Try dispatching a delivered delivery again or cancelling a dispatched one: expect rejection. Attempt planning more than the remaining order quantity on a separate order; expect rejection. Delivery failure/cancellation scenarios should use planned/preparing deliveries, not already dispatched ones.

## 9. Invoice, payments and documents

### FIN-01: issue and settle invoice

1. Open **Invoices** → **Create invoice**, select the confirmed or delivered main order and due date in 30 days. Save as draft. Expect total `2400.00` if the quotation values in this guide were used.
2. Attempt to create another invoice for the same order; expect rejection. Issue the draft; expect `ISSUED`. Payments against a draft should be rejected.
3. Record `600.00` MAD, method bank transfer, date today, reference `PAY-D01-1`. Expect paid `600`, outstanding `1800` and partially paid status.
4. Attempt to record `1800.01`; expect rejection and unchanged balance. Record `1800.00`, reference `PAY-D01-2`; expect paid `2400`, outstanding `0`, status `PAID`.
5. Attempt to void a paid or partially paid invoice: expect rejection. Test void on a separate invoice with no recorded payments. These are manual accounting entries; the system does not execute bank transfers.

### DOC-01: attach and retrieve a document

1. Open **Documents**, select a supported target such as the test project or order, and upload `plan-test.pdf` as `PROJECT_PLAN` or an appropriate visible type. Save and reopen; expect the correct filename, record and type.
2. Download while signed in and verify it opens. Try accessing the private uploaded document without staff authentication; expect denied/401. The endpoint and storage provider must be configured for the environment.
3. On a disposable attachment, remove the document record and confirm it disappears from the list. Check the specific storage policy separately; deleting a record should not be assumed to prove the binary was securely erased.

## 10. API-only and cross-cutting checks

### API-01: Swagger and error responses

1. Open `http://localhost:8080/swagger-ui/index.html` if Swagger is enabled. Locate the endpoint, schema and required fields. Use the test account and a bearer token only in your private test environment; avoid sharing screenshots with the token.
2. Check `GET /api/v1/health` without authentication. Call a protected endpoint without credentials: expect 401; call a forbidden mutation with a valid lesser role: expect 403. Check a nonexistent record: expect a not-found response; invalid state: typically 409; invalid fields: 400.
3. Use the exact schemas in Swagger for API-only catalogue category create/edit, warehouse location updates, inventory recount/transfer, RFQ attachment/item actions, quotation reject/expire, delivery fail, audit `GET /api/v1/activity`, and access-denial history `GET /api/v1/activity/access-denials`. Verify an authorized actor can see permitted data and unauthorized users cannot. Record request ID, method, route, response and side effects.
4. Audit history can contain existing data. Cause a test action and check for a relevant event if that action is audited; do not assume every endpoint logs an event. Avoid relying solely on the frontend navigation for access enforcement.

### API-02: security and concurrency checks

1. As one sales agent create a quotation, then attempt a protected modification as another sales agent. Expect the ownership check to reject it; a manager/admin may have broader access depending on the action.
2. For a controlled PostgreSQL test, create a new variant with 2 m² available and two sent quotations, each requiring 2 m². Submit both acceptance requests near-simultaneously from separate authenticated sessions. Expected invariant: at most one succeeds, no negative availability or double reservation. Record both responses and final database/UI quantities. This is a manual concurrency experiment, not proof against all races.
3. Deactivate a test user while retaining their token; try a protected request with that token. Because the filter reloads the user, access should fail. Never test this on the sole admin account.

## 11. Tests between components

These scenarios check the handoff between modules, not just whether each screen saves. Run **INT-01** in order with the isolated `D01` data from section 1. Use new suffixes for destructive or alternate scenarios. After every action, refresh the receiving screen and reopen the record: this distinguishes a persisted change from an update visible only in the current screen. If a prerequisite fails, mark dependent checks BLOCKED and record the original failure.

### INT-01: purchase → inventory → sale → delivery → invoice

**Preconditions:** An admin is signed in; the `D01` variant has no other stock, reservations, damage or fabrication consumption. Create the supplier, warehouse and location as in PUR-01, CAT-01 and INV-01. Do not run SLAB-01/REM-01 against the main stock for this scenario. All quantities below are m² and all amounts are MAD.

1. **Purchasing → inventory.** Create and confirm a PO for `10.000` at `450.00`. Receive `6.000` into `WH-D01` / `A-D01`, lot `LOT-D01`, bundle `BUNDLE-D01`. Reopen the PO and note its number and receipt; open Inventory and find that same variant, location, lot and bundle. Expect PO received `6`, remaining `4`, and stock on hand/available `6`. Receive the remaining `4` with the same identifiers. Expect PO `RECEIVED`, received `10`, and inventory on hand/available `10`; check both receipt movements. Capture the actual PO and inventory IDs.
2. **Customer/project → RFQ.** Create `Test Client D01` and its `Kitchen D01` project. Create and submit an RFQ for that customer, project and `2.000` of the sample variant; start review. Reopen the project and RFQ and compare the customer, project, variant and quantity. Expect the RFQ `UNDER_REVIEW` and the stock still on hand `10`, reserved `0`, available `10`.
3. **RFQ → quotation.** Create the linked quotation with quantity `2`, unit price `1000`, discount `0%`, tax `20%`, transport `0` and expiry in seven days. Expect subtotal `2000`, tax `400`, total `2400`. Generate the share link; verify `SENT` in the staff view and open the link in a private window. Reopen the RFQ and check that it is `QUOTED`, with the correct quotation/customer association where displayed. Stock remains unreserved.
4. **Quotation → order → inventory.** Record customer acceptance in the staff view and open the resulting order. Check that its customer, variant and quantity match the quotation; expect `PENDING` and exactly `2` reserved. Refresh Inventory: expect on hand `10`, reserved `2`, available `8`. Confirm the order and refresh both screens; expect `CONFIRMED` with the same single reservation, not `4` reserved.
5. **Order → delivery → inventory.** Plan a delivery for `1`, prepare and dispatch it. Reopen the delivery, order and inventory: expect delivery `DISPATCHED`, on hand `9`, reserved `1`, available `8`, with a delivery movement linked to the order. Confirm delivery; the order must not yet be `DELIVERED`. Repeat for the remaining `1` and confirm it delivered. Expect order `DELIVERED`, on hand `8`, reserved `0`, available `8`. Check both deliveries belong to the same order.
6. **Order → invoice → payments.** Create an invoice from that order, issue it, and check the invoice references the same order/customer and totals `2400`. Record `600` with reference `PAY-D01-1`; expect paid `600`, outstanding `1800`. Record `1800` with reference `PAY-D01-2`; expect `PAID`, paid `2400`, outstanding `0`, and two ledger entries. Refresh the order and inventory: payment must not change the delivered quantity or stock balances.
7. **Persistence and traceability.** Refresh and reopen the PO, inventory item, RFQ, quotation, order, deliveries and invoice. Follow the visible links or compare recorded IDs and verify the same variant, customer and order are used throughout. Check Dashboard for relevant activity without assuming its totals equal this test alone.

| Checkpoint | PO received | Stock on hand | Reserved | Available | Invoice outstanding |
|---|---:|---:|---:|---:|---:|
| First receipt | 6 | 6 | 0 | 6 | Not created |
| Second receipt / RFQ / sent quote | 10 | 10 | 0 | 10 | Not created |
| Quote accepted / order confirmed | 10 | 10 | 2 | 8 | Not created |
| First dispatch | 10 | 9 | 1 | 8 | Not created |
| Second dispatch | 10 | 8 | 0 | 8 | Not created |
| Invoice issued / first payment / second payment | 10 | 8 | 0 | 8 | 2400 / 1800 / 0 |

If your existing database includes other stock rows, compare the isolated inventory row and the actual order reservations rather than assuming a global variant total. Stop and investigate a discrepancy before using later expected balances.

### INT-02: public enquiry → ERP customer and project

1. With both sites running, submit the contact form as `Web Test D02`, `web-d02@example.test`, `0600000002`, message `Please quote 2 m² for Web Kitchen D02`. Note the submission time. Expect a public acknowledgement.
2. In ERP Website CMS, locate the matching enquiry and compare its name, email, phone and message to the form. Claim it as a sales user, add `Called for manual test` and qualify it with project name `Web Kitchen D02`, type `Residential`, location `Casablanca`, and the required call confirmation.
3. Open the linked customer and project in their respective modules. Expect the customer details and project/customer link to match the qualified enquiry; note whether an existing customer was reused. Reopen the enquiry and check the link and notes persist. If supported, create an RFQ from those actual customer/project records and verify the association survives after refresh.
4. Submit a second form with a required field empty. Expect validation, then search enquiries for that distinct test name: no new valid enquiry should have been created. If the site cannot reach the API, record BLOCKED with the configuration/error instead of treating the absence as a validation pass.

### INT-03: cancellation releases another order's stock

1. Use a fresh variant with `5.000` available and two separately sent quotations for the same variant: quote A `2.000` and quote B `1.000`. Record the inventory row and create/accept both orders. Expect on hand `5`, reserved `3`, available `2`.
2. Cancel order B before dispatch. Reopen both orders and Inventory. Expect B cancelled, A still active with its `2` reservation, and on hand `5`, reserved `2`, available `3`. Check any eligible planned/preparing delivery for B is cancelled.
3. Attempt to cancel B again. Expect a rejection and unchanged balances. Verify A can still proceed through delivery; use a separate test if checking cancellation after dispatch.

### INT-04: rejected actions leave connected records unchanged

Use fresh records and note their IDs and balances before each action. Capture the visible error or HTTP response and refresh **every** affected screen after the attempt.

1. **PO → inventory:** on a confirmed PO with `4` remaining, attempt to receive `5`. Expect rejection; PO received/remaining quantities, inventory quantity and receipt history stay unchanged.
2. **Quotation → order → inventory:** with only `1` available, try to accept a sent quotation for `2`. Expect rejection; no new order or reservation, and the quotation and inventory remain unchanged. Search by the quotation/customer and refresh to check for partial records.
3. **Delivery → order → inventory:** on a separate order, attempt to plan more than the remaining order quantity. Expect rejection; no extra delivery and no stock or reservation change.
4. **Payment → invoice:** on an issued invoice with `1800` outstanding, attempt `1800.01`. Expect rejection; paid, outstanding and payment history remain unchanged. Reopen the order and verify its delivery status remains unchanged.

### INT-05: inventory → slab → offcut → order → delivery

1. On a separate stock row for a matching variant, create a `1200 × 1000 mm` slab `SLAB-D05` and a `900 × 500 mm` offcut `OFFCUT-D05`. Reopen both: expect slab area `1.200`, offcut `0.450` and slab remaining `0.750`; verify the slab links to the correct inventory row and the offcut to the slab.
2. Create and confirm an eligible order for that variant, then reserve the offcut against its actual order line. Reopen the offcut and order and verify the `RESERVED` status and association. Complete delivery of that order and reopen the offcut; expect `CONSUMED`. Record stock before and after; do not mix its balances with INT-01.
3. Repeat with a second offcut and eligible order, but cancel the order before dispatch. Verify the offcut reservation is released and the order's stock reservation is released. Attempt to reserve an offcut against an incompatible order line; expect rejection and unchanged offcut/order state.

### INT-06: document and permissions across sessions

1. As admin, upload `plan-test.pdf` to the `Kitchen D01` project and record its filename, document type and project. Refresh the Documents list and reopen the project; verify the attachment can be found for the same target and downloaded by an authorized staff user.
2. In a private browser session without a staff login, attempt the same private download URL. Expect access denied; do not paste tokens or private URLs into shared evidence. Sign in with an appropriately authorized test role and check access according to that role's permissions.
3. As a sales user, attempt an inventory adjustment through the UI and, separately, the API. Expect the UI to hide or deny the action and the API to return `403`; confirm inventory quantity and movement history did not change. An unauthenticated protected request should return `401`.

### Integration test record

```text
Scenario / run suffix: INT-01 / D01
Environment / date / tester / role:
Source record and ID: PO …
Receiving record and ID: inventory item …
Action and time:
Before: on hand …, reserved …, available …
Expected after: …
Actual after refresh in each module: …
Status: PASS / FAIL / BLOCKED
Evidence: screenshot or request ID (no credentials or tokens)
Dependent tests blocked / notes:
```

## 12. Quick demonstration order

If time is short: AUTH-01 → PUR-01 → CAT-01 → INV-01 → PUR-02 → CRM-01 → RFQ-01 → QUO-01 → ORD-01 → FAB-01 → DEL-01 → FIN-01. Use WEB-01 and LABEL-01 to demonstrate the public-to-ERP connection and traceability. Pre-create dependent records; after each stage state the expected status and quantity before clicking. For unexpected failures, capture the error and continue with prepared records or screenshots.

## 13. Results template

```text
Test ID:
Date / environment / build:
Role:
Preconditions / test data:
Steps performed:
Expected result:
Actual result:
Status: PASS / FAIL / BLOCKED
Evidence / request ID:
```

Key sources: [navigation](../frontend/src/widgets/app-shell/navigation.ts), [backend APIs](../backend/src/main/java/com/univmar/), [workflow integration test](../backend/src/test/java/com/univmar/workflow/MainBusinessWorkflowIntegrationTest.java), [security configuration](../backend/src/main/java/com/univmar/auth/SecurityConfig.java), [local setup](../README.md). The workflow integration test demonstrates service behavior; it does not substitute for the manual UI run above.
