# =============================================================================
# DAY 15 — LESSON 4: Functions & Scope in Python
# =============================================================================
# Functions in Python are FIRST-CLASS OBJECTS:
# - Can be assigned to variables
# - Can be passed as arguments
# - Can be returned from other functions
# - Can be stored in lists/dicts
# =============================================================================

# =============================================================================
# SECTION 1: Defining Functions
# =============================================================================

# Basic function
def greet(name):
    """Docstring: describes what the function does."""
    return f"Hello, {name}!"

result = greet("Rohit")
print(result)  # Hello, Rohit!

# Multiple return values (actually returns a TUPLE)
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5, 9, 2])
print(low, high)  # 1 9

# Early return
def absolute_value(n):
    if n < 0:
        return -n  # Return immediately
    return n       # Otherwise return as-is

# =============================================================================
# SECTION 2: Default Parameters
# =============================================================================

def greet_user(name, greeting="Hello", punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet_user("Rohit"))                    # Hello, Rohit!
print(greet_user("Rohit", "Hi"))              # Hi, Rohit!
print(greet_user("Rohit", punctuation="...")) # Hello, Rohit...
# NOTE: keyword arguments can be in any order when calling

# IMPORTANT: Never use mutable defaults (list, dict)!
# BAD:  def add_item(item, lst=[]):  # lst is shared across all calls!
# GOOD:
def add_item(item, lst=None):
    if lst is None:
        lst = []       # Create new list each time
    lst.append(item)
    return lst

# =============================================================================
# SECTION 3: *args and **kwargs
# =============================================================================

# *args: collect extra positional arguments into a TUPLE
def add(*numbers):
    return sum(numbers)  # numbers is a tuple

print(add(1, 2))         # 3
print(add(1, 2, 3, 4))   # 10

# **kwargs: collect extra keyword arguments into a DICT
def user_info(**data):
    for key, value in data.items():
        print(f"  {key}: {value}")

user_info(name="Rohit", age=25, city="Mumbai")

# Combining all: positional, *args, keyword, **kwargs
def flexible(required, *args, keyword_only=None, **kwargs):
    print(f"required: {required}")
    print(f"extra positional: {args}")
    print(f"keyword_only: {keyword_only}")
    print(f"extra kwargs: {kwargs}")

flexible("must", 1, 2, 3, keyword_only="hi", x=10, y=20)

# Unpacking with * and **
def add3(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add3(*numbers))     # Unpack list as positional args

config = {"a": 1, "b": 2, "c": 3}
print(add3(**config))     # Unpack dict as keyword args

# =============================================================================
# SECTION 4: Lambda Functions (Anonymous Functions)
# =============================================================================

# Lambda: small one-line function without def and return keyword
# lambda args: expression

square = lambda x: x ** 2
print(square(5))  # 25

# Most useful in: sorted(), map(), filter(), as callbacks
nums = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_nums = sorted(nums)                          # [1, 1, 2, 3, 4, 5, 6, 9]
reversed_nums = sorted(nums, reverse=True)          # [9, 6, 5, 4, 3, 2, 1, 1]

people = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
by_age = sorted(people, key=lambda p: p["age"])    # Sort by age
by_name = sorted(people, key=lambda p: p["name"]) # Sort by name

# Lambda with map and filter
doubled = list(map(lambda x: x * 2, [1, 2, 3]))   # [2, 4, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))  # [4, 2, 6]

# =============================================================================
# SECTION 5: Scope — LEGB Rule
# =============================================================================
# Python looks for names in this order: Local → Enclosing → Global → Built-in

x = "global"  # Global scope

def outer():
    x = "enclosing"  # Enclosing scope (for inner)
    
    def inner():
        x = "local"  # Local scope
        print(x)     # "local" — found in local scope first
    
    inner()
    print(x)     # "enclosing" — inner's local x doesn't affect outer

outer()
print(x)         # "global" — unchanged

# global keyword — modify global variable from inside function
counter = 0

