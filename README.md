# UNIVMAR

UNIVMAR is a stone-company management platform. The workspace currently covers catalog, inventory, customers, projects, RFQs, quotations, orders, deliveries, and Phase 10 internal customer receivables.

## Repository layout

```text
backend/    Spring Boot REST API, Flyway migrations, authentication, catalog, and local image storage
frontend/   React + TypeScript workspace built with Vite, Tailwind, and reusable UI components
scripts/    Local development start, stop, and restart commands
```

Local planning documents, generated build output, uploaded media, IDE settings, the previous landing site, and UML export files are intentionally excluded from Git.

## Available features

- JWT login and protected workspace routes
- Material catalog: create, edit, details, search, filters, pagination, archive/reactivate
- Stone variants: thickness, finish, optional format, archive/reactivate
- Local JPEG, PNG, and WebP uploads up to 10 MiB
- Separate catalog and inventory boundaries
- Customer orders with stock reservation and delivery dispatch workflows
- Internal invoice drafts and issuance, linked one-to-one with customer orders
- Manual payment ledger for cash, bank transfer, cheque, card, and other received payments
- Outstanding balance, partial-payment, paid, overdue, and void invoice tracking

## Financial tracking

The Invoices workspace tracks money owed by customers; it does not process online payments. Create an invoice from a confirmed or fulfilled order, issue it, then record payments once they are received through the business's normal channels. Payment entries cannot exceed the invoice's remaining balance, and paid invoices cannot be voided.

## Run locally without Docker

Install Java 17+, Maven, and Node.js 20+. Then run:

```sh
chmod +x scripts/dev*.sh
./scripts/dev.sh
```

Open `http://localhost:5173` and sign in with the local development account:

```text
admin@univmar.local
ChangeMe123!
```

The API runs at `http://localhost:8080`. Use `./scripts/dev-stop.sh` to stop the local services, or `./scripts/dev-restart.sh` to restart them. The local H2 development database resets when the backend stops.

## Media storage

In local development, uploaded catalog images are stored at `backend/data/uploads/images`. Set `UNIVMAR_STORAGE_ROOT` and `UNIVMAR_PUBLIC_API_URL` when moving media to managed storage.
