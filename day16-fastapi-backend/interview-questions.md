# Day 16 — FastAPI Interview Questions & Answers

FastAPI is now the standard for Python backend APIs. Know it better than the docs.

---

## SECTION A — FastAPI Fundamentals

**Q1. What is FastAPI? How does it compare to Flask and Django?**
A: FastAPI: Modern, async-first, type-hint-driven framework. Built on Starlette (ASGI) + Pydantic.
   Flask: Lightweight, synchronous, minimal. Older. Good for small APIs.
   Django: Full-stack framework (ORM, admin, auth, templates). Batteries-included. Sync by default.
   
   FastAPI advantages over Flask:
   - Native async/await support (non-blocking I/O, handles more requests concurrently)
   - Automatic API documentation (Swagger UI at /docs — no extra packages)
   - Automatic request validation (Pydantic models — no manual validation)
   - Type hints → better IDE support, fewer runtime bugs
   - 2-3x faster than Flask
   
   FastAPI is NOT a replacement for Django — use Django when you need its full ORM and admin.

**Q2. What is ASGI? How is it different from WSGI?**
A: WSGI (Web Server Gateway Interface): Python's older standard. Synchronous.
   One request handled at a time per worker. For async: need multiple workers/threads.
   Examples: Flask, Django (WSGI mode), uWSGI, Gunicorn.
   
   ASGI (Asynchronous Server Gateway Interface): modern standard. Supports async.
   Can handle thousands of concurrent connections in one process using event loop.
   Examples: FastAPI, Django (ASGI mode), Starlette, uvicorn (server).
   
   Run FastAPI with: `uvicorn main:app --workers 4` for production (4 processes).

**Q3. What is Pydantic? How does FastAPI use it?**
A: Pydantic is Python's most popular data validation library. Uses type annotations.
   FastAPI uses Pydantic for:
   - Request body validation: if body doesn't match model → 422 Unprocessable Entity automatically.
   - Response serialization: converts Python objects to JSON, filters extra fields.
   - OpenAPI schema: Pydantic models become the API schema visible in /docs.
   - Query parameter validation: with Field() constraints.
   
   Key: define a class inheriting from BaseModel → get validation, serialization, docs for free.

