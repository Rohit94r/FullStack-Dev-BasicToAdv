# ─────────────────────────────────────────────────────────────────────────────
# LESSON 01 — VARIABLES & TYPES              LEVEL: BASIC → ADVANCED
#
# Run me with:  python3 01_variables_and_types.py
#
# WHAT YOU WILL LEARN:
#   1. Variables (no let/const/var!)
#   2. Dynamic typing — what it really means
#   3. The core types: int, float, str, bool, None
#   4. f-strings (Python's template literals)
#   5. Type hints (Python's "TypeScript mode")
#   6. input() — reading from the keyboard
#
# ANALOGY: A variable is a NAME TAG that you stick on a value.
# In Python you never "declare" the tag first — you just stick it on.
# ─────────────────────────────────────────────────────────────────────────────


# ─── 1. VARIABLES ────────────────────────────────────────────────────────────

# JS:      let name = "Rohit";  const age = 25;
# Python:  just write the name and assign. No keyword at all.
name = "Rohit"
age = 25

# WHY no const? Python has no real constants. The CONVENTION is:
# write the name in ALL_CAPS and everyone promises not to change it.
MAX_USERS = 100  # "const" by convention only — Python will not stop you

# Naming style: Python uses snake_case, not camelCase.
# JS:      let userName
# Python:  user_name
user_name = "rohit_j"

# You can reassign any variable to ANY type. That is "dynamic typing":
# the TYPE lives on the VALUE, not on the variable (the name tag).
x = 10        # x points to an int
x = "hello"   # now x points to a str — perfectly legal (TS would scream here)

# Multiple assignment (very Pythonic):
a, b = 1, 2          # like JS destructuring: const [a, b] = [1, 2]
a, b = b, a          # swap in one line! No temp variable needed.
print(a, b)          # Expected output: 2 1


# ─── 2. THE CORE TYPES ───────────────────────────────────────────────────────

# JS has ONE number type. Python has TWO: int and float.
count = 42           # int   — whole numbers, can be HUGE (no overflow!)
price = 19.99        # float — decimal numbers (like JS number)

# Python ints have unlimited size. JS breaks after Number.MAX_SAFE_INTEGER,
# Python just keeps going:
big = 2 ** 100       # ** is "power" (JS also has ** now)
print(big)           # Expected output: 1267650600228229401496703205376

# Strings — single or double quotes, both fine (like JS):
greeting = "hello"
also_greeting = 'hello'

# Booleans — CAPITALIZED! This trips up every JS developer on day 1.
# JS:      true / false
# Python:  True / False
is_active = True
is_admin = False

# None — Python's null. There is NO undefined in Python.
# JS:      null (and undefined)
# Python:  None (just one "nothing" value)
middle_name = None

# type() tells you the type of a value (like typeof in JS, but better):
print(type(count))       # Expected output: <class 'int'>
print(type(price))       # Expected output: <class 'float'>
print(type(greeting))    # Expected output: <class 'str'>
print(type(is_active))   # Expected output: <class 'bool'>
print(type(middle_name)) # Expected output: <class 'NoneType'>


# ─── 3. NUMBERS & OPERATORS ──────────────────────────────────────────────────

print(7 + 3)    # Expected output: 10
print(7 - 3)    # Expected output: 4
print(7 * 3)    # Expected output: 21

