# JewelTrack - Frontend

A personal jewellery inventory application that lets you catalogue your jewellery collection (gold, silver, and other pieces), see at-a-glance dashboard of holdings, and manage items through a filterable list.

## Features

- **Dashboard Overview**: View total grams and value per metal (Gold, Silver, Other)
- **Visual Charts**: Bar chart (grams by metal & carat) and donut chart (value distribution)
- **Filterable Item List**: Filter by type, name, and carat; sort by name, weight, amount, or date
- **CRUD Operations**: Add, edit, and delete jewellery items
- **Offline Fallback**: Uses mock data when backend is unavailable

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Backend server running at `http://localhost:8080` (or configured via `VITE_API_BASE_URL`)

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── httpClient.ts          # HTTP client for backend API
│   │   └── jewelleryService.ts    # Service interface with mock & HTTP implementations
│   ├── components/
│   │   ├── AddItemModal.tsx       # Modal for add/edit items
│   │   ├── Chart.tsx              # Recharts wrappers
│   │   ├── ItemList.tsx           # Filterable/sortable table
│   │   ├── StatCard.tsx           # Dashboard stat cards
│   │   └── ToastContainer.tsx     # Toast notifications
│   ├── hooks/
│   │   └── useJewelleryService.ts # Custom hook for service integration
│   ├── utils/
│   │   └── formatting.ts          # Formatting utilities (currency, weight, date)
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── public/
├── package.json
└── vite-env.d.ts                  # Vite environment type definitions
```

## API Integration (Phase 3)

The frontend now connects to the Spring Boot backend API. The `HttpJewelleryService` class implements the `JewelleryService` interface and uses `fetch` to communicate with the backend.

### Environment Variables

Create a `.env` file in the frontend directory to configure the backend API URL:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Fallback to Mock Data

If the backend is unavailable, the application automatically falls back to using mock data stored in `localStorage`. This ensures the app remains usable during development without a running backend.

### Service Implementation

The service layer (`src/api/jewelleryService.ts`) provides two implementations:
- `HttpJewelleryService`: Uses HTTP requests to the backend API (Phase 3)
- `MockJewelleryService`: In-memory service with localStorage persistence (Phase 1)

The `useJewelleryService` hook automatically selects the appropriate service based on configuration.

## API Specification

The frontend uses a service interface with the following methods:

- `getItems(params?)` - List items with optional filters (type, name, carat, sort)
- `getDashboardSummary()` - Get totals per metal and overall stats
- `createItem(item)` - Add a new item
- `updateItem(id, item)` - Edit an existing item
- `deleteItem(id)` - Delete an item

## Phase 1 Status

- ✅ Frontend with sample data implemented
- ✅ Dashboard UI with stat cards and charts
- ✅ Filterable and sortable item list
- ✅ Add/Edit/Delete functionality
- ✅ localStorage persistence

## Phase 2 Status

- ✅ Backend API implemented (Spring Boot)
- ✅ MariaDB database integration
- ✅ All CRUD endpoints working

## Phase 3 Status

- ✅ HTTP client integration with backend
- ✅ Environment variable configuration
- ✅ Offline fallback to mock data
- ✅ Error handling and toast notifications

## License

MIT
