# JewelTrack Backend

Spring Boot backend for JewelTrack jewellery inventory management application.

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- Docker & Docker Compose
- MariaDB 11+ (via Docker)

## Building

```bash
mvn clean package
```

## Running with Docker

1. Start the database:

```bash
docker compose up -d
```

2. Verify the database is running:

```bash
docker compose ps
```

3. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

## API Documentation

Once the application is running, visit:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/items` | List all items (with filters) |
| GET | `/api/v1/items/{id}` | Get single item |
| POST | `/api/v1/items` | Create new item |
| PUT | `/api/v1/items/{id}` | Update item |
| DELETE | `/api/v1/items/{id}` | Delete item |
| GET | `/api/v1/dashboard/summary` | Get dashboard totals |

## Seed Data

The `data.sql` file contains ~15 sample items:
- 6 Gold items (22K bangles, necklaces, coins)
- 4 Silver items (pendant, bangles, coin, earrings)
- 2 Other items (platinum ring, pearl strand)

## Configuration

Edit `src/main/resources/application.properties` to change:
- Database connection settings
- Server port
- SQL logging
