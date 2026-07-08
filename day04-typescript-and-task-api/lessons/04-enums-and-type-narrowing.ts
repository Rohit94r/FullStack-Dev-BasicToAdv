// ============================================================
// DAY 1 — TypeScript: ENUMS & TYPE NARROWING
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: ENUMS
// ─────────────────────────────────────────────────────────────
// Enums = Named constants grouped together.
// Better than magic strings/numbers — readable, type-safe, refactorable.
// TypeScript-specific feature (NOT in plain JavaScript).

// ── 1A. Numeric Enums (default) ───────────────────────────────
// Values are automatically assigned 0, 1, 2, ...
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

console.log(Direction.Up);       // 0
console.log(Direction.Right);    // 3
console.log(Direction[0]);       // "Up" ← reverse mapping!

// Custom starting value:
enum Priority {
  Low    = 1,
  Medium = 2,
  High   = 3,
}

// Value from a start:
enum HttpStatus {
  OK        = 200,
  Created   = 201,
  NotFound  = 404,
  InternalError = 500,
}

function getStatusMessage(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:           return "Success";
    case HttpStatus.Created:      return "Resource created";
    case HttpStatus.NotFound:     return "Not found";
    case HttpStatus.InternalError:return "Server error";
    default: return "Unknown";
  }
}
console.log(getStatusMessage(HttpStatus.OK));      // "Success"
console.log(getStatusMessage(HttpStatus.NotFound)); // "Not found"

// ── 1B. String Enums ──────────────────────────────────────────
// PREFERRED over numeric enums — more readable in debug/logs
// No auto-increment, each value must be explicitly set
enum TaskStatus {
  Pending    = "PENDING",
  InProgress = "IN_PROGRESS",
  Completed  = "COMPLETED",
  Cancelled  = "CANCELLED",
}

enum UserRole {
  Admin     = "admin",
  User      = "user",
  Moderator = "moderator",
  Guest     = "guest",
}

const taskStatus: TaskStatus = TaskStatus.InProgress;
console.log(taskStatus); // "IN_PROGRESS" ← readable!
// Note: String enums do NOT have reverse mapping

function canDelete(role: UserRole): boolean {
  return role === UserRole.Admin || role === UserRole.Moderator;
}
console.log(canDelete(UserRole.Admin));  // true
console.log(canDelete(UserRole.Guest));  // false

// ── 1C. Const Enums ───────────────────────────────────────────
// 'const enum' is inlined at compile time — no object created!
// Better performance (no runtime object to look up)
const enum Color {
  Red   = "#FF0000",
  Green = "#00FF00",
  Blue  = "#0000FF",
}

const myColor: Color = Color.Red;
// Compiled to: const myColor = "#FF0000"; (inlined!)

// ── 1D. Heterogeneous Enums (AVOID) ───────────────────────────
// Mix of string and number — confusing, avoid in practice
enum Mixed {
  No  = 0,
  Yes = "YES", // mixing types — not recommended
}

// ── 1E. Enum as Flags (Bit Flags) ─────────────────────────────
// Use powers of 2 for bitwise operations — check multiple permissions
enum Permission {
  None    = 0,         // 0000
  Read    = 1 << 0,   // 0001 = 1
  Write   = 1 << 1,   // 0010 = 2
  Delete  = 1 << 2,   // 0100 = 4
  Admin   = 1 << 3,   // 1000 = 8
}

// Combine permissions with bitwise OR:
const userPermission = Permission.Read | Permission.Write; // 0011 = 3

// Check permissions with bitwise AND:
function hasPermission(userPerm: number, required: Permission): boolean {
  return (userPerm & required) === required;
}

console.log(hasPermission(userPermission, Permission.Read));   // true
console.log(hasPermission(userPermission, Permission.Delete)); // false

// ── 1F. Enum vs Union Type Strings ────────────────────────────
// Modern TypeScript often prefers union types over enums:

// Enum approach:
enum Status1 { Active = "active", Inactive = "inactive" }

