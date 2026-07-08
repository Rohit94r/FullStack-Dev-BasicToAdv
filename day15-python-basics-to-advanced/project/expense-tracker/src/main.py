#!/usr/bin/env python3
"""
CLI Expense Tracker — entry point.
Run: python src/main.py
"""

from __future__ import annotations

import sys
from pathlib import Path

# Allow imports from src/ when run as script
sys.path.insert(0, str(Path(__file__).resolve().parent))

from commands import ExpenseCommands
from models import InvalidAmountError


def print_menu() -> None:
    print("\n=== Expense Tracker ===")
    print("1. Add expense")
    print("2. List all expenses")
    print("3. List by category")
    print("4. Delete expense")
    print("5. Monthly summary")
    print("0. Exit")


def main() -> None:
    commands = ExpenseCommands()

    # TODO: while True loop with match on user choice
    # Handle invalid input with try/except ValueError
    # YOUR IDEA: write your attempt here first ↓


    # ─── ANSWER ───
    # while True:
    #     print_menu()
    #     choice = input("Choice: ").strip()
    #     try:
    #         match choice:
    #             case "1":
    #                 amount = float(input("Amount: "))
    #                 category = input("Category: ")
    #                 note = input("Note (optional): ")
    #                 commands.add_expense(amount, category, note)
    #             case "2":
    #                 commands.list_expenses()
    #             case "3":
    #                 cat = input("Category: ")
    #                 commands.list_expenses(category=cat)
    #             case "4":
    #                 eid = input("Expense ID: ")
    #                 commands.delete_expense(eid)
    #             case "5":
    #                 year = int(input("Year: "))
    #                 month = int(input("Month (1-12): "))
    #                 commands.monthly_summary(year, month)
    #             case "0":
    #                 print("Goodbye!")
    #                 break
    #             case _:
    #                 print("Invalid choice.")
    #     except ValueError as exc:
    #         print(f"Invalid input: {exc}")
    #     except InvalidAmountError:
    #         pass  # already printed in add_expense

    print("TODO: Implement main loop in main.py")


if __name__ == "__main__":
    main()
