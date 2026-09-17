# UNIVMAR

UNIVMAR is a stone-company management platform. This repository currently contains the Phase 0 foundation and the completed Phase 1 stone catalog vertical slice.

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
