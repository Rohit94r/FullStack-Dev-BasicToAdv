"""
FastAPI Todo API — application entry point.
Run: uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import todos


@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO: On startup — Base.metadata.create_all(bind=engine)
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="FastAPI Todo API",
        version="1.0.0",
        lifespan=lifespan,
    )

    # TODO: Include todos router
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # app.include_router(todos.router)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
