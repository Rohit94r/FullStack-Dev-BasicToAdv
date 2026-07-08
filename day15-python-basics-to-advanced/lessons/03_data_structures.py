# ─────────────────────────────────────────────────────────────────────────────
# LESSON 03 — DATA STRUCTURES: THE BIG 4     LEVEL: BASIC → ADVANCED
#
# Run me with:  python3 03_data_structures.py
#
# WHAT YOU WILL LEARN:
#   1. list  — ordered, changeable          (JS: Array)
#   2. tuple — ordered, FROZEN              (JS: no real equivalent — readonly array)
#   3. dict  — key → value pairs            (JS: object / Map)
#   4. set   — unique values, super-fast    (JS: Set)
#   5. Slicing deep-dive
#   6. Nesting + when to use which
#
# ANALOGY:
#   list  = a shopping list you can edit
#   tuple = a sealed envelope — once written, never changed
#   dict  = a phone book — look up a name, get a number
#   set   = a guest list — each name appears only ONCE
# ─────────────────────────────────────────────────────────────────────────────


# ─── 1. LIST — the workhorse (JS Array) ──────────────────────────────────────

fruits = ["apple", "banana", "cherry"]

# Reading:
print(fruits[0])       # Expected output: apple
print(fruits[-1])      # Expected output: cherry  ← -1 = last item! (no .at(-1) needed)
print(len(fruits))     # Expected output: 3       (function, not .length)

# Adding:
fruits.append("mango")            # JS: push       → add to END
fruits.insert(1, "kiwi")          # JS: splice     → add at index
print(fruits)  # Expected output: ['apple', 'kiwi', 'banana', 'cherry', 'mango']

# Removing:
fruits.remove("kiwi")             # remove by VALUE (first match, ValueError if missing)
last = fruits.pop()               # JS: pop        → remove + return last
first = fruits.pop(0)             # JS: shift      → remove + return by index
print(fruits)  # Expected output: ['banana', 'cherry']
print(last, first)                # Expected output: mango apple

# Other key methods:
nums = [3, 1, 4, 1, 5]
nums.sort()                       # sorts IN PLACE (changes nums, returns None!)
print(nums)                       # Expected output: [1, 1, 3, 4, 5]
print(sorted([9, 2, 7]))          # Expected output: [2, 7, 9]  ← returns a NEW list
nums.reverse()                    # in-place reverse
print(nums)                       # Expected output: [5, 4, 3, 1, 1]
print(nums.count(1))              # Expected output: 2   how many 1s
print(nums.index(3))              # Expected output: 2   where is 3 (ValueError if missing)

# ❌ CLASSIC BUG: data = nums.sort()  → data is None! sort() returns nothing.
# ✅ Use sorted(nums) when you want the result back.

# Sorting with a key (JS: arr.sort((a,b) => ...) — Python is nicer):
words = ["banana", "fig", "apple"]
print(sorted(words, key=len))            # Expected output: ['fig', 'apple', 'banana']
print(sorted(words, key=len, reverse=True))
# Expected output: ['banana', 'apple', 'fig']

# Concatenation and repetition:
print([1, 2] + [3, 4])            # Expected output: [1, 2, 3, 4]
print([0] * 4)                    # Expected output: [0, 0, 0, 0]

# extend = spread-append:
# JS:  arr.push(...other)
a = [1, 2]
a.extend([3, 4])
print(a)                          # Expected output: [1, 2, 3, 4]

# Checking membership (fast to write, but O(n) — scans the whole list):
print(2 in a)                     # Expected output: True

# min / max / sum work directly on lists:
print(min(a), max(a), sum(a))     # Expected output: 1 4 10

# ⚠️ MUTABILITY WARNING (same trap as JS objects/arrays):
original = [1, 2, 3]
alias = original          # NOT a copy — both names point to the SAME list
alias.append(4)
print(original)           # Expected output: [1, 2, 3, 4]  ← original changed too!
real_copy = original.copy()       # shallow copy (JS: [...original])
real_copy.append(5)
print(original)           # Expected output: [1, 2, 3, 4]  ← safe now


# ─── 2. SLICING DEEP-DIVE ────────────────────────────────────────────────────

# Syntax: sequence[start:stop:step] — stop is EXCLUSIVE. Works on lists,
# strings, and tuples. Think of it as JS .slice() with superpowers.
letters = ["a", "b", "c", "d", "e", "f"]

