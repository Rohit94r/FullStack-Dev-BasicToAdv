# ─────────────────────────────────────────────────────────────────────────────
# LESSON 02 — CONDITIONS & LOOPS             LEVEL: BASIC → ADVANCED
#
# Run me with:  python3 02_conditions_and_loops.py
#
# WHAT YOU WILL LEARN:
#   1. INDENTATION — Python's replacement for { braces }  ← MOST IMPORTANT
#   2. if / elif / else
#   3. Comparison & logic operators (and/or/not instead of &&/||/!)
#   4. while loops
#   5. for loops + range()
#   6. enumerate() and zip()
#   7. break / continue / for-else
#   8. match statement (Python's switch, but stronger)
# ─────────────────────────────────────────────────────────────────────────────


# ─── 1. INDENTATION — THE BIG RULE ───────────────────────────────────────────

# In JS, { braces } define a block. In Python, INDENTATION defines a block.
# The colon : says "a block starts next line", then you indent 4 spaces.
#
# JS:                              Python:
#   if (x > 5) {                     if x > 5:
#       console.log("big");              print("big")
#   }
#
# RULES:
#   ✅ Use 4 spaces per level (the universal standard)
#   ❌ Never mix tabs and spaces — Python will refuse to run
#   ✅ Everything at the same indent level = same block
#
# ANALOGY: think of indentation like a book's outline — chapters, sections,
# subsections. The visual structure IS the logical structure.

x = 10
if x > 5:
    print("big")          # inside the if-block (indented)
    print("still inside") # same indent → same block
print("always runs")      # back to indent 0 → OUTSIDE the if
# Expected output:
# big
# still inside
# always runs


# ─── 2. if / elif / else ─────────────────────────────────────────────────────

# JS: else if   →   Python: elif  (one word)
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(grade)  # Expected output: B

# Ternary — the word order is DIFFERENT from JS (read it like English):
# JS:      const label = score >= 50 ? "pass" : "fail"
# Python:  value_if_true  if  condition  else  value_if_false
label = "pass" if score >= 50 else "fail"
print(label)  # Expected output: pass


# ─── 3. COMPARISONS & LOGIC ──────────────────────────────────────────────────

# Python's == already compares by VALUE with no type coercion surprises,
# so == in Python behaves like === in JS. There is no "loose equals" trap.
print(1 == 1)       # Expected output: True
print("1" == 1)     # Expected output: False  (different types → just False)
print(1 != 2)       # Expected output: True

# Logic words instead of symbols:
# JS:  &&   ||   !
# Py:  and  or   not
age = 25
has_id = True
print(age >= 18 and has_id)   # Expected output: True
print(age < 18 or has_id)     # Expected output: True
print(not has_id)             # Expected output: False

# Chained comparison — a Python superpower JS doesn't have:
print(18 <= age <= 65)        # Expected output: True   (means: 18<=age AND age<=65)

# "in" checks membership in strings, lists, dicts...
print("py" in "python")            # Expected output: True
print(3 in [1, 2, 3])              # Expected output: True

# is → identity (same object in memory). Use it ONLY for None:
nothing = None
print(nothing is None)             # Expected output: True   ✅ the Pythonic way
print(nothing is not None)         # Expected output: False


# ─── 4. while LOOPS ──────────────────────────────────────────────────────────

# Same idea as JS, minus parentheses and braces:
count = 3
while count > 0:
    print(f"countdown: {count}")
    count -= 1          # remember: no count-- in Python
# Expected output:
# countdown: 3
# countdown: 2
# countdown: 1

# The classic "menu loop" pattern (you will use this in today's project):
# while True:
#     command = input("> ")
#     if command == "quit":
#         break            # break exits the loop, like JS


# ─── 5. for LOOPS + range() ──────────────────────────────────────────────────

# Python's for is JS's for...of — it walks over ITEMS, not indexes.
# JS:      for (const fruit of fruits) { ... }
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# Expected output:
# apple
# banana
# cherry

# There is NO C-style for (let i = 0; i < n; i++). Want numbers? Use range():
for i in range(3):        # range(3) → 0, 1, 2  (stop is EXCLUSIVE)
    print(i)
# Expected output:
# 0
# 1
# 2

print(list(range(2, 6)))      # Expected output: [2, 3, 4, 5]   (start, stop)
print(list(range(0, 10, 3)))  # Expected output: [0, 3, 6, 9]   (start, stop, step)
print(list(range(5, 0, -1)))  # Expected output: [5, 4, 3, 2, 1] (counting down)

