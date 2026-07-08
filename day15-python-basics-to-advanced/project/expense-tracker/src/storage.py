"""
JSON persistence layer — load/save expenses to disk.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Optional

from models import Expense

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_FILE = DATA_DIR / "expenses.json"


class ExpenseStorage:
    """In-memory expense list with JSON file persistence."""

    def __init__(self, filepath: Path = DATA_FILE) -> None:
        self.filepath = filepath
        self._expenses: list[Expense] = []
        self.load()

    def load(self) -> None:
        # TODO: Create data dir if missing
        # TODO: If file exists, read JSON and convert each item to Expense via from_dict
        # TODO: If file missing, start with empty list
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # self.filepath.parent.mkdir(parents=True, exist_ok=True)
        # if self.filepath.exists():
        #     raw = json.loads(self.filepath.read_text(encoding="utf-8"))
        #     self._expenses = [Expense.from_dict(item) for item in raw]
        # else:
        #     self._expenses = []
        pass

    def save(self) -> None:
        # TODO: Write list of expense.to_dict() to JSON file (indent=2)
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # payload = [expense.to_dict() for expense in self._expenses]
        # self.filepath.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        pass

    def add(self, expense: Expense) -> Expense:
        # TODO: Append to list, save, return expense
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # self._expenses.append(expense)
        # self.save()
        # return expense
        raise NotImplementedError

    def delete(self, expense_id: str) -> bool:
        # TODO: Find by id, remove if found, save, return True/False
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # for i, expense in enumerate(self._expenses):
        #     if expense.id == expense_id:
        #         del self._expenses[i]
        #         self.save()
        #         return True
        # return False
        return False

    def all(self) -> list[Expense]:
        return list(self._expenses)

    def filter_by_category(self, category: str) -> list[Expense]:
        # TODO: List comprehension — case-insensitive category match
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # needle = category.strip().lower()
        # return [e for e in self._expenses if e.category.lower() == needle]
        return []

    def filter_by_date_range(
        self, start: date, end: date
    ) -> list[Expense]:
        # TODO: Return expenses where start <= expense_date <= end
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # return [
        #     e for e in self._expenses
        #     if start <= e.expense_date <= end
        # ]
        return []