// Union type approach (often preferred):
type Status2 = "active" | "inactive";

// Pros of union types vs enums:
// ✅ No extra JS output (enums generate runtime code)
// ✅ Works with JSON directly ("active" === "active")
// ✅ Less verbose
// Cons:
// ❌ No auto-complete grouping like Status1.Active (need to know the string)

// When to use enums:
// ✅ Complex mappings (string → number, reverse lookup)
// ✅ Library code where you want grouped constants
// ✅ When you need const enum for performance

// ─────────────────────────────────────────────────────────────
// SECTION 2: TYPE NARROWING
// ─────────────────────────────────────────────────────────────
// Type Narrowing = TypeScript refines a broad type to a specific one
// based on RUNTIME CHECKS in your code.
// TypeScript is smart enough to TRACK these checks!

// ── 2A. typeof Narrowing ──────────────────────────────────────
function process(value: string | number | boolean): string {
  if (typeof value === "string") {
    // TypeScript KNOWS value is string here
    return value.toUpperCase();     // ✅ string method safe
  }
  if (typeof value === "number") {
    // TypeScript KNOWS value is number here
    return value.toFixed(2);        // ✅ number method safe
  }
  // TypeScript KNOWS value is boolean here (only option left)
  return value ? "Yes" : "No";
}

console.log(process("hello"));  // "HELLO"
console.log(process(3.14));     // "3.14"
console.log(process(true));     // "Yes"

// ── 2B. instanceof Narrowing ──────────────────────────────────
class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function handleError(error: Error): string {
  if (error instanceof HttpError) {
    // TypeScript KNOWS: error is HttpError here
    return `HTTP ${error.statusCode}: ${error.message}`;
  }
  if (error instanceof ValidationError) {
    // TypeScript KNOWS: error is ValidationError here
    return `Validation error on '${error.field}': ${error.message}`;
  }
  return `Unknown error: ${error.message}`;
}

console.log(handleError(new HttpError(404, "Not found")));
console.log(handleError(new ValidationError("email", "Invalid format")));

// ── 2C. 'in' Operator Narrowing ───────────────────────────────
// Check if a property exists in an object

interface Dog { kind: "dog"; bark(): void; }
interface Cat { kind: "cat"; meow(): void; }
type Pet = Dog | Cat;

function makeSound(pet: Pet): void {
  if ("bark" in pet) {
    // TypeScript KNOWS pet is Dog here
    pet.bark();
  } else {
    // TypeScript KNOWS pet is Cat here
    pet.meow();
  }
}

// ── 2D. Discriminated Unions ──────────────────────────────────
// MOST IMPORTANT PATTERN — add a common "discriminant" property
// to each type in a union. TypeScript can narrow perfectly.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript KNOWS: shape has .radius
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TypeScript KNOWS: shape has .width and .height
      return shape.width * shape.height;
    case "triangle":
      // TypeScript KNOWS: shape has .base and .height
      return 0.5 * shape.base * shape.height;
  }
}

console.log(calculateArea({ kind: "circle", radius: 5 }));           // ~78.5
console.log(calculateArea({ kind: "rectangle", width: 4, height: 6 })); // 24

// Real-world discriminated union — API responses:
type ApiResult<T> =
  | { type: "success"; data: T; statusCode: 200 | 201 }
  | { type: "error"; message: string; statusCode: 400 | 404 | 500 }
  | { type: "loading" };

function renderResponse<T>(result: ApiResult<T>): string {
  switch (result.type) {
    case "success": return `Data: ${JSON.stringify(result.data)}`;
    case "error":   return `Error ${result.statusCode}: ${result.message}`;
    case "loading": return "Loading...";
  }
}

// ── 2E. Truthiness Narrowing ──────────────────────────────────
function printName(name: string | null | undefined): void {
  if (name) {
    // TypeScript KNOWS: name is string here (null/undefined are falsy)
    console.log(name.toUpperCase());
  } else {
    console.log("No name provided");
  }
}

