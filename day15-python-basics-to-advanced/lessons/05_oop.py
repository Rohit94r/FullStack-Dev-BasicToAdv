# =============================================================================
# DAY 15 — LESSON 5: Object-Oriented Programming in Python
# =============================================================================
# Python supports EVERYTHING in OOP:
# Classes, objects, inheritance, multiple inheritance, encapsulation,
# polymorphism, abstract classes, class/static methods, properties.
# =============================================================================

# =============================================================================
# SECTION 1: Classes and Objects
# =============================================================================

class Dog:
    """A class representing a dog."""

    # Class variable — shared by ALL instances
    species = "Canis lupus familiaris"
    dog_count = 0

    # __init__ = constructor — called when creating an instance
    def __init__(self, name, breed, age):
        # Instance variables — unique to each instance
        self.name = name       # Public: accessible from anywhere
        self.breed = breed
        self.age = age
        self._energy = 100     # Protected: convention (single underscore = "private by convention")
        self.__id = id(self)   # Private: name mangling (double underscore = truly private)

        Dog.dog_count += 1     # Modify class variable

    # Instance method — has access to self
    def bark(self):
        return f"{self.name} says: Woof!"

    def eat(self, food):
        print(f"{self.name} is eating {food}. Energy: {self._energy}")
        self._energy += 10

    # Class method — has access to class (cls), not instance (self)
    @classmethod
    def get_count(cls):
        return f"Total dogs created: {cls.dog_count}"

    # Class method as FACTORY — alternate constructor
    @classmethod
    def from_dict(cls, data):
        return cls(data["name"], data["breed"], data["age"])

    # Static method — doesn't access class or instance. A utility function.
    @staticmethod
    def is_valid_age(age):
        return 0 <= age <= 20

    # __str__ — human-readable representation (for print())
    def __str__(self):
        return f"Dog(name={self.name}, breed={self.breed}, age={self.age})"

    # __repr__ — developer representation (for debugging)
    def __repr__(self):
        return f"Dog(name={self.name!r}, breed={self.breed!r}, age={self.age!r})"

# Creating instances
rex = Dog("Rex", "German Shepherd", 3)
buddy = Dog.from_dict({"name": "Buddy", "breed": "Labrador", "age": 5})

print(rex.bark())          # Rex says: Woof!
print(Dog.get_count())     # Total dogs created: 2
print(Dog.is_valid_age(5)) # True (static method)
print(rex)                 # Dog(name=Rex, breed=German Shepherd, age=3) — uses __str__

# =============================================================================
# SECTION 2: Properties — Getters and Setters
# =============================================================================
# Properties allow controlled access to attributes.
# Looks like attribute access, works like method calls.

class BankAccount:
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self._balance = initial_balance  # "private" by convention

    @property
    def balance(self):
        """Getter — called when you access account.balance"""
        return self._balance

    @balance.setter
    def balance(self, value):
        """Setter — called when you do account.balance = value"""
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value

    @balance.deleter
    def balance(self):
        """Deleter — called when you do del account.balance"""
        print("Closing account — balance cleared")
        self._balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount
        return self._balance

account = BankAccount("Rohit", 1000)
print(account.balance)      # 1000 — calls the getter
account.balance = 500       # Calls the setter (with validation)
account.deposit(200)
print(account.balance)      # 700

# =============================================================================
# SECTION 3: Inheritance
# =============================================================================

class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says: {self.sound}"

    def breathe(self):
        return f"{self.name} breathes"

class Cat(Animal):  # Cat inherits from Animal
    def __init__(self, name, indoor=True):
        super().__init__(name, "Meow")  # Call parent __init__
        self.indoor = indoor

    def speak(self):
        # Override parent method
        return f"{self.name} says: {self.sound}! (softly)"

    def purr(self):  # New method only in Cat
        return f"{self.name} purrs..."

