# JewelTrack - Jewellery Inventory Management

A personal jewellery inventory application that lets you catalogue your jewellery collection (gold, silver, and other pieces), see at-a-glance dashboard of holdings, and manage items through a filterable list.

## Features

- **Dashboard Overview**: View total grams and value per metal (Gold, Silver, Other)
- **Visual Charts**: Bar chart (grams by metal & carat) and donut chart (value distribution)
- **Filterable Item List**: Filter by type, name, and carat; sort by name, weight, amount, or date
- **CRUD Operations**: Add, edit, and delete jewellery items
- **Data Persistence**: Items are stored in MariaDB via backend API (Phase 3)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Charts**: Recharts
- **Backend**: Spring Boot 3.x + Java 21 + Maven
- **Database**: MariaDB 12 via Docker

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- Docker & Docker Compose
- Node.js 18+ (for frontend)

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

### 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/items` | List all items (with filters) |
| GET | `/api/v1/items/{id}` | Get single item |
| POST | `/api/v1/items` | Create new item |
| PUT | `/api/v1/items/{id}` | Update item |
| DELETE | `/api/v1/items/{id}` | Delete item |
| GET | `/api/v1/dashboard/summary` | Get dashboard totals |

## Data Model

The application tracks jewellery items with the following fields:
- **Name**: Item name (required)
- **Type**: GOLD, SILVER, or OTHER (required)
- **Carat**: Purity (optional, e.g., 22, 18, 14)
- **Weight**: In grams (required)
- **Amount**: Price spent (required)
- **Remarks**: Notes (optional)

## Project Structure

```
jewellery-catalog/
├── backend/               # Spring Boot API
│   ├── src/main/java/... # Java source
│   └── pom.xml          # Maven config
├── frontend/            # React app
│   ├── src/
│   │   ├── api/         # Service layer with HTTP client
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utilities
│   └── package.json
├── docker-compose.yml   # MariaDB setup
└── README.md           # This file
```

## Development

### Backend (Spring Boot)

```bash
cd backend
mvn clean package          # Build
mvn spring-boot:run        # Run
```

### Frontend (React + Vite)

```bash
cd frontend
npm install                # Install dependencies
npm run dev               # Start dev server
npm run build             # Production build
```

## Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## License

MIT