def increment():
    global counter  # Declare we want the global one
    counter += 1

increment()
increment()
print(counter)   # 2

# nonlocal keyword — modify enclosing function's variable
def make_counter():
    count = 0
    def increment():
        nonlocal count  # Declare we want the enclosing one
        count += 1
        return count
    return increment

c = make_counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3

# =============================================================================
# SECTION 6: Closures
# =============================================================================
# A function that remembers variables from its enclosing scope even after
# the enclosing function has returned.

def make_multiplier(factor):
    """Returns a function that multiplies by factor."""
    def multiply(x):
        return x * factor  # factor is "closed over"
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# Practical: factory functions
def make_validator(min_len, max_len):
    def validate(value):
        return min_len <= len(value) <= max_len
    return validate

validate_username = make_validator(3, 20)
validate_password = make_validator(8, 100)

print(validate_username("ro"))     # False (too short)
print(validate_password("secure123"))  # True

# =============================================================================
# SECTION 7: Higher-Order Functions
# =============================================================================
# Functions that take functions as arguments or return functions.

def apply_twice(func, value):
    return func(func(value))

print(apply_twice(lambda x: x + 3, 10))  # 16 (10 → 13 → 16)

# Built-in higher-order functions
nums = [1, 2, 3, 4, 5]

doubled = list(map(lambda x: x * 2, nums))           # Transform each
evens = list(filter(lambda x: x % 2 == 0, nums))     # Keep matching
total = __import__('functools').reduce(lambda a, b: a + b, nums)  # Accumulate

# map and filter are lazy in Python 3 — wrap in list() to evaluate

# =============================================================================
# SECTION 8: Decorators
# =============================================================================
# A decorator is a function that WRAPS another function to add behavior.
# Syntax: @decorator_name above function definition.

# First: understand what a decorator IS (before the @ syntax)
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function runs")
        result = func(*args, **kwargs)
        print("After function runs")
        return result
    return wrapper

# Using decorator syntax (equivalent to: greet = my_decorator(greet))
@my_decorator
def greet_person(name):
    print(f"Hello, {name}!")
    return f"Greeted {name}"

greet_person("Rohit")
# Output:
# Before function runs
# Hello, Rohit!
# After function runs

# Practical decorators:
import time
import functools

def timer(func):
    @functools.wraps(func)  # Preserves the original function's name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

def logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@timer
@logger  # Decorators stack: timer wraps logger wraps slow_add
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(3, 4)

# Decorator factory (decorator with parameters)
def repeat(n):
    """Run function n times."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()  # Prints "Hello!" 3 times

# =============================================================================
# SECTION 9: FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Write a `memoize` decorator that caches function results.
# - Store results in a dict: cache = {}
# - Key: tuple of args (hashable)
# - If key in cache: return cached result
# - Else: compute, store in cache, return result
# FILL IN:
# def memoize(func):
#     cache = {}
#     @functools.wraps(func)
#     def wrapper(*args):
#         ____________________
#     return wrapper
# 
# @memoize
# def fibonacci(n):
#     if n <= 1: return n
#     return fibonacci(n-1) + fibonacci(n-2)
# 
# print(fibonacci(35))  # Should be instant after first call

# Exercise 2: Write a `retry(attempts)` decorator factory that:
# - Runs the function up to `attempts` times if it raises an exception
# - If it succeeds, return the result
# - If all attempts fail, re-raise the last exception
# FILL IN:
# def retry(attempts):
#     def decorator(func):
#         @functools.wraps(func)
#         def wrapper(*args, **kwargs):
#             ____________________
#         return wrapper
#     return decorator

# Exercise 3: Write `make_power_func(exponent)` — a closure factory:
# - Returns a function that raises its input to the given exponent
# - square = make_power_func(2); square(4) → 16
# - cube   = make_power_func(3); cube(3)   → 27
# FILL IN:
# def make_power_func(exponent):
#     ____________________

print("\n✓ Lesson 4: Functions & Scope complete")
