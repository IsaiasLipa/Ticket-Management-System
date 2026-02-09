# Ticket Management System

A simple ticket management app with a React + Vite UI and a FastAPI + SQLite backend. It supports ticket creation, filtering/searching, status updates with optimistic UI, and AI suggestion helpers.

**Features**
- View and search tickets with filters (category, status, priority)
- Optimistic status updates with toast feedback
- Create tickets in a modal
- AI suggestion helper for category, tags, and priority

**Tech Stack**
- UI: React, TypeScript, Vite, Tailwind CSS
- API: FastAPI
- DB: SQLite

**Project Structure**
- `ui/` Frontend app
- `server/` FastAPI backend
- `server/data/` SQLite database files

**Getting Started**
1. Start the API
2. `cd server`
3. `python -m venv .venv`
4. `source .venv/bin/activate`
5. `pip install fastapi uvicorn`
6. `uvicorn main:app --reload --port 8000`

1. Start the UI
2. `cd ui`
3. `npm install`
4. `npm run dev`

**Database**
The API expects the SQLite database at `server/data/tickets.db` (set in `server/db.py`).

Create the schema:
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

Note: `tags` is stored as a JSON string.

**API Endpoints**
- `GET /tickets` Get all tickets
- `POST /ticket` Create a ticket
- `PUT /ticket/{ticket_id}` Update a ticket
- `POST /ticket/suggest` Get AI suggestions

**UI Scripts**
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run format`
- `npm run preview`