// Nullish coalescing operator:
const displayName = name ?? "Anonymous"; // name if not null/undefined, else "Anonymous"

// Optional chaining:
interface UserProfile {
  name: string;
  address?: {
    city?: string;
    street?: string;
  };
}
const profile: UserProfile = { name: "Rohit" };
console.log(profile.address?.city ?? "No city"); // "No city" — safe!

// ── 2F. Type Predicates (User-Defined Guards) ─────────────────
// Create your own narrowing functions with 'is'

interface Fish  { swim(): void; name: string; }
interface Bird  { fly(): void;  name: string; }

// Type predicate: if this returns true, TypeScript knows arg is Fish
function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}

function move(animal: Fish | Bird): void {
  if (isFish(animal)) {
    animal.swim(); // TypeScript KNOWS it's Fish
  } else {
    animal.fly();  // TypeScript KNOWS it's Bird
  }
}

// More complex type predicate:
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// ── 2G. Assertion Functions ───────────────────────────────────
// Throw if condition fails — TypeScript narrows after the call
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error(`Expected string, got ${typeof val}`);
  }
}

function processInput(input: unknown): void {
  assertIsString(input);
  // After assertIsString, TypeScript KNOWS input is string:
  console.log(input.toUpperCase()); // ✅ safe
}

// ── 2H. Exhaustive Checking with 'never' ──────────────────────
// Ensure you handle ALL cases in a discriminated union
type TrafficLight = "red" | "yellow" | "green";

function getAction(light: TrafficLight): string {
  switch (light) {
    case "red":    return "Stop";
    case "yellow": return "Slow down";
    case "green":  return "Go";
    default:
      // If you add a new case to TrafficLight but forget to add it here,
      // TypeScript will error here because 'light' would not be 'never'!
      const _exhaustiveCheck: never = light;
      throw new Error(`Unhandled traffic light: ${_exhaustiveCheck}`);
  }
}

// ── 2I. as const — Narrow to literal type ──────────────────────
// 'as const' makes TypeScript infer the most specific type possible
const directions = ["north", "south", "east", "west"] as const;
// Type: readonly ["north", "south", "east", "west"]
// Without as const: string[]

type Direction2 = typeof directions[number]; // "north" | "south" | "east" | "west"

const config = {
  host: "localhost",
  port: 3000,
  mode: "development",
} as const;
// Every property is readonly + literal type
// config.port = 4000; // ❌ Error: readonly

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What's the difference between numeric and string enums?
A: Numeric: auto-increment, reverse mapping available (Enum[0] → "Name")
   String: explicit values, no reverse mapping, better for debugging/APIs

Q: When should you use enum vs union type?
A: Prefer union types ('active' | 'inactive') for simple cases.
   Use enums when: grouping related constants, need reverse lookup,
   using const enum for performance, or building library code.

Q: What is a const enum?
A: Values are inlined at compile time — no runtime object created.
   Better performance but can't do reverse lookup or use as value.

Q: What is type narrowing?
A: TypeScript refining a broad union type to a specific type
   based on runtime checks (typeof, instanceof, 'in', truthiness, etc.)

Q: What is a discriminated union?
A: A union type where each member has a common "discriminant" property
   (like 'kind' or 'type') with a unique literal value.
   TypeScript can narrow perfectly using switch/if on the discriminant.

Q: What is a type predicate?
A: A function that returns 'value is Type' — tells TypeScript that
   if the function returns true, the argument is the specified type.
   function isFish(pet: Fish | Bird): pet is Fish { ... }

Q: What is 'as const'?
A: Makes TypeScript infer the most specific (literal) types.
   const x = ["a", "b"] → string[] (wide)
   const x = ["a", "b"] as const → readonly ["a", "b"] (narrow)

Q: What is exhaustive checking with never?
A: After handling all cases of a discriminated union, assign remaining
   value to 'never'. If TypeScript errors, you missed a case.
   Great for switch statements to catch missing cases at compile time.
*/
