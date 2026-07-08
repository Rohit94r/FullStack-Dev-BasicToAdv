"""
Todo HTTP routes — thin layer calling services.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import TodoCreate, TodoListResponse, TodoResponse, TodoUpdate
from app.services import todos as todo_service

router = APIRouter(prefix="/api/v1/todos", tags=["todos"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=TodoListResponse)
def list_todos(
    db: DbSession,
    search: str | None = Query(None),
    completed: bool | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    # TODO: Call todo_service.get_all, return TodoListResponse
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # items, total = todo_service.get_all(
    #     db, search=search, completed=completed, page=page, limit=limit
    # )
    # return TodoListResponse(
    #     data=items, total=total, page=page, limit=limit
    # )
    raise NotImplementedError


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(db: DbSession, todo_id: int):
    # TODO: Call get_by_id, map TodoNotFoundError → HTTP 404
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # try:
    #     return todo_service.get_by_id(db, todo_id)
    # except todo_service.TodoNotFoundError as exc:
    #     raise HTTPException(status_code=404, detail=str(exc))
    raise NotImplementedError


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(db: DbSession, payload: TodoCreate):
    # TODO: Call todo_service.create
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # return todo_service.create(db, payload)
    raise NotImplementedError


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(db: DbSession, todo_id: int, payload: TodoUpdate):
    # TODO: Call todo_service.update with 404 handling
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # try:
    #     return todo_service.update(db, todo_id, payload)
    # except todo_service.TodoNotFoundError as exc:
    #     raise HTTPException(status_code=404, detail=str(exc))
    raise NotImplementedError


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(db: DbSession, todo_id: int):
    # TODO: Call todo_service.delete with 404 handling
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # try:
    #     todo_service.delete(db, todo_id)
    # except todo_service.TodoNotFoundError as exc:
    #     raise HTTPException(status_code=404, detail=str(exc))
    pass
