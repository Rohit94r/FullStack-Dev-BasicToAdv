# CLI Expense Tracker — Day 15 Project

Pure Python CLI app. Fill in the blanks in `src/` before peeking at ANSWER comments.

## Setup

```bash
cd project/expense-tracker
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
python src/main.py
```

## Features checklist

- [ ] `Expense` dataclass with validation
- [ ] Add / list / delete expenses
- [ ] Filter by category and date range
- [ ] Monthly summary (totals per category)
- [ ] Budget warnings (over 80% of monthly budget)
- [ ] Persist to `data/expenses.json`
- [ ] `@log_action` decorator on commands
- [ ] Custom `InvalidAmountError` exception
- [ ] Interactive menu loop with `match`

## File map

| File | Your job |
|------|----------|
| `src/models.py` | Dataclass, exceptions, budget constants |
| `src/storage.py` | JSON load/save, CRUD on in-memory list |
| `src/commands.py` | Business logic + decorator |
| `src/main.py` | CLI menu loop |

## Workflow

1. Read the TODO in each file.
2. Write YOUR attempt in the YOUR IDEA section.
3. Only then uncomment or read the ANSWER block below it.
