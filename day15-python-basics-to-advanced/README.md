# DAY 15 — Python (Zero → Backend-Ready in One Day)

## Today's Goal
Python from zero — but FAST, because you already think in JavaScript.
Every lesson shows the JS equivalent so it maps onto what you know.

## Morning Revision (2 hr)
Explain your Portfolio CMS architecture out loud (this is interview practice
for a project on YOUR resume). Draw the request flow.

## Lessons (`lessons/`) — each shows JS vs Python side by side
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01_variables_and_types.py` | Variables (no let/const!), int/float/str/bool/None, f-strings, type hints | 45 min |
| 2 | `02_conditions_and_loops.py` | if/elif/else, INDENTATION (no braces!), for/while, range, enumerate, zip | 45 min |
| 3 | `03_data_structures.py` | list, tuple, dict, set — the big 4 + methods + when each | 75 min |
| 4 | `04_functions_and_scope.py` | def, default/keyword args, *args/**kwargs, lambda, scope | 60 min |
| 5 | `06_comprehensions_and_generators.py` | List/dict/set comprehensions, generator expressions | 45 min |
| 6 | `05_oop.py` | Classes, __init__, self, inheritance, dunder methods, dataclasses | 75 min |
| 7 | `07_async_python.py` | Decorators, generators/yield, async/await in Python | 60 min |

## Project: `project/expense-tracker/`
Fill-in-the-blank CLI — see project README for file map.

**Setup:** `python3 -m venv venv && source venv/bin/activate`

## Project (5 hours): CLI Expense Tracker (pure Python)
Same spirit as the Day 4 Task API — covers everything from today:

- [ ] Expense dataclass (amount, category, note, date)
- [ ] Add/list/delete expenses (dict + list operations)
- [ ] Filter by category/date range (comprehensions)
- [ ] Monthly summary: totals per category (dict aggregation — Python's reduce)
- [ ] Budget warnings (over 80% → warning — conditions)
- [ ] Persist to JSON file (with open, json module)
- [ ] @log_action decorator that logs every operation (decorators!)
- [ ] Custom exceptions (InvalidAmountError) with try/except
- [ ] Simple CLI menu loop (while + match statement)
- [ ] Type hints EVERYWHERE (you know TS — same idea!)

## Tonight's Notes
- JS→Python translation table: const→?, ===→?, arr.map→?, obj→dict, null→None
- list vs tuple vs set vs dict — when each?
- What a decorator is (you built one!)
- What yield does

## Interview Questions
1. list vs tuple?
2. How do dictionaries work in Python?
3. What is a list comprehension? Rewrite a map+filter with one.
4. What is *args / **kwargs?
5. What is a decorator? A generator?
6. How does Python handle errors vs JavaScript?
