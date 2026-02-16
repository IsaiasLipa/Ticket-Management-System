from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from db import get_db
import json
import random
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

## Mock AI suggestions
@app.post("/ticket/suggest", response_model=TicketSuggestion)
def suggest_ticket(request: TicketRequest):
    # artificial delay
    time.sleep(1)
    text = f"{request.title} {request.description}".lower()

    responses = [
        {
            "category": "Infrastructure",
            "tags": ["VPN", "timeout", "remote access"],
            "priority": "High",
            "suggested_response": (
                "Please ensure you're on the company network and restart your VPN client. "
                "If that fails, contact IT Support at x1234."
            ),
        },
        {
            "category": "Bug",
            "tags": ["login", "credentials", "auth"],
            "priority": "High",
            "suggested_response": (
                "Please reset your password and try again. If the issue persists, "
                "clear your browser cache and contact IT Support."
            ),
        },
        {
            "category": "Feature",
            "tags": ["email", "notifications", "delayed"],
            "priority": "Medium",
            "suggested_response": (
                "We are investigating delayed mail delivery. In the meantime, "
                "check your spam folder and ensure your inbox is not full."
            ),
        },
        {
            "category": "Infrastructure",
            "tags": ["slow", "timeout", "latency"],
            "priority": "Medium",
            "suggested_response": (
                "Performance may be impacted by peak usage. Please retry in a few minutes "
                "and report if the issue continues."
            ),
        },
        {
            "category": "Enhancement",
            "tags": ["mobile", "ios", "android"],
            "priority": "Low",
            "suggested_response": (
                "Please update the app to the latest version and retry. "
                "If the issue persists, reinstall the app."
            ),
        },
        {
            "category": "Design",
            "tags": ["ui", "layout", "display"],
            "priority": "Low",
            "suggested_response": (
                "Thanks for the feedback. We will review the layout and follow up with "
                "improvements in a future release."
            ),
        },
    ]

    keyword_map = {
        "vpn": 0,
        "network": 0,
        "login": 1,
        "password": 1,
        "auth": 1,
        "email": 2,
        "notification": 2,
        "slow": 3,
        "timeout": 3,
        "latency": 3,
        "mobile": 4,
        "ios": 4,
        "android": 4,
        "ui": 5,
        "layout": 5,
        "display": 5,
    }

    for keyword, index in keyword_map.items():
        if keyword in text:
            return responses[index]

    return random.choice(responses)

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
    ## artificial delay
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
    ## artificial delay
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
def get_tickets(
    pageNum: int = 1,
    category: str = "",
    status: str = "",
    priority: str = "",
    searchString: str = "",
):
    if pageNum < 1:
        raise HTTPException(status_code=400, detail="pageNum must be >= 1")

    conn = get_db()
    cursor = conn.cursor()

    category_filter = f"%{category}%" if category else "%"
    status_filter = f"%{status}%" if status else "%"
    priority_filter = f"%{priority}%" if priority else "%"
    search_filter = f"%{searchString}%" if searchString else "%"

    page_size = 10
    offset = page_size * (pageNum - 1)

    where_clause = """
    WHERE category LIKE ? AND status LIKE ? AND priority LIKE ?
      AND (
        title LIKE ?
        OR description LIKE ?
        OR category LIKE ?
        OR tags LIKE ?
        OR priority LIKE ?
        OR ai_response LIKE ?
        OR email LIKE ?
        OR department LIKE ?
        OR status LIKE ?
      )
    """
    base_params = [
        category_filter,
        status_filter,
        priority_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
        search_filter,
    ]

    # 1) total count (no LIMIT/OFFSET)
    cursor.execute(
        f"SELECT COUNT(*) FROM tickets {where_clause}",
        base_params,
    )
    total = cursor.fetchone()[0]

    # 2) paged rows
    cursor.execute(
        f"""
        SELECT * FROM tickets
        {where_clause}
        ORDER BY rowid DESC
        LIMIT ? OFFSET ?
        """,
        (*base_params, page_size, offset),
    )
    rows = cursor.fetchall()
    tickets = []

    for r in rows:
        item = dict(r)
        item["tags"] = json.loads(item["tags"])  # converts string -> list
        tickets.append(item)
    
    conn.close()

    return {"total": total, "tickets": tickets}
