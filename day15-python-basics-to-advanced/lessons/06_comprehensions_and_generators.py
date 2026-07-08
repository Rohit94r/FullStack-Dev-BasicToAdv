# =============================================================================
# DAY 15 — LESSON 6: Comprehensions, Generators & Iterators
# =============================================================================
# These are Python's POWER FEATURES.
# Comprehensions: express data transformations in one clean line.
# Generators: produce values LAZILY — one at a time, on demand.
#             Critical for working with large datasets without running out of memory.
# =============================================================================

# =============================================================================
# SECTION 1: List Comprehensions
# =============================================================================
# Syntax: [expression for item in iterable if condition]
# Replaces: loop + append pattern

# Traditional
squares_traditional = []
for x in range(10):
    if x % 2 == 0:
        squares_traditional.append(x ** 2)

# List comprehension (one line, more readable)
squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(squares)  # [0, 4, 16, 36, 64]

# Nested comprehension (flatten a 2D list)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]   # [1, 2, 3, 4, 5, 6, 7, 8, 9]
# Read: "for each row in matrix, for each num in row, take num"

# Nested comprehension to create matrix
matrix_3x3 = [[i * j for j in range(1, 4)] for i in range(1, 4)]
# [[1,2,3], [2,4,6], [3,6,9]]

# Practical examples
words = ["hello", "world", "python", "is", "great"]
upper = [word.upper() for word in words]                     # Transform
long_words = [word for word in words if len(word) > 4]      # Filter
lengths = {word: len(word) for word in words}               # Dict comprehension

# =============================================================================
# SECTION 2: Dict Comprehensions
# =============================================================================
# Syntax: {key: value for item in iterable if condition}

# Invert a dictionary (keys become values, values become keys)
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}   # {1: "a", 2: "b", 3: "c"}

# Build from two lists
keys = ["name", "age", "city"]
values = ["Rohit", 25, "Mumbai"]
user = {k: v for k, v in zip(keys, values)}     # {"name": "Rohit", "age": 25, ...}

# Filter + transform dict
prices = {"apple": 1.5, "banana": 0.5, "mango": 3.0, "grape": 2.0}
expensive = {item: price for item, price in prices.items() if price > 1.0}
discounted = {item: round(price * 0.9, 2) for item, price in prices.items()}

# =============================================================================
# SECTION 3: Set Comprehensions
# =============================================================================
# Syntax: {expression for item in iterable if condition}

text = "hello world python programming"
unique_chars = {char for char in text if char.isalpha()}  # Set of unique letters
unique_lengths = {len(word) for word in text.split()}      # {5, 6, 11}

# =============================================================================
# SECTION 4: Generator Expressions
# =============================================================================
# Same syntax as list comprehension but with PARENTHESES instead of brackets.
# KEY DIFFERENCE: Does NOT create the full list in memory.
# Creates a lazy GENERATOR that produces values one at a time.

# List comprehension — all 10 million items in memory at once
# big_list = [x ** 2 for x in range(10_000_000)]  # Takes ~400MB RAM

# Generator expression — produces one value at a time. Uses ~constant memory.
gen = (x ** 2 for x in range(10_000_000))  # Created instantly, no RAM yet

# Values are generated on demand
print(next(gen))  # 0 (generates just this one value)
print(next(gen))  # 1
print(next(gen))  # 4

# sum() uses the generator directly — never holds all values at once
total = sum(x ** 2 for x in range(1_000_000))  # Efficient!

# =============================================================================
# SECTION 5: Generator Functions (yield)
# =============================================================================
# A function with yield keyword is a GENERATOR FUNCTION.
# When called, returns a generator object. Does NOT run the function body yet.
# Each call to next() runs until the next yield, then PAUSES.

def countdown(n):
    """A generator that counts down from n to 0."""
    print("Starting countdown...")
    while n > 0:
        yield n          # Pause here, return n to caller
        n -= 1           # Resume here on next next() call
    print("Done!")

gen = countdown(5)
print(type(gen))          # <class 'generator'>
print(next(gen))          # "Starting countdown..." then 5
print(next(gen))          # 4
print(next(gen))          # 3

