"""
Database engine and session dependency.
Pattern: same as lesson 05_sqlalchemy_setup.py
"""

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/fastapi_todo",
)

# TODO: create_engine(DATABASE_URL, echo=False)
# TODO: SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# YOUR IDEA: write your attempt here first ↓


# ─── ANSWER ───
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

engine = None  # replace with your engine
SessionLocal = None  # replace with your sessionmaker


def get_db() -> Generator[Session, None, None]:
    # TODO: Yield a session, close in finally (see lesson 05)
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # db = SessionLocal()
    # try:
    #     yield db
    # finally:
    #     db.close()
    raise NotImplementedError("Implement get_db")
