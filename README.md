# JewelTrack - Jewellery Inventory Management

A personal, single-user, local-only jewellery inventory application. Catalogue your collection (gold, silver, and other pieces), see an at-a-glance dashboard of holdings (grams and value per metal), and manage items through a filterable, sortable list with add/edit/delete.

There is no authentication or multi-tenancy. All amounts are in **SGD (S$)** — currency is a frontend display convention only, so the backend stores currency-agnostic decimals. The authoritative spec is [`JewelTrack.PRD`](./JewelTrack.PRD).

## Features

- **Dashboard Overview** — stat cards showing total grams and value (S$) per metal (Gold / Silver / Other), total item count, and total amount spent
- **Filterable Item List** — filter by type, name (case-insensitive substring), and carat; sort by name, carat, weight, amount, or date, with a "showing X of Y" count and clear-filters control
- **CRUD Operations** — add, edit, and delete jewellery items, with inline validation and confirmations
- **Data Persistence** — items are stored in MariaDB via the backend REST API
- **Offline Fallback** — if the backend is unreachable, the UI automatically falls back to a `localStorage`-backed mock with sample data, so the app stays usable without a server

> **Not yet implemented:** the PRD (`JewelTrack.PRD` §5.2) also calls for a bar chart (grams by metal, stacked by carat) and a donut chart (value share) via Recharts. These are not built yet and Recharts is not a dependency.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.4 + Java 21 + Maven (springdoc-openapi for Swagger UI)
- **Database**: MariaDB 12 via Docker

## Prerequisites

For a manual dev setup:
- Java 21 or higher
- Maven 3.8+
- Docker & Docker Compose
- Node.js 18+ (for the frontend)

For the full-Docker setup, you only need Docker & Docker Compose.

## Quick Start

### Option A — Run the whole stack with Docker

```bash
docker compose up --build
```

This starts the database, backend, and frontend together:

- **Frontend**: http://localhost:3000 (nginx-served static build)
- **Backend API**: http://localhost:8080 — Swagger UI at `http://localhost:8080/swagger-ui.html`
- **Database**: MariaDB on `:3306` (database `jeweldb`, auto-seeded)

Stop with `docker compose down` (add `-v` to also remove the persisted `dbdata` volume).

### Option B — Manual dev setup

**1. Start the database**

```bash
docker compose up -d db
```

**2. Start the backend**

```bash
cd backend
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`.

**3. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Documentation

Once the backend is running:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## Available Endpoints

Base path: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/items` | List items (optional query params: `type`, `name`, `carat`, `sort`, `page`, `size`) |
| GET | `/items/{id}` | Get a single item |
| POST | `/items` | Create a new item |
| PUT | `/items/{id}` | Update an item |
| DELETE | `/items/{id}` | Delete an item |
| GET | `/dashboard/summary` | Totals per metal (grams + value), total items, total amount spent |

Errors return standard `4xx`/`5xx` bodies of the form `{ "status", "error", "message", "path", "timestamp" }` (with a field-level `errors` map on validation failures). `400` for validation, `404` for missing ids.

## Data Model

`JewelleryItem` (table `jewellery_items`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | `BIGINT` | PK, auto-increment |
| `name` | `VARCHAR(200)` | required |
| `type` | `GOLD` \| `SILVER` \| `OTHER` | required; drives dashboard totals |
| `carat` | `DECIMAL(5,2)` | optional (e.g. 22, 18, 92.5) |
| `weight_grams` | `DECIMAL(10,3)` | required, > 0 |
| `amount_spent` | `DECIMAL(12,2)` | required, ≥ 0 (SGD, stored currency-agnostic) |
| `remarks` | `VARCHAR(1000)` | optional |
| `created_at` / `updated_at` | `TIMESTAMP` | set automatically |

> Note: Java fields are camelCase (`weightGrams`, `amountSpent`) and map to the snake_case columns above.

## Project Structure

```
jewellery-catalog/
├── backend/               # Spring Boot API
│   ├── src/main/java/...  # Java source (controller/service/repository/entity/dto)
│   ├── src/main/resources # application.properties, data.sql (idempotent seed)
│   ├── pom.xml            # Maven config
│   └── Dockerfile
├── frontend/              # React + Vite + TypeScript + Tailwind app
│   ├── src/
│   │   ├── api/           # service interface, HTTP client, mock service
│   │   ├── components/    # React components
│   │   ├── hooks/         # custom hooks
│   │   └── utils/         # formatting helpers
│   ├── Dockerfile         # builds to static + nginx
│   └── nginx.conf
├── docker-compose.yml     # db + backend + frontend
├── CLAUDE.md
├── JewelTrack.PRD         # product requirements
└── README.md              # this file
```

## Development

### Backend (Spring Boot)

```bash
cd backend
mvn clean package          # Build
mvn spring-boot:run        # Run
mvn test                   # (no tests currently present)
```

### Frontend (React + Vite)

```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start dev server (type-checks via `tsc` on build)
npm run build              # Production build → dist/
```

> There is no linter or test suite configured in either tier yet.

## Configuration

### Frontend

The API base URL is read from `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api/v1`). Set it in `frontend/.env` for local dev:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

In Docker, this value is baked in at build time (see `frontend/Dockerfile`).

### Backend

Database settings are read from environment variables with local-friendly defaults (see `backend/src/main/resources/application.properties`):

| Variable | Default |
|----------|---------|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_NAME` | `jeweldb` |
| `DB_USER` | `jewel` |
| `DB_PASSWORD` | `jewel@123` |

The schema is created on startup (`spring.jpa.hibernate.ddl-auto=update`) and seeded idempotently from `data.sql`.

## License

MIT