for num in countdown(3):  # Iterates until StopIteration
    print(num)            # 3, 2, 1, then "Done!"

# Infinite generator — would be impossible with a list
def integers_from(start=0):
    """Generate integers from start, forever."""
    n = start
    while True:
        yield n
        n += 1

gen = integers_from(1)
first_10 = [next(gen) for _ in range(10)]  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Practical generator — read large file line by line
def read_lines(filename):
    """Read a large file without loading it entirely into memory."""
    with open(filename, "r") as f:
        for line in f:
            line = line.strip()
            if line:  # Skip empty lines
                yield line
    # File automatically closed when generator is exhausted or garbage collected

# Usage:
# for line in read_lines("huge_file.txt"):
#     process(line)

# =============================================================================
# SECTION 6: yield from — Delegating to Sub-generators
# =============================================================================

def chain(*iterables):
    """Yield from multiple iterables one after another."""
    for iterable in iterables:
        yield from iterable  # Delegate to sub-iterable

result = list(chain([1, 2], [3, 4], [5, 6]))  # [1, 2, 3, 4, 5, 6]
result2 = list(chain("abc", "def"))             # ['a', 'b', 'c', 'd', 'e', 'f']

# =============================================================================
# SECTION 7: Custom Iterators with __iter__ and __next__
# =============================================================================
# Any object with __iter__ and __next__ can be used in a for loop.

class Range:
    """A custom range-like object."""
    def __init__(self, start, stop, step=1):
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self  # The object itself is the iterator

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration  # Signal: iteration complete
        value = self.current
        self.current += self.step
        return value

for num in Range(0, 10, 2):
    print(num, end=" ")  # 0 2 4 6 8

# =============================================================================
# SECTION 8: itertools — Powerful Iteration Tools
# =============================================================================
import itertools

# chain — combine iterables
combined = list(itertools.chain([1, 2], [3, 4], [5]))   # [1, 2, 3, 4, 5]

# islice — take a slice from any iterable (works on generators!)
first_5 = list(itertools.islice(integers_from(1), 5))   # [1, 2, 3, 4, 5]

# cycle — cycle through values infinitely
colors = itertools.cycle(["red", "green", "blue"])
first_7 = list(itertools.islice(colors, 7))  # ['red','green','blue','red','green','blue','red']

# product — cartesian product
suits = ["♠", "♥", "♦", "♣"]
ranks = ["A", "2", "3", "K", "Q", "J"]
deck = list(itertools.product(ranks, suits))  # All 24 combinations

# combinations and permutations
from itertools import combinations, permutations
teams = combinations(["A", "B", "C", "D"], 2)  # All pairs: (A,B), (A,C) etc.
orders = permutations([1, 2, 3], 2)            # All ordered pairs: (1,2), (1,3) etc.

# groupby — group consecutive elements
data = sorted([("A", 1), ("B", 2), ("A", 3), ("B", 4), ("A", 5)], key=lambda x: x[0])
grouped = {key: list(group) for key, group in itertools.groupby(data, key=lambda x: x[0])}

# =============================================================================
# FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Using list comprehension, create:
# a) Words from "python programming is fun" that have more than 3 chars
# b) A list of (word, len(word)) tuples for each word
# c) The same words but title-cased
# FILL IN:
# sentence = "python programming is fun"
# long_words = [_____________________]
# word_lengths = [_____________________]
# title_words = [_____________________]

# Exercise 2: Write a generator function `fibonacci()` that yields the infinite
# Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
# FILL IN:
# def fibonacci():
#     a, b = 0, 1
#     while True:
#         _____________________

# Use it:
# fib = fibonacci()
# first_10_fib = [next(fib) for _ in range(10)]
# print(first_10_fib)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Exercise 3: Write a generator `chunk(iterable, size)` that yields:
# chunks of `size` from the iterable.
# chunk([1,2,3,4,5,6,7], 3) → yields [1,2,3], [4,5,6], [7]
# FILL IN:
# def chunk(iterable, size):
#     _____________________

print("\n✓ Lesson 6: Comprehensions & Generators complete")
