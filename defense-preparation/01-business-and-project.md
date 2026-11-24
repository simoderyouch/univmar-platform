# 1. Business problem and project

## The context

UNIVMAR is a management platform for a stone company. The repository contains an internal ERP application and a public website. The ERP supports processes such as managing stone materials, inventory, customers, quotations, orders, deliveries, and invoices. The public website presents catalog and portfolio information and accepts inquiries.

The exact starting situation at the company, the people involved, and the results of deployment should come from your internship experience. Do not present assumptions about the company's previous tools or measured benefits as established facts unless you have evidence.

## The problem the software addresses

A stone business needs to coordinate commercial information with physical stock. A salesperson needs to know what can be offered to a customer; warehouse staff need to know what is available or reserved; and the company needs to track the order through delivery and billing. If those activities are disconnected, information may need to be entered or checked multiple times, making coordination and traceability harder.

UNIVMAR brings these activities into one application. For example, accepting a quotation can create an order and reserve available stock, linking a commercial decision to warehouse information.

## Main users

The application defines roles including administrator, manager, sales agent, inventory manager, and purchasing manager. Permissions depend on the action. For example, user administration is restricted to administrators, while commercial staff can work on sales workflows. Public visitors can access selected website and catalog endpoints without a staff account.

See [SecurityConfig.java](../backend/src/main/java/com/univmar/auth/SecurityConfig.java) and [Role.java](../backend/src/main/java/com/univmar/user/domain/Role.java).

## Core business concepts

- **Material and variant:** a stone product and a specific version of it, such as a surface variation or thickness.
- **Inventory:** quantities of variants held at warehouse locations, with stock movements recording changes.
- **Customer and project:** the client and the project associated with their commercial activity.
- **RFQ:** a request for quotation, which captures what a customer is asking for.
- **Quotation:** an offer containing items, quantities, and prices.
- **Order:** the commercial order created after a quotation is accepted; the application reserves stock as part of this workflow.
- **Delivery:** preparation and dispatch of ordered material.
- **Invoice and payment:** a record of money owed and payments received. This is an internal ledger, not online payment processing.
- **Purchasing:** supplier orders and receipt of goods into stock.
- **Slabs, remnants and fabrication:** tracking physical stone pieces and workshop activity.

## An example to tell the jury

Imagine a customer requests stone for a project. A sales agent records the request and prepares a quotation. When the quotation is accepted in the system, the backend checks its status, expiry, items, and stock availability. It creates an order and reserves inventory. Staff can then work on fulfillment and delivery, and an invoice can be issued and payments recorded.

This is a simplified explanation of the implemented modules, not a claim that every step happens automatically. In particular, delivery and invoice operations have their own workflows and rules.

## Your own internship story

Before your defense, write down and verify:

- The company's actual situation at the start of the internship.
- The objectives given to you and the boundaries of your assignment.
- The features you personally designed, implemented, tested, or deployed.
- One concrete difficulty you encountered and how you solved it.
- Evidence of results, such as a demonstration, acceptance feedback, or a measured improvement. If there is no measurement, describe the intended benefit instead of inventing one.
