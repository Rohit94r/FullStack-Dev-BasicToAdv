# =============================================================================
# DAY 16 — LESSON 5: SQLAlchemy Setup (Prisma Equivalent in Python)
# =============================================================================
# Run examples after setting DATABASE_URL:
# export DATABASE_URL="postgresql://user:pass@localhost:5432/fastapi_lesson"
# python lessons/05_sqlalchemy_setup.py
#
# Install: pip install sqlalchemy psycopg2-binary
# =============================================================================

from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    select,
)
from sqlalchemy.orm import DeclarativeBase, Session, relationship, sessionmaker

# =============================================================================
# SECTION 1: Engine + Session — connection lifecycle
# =============================================================================

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/fastapi_lesson"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True logs SQL (dev only)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


# =============================================================================
# SECTION 2: Models — like Prisma schema models
# =============================================================================


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    todos = relationship("Todo", back_populates="owner", cascade="all, delete-orphan")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="todos")


# =============================================================================
# SECTION 3: Create tables (migrations in production — Alembic)
# =============================================================================

# Base.metadata.create_all(bind=engine)  # uncomment for first run


# =============================================================================
# SECTION 4: CRUD with Session — the pattern FastAPI Depends() wraps
# =============================================================================


def get_db():
    """Dependency pattern — yield session, always close."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_todo(db: Session, title: str, owner_id: int) -> Todo:
    todo = Todo(title=title, owner_id=owner_id)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def list_todos(db: Session, owner_id: int) -> list[Todo]:
    stmt = select(Todo).where(Todo.owner_id == owner_id).order_by(Todo.created_at.desc())
    return list(db.scalars(stmt).all())


def get_todo(db: Session, todo_id: int, owner_id: int) -> Todo | None:
    stmt = select(Todo).where(Todo.id == todo_id, Todo.owner_id == owner_id)
    return db.scalars(stmt).first()


# =============================================================================
# SECTION 5: Prisma vs SQLAlchemy mapping
# =============================================================================
# Prisma schema     → SQLAlchemy DeclarativeBase models
# prisma migrate    → Alembic migrations
# prisma.todo.findMany → session.scalars(select(Todo))
# @@relation          → relationship() + ForeignKey
# Prisma Client in DI → Depends(get_db) yields Session


# =============================================================================
# INTERVIEW Q&A
# =============================================================================
# Q: What is SQLAlchemy's role?
# A: Python ORM — maps classes to tables, provides query API and session
#    management for transactions.
#
# Q: Session lifecycle in FastAPI?
# A: Open session per request via Depends(get_db), commit on success,
#    rollback on error, always close in finally block.
#
# Q: create_all vs Alembic?
# A: create_all is fine for learning; production uses Alembic for versioned
#    migrations (like Prisma migrate).
