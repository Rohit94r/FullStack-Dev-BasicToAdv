"""
Pydantic schemas — request/response validation (Zod equivalent).
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    completed: bool = False
    priority: int = Field(default=1, ge=1, le=5)


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    # TODO: All fields optional for partial PATCH updates
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # title: Optional[str] = Field(None, min_length=1, max_length=200)
    # description: Optional[str] = Field(None, max_length=2000)
    # completed: Optional[bool] = None
    # priority: Optional[int] = Field(None, ge=1, le=5)
    pass


class TodoResponse(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)  # read from ORM objects


class TodoListResponse(BaseModel):
    data: list[TodoResponse]
    total: int
    page: int
    limit: int
