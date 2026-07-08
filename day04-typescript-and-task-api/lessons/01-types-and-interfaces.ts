// ============================================================
// DAY 1 — TypeScript: TYPES & INTERFACES
// Interview Level: Beginner → Advanced
// ============================================================

// WHY TYPESCRIPT?
// JavaScript is dynamically typed — types are checked at RUNTIME.
// TypeScript adds STATIC typing — types are checked at COMPILE TIME.
// This catches bugs BEFORE your code runs!
//
// TypeScript compiles to JavaScript (it's a superset of JS).
// Every valid JS file is also a valid TS file.

// ─────────────────────────────────────────────────────────────
// SECTION 1: PRIMITIVE TYPES
// ─────────────────────────────────────────────────────────────
// TypeScript can INFER types (you don't always need to annotate)
// But explicit annotations are better for documentation.

// Explicit type annotations
let name: string    = "Rohit";
let age: number     = 25;
let isActive: boolean  = true;
let nothing: null   = null;
let notDefined: undefined = undefined;

// TypeScript infers the type from the initial value:
let inferred = "Hello"; // TypeScript knows this is: string
// inferred = 42;       // ❌ Error: Type 'number' is not assignable to type 'string'

// ── Special types ─────────────────────────────────────────────

// any — disables type checking (AVOID — defeats the purpose of TS)
let anything: any = "could be anything";
anything = 42;        // ✅ no error (but no type safety either!)
anything = true;      // ✅

// unknown — safer alternative to any (must narrow before use)
let unknownVal: unknown = "hello";
// unknownVal.toUpperCase(); // ❌ Error: Object is of type 'unknown'
if (typeof unknownVal === "string") {
  unknownVal.toUpperCase(); // ✅ TypeScript now knows it's a string
}

// never — represents values that NEVER occur
// Used for: functions that always throw, exhaustive checks
function throwError(message: string): never {
  throw new Error(message); // never returns normally
}

// void — function returns nothing useful
function logMessage(msg: string): void {
  console.log(msg);
  // implicitly returns undefined
}

// ─────────────────────────────────────────────────────────────
// SECTION 2: ARRAYS & TUPLES
// ─────────────────────────────────────────────────────────────

// Arrays — two syntaxes (both equivalent)
const numbers: number[]       = [1, 2, 3, 4, 5];
const strings: Array<string>  = ["a", "b", "c"];

// numbers.push("hello"); // ❌ Error: Argument of type 'string' not assignable to 'number'

// Readonly array — cannot be mutated
const readonlyNums: readonly number[] = [1, 2, 3];
// readonlyNums.push(4); // ❌ Error: Property 'push' does not exist on type 'readonly number[]'

// Tuple — fixed-length array with specific types at each position
let point: [number, number] = [10, 20];       // x, y coordinates
let record: [string, number, boolean] = ["Rohit", 25, true];

// Labeled tuples (TypeScript 4.0+) — better readability
type Coordinate = [x: number, y: number, z?: number];
const pos: Coordinate = [10, 20];      // z is optional
const pos3D: Coordinate = [10, 20, 5]; // with z

// point = [10, 20, 30]; // ❌ Error: Too many elements

// ─────────────────────────────────────────────────────────────
// SECTION 3: OBJECT TYPES
// ─────────────────────────────────────────────────────────────

// Inline object type annotation
let user: { name: string; age: number; email?: string } = {
  name: "Rohit",
  age: 25,
  // email is optional (? means optional)
};

// Optional properties with ?
// Readonly properties with readonly keyword
let config: {
  readonly host: string;
  readonly port: number;
  timeout?: number;
} = {
  host: "localhost",
  port: 3000,
};
// config.host = "newhost"; // ❌ Error: Cannot assign to 'host' because it is read-only

// ─────────────────────────────────────────────────────────────
// SECTION 4: INTERFACES
// ─────────────────────────────────────────────────────────────
// Interface = a CONTRACT that describes the SHAPE of an object.
// It defines what properties and methods an object must have.

