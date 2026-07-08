# =============================================================================
# DAY 16 — LESSON 3: Pydantic Models (Validation = Zod for Python)
# =============================================================================
# Run: python lessons/03_pydantic_models.py
# Install: pip install pydantic email-validator
# =============================================================================

from datetime import datetime
from enum import Enum
from typing import Annotated, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

# =============================================================================
# SECTION 1: Basic BaseModel — like a TypeScript interface + runtime validation
# =============================================================================


class TodoCreate(BaseModel):
    """Schema for creating a todo — request body validation."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    completed: bool = False
    priority: int = Field(default=1, ge=1, le=5)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Learn Pydantic",
                "description": "Read lesson 03",
                "completed": False,
                "priority": 3,
            }
        }
    )


class TodoResponse(TodoCreate):
    """Response includes server-generated fields."""

    id: int
    created_at: datetime
    updated_at: datetime


# Valid data
todo = TodoCreate(title="Buy milk", priority=2)
print("Valid todo:", todo.model_dump())

# Invalid — Pydantic raises ValidationError (like Zod .parse())
try:
    TodoCreate(title="", priority=10)
except Exception as exc:
    print("Validation failed:", exc)


# =============================================================================
# SECTION 2: Field validators — custom rules
# =============================================================================


class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=8)
    confirm_password: str

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError("Username must be alphanumeric (underscores allowed)")
        return v.lower()

    @model_validator(mode="after")
    def passwords_match(self) -> "UserRegister":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


user = UserRegister(
    email="dev@example.com",
    username="dev_user",
    password="secret123",
    confirm_password="secret123",
)
print("User:", user.email, user.username)


# =============================================================================
# SECTION 3: Enums + Optional fields — Express/Zod equivalent patterns
# =============================================================================


class TodoStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[TodoStatus] = None
    priority: Optional[Annotated[int, Field(ge=1, le=5)]] = None

    # Partial update — only provided fields are set (exclude_unset in FastAPI)


update = TodoUpdate(status=TodoStatus.done)
print("Partial update:", update.model_dump(exclude_unset=True))


# =============================================================================
# SECTION 4: Nested models — like nested Zod objects
# =============================================================================


class Tag(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)


class TodoWithTags(BaseModel):
    title: str
    tags: list[Tag] = Field(default=[], max_length=10)


nested = TodoWithTags(title="Deploy", tags=[Tag(name="urgent"), Tag(name="backend")])
print("Nested:", nested.model_dump())


# =============================================================================
# INTERVIEW Q&A
# =============================================================================
# Q: What is Pydantic and why does FastAPI use it?
# A: Data validation library using Python type hints. FastAPI uses it for
#    automatic request/response validation and OpenAPI schema generation.
#
# Q: Pydantic vs Zod?
# A: Same job — runtime validation from schemas. Pydantic is Python-native;
#    Zod is TypeScript-native. Both integrate with their web frameworks.
#
# Q: What is model_validator vs field_validator?
# A: field_validator runs on one field; model_validator runs after all fields
#    are parsed — good for cross-field rules like password confirmation.