**Q4. What is the difference between `response_model` and return type annotation?**
A: `response_model=NoteResponse` → tells FastAPI to:
   1. Validate the response against NoteResponse schema.
   2. FILTER OUT any extra fields not in NoteResponse (security — don't leak passwords).
   3. Generate the response schema in /docs.
   Return type annotation `-> NoteResponse` → only for IDE type checking. FastAPI doesn't use it for docs.
   Always set response_model explicitly for routes that return data. Use `response_model_exclude` to hide specific fields.

**Q5. How does automatic documentation work in FastAPI?**
A: FastAPI generates an OpenAPI schema from your code automatically:
   - Route decorators (`@app.get`) → API paths.
   - Pydantic models → request/response schemas.
   - `Field()`, `Query()`, `Path()` → parameter descriptions and constraints.
   - Docstrings → endpoint descriptions.
   Swagger UI at `/docs` → interactive documentation. You can test API calls directly from browser.
   ReDoc at `/redoc` → cleaner read-only documentation.
   Raw schema at `/openapi.json` → can import into Postman or other tools.

---

## SECTION B — Routing & Parameters

**Q6. What are the 5 ways to pass data in a FastAPI request?**
A: 1. Path parameters: `/users/{user_id}` → `user_id: str`
   2. Query parameters: `/users?page=1&limit=10` → `page: int = 1, limit: int = 10`
   3. Request body: JSON body → Pydantic model parameter
   4. Headers: `Authorization: Bearer ...` → `authorization: str = Header()`
   5. Cookies: `session_id=...` → `session_id: str = Cookie()`
   
   FastAPI infers which is which:
   - Pydantic model parameter = request body (POST/PUT/PATCH)
   - Simple type that matches path param = path parameter
   - Simple type NOT in path = query parameter

**Q7. What is `exclude_unset=True` in Pydantic's `model_dump()`?**
A: Without it: `model_dump()` returns ALL fields, including unset ones with default values.
   With it: only returns fields EXPLICITLY set by the user in the request.
   Critical for PATCH endpoints:
   ```python
   update_data = updates.model_dump(exclude_unset=True)
   # If user only sent {"title": "New"}, update_data = {"title": "New"}
   # Without exclude_unset: {"title": "New", "content": None, "pinned": False}
   # Would accidentally overwrite content with None!
   ```

**Q8. What is the difference between `status.HTTP_404_NOT_FOUND` and `404`?**
A: Both work. `status.HTTP_404_NOT_FOUND` is a named constant from `fastapi.status` module.
   Benefits of using named constants:
   - Self-documenting (code is readable without knowing HTTP codes)
   - IDE autocomplete helps discover status codes
   - Less prone to typos (404 vs 403 are easy to confuse)
   Best practice: use `status.HTTP_xxx` constants.

---

## SECTION C — Dependency Injection

**Q9. What is FastAPI's dependency injection? Why is it better than just calling functions directly?**
A: DI (Depends(my_func)) vs direct calls have key differences:
   - Dependencies are CACHED per request: if route depends on `get_current_user` twice, it's called once.
   - Dependencies can depend on other dependencies (chains/trees automatically resolved).
   - Dependencies with yield can do CLEANUP after request (even if exception occurred).
   - Testability: in tests, override dependencies with mocks (no need to mock module imports).
   ```python
   # In tests:
   app.dependency_overrides[get_db] = lambda: MockDatabase()
   ```

**Q10. What is the difference between a `Depends` with `return` vs `yield`?**
A: return → dependency provides a value. No cleanup. Simple.
   yield  → dependency acts like a context manager. Code after `yield` runs after response is sent.
   ```python
   async def get_db():
       db = SessionLocal()  # Open connection
       try:
           yield db          # Route handler uses db
       finally:
           db.close()        # Cleanup — runs even if route raised exception
   ```
   CRITICAL: Always use yield + try/finally for database sessions, file handles, connections.

**Q11. How do you apply a dependency to ALL routes in a router?**
A: ```python
   from fastapi import APIRouter, Depends
   
   router = APIRouter(
       prefix="/api/v1",
       tags=["Users"],
       dependencies=[Depends(authenticate), Depends(rate_limit)],  # Applied to ALL routes
   )
   ```
   Or for the entire app: `app = FastAPI(dependencies=[Depends(some_check)])`.

---

## SECTION D — Validation & Errors

**Q12. What does FastAPI return when validation fails?**
A: Automatically returns `422 Unprocessable Entity` with a detailed error response:
   ```json
   {
     "detail": [
       {"loc": ["body", "email"], "msg": "value is not a valid email", "type": "value_error.email"},
       {"loc": ["body", "age"], "msg": "ensure this value is greater than 0", "type": "value_error.number.not_gt"}
     ]
   }
   ```
   This is generated automatically from Pydantic validation failures. No extra code needed.

**Q13. How do you customize error responses in FastAPI?**
A: Use exception handlers:
   ```python
   from fastapi import Request
   from fastapi.responses import JSONResponse
   
   @app.exception_handler(HTTPException)
   async def http_exception_handler(request: Request, exc: HTTPException):
       return JSONResponse(
           status_code=exc.status_code,
           content={"error": exc.detail, "path": request.url.path}
       )
   
   class NotFoundError(Exception):
       pass
   
   @app.exception_handler(NotFoundError)
   async def not_found_handler(request: Request, exc: NotFoundError):
       return JSONResponse(status_code=404, content={"error": str(exc)})
   ```

**Q14. What is the difference between `HTTPException` and custom exceptions?**
A: HTTPException → built-in. Includes status_code and detail. Any route can raise it.
   Custom exceptions → your own Exception subclasses. Need to register handlers.
   Custom exceptions are better for: business logic errors (don't mix HTTP concerns with domain logic),
   catching and converting at the handler level, testing (can assert specific exception type).

---

## SECTION E — Middleware & Background Tasks

**Q15. How do you add middleware in FastAPI?**
A: ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_methods=["*"],
       allow_headers=["*"],
       allow_credentials=True,
   )
   
   # Custom middleware:
   from starlette.middleware.base import BaseHTTPMiddleware
   class RequestTimingMiddleware(BaseHTTPMiddleware):
       async def dispatch(self, request, call_next):
           start = time.time()
           response = await call_next(request)  # Call the route
           response.headers["X-Process-Time"] = str(time.time() - start)
           return response
   
   app.add_middleware(RequestTimingMiddleware)
   ```

**Q16. What are background tasks in FastAPI?**
A: Tasks that run AFTER the response is sent. Don't block the client.
   Use for: sending emails, notifications, logging, processing uploads.
   ```python
   from fastapi import BackgroundTasks
   
   def send_email(email: str, message: str):
       # This runs after response is sent
       time.sleep(5)
       print(f"Sent email to {email}")
   
   @app.post("/register")
   async def register(data: UserCreate, background_tasks: BackgroundTasks):
       user = create_user(data)
       background_tasks.add_task(send_email, data.email, "Welcome!")
       return user  # Returns immediately — email sent in background
   ```

---

## SECTION F — Production & Testing

**Q17. How do you structure a FastAPI application for production?**
A: ```
   app/
   ├── main.py          → app creation, middleware, routers
   ├── core/
   │   ├── config.py    → settings (Pydantic BaseSettings)
   │   └── database.py  → SQLAlchemy engine + session dependency
   ├── models/          → SQLAlchemy models (database tables)
   ├── schemas/         → Pydantic models (request/response)
   ├── routers/         → APIRouter per resource
   ├── services/        → business logic
   ├── repositories/    → database queries
   └── dependencies/    → reusable Depends functions
   ```

**Q18. How do you use Pydantic BaseSettings for configuration?**
A: ```python
   from pydantic_settings import BaseSettings  # pip install pydantic-settings
   
   class Settings(BaseSettings):
       database_url: str
       secret_key: str
       jwt_algorithm: str = "HS256"
       access_token_expire_minutes: int = 30
       
       class Config:
           env_file = ".env"
   
   settings = Settings()  # Reads from .env or environment variables
   # Use: settings.database_url
   ```
   Pydantic validates that env vars are present and the right type at startup.

**Q19. How do you test FastAPI applications?**
A: Use TestClient (synchronous) or AsyncClient (async):
   ```python
   from fastapi.testclient import TestClient
   from httpx import AsyncClient
   
   def test_get_notes():
       with TestClient(app) as client:
           response = client.get("/notes")
           assert response.status_code == 200
           assert isinstance(response.json(), list)
   
   # Override dependencies in tests:
   async def mock_current_user():
       return {"id": "1", "role": "admin"}
   
   app.dependency_overrides[get_current_user] = mock_current_user
   ```

**Q20. What is the difference between FastAPI routers and sub-applications?**
A: APIRouter → groups related routes with a prefix. Mounted via `app.include_router()`.
              Shares the same app's middleware and exception handlers.
              ```python
              router = APIRouter(prefix="/api/v1/notes", tags=["Notes"])
              app.include_router(router)
              ```
   Sub-application → a completely separate FastAPI app mounted at a path.
                    `app.mount("/v2", app_v2)` — separate middleware, docs, config.
                    Use for: versioning with completely different apps, independent services.
   For most cases: use APIRouter. Sub-applications for true separation.