interface User {
  readonly id: number;    // readonly — cannot change after creation
  name: string;
  email: string;
  age?: number;           // optional property
  role: "admin" | "user" | "moderator"; // literal union type
}

// Implementing the interface
const rohit: User = {
  id: 1,
  name: "Rohit",
  email: "rohit@example.com",
  role: "admin",
};
// rohit.id = 99; // ❌ Error: Cannot assign to 'id' (readonly)

// ── Interface with methods ────────────────────────────────────
interface Animal {
  name: string;
  sound: string;
  speak(): void;          // method signature
  eat(food: string): void;
  sleep(hours: number): string;
}

// Implementing the interface on a class
class Dog implements Animal {
  constructor(
    public name: string,   // shorthand: creates and assigns property
    public sound: string
  ) {}

  speak(): void {
    console.log(`${this.name} says ${this.sound}!`);
  }

  eat(food: string): void {
    console.log(`${this.name} eats ${food}`);
  }

  sleep(hours: number): string {
    return `${this.name} slept for ${hours} hours`;
  }
}

const rex = new Dog("Rex", "Woof");
rex.speak(); // "Rex says Woof!"

// ── Interface Extension ────────────────────────────────────────
// Interfaces can EXTEND other interfaces (even multiple)
interface Vehicle {
  brand: string;
  speed: number;
  accelerate(amount: number): void;
}

interface ElectricVehicle extends Vehicle {
  batteryLevel: number;
  charge(): void;
}

interface AutonomousVehicle extends ElectricVehicle {
  autopilot: boolean;
  setDestination(location: string): void;
}

// Must implement ALL properties from all extended interfaces
const tesla: AutonomousVehicle = {
  brand: "Tesla",
  speed: 0,
  batteryLevel: 80,
  autopilot: true,
  accelerate(amount: number) { this.speed += amount; },
  charge() { this.batteryLevel = 100; },
  setDestination(loc: string) { console.log(`Navigating to ${loc}`); },
};

// ── Interface Declaration Merging ─────────────────────────────
// UNIQUE TO INTERFACES: Can be declared multiple times — TS merges them!
// This is why interfaces are preferred for library/SDK definitions.
interface Config {
  host: string;
}
interface Config {           // ← merged with above! Both declarations combine
  port: number;
}
interface Config {
  timeout?: number;
}
// Config now has: host, port, timeout (all merged)

const cfg: Config = { host: "localhost", port: 3000 }; // all merged