# DIVISION — important difference from JS:
print(7 / 2)    # Expected output: 3.5   ← / ALWAYS gives a float
print(7 // 2)   # Expected output: 3     ← // is FLOOR division (JS: Math.floor(7/2))
print(7 % 2)    # Expected output: 1     ← remainder, same as JS
print(2 ** 10)  # Expected output: 1024  ← power

# No ++ or -- in Python! Use += and -= instead:
counter = 0
counter += 1    # JS: counter++
print(counter)  # Expected output: 1

# Converting between types (like Number("5") / String(5) in JS):
print(int("42"))      # Expected output: 42     str → int
print(float("3.14"))  # Expected output: 3.14   str → float
print(str(99))        # Expected output: 99     int → str (as text)
print(int(3.99))      # Expected output: 3      float → int TRUNCATES (no rounding!)
print(round(3.6))     # Expected output: 4      use round() to round


# ─── 4. STRINGS DEEP-DIVE ────────────────────────────────────────────────────

s = "Python is fun"

print(len(s))          # Expected output: 13     length — a FUNCTION, not .length!
print(s.upper())       # Expected output: PYTHON IS FUN
print(s.lower())       # Expected output: python is fun
print(s.replace("fun", "powerful"))  # Expected output: Python is powerful
print(s.split(" "))    # Expected output: ['Python', 'is', 'fun']   like JS .split
print("  hi  ".strip())# Expected output: hi     like JS .trim()
print("a" in s)        # Expected output: False  "in" checks membership (JS .includes)
print("fun" in s)      # Expected output: True

# Strings are IMMUTABLE (same as JS): methods return NEW strings.
# s.upper() did not change s:
print(s)               # Expected output: Python is fun

# Repetition — a fun Python trick:
print("-" * 20)        # Expected output: --------------------

# Joining a list of strings (NOTE: it's backwards vs JS!):
# JS:      ["a", "b"].join("-")
# Python:  "-".join(["a", "b"])   ← the SEPARATOR calls join
print("-".join(["a", "b", "c"]))  # Expected output: a-b-c


# ─── 5. F-STRINGS (template literals) ────────────────────────────────────────

# JS:      `Hello ${name}, you are ${age}`
# Python:  f"Hello {name}, you are {age}"   ← the f prefix is REQUIRED
city = "Pune"
print(f"Hello {name} from {city}!")   # Expected output: Hello Rohit from Pune!

# You can put any expression inside the braces:
print(f"Next year you will be {age + 1}")  # Expected output: Next year you will be 26

# Formatting numbers — super useful for money:
total = 1234.5678
print(f"Total: {total:.2f}")     # Expected output: Total: 1234.57   (.2f = 2 decimals)
print(f"Padded: {42:05d}")       # Expected output: Padded: 00042    (pad to 5 digits)

# Debug shortcut — {var=} prints the name AND value:
print(f"{age=}")                 # Expected output: age=25


# ─── 6. TYPE HINTS — "TypeScript mode" ───────────────────────────────────────

# Python is dynamically typed, BUT you can add optional type hints.
# They are like TypeScript types, with ONE big difference:
#   ❌ Python does NOT check them when running (no compiler error!)
#   ✅ Tools (mypy, your editor, FastAPI!) read them and help you.
#
# TS:      let score: number = 10
# Python:
score: int = 10
username: str = "rohit"
ratio: float = 0.5
active: bool = True

# Optional values — "this can be a str OR None":
# TS:      let nickname: string | null
nickname: str | None = None

# Function hints (much more in lesson 04):
# TS:      function add(a: number, b: number): number
def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))   # Expected output: 5

# WHY care? FastAPI (day 16) uses type hints to VALIDATE requests and
# AUTO-GENERATE docs. Type hints are not decoration — they are the engine.


# ─── 7. input() — reading from the keyboard ──────────────────────────────────

# input("question") shows the question and waits for the user to type.
# It ALWAYS returns a str — convert it yourself if you need a number.
#
#   raw = input("Your age: ")     # user types 25  → raw is the STRING "25"
#   age_num = int(raw)            # convert to int
#
# We guard it behind a flag so this file can run without stopping to ask:
ASK_USER = False  # ← change to True and re-run to try it!
if ASK_USER:
    answer = input("What is your name? ")
    print(f"Nice to meet you, {answer}!")


# ─── 8. TRUTHINESS — what counts as False? ───────────────────────────────────

# Falsy in Python: False, None, 0, 0.0, "" and EMPTY collections ([], {}, set()).
# Different from JS: in JS an empty array [] is TRUTHY. In Python it is FALSY!
print(bool(""))     # Expected output: False
print(bool("hi"))   # Expected output: True
print(bool(0))      # Expected output: False
print(bool([]))     # Expected output: False  ← ❌ JS devs get burned here
print(bool([0]))    # Expected output: True   (non-empty list, even holding 0)


# ─────────────────────────────────────────────────────────────────────────────
# INTERVIEW Q&A CHEAT SHEET
# ─────────────────────────────────────────────────────────────────────────────
#
# Q: What does "dynamically typed" mean?
# A: Types are attached to VALUES, not variables, and are checked while the
#    program runs (at runtime), not before. A variable can point to an int
#    now and a str later. TypeScript/Java check types BEFORE running (static).
#
# Q: What is the difference between int and float?
# A: int is a whole number with UNLIMITED size in Python. float is a decimal
#    (64-bit, like the JS number type). Dividing with / always returns float;
#    // returns the floored int result.
#
# Q: What is None?
# A: Python's single "no value" object (like null in JS). There is no
#    undefined. Compare with "is None", not "== None" (see lesson on == vs is).
#
# Q: What are f-strings?
# A: String literals prefixed with f that embed expressions in {braces},
#    e.g. f"hi {name}". Same idea as JS template literals `hi ${name}`.
#    They also support formatting like {price:.2f}.
#
# Q: Do type hints affect how Python runs?
# A: No — Python ignores them at runtime. They exist for tools: editors,
#    mypy (static checker), and frameworks like FastAPI, which uses them
#    for request validation and automatic documentation.
#
# Q: What does input() return?
# A: Always a string. You must convert it with int() / float() if you need
#    a number, and that conversion can raise ValueError for bad input.
#
# Q: Name Python's falsy values.
# A: False, None, 0, 0.0, "" (empty string), and empty collections:
#    [], (), {}, set(). Note: empty list is falsy in Python but truthy in JS.
# ─────────────────────────────────────────────────────────────────────────────
