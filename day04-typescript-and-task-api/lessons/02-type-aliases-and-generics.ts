// ============================================================
// DAY 1 — TypeScript: TYPE ALIASES & GENERICS
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: TYPE ALIASES
// ─────────────────────────────────────────────────────────────
// type keyword creates a NAME for any type.
// More flexible than interface — can alias ANY type (primitives, unions, etc.)

// ── Primitive aliases ─────────────────────────────────────────
type ID       = string | number;
type Username = string;
type Score    = number;

// ── Object shape alias ────────────────────────────────────────
type Point = {
  x: number;
  y: number;
};

type Point3D = Point & { z: number }; // extends via intersection!

const p: Point   = { x: 10, y: 20 };
const p3: Point3D = { x: 10, y: 20, z: 5 };

// ── Union type alias ──────────────────────────────────────────
type Status      = "pending" | "active" | "completed" | "cancelled";
type HTTPMethod  = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Result<T>   = { success: true; data: T } | { success: false; error: string };

// Using Result<T>:
function divide(a: number, b: number): Result<number> {
  if (b === 0) return { success: false, error: "Division by zero" };
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log("Result:", result.data);   // narrowed: has .data
} else {
  console.log("Error:", result.error);   // narrowed: has .error
}

// ── Function type alias ───────────────────────────────────────
type Callback      = () => void;
type EventHandler  = (event: Event) => void;
type Predicate<T>  = (item: T) => boolean;
type Transformer<T, U> = (input: T) => U;
type Comparator<T> = (a: T, b: T) => number;

// Use them:
const isEven: Predicate<number> = (n) => n % 2 === 0;
const toStr: Transformer<number, string> = (n) => n.toString();
const compareNumbers: Comparator<number> = (a, b) => a - b;

// ── Recursive type alias ──────────────────────────────────────
// Type that references itself — great for tree structures
type TreeNode = {
  value: number;
  left?:  TreeNode; // recursive reference!
  right?: TreeNode;
};

const tree: TreeNode = {
  value: 10,
  left: {
    value: 5,
    left:  { value: 2 },
    right: { value: 7 },
  },
  right: {
    value: 15,
    right: { value: 20 },
  },
};

// JSON-like recursive type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]              // array of JSON values
  | { [key: string]: JSONValue }; // object with JSON values

const jsonData: JSONValue = {
  name: "Rohit",
  age: 25,
  tags: ["js", "ts"],
  address: { city: "Mumbai", zip: "400001" },
};

// ── Conditional type alias ────────────────────────────────────
// Type changes based on condition — like ternary for types!
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
type C = IsString<"hello">; // "yes" (string literal extends string)

// ─────────────────────────────────────────────────────────────
// SECTION 2: GENERICS — THE MOST IMPORTANT TS CONCEPT
// ─────────────────────────────────────────────────────────────
// Generics = TYPE PARAMETERS — write code that works with ANY type
// while still being type-safe.
//
// Think of generics like function parameters, but for TYPES.
// Instead of a specific type, you use a placeholder (T, U, K, V...)

// ── 2A. Generic Functions ─────────────────────────────────────
// Without generics — works but loses type info:
function identityAny(value: any): any {
  return value; // input was string, but output type is 'any' — unsafe!
}

// With generics — preserves type info:
function identity<T>(value: T): T {
  return value; // T is inferred or explicitly provided
}

const s = identity("hello");    // T inferred as string → returns string
const n = identity(42);         // T inferred as number → returns number
const b = identity(true);       // T inferred as boolean

// Explicit type parameter:
const explicit = identity<string>("hello"); // explicitly T = string

// ── 2B. Generic with Multiple Type Parameters ─────────────────
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}
const p1 = pair("name", 25);   // [string, number]
const p2 = pair(true, [1,2]);  // [boolean, number[]]

// Swap function:
function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}
const swapped = swap("hello", 42); // [number, string]

// ── 2C. Generic Constraints ───────────────────────────────────
// Use 'extends' to restrict what T can be

// T must have a .length property
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}
console.log(getLength("hello"));    // 5 ✅
console.log(getLength([1, 2, 3]));  // 3 ✅
// console.log(getLength(42));      // ❌ Error: number has no .length

// T must be a key of U
function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // TypeScript knows the return type is T[K]
}

const person = { name: "Rohit", age: 25, role: "admin" };
const pName = getProperty(person, "name");  // TypeScript knows: string
const pAge  = getProperty(person, "age");   // TypeScript knows: number
// getProperty(person, "xyz"); // ❌ Error: 'xyz' is not a key of person

// ── 2D. Generic Interfaces ────────────────────────────────────
interface Repository<T> {
  getById(id: number): T | undefined;
  getAll(): T[];
  create(item: Omit<T, "id">): T;
  update(id: number, data: Partial<T>): T | undefined;
  delete(id: number): boolean;
}

interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Implement the generic interface with a specific type
class TaskRepository implements Repository<Task> {
  private tasks: Task[] = [];
  private nextId = 1;

  getById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  getAll(): Task[] {
    return [...this.tasks];
  }

  create(item: Omit<Task, "id">): Task {
    const task: Task = { ...item, id: this.nextId++ };
    this.tasks.push(task);
    return task;
  }

  update(id: number, data: Partial<Task>): Task | undefined {
    const task = this.getById(id);
    if (!task) return undefined;
    Object.assign(task, data);
    return task;
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}

const repo = new TaskRepository();
repo.create({ title: "Learn TypeScript", done: false });
repo.create({ title: "Build project", done: false });
console.log(repo.getAll()); // [{id:1, ...}, {id:2, ...}]

// ── 2E. Generic Classes ───────────────────────────────────────
class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }

  pop(): T | undefined { return this.items.pop(); }

  peek(): T | undefined { return this.items[this.items.length - 1]; }

  get size(): number { return this.items.length; }

  isEmpty(): boolean { return this.items.length === 0; }

  toArray(): T[] { return [...this.items]; }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);
console.log(numberStack.peek()); // 3
console.log(numberStack.pop());  // 3
console.log(numberStack.size);   // 2

const stringStack = new Stack<string>();
stringStack.push("a");
stringStack.push("b");
// numberStack.push("hello"); // ❌ Error: must be number!

// Generic Queue
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void { this.items.push(item); }

  dequeue(): T | undefined { return this.items.shift(); }

  front(): T | undefined { return this.items[0]; }

  get size(): number { return this.items.length; }
}

// ── 2F. Generic Type Aliases ──────────────────────────────────
type Optional<T> = T | null | undefined;
type Nullable<T> = T | null;
type Maybe<T>    = T | undefined;

// Response wrapper:
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: string;
};

type UserResponse = ApiResponse<{ id: number; name: string }>;
type ListResponse<T> = ApiResponse<T[]>;

// Async result:
type AsyncResult<T> = Promise<Result<T>>;

// ── 2G. Default Type Parameters ───────────────────────────────
// Generic type parameter can have a DEFAULT
type Container<T = string> = {
  value: T;
  label: string;
};

const strContainer: Container       = { value: "hello", label: "text" }; // T defaults to string
const numContainer: Container<number> = { value: 42, label: "count" };

// ── 2H. Conditional Types with Generics ───────────────────────
// Infer inside conditional types:
type ReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never;

// Extract array element type:
type ElementType<T> = T extends (infer E)[] ? E : never;

type NumArr = ElementType<number[]>;  // number
type StrArr = ElementType<string[]>;  // string

// Flatten type:
type Flatten<T> = T extends Array<infer Item> ? Item : T;
type Str = Flatten<string[]>;   // string
type Num = Flatten<number>;     // number (not an array, returns as-is)

// ── 2I. Mapped Types (Preview) ────────────────────────────────
// Transform all properties of a type
type ReadonlyUser = {
  readonly [K in keyof { name: string; age: number }]: string;
};

// Built-in mapped type examples:
type PartialUser = Partial<{ name: string; age: number }>;
// All properties optional: { name?: string; age?: number }

type RequiredUser = Required<{ name?: string; age?: number }>;
// All properties required: { name: string; age: number }

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is the difference between type alias and interface?
A: type alias:
   - Can alias any type (primitives, unions, intersections, tuples)
   - CANNOT be merged (redeclaration = error)
   - Extended via & (intersection)
   interface:
   - Can only describe object shapes
   - CAN be merged (declaration merging)
   - Extended via 'extends'
   Rule of thumb: Use interface for object shapes in public APIs,
   type alias for everything else.

Q: What are generics and why are they useful?
A: Generics allow writing code that works with any type while
   maintaining type safety. Like function parameters, but for types.
   Without generics: use 'any' (unsafe) or duplicate code (wasteful).
   With generics: one function/class works for all types safely.

Q: What does 'extends' mean in a generic constraint?
A: T extends X means T must be assignable to X (must satisfy X's shape).
   Example: T extends { length: number } means T must have .length.

Q: What is 'keyof'?
A: keyof T creates a union of all keys of type T.
   keyof { name: string; age: number } → "name" | "age"

Q: What is 'infer' used for?
A: Used inside conditional types to extract and name a type.
   T extends Array<infer E> ? E : never
   If T is an array, E is inferred as the element type.

Q: What is a conditional type?
A: A type that depends on a condition, like a ternary for types.
   T extends string ? "yes" : "no"
   Evaluates at compile time based on T.

Q: What are default type parameters?
A: Like default function parameters but for types.
   type Container<T = string> — if T not specified, defaults to string.
*/
