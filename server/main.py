from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from db import get_db
import json
from uuid import uuid4
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketRequest(BaseModel):
    title: str
    description: str


class TicketSuggestion(BaseModel):
    category: str
    tags: list[str]
    priority: str
    suggested_response: str

class Ticket(BaseModel):
    id: str
    title: str
    description: str
    status: str
    category: str
    tags: list[str]
    priority: str
    email: str
    department: str
    ai_response: str


class TicketPayload(BaseModel):
    newTicket: Ticket


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[list[str]] = None
    priority: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    ai_response: Optional[str] = None

## TODO: should this be a post or get 
@app.post("/ticket/suggest", response_model=TicketSuggestion)
def suggest_ticket(_: TicketRequest):
    time.sleep(1)
    ##raise HTTPException(status_code=500, detail="AI failed at making suggestions")
    return {
        "category": "Networking",
        "tags": ["VPN", "timeout", "remote access"],
        "priority": "High",
        "suggested_response": (
            "Please ensure you're on the company network and restart your VPN client. "
            "If that fails, contact IT Support at x1234."
        ),
    }

@app.post("/ticket")
def write_ticket_to_db(payload: TicketPayload):
    ticket = payload.newTicket
    ticket_id = ticket.id or f"TCK-{uuid4().hex[:8].upper()}"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO tickets (
            id,
            title,
            description,
            status,
            category,
            tags,
            priority,
            email,
            department,
            ai_response
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            ticket_id,
            ticket.title,
            ticket.description,
            ticket.status,
            ticket.category,
            json.dumps(ticket.tags),
            ticket.priority,
            ticket.email,
            ticket.department,
            ticket.ai_response,
        ),
    )
    conn.commit()
    time.sleep(0.8)
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=500, detail="Failed to create ticket")

    item = dict(row)
    item["tags"] = json.loads(item["tags"])
    return item


@app.put("/ticket/{ticket_id}")
def update_ticket(ticket_id: str, payload: TicketUpdate):
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    time.sleep(0.8)

    if "tags" in updates and updates["tags"] is not None:
        updates["tags"] = json.dumps(updates["tags"])

    set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
    values = list(updates.values()) + [ticket_id]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        f"UPDATE tickets SET {set_clause} WHERE id = ?",
        values,
    )
    conn.commit()

    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    item = dict(row)
    item["tags"] = json.loads(item["tags"])
    return item

@app.get("/tickets")
def get_tickets():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM tickets"
    )
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="Tickets not found")

    tickets = []
    for r in rows:
        item = dict(r)
        item["tags"] = json.loads(item["tags"])  # converts string -> list
        tickets.append(item)
    return tickets

