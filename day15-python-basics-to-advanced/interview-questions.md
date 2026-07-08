# Day 15 — Python Interview Questions & Answers

Python is used everywhere: backend, data, ML, scripting, automation. Know it well.

---

## SECTION A — Python Fundamentals

**Q1. What is Python? What makes it different from JavaScript?**
A: Python is an interpreted, dynamically typed, general-purpose language.
   Key differences from JS:
   - Indentation-based (no curly braces) — enforced structure.
   - Truly synchronous by default (no event loop). asyncio adds async.
   - Stronger typing culture — type hints widely used.
   - Different async model: asyncio vs JS's built-in event loop.
   - Used heavily in: data science, ML, scripting, automation, web backends.
   - Slower than Node.js for I/O but can be faster for CPU with NumPy/Pandas.

**Q2. What is the GIL (Global Interpreter Lock)?**
A: CPython (standard Python) has a GIL — only ONE thread runs Python bytecode at a time.
   This means Python threads cannot truly run in PARALLEL for CPU-bound work.
   BUT: GIL is released during I/O operations → threads are useful for I/O-bound tasks.
   Solutions for CPU-bound parallelism:
   - multiprocessing module — multiple processes, each with own GIL.
   - NumPy/pandas — use C extensions that release the GIL.
   - asyncio — single thread, cooperative multitasking for I/O.
   Python 3.13+ is working on making the GIL optional.

**Q3. What is the difference between list, tuple, set, and dict?**
A: list  → ordered, mutable, allows duplicates. `[1, 2, 3]`. O(1) index, O(n) search.
   tuple → ordered, IMMUTABLE, allows duplicates. `(1, 2, 3)`. Use for fixed data.
   set   → unordered, mutable, NO duplicates. `{1, 2, 3}`. O(1) membership test.
   dict  → key-value pairs, ordered (Python 3.7+), mutable. `{"a": 1}`. O(1) key lookup.
   Choose: need index → list, immutable → tuple, unique → set, key-value → dict.

**Q4. What is the difference between `is` and `==`?**
A: `==` → value equality. Checks if values are the same.
   `is` → identity equality. Checks if they are the SAME OBJECT in memory.
   `[1,2,3] == [1,2,3]` → True (same value).
   `[1,2,3] is [1,2,3]` → False (different objects).
   Only use `is` for: `is None`, `is True`, `is False` (singletons).
   NEVER do `val is "string"` — string interning is not guaranteed.

**Q5. What are mutable vs immutable types?**
A: Immutable: int, float, str, bool, tuple, frozenset, bytes — cannot be changed after creation.
   Mutable:   list, dict, set, bytearray, most objects — can be modified in place.
   Why matters: if you pass a mutable object to a function and modify it → the caller sees the change.
   `def add(lst): lst.append(4)` — modifies the ORIGINAL list (passes by reference).
   Immutables are safe to use as dict keys and set elements.

---

## SECTION B — Functions & Closures

**Q6. What is the difference between `*args` and `**kwargs`?**
A: `*args` → collects extra POSITIONAL arguments into a TUPLE.
   `**kwargs` → collects extra KEYWORD arguments into a DICT.
   `def f(*args, **kwargs)` → accepts ANY number of positional and keyword args.
   Also used for unpacking: `f(*[1,2,3])` and `f(**{"a": 1})`.

**Q7. What is a closure in Python?**
A: A function that remembers variables from its enclosing scope, even after the outer function returns.
   ```python
   def make_adder(n):
       def add(x):
           return x + n  # n is "closed over" from make_adder's scope
       return add
   
   add5 = make_adder(5)
   add5(3)  # 8 — remembers n=5
   ```
   Closures are used in: decorators, factory functions, callbacks.

**Q8. What is a decorator? Write one from scratch.**
A: A decorator is a function that wraps another function to add behavior.
   ```python
   def timer(func):
       import time, functools
       @functools.wraps(func)  # Preserves func's name and docstring
       def wrapper(*args, **kwargs):
           start = time.perf_counter()
           result = func(*args, **kwargs)
           end = time.perf_counter()
           print(f"{func.__name__} took {end-start:.4f}s")
           return result
       return wrapper
   
   @timer
   def slow_function():
       time.sleep(1)
   ```
   `@timer` is syntactic sugar for `slow_function = timer(slow_function)`.

**Q9. What is the difference between a generator and a list?**
A: List       → stores ALL values in memory at once. Fast random access.
   Generator   → produces values LAZILY, one at a time on demand. Constant memory usage.
   `[x**2 for x in range(1000000)]` → ~8MB in memory.
   `(x**2 for x in range(1000000))` → ~100 bytes. Values created when requested.
   Use generators for: large datasets, infinite sequences, pipelines.
   Limitation: can only iterate once (consumed), no indexing.

**Q10. What is `functools.wraps` and why is it needed in decorators?**
A: Without `@functools.wraps(func)`, the wrapper function REPLACES the original function's metadata:
   `decorated.__name__` → "wrapper" instead of "slow_function"
   `decorated.__doc__`  → None instead of original docstring
   This breaks: debugging, documentation, `help()`, some testing tools.
   Always use `@functools.wraps(func)` inside your decorators.

