# Ticket Management System

A simple ticket management app with a React + Vite UI and a FastAPI + SQLite backend. It supports ticket creation, filtering/searching, status updates with optimistic UI, and AI suggestion helpers.

## Setup Instructions (Install + Run Locally)

### 1) Backend (FastAPI)

From project root:

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

### 2) Frontend (Vite + React)

From project root:

```bash
cd ui
npm install
npm run dev
```

### 3) Database

The API reads from `server/data/tickets.db` (see `server/db.py`). This repo includes a pre-populated DB, so you can run the app without creating the schema manually.

If you delete/reset the DB, create the schema with:

```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,
  priority TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  ai_response TEXT NOT NULL
);
```

## AI Behavior Explanation

AI suggestions are **mocked** in the backend. The endpoint `POST /ticket/suggest` returns a canned response based on keywords in the title/description (e.g., vpn/login/email/slow/mobile/ui). If no keywords match, a random mock response is returned. This keeps the response shape stable while providing more variety.

## Design Decisions & Known Limitations

**Design decisions**
- Tags are saved in the database as a array, but in the form creation are treated as a string separated by commas.
- Tickes order from newest to oldest.
- Headless component used for inputs with AI suggested fields and for new ticket form modal.
- Hook used for ticket status update to keep UI dashboard component cleaner and focused on rendering.
- Optimistic updates for ticket status changes, with toast feedback on success or failure.
- Polling every 8 seconds to refresh tickets instead of WebSockets for simplicity.
- Tailwind CSS utility-first styling for rapid UI iteration.

**Known limitations**
- AI suggestions are mocked; no real model integration.
- Tags are stored as JSON strings in SQLite (not normalized).
- Polling can become inefficient at scale (WebSockets/SSE would be better).
- The modal form can grow long; it is scrollable but still a single-page form.

## API Endpoints

- `GET /tickets` Get all tickets
- `POST /ticket` Create a ticket
- `PUT /ticket/{ticket_id}` Update a ticket
- `POST /ticket/suggest` Get AI suggestions

## UI Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run preview
```
