"""
Todo business logic — no HTTP knowledge here (same as Day 6 service layer).
"""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate


class TodoNotFoundError(Exception):
    pass


def get_all(
    db: Session,
    *,
    search: str | None = None,
    completed: bool | None = None,
    page: int = 1,
    limit: int = 10,
) -> tuple[list[Todo], int]:
    # TODO: Build select query with optional filters
    # TODO: Count total, apply offset/limit for pagination
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # stmt = select(Todo)
    # if search:
    #     stmt = stmt.where(Todo.title.ilike(f"%{search}%"))
    # if completed is not None:
    #     stmt = stmt.where(Todo.completed == completed)
    # count_stmt = select(func.count()).select_from(stmt.subquery())
    # total = db.scalar(count_stmt) or 0
    # offset = (page - 1) * limit
    # items = list(db.scalars(stmt.order_by(Todo.created_at.desc()).offset(offset).limit(limit)))
    # return items, total
    return [], 0


def get_by_id(db: Session, todo_id: int) -> Todo:
    # TODO: Fetch by id or raise TodoNotFoundError
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # todo = db.get(Todo, todo_id)
    # if not todo:
    #     raise TodoNotFoundError(f"Todo {todo_id} not found")
    # return todo
    raise NotImplementedError


def create(db: Session, payload: TodoCreate) -> Todo:
    # TODO: Create Todo ORM object, add, commit, refresh, return
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # todo = Todo(**payload.model_dump())
    # db.add(todo)
    # db.commit()
    # db.refresh(todo)
    # return todo
    raise NotImplementedError


def update(db: Session, todo_id: int, payload: TodoUpdate) -> Todo:
    # TODO: get_by_id, apply only set fields via model_dump(exclude_unset=True)
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # todo = get_by_id(db, todo_id)
    # for key, value in payload.model_dump(exclude_unset=True).items():
    #     setattr(todo, key, value)
    # db.commit()
    # db.refresh(todo)
    # return todo
    raise NotImplementedError


def delete(db: Session, todo_id: int) -> None:
    # TODO: get_by_id, db.delete, commit
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # todo = get_by_id(db, todo_id)
    # db.delete(todo)
    # db.commit()
    pass