# WHY range instead of a real list? range is LAZY — range(1_000_000) does not
# build a million numbers in memory; it hands them out one at a time.

# Looping over a string works too (strings are iterable):
for ch in "abc":
    print(ch)
# Expected output:
# a
# b
# c


# ─── 6. enumerate() and zip() ────────────────────────────────────────────────

# Need the INDEX too? Don't do range(len(...)). Use enumerate():
# JS:      fruits.forEach((fruit, i) => ...)
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# Expected output:
# 0: apple
# 1: banana
# 2: cherry

# enumerate(fruits, start=1) starts counting at 1 — nice for menus.

# zip() walks two (or more) lists TOGETHER, pairing items up:
names = ["Rohit", "Asha", "Vikram"]
scores = [92, 85, 78]
for person, points in zip(names, scores):
    print(f"{person} scored {points}")
# Expected output:
# Rohit scored 92
# Asha scored 85
# Vikram scored 78
# NOTE: zip stops at the SHORTEST list.


# ─── 7. break / continue / for-else ──────────────────────────────────────────

# break and continue work exactly like JS:
for n in range(10):
    if n == 3:
        continue        # skip 3, go to next iteration
    if n == 5:
        break           # stop the whole loop
    print(n)
# Expected output:
# 0
# 1
# 2
# 4

# for-else — unique to Python! The else runs ONLY if the loop finished
# WITHOUT hitting break. Great for "search and report not found":
for n in [1, 3, 5]:
    if n % 2 == 0:
        print("found an even number")
        break
else:
    print("no even numbers found")
# Expected output: no even numbers found


# ─── 8. match STATEMENT (Python 3.10+) ───────────────────────────────────────

# Python's switch — but it can also DESTRUCTURE (pattern matching).
# JS:  switch (command) { case "add": ...; break; default: ... }
command = "list"

match command:
    case "add":
        print("adding...")
    case "list":
        print("listing...")
    case "delete" | "remove":            # multiple options with |
        print("deleting...")
    case _:                              # _ is the default case
        print("unknown command")
# Expected output: listing...
# NOTE: no break needed — cases never fall through.

# Pattern matching with structure — match can pull values OUT:
point = (0, 5)
match point:
    case (0, 0):
        print("at origin")
    case (0, y):                          # matches (0, anything), captures y
        print(f"on the y-axis at {y}")
    case (x, y):
        print(f"at {x}, {y}")
# Expected output: on the y-axis at 5


# ─────────────────────────────────────────────────────────────────────────────
# INTERVIEW Q&A CHEAT SHEET
# ─────────────────────────────────────────────────────────────────────────────
#
# Q: How does Python define code blocks without braces?
# A: With a colon and consistent indentation (4 spaces standard). Lines at
#    the same indent level belong to the same block. Wrong indentation is a
#    SyntaxError/IndentationError, not a style issue.
#
# Q: Does Python have ===?
# A: No, and it doesn't need it. Python's == compares values WITHOUT type
#    coercion ("1" == 1 is simply False), so it already behaves like ===.
#    "is" exists separately for identity (same object) — use it for None.
#
# Q: What is the difference between for in Python and for in JS?
# A: Python's for iterates over items of any iterable (like JS for...of).
#    There is no C-style index for-loop; use range() for number sequences
#    and enumerate() when you need index + item together.
#
# Q: What does range(1, 10, 2) produce?
# A: 1, 3, 5, 7, 9 — start 1, stop BEFORE 10, step 2. It's lazy: values are
#    generated one at a time, not stored as a full list.
#
# Q: What is enumerate() for?
# A: It wraps an iterable and yields (index, item) pairs, replacing the
#    pattern for i in range(len(x)). Cleaner and less error-prone.
#
# Q: What does zip() do when lists have different lengths?
# A: It stops at the shortest one. (itertools.zip_longest fills gaps if you
#    need the longer behavior.)
#
# Q: What is for-else?
# A: The else block after a for runs only if the loop completed WITHOUT
#    break — commonly used for "searched everything, found nothing" logic.
#
# Q: How is match different from a JS switch?
# A: No fall-through (no break needed), multiple values with |, a default
#    via case _, and real PATTERN MATCHING: it can destructure tuples,
#    dicts, and objects and capture inner values into variables.
# ─────────────────────────────────────────────────────────────────────────────
