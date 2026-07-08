"""
SQLAlchemy ORM models.
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    # TODO: Define columns — id, title, description, completed, priority, created_at, updated_at
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # id = Column(Integer, primary_key=True, index=True)
    # title = Column(String(200), nullable=False, index=True)
    # description = Column(Text, default="")
    # completed = Column(Boolean, default=False, index=True)
    # priority = Column(Integer, default=1)
    # created_at = Column(DateTime, default=datetime.utcnow)
    # updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    pass
