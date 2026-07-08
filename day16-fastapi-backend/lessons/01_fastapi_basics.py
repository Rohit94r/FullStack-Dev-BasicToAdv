# =============================================================================
# DAY 16 — LESSON 1: FastAPI Basics
# =============================================================================
# FastAPI is Python's most popular modern web framework.
# It's built on top of Starlette (ASGI) and Pydantic.
#
# Why FastAPI?
# - AUTOMATIC API documentation (Swagger UI at /docs, ReDoc at /redoc)
# - AUTOMATIC request/response validation using Pydantic type hints
# - Async-first — built for asyncio and concurrent I/O
# - Fastest Python web framework (comparable to Node.js, Go)
# - Type hints everywhere → better IDE support, fewer runtime errors
#
# Install:
# pip install fastapi uvicorn[standard] httpx
# Run: uvicorn main:app --reload
# =============================================================================

from fastapi import FastAPI, HTTPException, status, Query, Path
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# =============================================================================
# SECTION 1: Creating a FastAPI App
# =============================================================================

app = FastAPI(
    title="Notes API",
    description="A simple notes management API built with FastAPI",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI (interactive API explorer)
    redoc_url="/redoc",    # ReDoc (clean documentation)
)

# =============================================================================
# SECTION 2: Pydantic Models — Request & Response Schemas
# =============================================================================
# Pydantic models define the SHAPE of request/response data.
# FastAPI uses them for:
# - Automatic request body validation
# - Automatic JSON serialization
# - OpenAPI schema generation (for /docs)

class NoteCreate(BaseModel):
    """Schema for creating a note."""
    title: str = Field(..., min_length=1, max_length=200, description="Note title")
    content: str = Field(..., min_length=1, description="Note content")
    tags: list[str] = Field(default=[], max_items=10, description="List of tags")
    pinned: bool = Field(default=False)

    # Example shown in /docs
    class Config:
        json_schema_extra = {
            "example": {
                "title": "My First Note",
                "content": "FastAPI is amazing!",
                "tags": ["fastapi", "python"],
                "pinned": False
            }
        }

