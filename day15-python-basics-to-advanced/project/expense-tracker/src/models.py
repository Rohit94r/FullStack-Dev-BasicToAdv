"""
Expense Tracker — Data models and custom exceptions.
Type hints everywhere (same idea as TypeScript interfaces).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional
import uuid


# =============================================================================
# TODO: Define InvalidAmountError — a custom exception for bad amounts
# YOUR IDEA: write your attempt here first ↓


# ─── ANSWER (only look after trying!) ───
# class InvalidAmountError(ValueError):
#     """Raised when expense amount is zero or negative."""
#     pass


MONTHLY_BUDGET: float = 2000.0
BUDGET_WARNING_THRESHOLD: float = 0.8  # warn at 80%


@dataclass
class Expense:
    """Single expense record."""

    amount: float
    category: str
    note: str = ""
    expense_date: date = field(default_factory=date.today)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def __post_init__(self) -> None:
        # TODO: Validate amount > 0, raise InvalidAmountError if not
        # TODO: Strip and validate category is non-empty
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # if self.amount <= 0:
        #     raise InvalidAmountError(f"Amount must be positive, got {self.amount}")
        # self.category = self.category.strip()
        # if not self.category:
        #     raise InvalidAmountError("Category cannot be empty")
        pass

    def to_dict(self) -> dict:
        # TODO: Return dict with id, amount, category, note, date (ISO string)
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # return {
        #     "id": self.id,
        #     "amount": self.amount,
        #     "category": self.category,
        #     "note": self.note,
        #     "date": self.expense_date.isoformat(),
        # }
        return {}

    @classmethod
    def from_dict(cls, data: dict) -> Expense:
        # TODO: Parse date string back to date object, construct Expense
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # return cls(
        #     id=data["id"],
        #     amount=float(data["amount"]),
        #     category=data["category"],
        #     note=data.get("note", ""),
        #     expense_date=date.fromisoformat(data["date"]),
        # )
        raise NotImplementedError("Implement from_dict")
