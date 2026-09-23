# UNIVMAR

UNIVMAR is a stone-company management platform. The workspace currently covers catalog, inventory, customers, projects, RFQs, quotations, orders, deliveries, and Phase 10 internal customer receivables.

## Repository layout

```text
backend/    Spring Boot REST API, Flyway migrations, authentication, catalog, and provider-based media storage
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
- Documents workspace with record-linked files and activity history

## Financial tracking

The Invoices workspace tracks money owed by customers; it does not process online payments. Create an invoice from a confirmed or fulfilled order, issue it, then record payments once they are received through the business's normal channels. Payment entries cannot exceed the invoice's remaining balance, and paid invoices cannot be voided.

## Run the development stack

Install Java 17+, Maven, and Node.js 20+. Then run:

```sh
chmod +x scripts/dev*.sh
./scripts/dev.sh local
```

Open `http://localhost:5173` and sign in with the local development account:

```text
admin@univmar.local
ChangeMe123!
```

The default `local` mode runs PostgreSQL and MinIO in Docker but runs Spring Boot and Vite directly on your machine for fast reloads. Use `./scripts/dev-stop.sh local` to stop it, or `./scripts/dev-restart.sh local` to restart it.

Use `./scripts/dev.sh container` when you want the complete Docker stack, or `./scripts/dev.sh h2` for the in-memory H2/local-filesystem fallback.

## Media storage

Storage is provider-based so the application can switch between local files and S3-compatible object storage without changing catalog code.

The default non-Docker profile uses local files at `backend/data/uploads/images`:

```sh
UNIVMAR_STORAGE_PROVIDER=local
```

The Docker development stack uses MinIO automatically. Start it with:

```sh
docker compose up --build
```

MinIO is available at `http://localhost:9001` and the object API is at `http://localhost:9000`. The API creates the `univmar` bucket, imports the repository `base-gallery` on first startup, and stores new uploaded images in the same bucket. Existing gallery paths are served from the configured `VITE_ASSET_BASE_URL`.

To switch to AWS S3 or another S3-compatible provider, set:

```sh
UNIVMAR_STORAGE_PROVIDER=s3
UNIVMAR_STORAGE_S3_ENDPOINT=https://s3.amazonaws.com
UNIVMAR_STORAGE_S3_REGION=eu-west-1
UNIVMAR_STORAGE_S3_BUCKET=your-bucket
UNIVMAR_STORAGE_S3_ACCESS_KEY=...
UNIVMAR_STORAGE_S3_SECRET_KEY=...
UNIVMAR_STORAGE_S3_PUBLIC_URL=https://your-public-object-host/your-bucket
VITE_ASSET_BASE_URL=https://your-public-object-host/your-bucket
```
