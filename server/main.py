from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.post("/ticket/suggest", response_model=TicketSuggestion)
def suggest_ticket(_: TicketRequest):
    return {
        "category": "Networking",
        "tags": ["VPN", "timeout", "remote access"],
        "priority": "High",
        "suggested_response": (
            "Please ensure you're on the company network and restart your VPN client. "
            "If that fails, contact IT Support at x1234."
        ),
    }