// ── Interface for Function Signatures ──────────────────────────
interface MathOperation {
  (a: number, b: number): number; // callable signature
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

console.log(add(2, 3));       // 5
console.log(multiply(4, 5)); // 20

// ── Interface for Index Signatures ────────────────────────────
// When you don't know the keys in advance
interface StringMap {
  [key: string]: string; // any string key → string value
}

const translations: StringMap = {
  hello: "नमस्ते",
  goodbye: "अलविदा",
  thanks: "धन्यवाद",
};
console.log(translations["hello"]); // "नमस्ते"

// Mixed: known properties + index signature
interface FlexibleConfig {
  name: string;           // known property
  [key: string]: string;  // any other string properties
}

// ─────────────────────────────────────────────────────────────
// SECTION 5: UNION TYPES
// ─────────────────────────────────────────────────────────────
// Union type = value can be ONE of several types
// Written with |

type StringOrNumber = string | number;

function printId(id: StringOrNumber): void {
  if (typeof id === "string") {
    console.log(`ID (string): ${id.toUpperCase()}`);
  } else {
    console.log(`ID (number): ${id.toFixed(0)}`);
  }
}
printId("abc-123");  // "ID (string): ABC-123"
printId(42);         // "ID (number): 42"

// ─────────────────────────────────────────────────────────────
// SECTION 6: INTERSECTION TYPES
// ─────────────────────────────────────────────────────────────
// Intersection type = value must have ALL properties of ALL types
// Written with &
// Combines types (like "AND")

interface HasName { name: string; }
interface HasAge  { age: number;  }
interface HasEmail { email: string; }

type FullUser = HasName & HasAge & HasEmail;

const fullUser: FullUser = {
  name: "Rohit",
  age: 25,
  email: "rohit@example.com", // must have ALL properties
};

// Practical use: combining interfaces
interface AdminPrivileges {
  canDelete: boolean;
  canManageUsers: boolean;
}

type AdminUser = User & AdminPrivileges;
// AdminUser has: id, name, email, age, role + canDelete, canManageUsers

// ─────────────────────────────────────────────────────────────
// SECTION 7: LITERAL TYPES
// ─────────────────────────────────────────────────────────────
// A type that can only be a specific VALUE (not just a type)

type Direction = "north" | "south" | "east" | "west";
type DiceRoll  = 1 | 2 | 3 | 4 | 5 | 6;
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Status = "pending" | "active" | "inactive" | "suspended";

function move(dir: Direction): void {
  console.log(`Moving ${dir}`);
}
move("north");  // ✅
// move("up"); // ❌ Error: Argument of type '"up"' is not assignable to type 'Direction'

// Combining with other types:
type ID = string | number; // flexible ID
type SuccessCode = 200 | 201 | 204;
type ErrorCode = 400 | 401 | 403 | 404 | 500;
type StatusCode = SuccessCode | ErrorCode;

// ─────────────────────────────────────────────────────────────
// SECTION 8: FUNCTION TYPES
// ─────────────────────────────────────────────────────────────

// Function parameter and return type annotation
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// Optional parameters with ?
function createUser(name: string, age?: number): User {
  return {
    id: Date.now(),
    name,
    email: `${name.toLowerCase()}@example.com`,
    age,             // age could be undefined
    role: "user",
  };
}

// Rest parameters
function sumAll(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// Function type annotation
type Transformer = (input: string) => string;
type Predicate<T> = (item: T) => boolean;

const upperCase: Transformer = (s) => s.toUpperCase();
const isEven: Predicate<number> = (n) => n % 2 === 0;

// Overloads — multiple signatures for the same function
function format(value: string): string;
function format(value: number, decimals: number): string;
function format(value: string | number, decimals?: number): string {
  if (typeof value === "string") return value.trim();
  return value.toFixed(decimals ?? 2);
}
console.log(format("  hello  "));   // "hello"
console.log(format(3.14159, 2));    // "3.14"

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What's the difference between interface and type alias?
A: interface → can be extended with 'extends', supports declaration merging
   type alias → more flexible (unions, intersections, tuples, primitives)
   Both can describe object shapes. Prefer interface for public APIs,
   type alias for complex or computed types.

Q: What is 'any' vs 'unknown'?
A: any     → disables all type checking (avoid!)
   unknown → type-safe unknown value — must narrow with typeof/instanceof

Q: What is the 'never' type?
A: Represents values that should never exist.
   Use for: always-throwing functions, unreachable code, exhaustive checks.

Q: What is declaration merging?
A: Interfaces with the same name are automatically merged by TypeScript.
   Type aliases cannot be merged (redeclaration causes error).

Q: When to use union vs intersection types?
A: Union (|)       → value is ONE OF the listed types (OR)
   Intersection (&) → value must satisfy ALL listed types (AND)

Q: What are literal types?
A: Types that represent exact values: "north" | "south", 1 | 2 | 3.
   Great for enumerating valid values with type safety.

Q: What does the ? mean in TypeScript?
A: On property: optional (may be undefined) — name?: string
   On parameter: optional parameter — function f(x?: number)

Q: What is readonly?
A: Prevents property reassignment after initial assignment.
   Like const but for object properties.
*/