---

## SECTION C — OOP

**Q11. What is the difference between `@classmethod` and `@staticmethod`?**
A: Instance method  → first param is `self`. Has access to instance AND class.
   Class method      → `@classmethod`. First param is `cls`. Access to CLASS only. Not instance.
                       Use for: factory methods (alternate constructors), accessing class variables.
   Static method     → `@staticmethod`. No `self` or `cls`. No access to class or instance.
                       Just a regular function that logically belongs to the class.

**Q12. What is `__init__` vs `__new__`?**
A: `__new__` → creates the instance (allocates memory). Returns new instance.
   `__init__` → initializes the instance (sets attributes). Called right after `__new__`.
   Usually only override `__init__`. Override `__new__` for: metaclasses, singletons, immutable subclasses.

**Q13. What is multiple inheritance? What is MRO?**
A: Python supports inheriting from MULTIPLE base classes: `class C(A, B)`.
   MRO (Method Resolution Order): the ORDER Python searches for attributes/methods.
   Uses C3 linearization algorithm. `C.__mro__` → `(C, A, B, object)`.
   Resolved with `super()` — calls next in MRO, not just parent.
   Diamond problem: handled automatically by MRO. Each class appears only once.

**Q14. What are Python's dunder/magic methods? Name 5 with examples.**
A: `__init__` → constructor. Called when creating instance.
   `__str__`  → called by `str()` and `print()`. Human-readable representation.
   `__repr__` → called by `repr()`. Developer representation (eval-able ideally).
   `__len__`  → called by `len()`.
   `__eq__`   → called by `==`. Default compares identity.
   `__lt__`   → called by `<`. Enables sorting.
   `__add__`  → called by `+`.
   `__getitem__` → called by `obj[key]`.
   `__enter__/__exit__` → context manager protocol (`with` statement).
   `__iter__/__next__` → iterator protocol (`for` loop).

---

## SECTION D — Async Python

**Q15. What is asyncio? How is Python's async different from Node.js?**
A: asyncio is Python's built-in library for asynchronous I/O using a single-threaded event loop.
   Node.js: event loop is baked into the runtime. ALL I/O is async by default.
   Python: blocking by default. Must EXPLICITLY use async/await and run in event loop.
   Key: in Python, calling a regular function inside an async function BLOCKS everything.
   Must use async versions (asyncio.sleep, not time.sleep; httpx not requests).

**Q16. What is the difference between `asyncio.gather` and `asyncio.create_task`?**
A: gather → runs coroutines concurrently, waits for ALL to complete, returns list of results.
            `results = await asyncio.gather(coro1(), coro2(), coro3())`
   create_task → starts a coroutine as a background task. Returns Task immediately.
                 Other code can run while the task runs. Await the task when you need the result.
   gather internally creates tasks. Use gather for simple concurrency.
   Use create_task when you want to start tasks at different times or track them separately.

**Q17. What is the difference between `asyncio.sleep` and `time.sleep` in async code?**
A: `time.sleep(n)`     → BLOCKS the entire thread. Event loop stops. All other coroutines wait.
   `asyncio.sleep(n)`  → SUSPENDS current coroutine. Event loop runs other coroutines during the wait.
   ALWAYS use asyncio.sleep in async code. Using time.sleep in an async function is a common bug.
   Similarly: use async libraries: httpx (not requests), aiofiles (not open()), asyncpg (not psycopg2).

---

## SECTION E — Python Ecosystem

**Q18. What is pip and virtual environment (venv)?**
A: pip → Python package installer. `pip install fastapi`.
   venv → isolated Python environment per project.
          `python -m venv venv` → creates virtual environment in ./venv folder.
          Activates: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows).
          After activation: pip installs only to project's venv. Isolated from other projects.
          `pip freeze > requirements.txt` → saves exact versions.
          `pip install -r requirements.txt` → installs from requirements.

**Q19. What is the difference between `requirements.txt` and `pyproject.toml`?**
A: requirements.txt → traditional. Simple list of packages + versions. pip-based.
   pyproject.toml   → modern standard. Project metadata + dependencies. Used by Poetry, PDM, Hatch.
   For FastAPI projects: often use pyproject.toml with Poetry for dependency management.
   `poetry add fastapi` → adds to pyproject.toml + poetry.lock (like package-lock.json).

**Q20. What is Pydantic?**
A: Pydantic is Python's most popular data validation library.
   Uses Python type annotations to define data schemas.
   Validates, parses, and serializes data automatically.
   ```python
   from pydantic import BaseModel, EmailStr
   class User(BaseModel):
       name: str
       email: EmailStr
       age: int
   
   user = User(name="Rohit", email="rohit@example.com", age=25)
   ```
   If validation fails → raises ValidationError with detailed messages.
   FastAPI uses Pydantic for request/response models — the backbone of FastAPI's type safety.