print(letters[1:4])     # Expected output: ['b', 'c', 'd']   index 1 up to (not incl.) 4
print(letters[:3])      # Expected output: ['a', 'b', 'c']   from start
print(letters[3:])      # Expected output: ['d', 'e', 'f']   to end
print(letters[-2:])     # Expected output: ['e', 'f']        last two
print(letters[::2])     # Expected output: ['a', 'c', 'e']   every 2nd item
print(letters[::-1])    # Expected output: ['f', 'e', 'd', 'c', 'b', 'a']  ← reverse!

# Slicing ALWAYS returns a NEW object — [:] is the classic shallow-copy idiom:
copy2 = letters[:]

# Slicing strings works the same way:
s = "hello world"
print(s[:5])            # Expected output: hello
print(s[::-1])          # Expected output: dlrow olleh   (reverse a string — interview classic)

# You can even ASSIGN into a list slice (replaces that section):
letters[0:2] = ["X", "Y", "Z"]
print(letters)          # Expected output: ['X', 'Y', 'Z', 'c', 'd', 'e', 'f']


# ─── 3. TUPLE — the frozen list ──────────────────────────────────────────────

# A tuple is an ordered collection you CANNOT change after creation.
# JS has no true equivalent (closest: Object.freeze([...]) or readonly tuples in TS).
point = (3, 5)
rgb = (255, 128, 0)

print(point[0])         # Expected output: 3     reading works like a list

# point[0] = 99  →  ❌ TypeError: 'tuple' object does not support item assignment

# WHY use tuples?
#   1. Safety: data that must never change (coordinates, config)
#   2. Speed: slightly faster and smaller than lists
#   3. Dict keys: tuples CAN be dict keys, lists cannot (tuples are hashable)
#   4. Multiple return values from functions use tuples under the hood

# Unpacking (JS array destructuring):
x, y = point
print(x, y)             # Expected output: 3 5

# Star-unpacking (JS rest):
first, *rest = [1, 2, 3, 4]
print(first, rest)      # Expected output: 1 [2, 3, 4]

# One-item tuple NEEDS a trailing comma (classic gotcha):
single = (42,)          # tuple with one item
not_tuple = (42)        # ❌ just the number 42 in parentheses!
print(type(single), type(not_tuple))
# Expected output: <class 'tuple'> <class 'int'>


# ─── 4. DICT — key/value store (JS object + Map combined) ───────────────────

# JS:      const user = { name: "Rohit", age: 25 }
# Python:  keys are usually strings and MUST be quoted:
user = {"name": "Rohit", "age": 25, "is_admin": False}

# Reading:
print(user["name"])            # Expected output: Rohit
# print(user["email"])         # ❌ KeyError! Missing key CRASHES (JS gives undefined)

# .get() = safe read with optional default (this is the JS-like behavior):
print(user.get("email"))               # Expected output: None
print(user.get("email", "no email"))   # Expected output: no email

# Writing / updating / deleting:
user["email"] = "rohit@dev.com"   # add or overwrite
user["age"] = 26                  # update
del user["is_admin"]              # delete a key
print(user)
# Expected output: {'name': 'Rohit', 'age': 26, 'email': 'rohit@dev.com'}

# Membership tests KEYS:
print("name" in user)          # Expected output: True

# The three view methods — you will use these EVERY day:
print(list(user.keys()))       # Expected output: ['name', 'age', 'email']
print(list(user.values()))     # Expected output: ['Rohit', 26, 'rohit@dev.com']
print(list(user.items()))
# Expected output: [('name', 'Rohit'), ('age', 26), ('email', 'rohit@dev.com')]

# Looping a dict — items() gives key AND value (JS: Object.entries):
for key, value in user.items():
    print(f"{key} → {value}")
# Expected output:
# name → Rohit
# age → 26
# email → rohit@dev.com

# Merging dicts (JS: {...a, ...b}):
defaults = {"theme": "dark", "lang": "en"}
prefs = {"lang": "hi"}
merged = {**defaults, **prefs}     # right side wins on conflicts
print(merged)                  # Expected output: {'theme': 'dark', 'lang': 'hi'}
merged2 = defaults | prefs         # the | operator does the same (3.9+)
print(merged2)                 # Expected output: {'theme': 'dark', 'lang': 'hi'}

# .pop() removes a key and returns its value; setdefault inserts-if-missing:
email = user.pop("email")
print(email)                   # Expected output: rohit@dev.com
user.setdefault("tags", []).append("python")   # create list if missing, then append
print(user["tags"])            # Expected output: ['python']

# HOW DICTS WORK INSIDE (interview gold):
# A dict is a HASH TABLE. Each key is passed through hash() to compute a
# number that decides WHERE in memory the value sits. That's why lookup is
# O(1) — no scanning. It's also why keys must be hashable (immutable):
# str, int, tuple ✅ — list, dict ❌. Since Python 3.7, dicts remember
# insertion order.


