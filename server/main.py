import random
import asyncio
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from db import get_db
import json
from uuid import uuid4
import time
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict) -> None:
        dead_connections: list[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for connection in dead_connections:
            self.active_connections.discard(connection)


manager = ConnectionManager()

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

## Mock IT suggestions using OpenAi
@app.post("/ticket/suggest", response_model=TicketSuggestion)
def suggest_ticket(request: TicketRequest):
    title = request.title
    description = request.description
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    messages = [
        {
            "role": "user",
            "content": (
                "Suggest one possible solution for an IT ticket. "
                "Make the suggestion is thoughtful and practical "
                "Must be under 100 words. Skip intros and conclusions. "
                "Do not give me a list. I need a paragraph"
                "use the following tile and description to come up with the suggestion:" + title + "," + description
            ),
        }
    ]
    suggested_response = client.chat.completions.create(
        model=os.environ["AI_MODEL"],
        messages=messages,
    )

    suggested_tags = client.chat.completions.create(
        model=os.environ["AI_MODEL"],
        messages=[{
            "role": "user",
            "content": (
                "Avoid introductions. Just give me the three tags separated by commas"
                "Give me only three possible tags string that could be added to a IT ticket that has the title and description provided :" + title + "," + description
            ),
        }],
    )
    print(suggested_response)

    content = suggested_response.choices[0].message.content
    tags = suggested_tags.choices[0].message.content
    categories = ["Bug", "Feature", "Infrastructure", "Enhancement", "Design"]
    priorities = ["Low", "Medium", "High", "Urgent"]
    return {
        "category": random.choice(categories),
        "tags": tags.split(','),
        "priority": random.choice(priorities),
        "suggested_response": content,
    }

@app.post("/ticket")
async def write_ticket_to_db(payload: TicketPayload):
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
    await asyncio.sleep(0.8)
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=500, detail="Failed to create ticket")

    item = dict(row)
    item["tags"] = json.loads(item["tags"])
    await manager.broadcast({"type": "ticket_created", "ticket": item})
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

@app.websocket("/ws/tickets")
async def tickets_ws(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

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
