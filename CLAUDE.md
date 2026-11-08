# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**JewelTrack** is a single-user, local-only jewellery inventory app: a dashboard of totals (grams + value per metal), a filterable/sortable item table, and add/edit/delete. No auth, no multi-tenancy. All amounts are SGD — currency is a **frontend display convention only**; the backend stores plain decimals. The authoritative spec is `JewelTrack.PRD`.

## Commands

There is no linter configured (no ESLint/Prettier config) and **no test suite exists yet** (no backend `src/test`, no frontend test files).

Frontend (`frontend/`):
```bash
npm install          # install deps
npm run dev          # Vite dev server → http://localhost:5173
npm run build        # `tsc && vite build` — the type-check is the only "test"
```

Backend (`backend/`):
```bash
mvn spring-boot:run  # run API → http://localhost:8080
mvn clean package    # build JAR (skips nothing; there are no tests)
mvn test             # passes vacuously — no tests present
```

Database (MariaDB 12, from repo root):
```bash
docker compose up -d        # starts db (+ backend + frontend)
docker compose up -d db     # db only, for local backend/frontend dev
```

Whole stack via Docker: `docker compose up --build` → frontend `:3000` (nginx), backend `:8080`, db `:3306`.

## Architecture

### Data source is abstracted behind one interface with a runtime fallback
The central design decision (PRD §10: "swap-in data layer") is the `JewelleryService` interface in `frontend/src/api/jewelleryService.ts`, implemented twice:
- `MockJewelleryService` — in-memory, persisted to `localStorage` (key `jeweltrack_items`), seeded from `defaultItems`.
- `HttpJewelleryService` — `fetch` against the backend via `frontend/src/api/httpClient.ts`.

The active implementation is chosen in `frontend/src/hooks/useJewelleryService.ts` (`isBackendAvailable()` picks HTTP, else mock), and `HttpJewelleryService` additionally **falls back to the mock** on `503`/`404` so the UI keeps working offline. All UI reads state through the `useJewelleryService()` hook, so components never touch the API directly.

⚠️ Gotcha: `api/jewelleryService.ts` also exports a module-level `jewelleryService` constant (line ~461) that is **not** the instance the app uses — the hook defines its own. Edits to behavior should target the hook, not that stray export.

### Filtering & sorting are done client-side
`frontend/src/components/ItemList.tsx` filters and sorts the in-memory `items` array (type / name substring / carat, plus a "showing X of Y" count). Although the backend exposes `type`/`name`/`carat`/`sort` query params and `HttpJewelleryService.getItems` maps them, the current call path invokes `getItems()` with **no params**, so filtering is always in the browser. Don't assume a filter change in the backend is wired to the UI.

### Backend is a standard Spring Boot layering
`controller/ → service/ → repository/ → entity/`, with DTOs in `dto/` and a `@ControllerAdvice` (`exception/GlobalExceptionHandler`) producing spec-compliant error bodies (`{status, error, message, path, timestamp, errors}`; `400` validation, `404` not-found). Dashboard totals are computed with `SUM`/`COUNT` JPQL in `JewelleryItemRepository`. Endpoints are under `/api/v1`. CORS is hardcoded to the dev origins (5173/5174/3000) on the controller.

### Naming & persistence
- Java `weightGrams` / `amountSpent` map to MariaDB columns `weight_grams` / `amount_spent` (Hibernate camelCase→snake_case). `data.sql` and the `JewelleryItem` entity depend on this.
- Schema is created by `spring.jpa.hibernate.ddl-auto=update`; `data.sql` seeds **idempotently** (only when the table is empty). `spring.sql.init.mode=always` + `defer-datasource-initialization=true` run the seed after Hibernate DDL.
- `application.properties` reads `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` with sensible local defaults, so the backend runs against local MariaDB without env vars, or against the compose `db` service when they're set.

### Frontend build & deployment
Vite + React 18 + TS + Tailwind. In Docker, `VITE_API_BASE_URL` is baked in at **build time** (see `frontend/Dockerfile` `ARG`) and served by nginx (`frontend/nginx.conf`, static SPA with `/index.html` fallback). `httpClient.ts` defaults `API_BASE_URL` to `http://localhost:8080/api/v1` if the env var is unset — the same value is set in `frontend/.env` and in `docker-compose.yml`.

## Current state / known gaps

- **Charts are not implemented.** PRD §5.2 (FR-2) and the README both promise a bar chart (grams by metal/carated) and a donut chart (value share) via Recharts, but Recharts is **not a dependency** and `App.tsx` renders only the stat cards + item table. Adding charts requires installing Recharts and building the components.
- **No tests** in either tier, despite PRD Phase 2 asking for service-layer unit tests.
- The mock seed (`defaultItems`, 15 items) and the DB seed (`data.sql`, 12 items) differ; they are independent and neither is derived from the other.