# ─── 5. SET — unique items, instant lookup ───────────────────────────────────

# JS:      const s = new Set([1, 2, 2, 3])
tags = {"python", "js", "python"}      # duplicate silently dropped
print(tags)                # Expected output (order varies): {'python', 'js'}
print(len(tags))           # Expected output: 2

# ⚠️ Empty set MUST be set() — {} creates an empty DICT:
empty_set = set()
empty_dict = {}
print(type(empty_set), type(empty_dict))
# Expected output: <class 'set'> <class 'dict'>

tags.add("sql")            # JS: s.add(...)
tags.discard("js")         # remove if present, NO error if missing
print("python" in tags)    # Expected output: True   ← O(1), instant, like dict keys

# Set math — the killer feature:
backend = {"python", "sql", "docker"}
frontend = {"js", "css", "docker"}
print(backend & frontend)  # Expected output: {'docker'}            intersection (both)
print(backend | frontend)  # union (all, no duplicates)
print(backend - frontend)  # Expected output (order varies): {'python', 'sql'}  difference
# Expected output for union (order varies): {'python', 'sql', 'docker', 'js', 'css'}

# Deduplicate a list — the classic one-liner:
visits = [1, 2, 2, 3, 3, 3]
unique = list(set(visits))
print(sorted(unique))      # Expected output: [1, 2, 3]


# ─── 6. NESTING — real-world shapes ──────────────────────────────────────────

# Exactly like nested JSON — dicts in lists, lists in dicts:
users = [
    {"name": "Rohit", "skills": ["python", "js"], "address": {"city": "Pune"}},
    {"name": "Asha", "skills": ["sql"], "address": {"city": "Mumbai"}},
]

print(users[0]["skills"][1])            # Expected output: js
print(users[1]["address"]["city"])      # Expected output: Mumbai

for u in users:
    print(f"{u['name']} knows {len(u['skills'])} skills")
# Expected output:
# Rohit knows 2 skills
# Asha knows 1 skills


# ─── 7. WHEN TO USE WHICH? ───────────────────────────────────────────────────
#
#   Need...                                         Use
#   ─────────────────────────────────────────────  ──────
#   Ordered items, will add/remove/change           list
#   Ordered items, must NEVER change / dict key     tuple
#   Look things up by a name/id                     dict
#   Uniqueness or fast "is X in here?" checks       set
#
#   Speed cheat sheet:
#     x in list  → O(n) slow scan
#     x in set   → O(1) instant
#     d[key]     → O(1) instant


# ─────────────────────────────────────────────────────────────────────────────
# INTERVIEW Q&A CHEAT SHEET
# ─────────────────────────────────────────────────────────────────────────────
#
# Q: list vs tuple?
# A: Both are ordered sequences. A list is MUTABLE (append/remove/sort);
#    a tuple is IMMUTABLE — frozen after creation. Tuples are hashable (can
#    be dict keys / set members), slightly faster, and signal "fixed data".
#
# Q: How do Python dicts work internally?
# A: Hash table. hash(key) determines the storage slot, giving average O(1)
#    get/set/delete. Keys must be hashable (immutable). Since Python 3.7
#    insertion order is preserved. Collisions are handled by probing for
#    another slot.
#
# Q: Why can't a list be a dict key?
# A: Keys must be hashable, and hashing requires the value to never change.
#    A list can mutate, which would silently break its slot position. A
#    tuple of immutable items works fine as a key.
#
# Q: dict[key] vs dict.get(key)?
# A: [key] raises KeyError when missing; .get(key, default) returns None or
#    your default. Use .get when a key may legitimately be absent.
#
# Q: What does letters[::-1] do?
# A: Full slice with step -1 → a NEW reversed copy. Works on strings too;
#    it's the standard way to reverse a string in Python.
#
# Q: sort() vs sorted()?
# A: list.sort() sorts in place and returns None. sorted(iterable) returns
#    a NEW sorted list and works on any iterable. Both accept key= and
#    reverse= arguments.
#
# Q: How do you deduplicate a list?
# A: list(set(items)) — but sets don't keep order. Order-preserving trick:
#    list(dict.fromkeys(items)), because dict keys are unique AND ordered.
#
# Q: Shallow vs deep copy?
# A: A shallow copy (list.copy(), [:], dict.copy()) copies only the OUTER
#    container — nested objects are still shared. copy.deepcopy() recursively
#    copies everything. Same concept as spread vs structuredClone in JS.
#
# Q: Why is "x in set" faster than "x in list"?
# A: Sets are hash-based: membership is a hash lookup, O(1). Lists must be
#    scanned item by item, O(n).
# ─────────────────────────────────────────────────────────────────────────────
