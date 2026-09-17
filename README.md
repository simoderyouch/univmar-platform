# UNIVMAR

Stone-company management platform. Phase 0 establishes the application shell: PostgreSQL, Flyway migrations, JWT login, protected API routes, and a React admin workspace.

## Run locally

1. Copy `.env.example` to `.env` and replace the development credentials and JWT secret.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173` and sign in with `UNIVMAR_INITIAL_ADMIN_EMAIL` and `UNIVMAR_INITIAL_ADMIN_PASSWORD` from `.env`.

The API is published at `http://localhost:8080`; health is available at `/actuator/health`, and OpenAPI at `/swagger-ui/index.html`.

## Conventions introduced in Phase 0

- API routes start with `/api/v1`.
- Successful responses use `{ data, timestamp, requestId }`; errors use `{ code, message, fields, timestamp, requestId }`.
- All persisted timestamps are UTC instants; business-time rendering uses `Africa/Casablanca`.
- List endpoints in later phases will use zero-based `page`, `size`, and `sort` query parameters and return Spring's `Page` metadata within `data`.
- Database changes are append-only Flyway migrations in `backend/src/main/resources/db/migration`.
