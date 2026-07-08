# FastAPI Todo API — Day 16 Project

Same features as Day 6 Notes REST API — built in FastAPI so you can compare stacks.

## Setup

```bash
cd project/fastapi-todo
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# PostgreSQL (reuse Day 8 DB or Docker)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fastapi_todo"

uvicorn app.main:app --reload
# Open http://127.0.0.1:8000/docs
```

## Fill-in-the-blank files

| File | TODO |
|------|------|
| `app/database.py` | Engine, SessionLocal, get_db dependency |
| `app/models.py` | SQLAlchemy Todo model |
| `app/schemas.py` | Pydantic create/update/response schemas |
| `app/services/todos.py` | Business logic (CRUD, filters) |
| `app/routers/todos.py` | HTTP routes calling service |
| `app/main.py` | App factory, router mount, startup |

## Feature checklist

- [ ] CRUD `/api/v1/todos`
- [ ] Pagination + search query params
- [ ] PostgreSQL via SQLAlchemy
- [ ] Proper status codes + HTTPException
- [ ] Explore automatic Swagger at `/docs`

## Workflow

Read TODO → write YOUR IDEA → compare ANSWER → make it run.
