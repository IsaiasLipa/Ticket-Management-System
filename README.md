# Ticket Management System

A full-stack IT help-desk dashboard. You can create, search, filter and update support tickets. An OpenAI model triages each new ticket: it picks a category and priority, suggests tags, and drafts a fix. New tickets reach every open dashboard in real time over WebSockets.

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** FastAPI (Python), SQLite
- **AI:** OpenAI Chat Completions (the model is set with the `AI_MODEL` env var)

A screen recording of the working app is in the repo root (`Screen Recording 2026-02-09 ….mov`).

## Features

- **Ticket dashboard** with 10 tickets per page, newest first, and pagination
- **Server-side filtering** by category, status and priority, plus free-text search across every ticket field
- **New ticket form** in a modal. An **AI suggest** button fills in, from a single model call:
  - a category and priority
  - three suggested tags
  - a suggested resolution (one paragraph, under 100 words)
- **Inline status updates** with optimistic UI and toast messages on success or failure
- **Live updates:** when anyone creates a ticket, the server broadcasts it over `/ws/tickets`. Each open dashboard adds it if it matches that dashboard's current filters.

## Project structure

```
.
├── server/
│   ├── main.py          # FastAPI app: REST endpoints, WebSocket, OpenAI calls
│   ├── db.py            # SQLite connection helper
│   └── data/tickets.db  # Pre-populated database
└── ui/
    └── src/
        ├── components/  # Dashboard, table, filters, modal, form, toasts, pagination
        ├── hooks/       # useTicketStatusUpdate (optimistic status changes)
        ├── services/    # fetch wrappers for each API call
        ├── constants/   # Status / category / priority options
        └── types/       # Shared TypeScript types
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 20+
- An OpenAI API key

### 1. Environment variables

Create a `.env` file in the **repo root** (the server reads `../.env` relative to `server/`):

```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

### 2. Backend

Run this from the `server/` directory. The SQLite path `data/tickets.db` is relative to it.

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. Interactive docs are at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd ui
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The UI expects the API at `http://localhost:8000`. CORS allows any `http://localhost:<port>` origin.

## API

| Method | Path                  | Description |
| ------ | --------------------- | ----------- |
| `GET`  | `/tickets`            | Paged list of tickets. Query params: `pageNum` (default 1), `category`, `status`, `priority`, `searchString`. Returns `{ total, tickets }`. |
| `POST` | `/ticket`             | Create a ticket. Body: `{ "newTicket": Ticket }`. Broadcasts `ticket_created` to WebSocket clients. |
| `PUT`  | `/ticket/{ticket_id}` | Partially update a ticket. Send only the fields to change. |
| `POST` | `/ticket/suggest`     | AI suggestion. Body: `{ title, description }`. Returns `{ category, tags, priority, suggested_response }`. The model replies in JSON mode, and any category or priority outside the allowed values falls back to `Bug` / `Medium`. |
| `WS`   | `/ws/tickets`         | Pushes `{ type: "ticket_created", ticket }` messages. |

`POST /ticket` and `PUT /ticket/{id}` include an artificial 0.8 s delay. It makes the optimistic UI and loading states visible during demos.

## Data model

```ts
type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In progress" | "Blocked" | "Resolved" | "Closed";
  category: "Bug" | "Feature" | "Infrastructure" | "Enhancement" | "Design";
  tags: string[];
  priority: "Low" | "Medium" | "High" | "Urgent";
  email: string;
  department: string;
  ai_response: string;
};
```

The repo ships with a pre-populated `server/data/tickets.db`. To recreate it from scratch:

```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,        -- JSON-encoded string array
  priority TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  ai_response TEXT NOT NULL
);
```

## Design decisions

- **Filtering and pagination happen on the server**, so the UI never loads the whole table.
- **Headless input components:** `InputWithAi` and `Modal` keep the AI-suggestion and modal behavior separate from their markup.
- **`useTicketStatusUpdate` hook:** keeps the optimistic-update and rollback logic out of the dashboard component.
- **WebSockets push new tickets.** The client checks each pushed ticket against its active filters and skips IDs it has already shown.
- **Tags are a comma-separated string in the form** and a string array in the API. They're stored as a JSON string in SQLite.

## Known limitations

- Tags are stored as a JSON string, not in a normalized table, so filtering by tag is a substring match.
- Status updates aren't broadcast. Other clients see them only after their next fetch.
- You can't edit an existing ticket's fields from the UI yet. Only status can change.
- API and WebSocket URLs are hard-coded to `localhost:8000`.

## UI scripts

```bash
npm run dev       # start Vite dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm run lint      # ESLint
npm run format    # Prettier
```