class Dog2(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Woof")
        self.breed = breed

whiskers = Cat("Whiskers")
rex2 = Dog2("Rex", "Husky")

print(whiskers.speak())    # Whiskers says: Meow! (softly) — overridden
print(whiskers.breathe())  # Whiskers breathes — inherited from Animal
print(rex2.speak())        # Rex says: Woof — uses Animal.speak (not overridden)

# isinstance and issubclass
print(isinstance(whiskers, Cat))     # True
print(isinstance(whiskers, Animal))  # True — Cat IS an Animal (Liskov substitution)
print(issubclass(Cat, Animal))       # True

# =============================================================================
# SECTION 4: Polymorphism
# =============================================================================
# Different classes implementing the same interface. Code works with any of them.

class Shape:
    def area(self):
        raise NotImplementedError("Subclass must implement area()")

    def perimeter(self):
        raise NotImplementedError("Subclass must implement perimeter()")

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

# Polymorphic function — works with ANY Shape
def print_shape_info(shape):
    print(f"Area: {shape.area():.2f}, Perimeter: {shape.perimeter():.2f}")

shapes = [Circle(5), Rectangle(4, 6), Circle(3)]
for shape in shapes:
    print_shape_info(shape)  # Works for any shape!

# =============================================================================
# SECTION 5: Abstract Classes
# =============================================================================
from abc import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year

    @abstractmethod
    def fuel_type(self):
        """Must be implemented by subclasses."""
        pass

    @abstractmethod
    def max_speed(self):
        pass

    def info(self):
        return f"{self.year} {self.make} {self.model}"

# Cannot instantiate ABC directly:
# v = Vehicle("Toyota", "Camry", 2023)  # TypeError!

class Car(Vehicle):
    def fuel_type(self):
        return "Gasoline"

    def max_speed(self):
        return 200  # km/h

class Tesla(Vehicle):
    def fuel_type(self):
        return "Electric"

    def max_speed(self):
        return 250

car = Car("Toyota", "Camry", 2023)
tesla = Tesla("Tesla", "Model 3", 2024)
print(car.info(), "-", car.fuel_type())
print(tesla.info(), "-", tesla.fuel_type())

# =============================================================================
# SECTION 6: Magic/Dunder Methods
# =============================================================================
# Special methods that Python calls automatically in certain situations.

class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"

    def __add__(self, other):        # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):        # v1 - v2
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):       # v * 3
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):         # v1 == v2
        return self.x == other.x and self.y == other.y

    def __len__(self):               # len(v)
        return 2  # 2D vector has 2 components

    def __abs__(self):               # abs(v) → magnitude
        return (self.x**2 + self.y**2) ** 0.5

    def __bool__(self):              # bool(v) → False only if zero vector
        return self.x != 0 or self.y != 0

    def __iter__(self):              # for component in v:
        yield self.x
        yield self.y

    def __getitem__(self, index):    # v[0], v[1]
        return (self.x, self.y)[index]

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)       # Vector(4, 6)
print(v1 * 3)        # Vector(3, 6)
print(abs(v2))       # 5.0
print(list(v1))      # [1, 2]
print(v1[0], v1[1])  # 1 2
print(v1 == Vector(1, 2))  # True

# =============================================================================
# SECTION 7: Dataclasses (Modern Python)
# =============================================================================
from dataclasses import dataclass, field

# @dataclass auto-generates: __init__, __repr__, __eq__
@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0  # Default value

    def distance_to_origin(self):
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5

@dataclass
class User:
    name: str
    email: str
    age: int
    tags: list = field(default_factory=list)  # Mutable default — use field()
    is_active: bool = True

p = Point(1.0, 2.0)
print(p)              # Point(x=1.0, y=2.0, z=0.0)
print(p.distance_to_origin())

user = User("Rohit", "rohit@example.com", 25)
print(user)  # User(name='Rohit', email='rohit@example.com', age=25, tags=[], is_active=True)

# =============================================================================
# FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Create a Rectangle class with:
# - Properties: width, height (with validation: must be positive)
# - Method area() → width * height
# - Method perimeter() → 2 * (width + height)
# - __str__ → "Rectangle(4x6)"
# - Class method square(side) → returns Rectangle(side, side)
# FILL IN:
# class Rectangle:
#     ____________________

# Exercise 2: Create a Stack class that:
# - Uses a list internally (_items)
# - push(item) → add to top
# - pop() → remove and return top (raise IndexError if empty)
# - peek() → return top without removing
# - is_empty() → bool
# - __len__ → number of items
# - __str__ → "Stack([1, 2, 3])" (bottom to top)
# FILL IN:
# class Stack:
#     ____________________

# Exercise 3: Create a decorator @validate_types that:
# - Checks function arguments match type annotations
# - Raises TypeError if they don't
# - HINT: use func.__annotations__ to get type hints
# FILL IN:
# def validate_types(func):
#     ____________________

print("\n✓ Lesson 5: OOP complete")