class NoteUpdate(BaseModel):
    """Schema for updating a note — all fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[list[str]] = Field(None, max_items=10)
    pinned: Optional[bool] = None

class NoteResponse(BaseModel):
    """Schema for note responses — includes server-generated fields."""
    id: str
    title: str
    content: str
    tags: list[str]
    pinned: bool
    created_at: datetime
    updated_at: datetime

class MessageResponse(BaseModel):
    """Generic message response."""
    message: str

# =============================================================================
# SECTION 3: In-Memory "Database"
# =============================================================================
# Later we'll replace this with SQLAlchemy + PostgreSQL (Day 16 advanced)

from uuid import uuid4

notes_db: dict[str, dict] = {
    "1": {
        "id": "1",
        "title": "Welcome",
        "content": "Welcome to FastAPI!",
        "tags": ["welcome"],
        "pinned": False,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
}

# =============================================================================
# SECTION 4: Path Operations (Routes)
# =============================================================================
# @app.METHOD("/path") creates a route.
# FastAPI calls these "path operations."

# GET /notes — get all notes
@app.get(
    "/notes",
    response_model=list[NoteResponse],  # FastAPI validates AND filters the response
    summary="Get all notes",
    tags=["Notes"],
)
async def get_notes():
    return list(notes_db.values())

# GET /notes/{note_id} — get one note
@app.get(
    "/notes/{note_id}",
    response_model=NoteResponse,
    summary="Get a specific note",
    tags=["Notes"],
)
async def get_note(
    note_id: str = Path(..., description="The ID of the note to retrieve")
):
    # Path parameters are automatically extracted and typed
    note = notes_db.get(note_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with id '{note_id}' not found"
        )
    return note

# POST /notes — create a note
@app.post(
    "/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,  # Returns 201 not 200
    summary="Create a new note",
    tags=["Notes"],
)
async def create_note(note: NoteCreate):
    # FastAPI automatically:
    # 1. Reads the request body as JSON
    # 2. Validates it against NoteCreate schema (400 if invalid)
    # 3. Passes validated data as `note` Pydantic object

    new_note = {
        "id": str(uuid4()),
        "title": note.title,
        "content": note.content,
        "tags": note.tags,
        "pinned": note.pinned,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    notes_db[new_note["id"]] = new_note
    return new_note

# PATCH /notes/{note_id} — partial update
@app.patch(
    "/notes/{note_id}",
    response_model=NoteResponse,
    summary="Update a note",
    tags=["Notes"],
)
async def update_note(note_id: str, updates: NoteUpdate):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")

    note = notes_db[note_id]

    # Only update provided fields (exclude_unset = ignore fields not sent)
    update_data = updates.model_dump(exclude_unset=True)

    note.update({**update_data, "updated_at": datetime.now()})
    return note

# DELETE /notes/{note_id}
@app.delete(
    "/notes/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,  # 204 = success, no body
    summary="Delete a note",
    tags=["Notes"],
)
async def delete_note(note_id: str):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    del notes_db[note_id]
    # Return nothing — 204 No Content

# =============================================================================
# SECTION 5: Query Parameters
# =============================================================================

@app.get("/notes/search/filter", tags=["Notes"])
async def search_notes(
    # Query parameters with validation
    q: Optional[str] = Query(None, description="Search in title and content"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    pinned: Optional[bool] = Query(None, description="Filter by pinned status"),
    page: int = Query(1, ge=1, description="Page number"),      # ge=1: must be >= 1
    limit: int = Query(10, ge=1, le=100, description="Items per page"),  # 1-100
):
    results = list(notes_db.values())

    if q:
        results = [n for n in results if q.lower() in n["title"].lower() or q.lower() in n["content"].lower()]
    if tag:
        results = [n for n in results if tag in n["tags"]]
    if pinned is not None:
        results = [n for n in results if n["pinned"] == pinned]

    # Pagination
    start = (page - 1) * limit
    paginated = results[start:start + limit]

    return {
        "data": paginated,
        "total": len(results),
        "page": page,
        "limit": limit,
        "pages": -(-len(results) // limit),  # ceil division
    }

# =============================================================================
# SECTION 6: Request & Response Headers, Status Codes
# =============================================================================

from fastapi import Request, Response

@app.get("/health", tags=["System"])
async def health_check(request: Request, response: Response):
    # Access request headers
    user_agent = request.headers.get("user-agent", "unknown")

    # Set custom response headers
    response.headers["X-Custom-Header"] = "FastAPI is great"

    return {
        "status": "healthy",
        "user_agent": user_agent,
        "timestamp": datetime.now().isoformat(),
    }

# =============================================================================
# SECTION 7: HTTPException — Error Responses
# =============================================================================

# HTTPException automatically returns JSON error:
# raise HTTPException(status_code=404, detail="Not found")
# → { "detail": "Not found" }

# Custom error detail (can be any JSON-serializable object):
# raise HTTPException(
#     status_code=422,
#     detail=[{"field": "title", "message": "Title too long"}]
# )

# =============================================================================
# SECTION 8: Startup and Shutdown Events
# =============================================================================

@app.on_event("startup")
async def startup():
    """Run when server starts. Initialize DB connections, caches etc."""
    print("✓ Server starting up...")
    # In real app: await db.connect(), create_tables()

@app.on_event("shutdown")
async def shutdown():
    """Run when server stops. Clean up connections."""
    print("✓ Server shutting down...")
    # In real app: await db.disconnect()

# =============================================================================
# SECTION 9: How to Run
# =============================================================================
# 
# Install dependencies:
#   pip install fastapi uvicorn[standard]
#
# Run development server:
#   uvicorn day16-fastapi-backend.lessons.01_fastapi_basics:app --reload --port 8000
#
# Open in browser:
#   http://localhost:8000/docs      → Interactive Swagger UI
#   http://localhost:8000/redoc     → ReDoc documentation
#   http://localhost:8000/openapi.json → Raw OpenAPI schema
#
# Test with curl:
#   curl http://localhost:8000/notes
#   curl -X POST http://localhost:8000/notes \
#     -H "Content-Type: application/json" \
#     -d '{"title":"Test","content":"Hello FastAPI"}'

# =============================================================================
# FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Add a new endpoint PATCH /notes/{note_id}/pin that:
# - Toggles the pinned status of a note
# - Returns 404 if note doesn't exist
# - Returns the updated note
# FILL IN:
# @app.patch("/notes/{note_id}/pin", response_model=NoteResponse, tags=["Notes"])
# async def toggle_pin(note_id: str):
#     _____________________

# Exercise 2: Add an endpoint GET /notes/stats that returns:
# - total: total number of notes
# - pinned: number of pinned notes
# - by_tag: dict of {tag: count} for each tag
# FILL IN:
# @app.get("/notes/stats", tags=["Notes"])
# async def get_stats():
#     _____________________

# Exercise 3: Create a Pydantic model UserCreate with:
# - name: str, 2-50 chars
# - email: EmailStr (requires: pip install pydantic[email])
# - age: int, must be between 13 and 120
# - bio: Optional[str], max 500 chars
# FILL IN:
# class UserCreate(BaseModel):
#     _____________________
