"""
Business logic and CLI command handlers.
Uses decorator pattern from today's lessons.
"""

from __future__ import annotations

import functools
from collections import defaultdict
from datetime import date, datetime
from typing import Callable, TypeVar

from models import (
    BUDGET_WARNING_THRESHOLD,
    MONTHLY_BUDGET,
    Expense,
    InvalidAmountError,
)
from storage import ExpenseStorage

F = TypeVar("F", bound=Callable[..., object])


def log_action(func: F) -> F:
    """Decorator: log every command with timestamp and function name."""

    # TODO: Implement decorator using functools.wraps
    # Print: [2026-01-15 10:30:00] add_expense called
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # @functools.wraps(func)
    # def wrapper(*args, **kwargs):
    #     ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #     print(f"[{ts}] {func.__name__} called")
    #     return func(*args, **kwargs)
    # return wrapper  # type: ignore[return-value]

    return func  # placeholder until you implement


class ExpenseCommands:
    """High-level operations used by the CLI menu."""

    def __init__(self, storage: ExpenseStorage | None = None) -> None:
        self.storage = storage or ExpenseStorage()

    @log_action
    def add_expense(
        self, amount: float, category: str, note: str = ""
    ) -> Expense:
        # TODO: Create Expense, add via storage, print confirmation
        # Handle InvalidAmountError with friendly message
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # try:
        #     expense = Expense(amount=amount, category=category, note=note)
        #     self.storage.add(expense)
        #     print(f"Added ${expense.amount:.2f} in '{expense.category}'")
        #     return expense
        # except InvalidAmountError as exc:
        #     print(f"Error: {exc}")
        #     raise
        raise NotImplementedError

    @log_action
    def list_expenses(self, category: str | None = None) -> list[Expense]:
        # TODO: Get all or filter by category, print formatted table, return list
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # expenses = (
        #     self.storage.filter_by_category(category)
        #     if category
        #     else self.storage.all()
        # )
        # if not expenses:
        #     print("No expenses found.")
        #     return []
        # for e in expenses:
        #     print(f"  {e.id[:8]}…  ${e.amount:>8.2f}  {e.category:<12}  {e.expense_date}  {e.note}")
        # return expenses
        return []

    @log_action
    def delete_expense(self, expense_id: str) -> None:
        # TODO: Call storage.delete, print success or not-found message
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # if self.storage.delete(expense_id):
        #     print("Expense deleted.")
        # else:
        #     print("Expense not found.")
        pass

    @log_action
    def monthly_summary(self, year: int, month: int) -> dict[str, float]:
        # TODO: Filter expenses for that month, group totals by category (dict aggregation)
        # Print summary table and budget warning if total > 80% of MONTHLY_BUDGET
        # YOUR IDEA: write your attempt here first ↓


        # ─── ANSWER ───
        # start = date(year, month, 1)
        # end = date(year, month, 28 if month == 2 else 30 if month in (4, 6, 9, 11) else 31)
        # # Better: use calendar or first day of next month minus 1 day
        # from calendar import monthrange
        # end = date(year, month, monthrange(year, month)[1])
        # expenses = [
        #     e for e in self.storage.all()
        #     if e.expense_date.year == year and e.expense_date.month == month
        # ]
        # totals: dict[str, float] = defaultdict(float)
        # for e in expenses:
        #     totals[e.category] += e.amount
        # grand_total = sum(totals.values())
        # print(f"\nSummary for {year}-{month:02d}:")
        # for cat, total in sorted(totals.items()):
        #     print(f"  {cat:<15} ${total:>10.2f}")
        # print(f"  {'TOTAL':<15} ${grand_total:>10.2f}")
        # if grand_total >= MONTHLY_BUDGET * BUDGET_WARNING_THRESHOLD:
        #     print(f"  ⚠ Warning: over {BUDGET_WARNING_THRESHOLD:.0%} of ${MONTHLY_BUDGET:.0f} budget!")
        # return dict(totals)
        return {}
