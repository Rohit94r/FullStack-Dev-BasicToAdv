// ============================================================
// TYPESCRIPT — File 0: What is TypeScript & Why Use It?
// Level: Absolute Beginner — Start Here Before Other TS Files!
// ============================================================

// ==========================================================
// SECTION 1: WHAT IS TYPESCRIPT?
// ==========================================================
//
// TypeScript = JavaScript + Type System
//
// JavaScript problem: you find TYPE errors only at RUNTIME (when app runs).
// TypeScript solution: catches type errors at COMPILE TIME (before it runs!).
//
// TypeScript is:
//   - A SUPERSET of JavaScript (every JS file is valid TS)
//   - Transpiles (converts) to JavaScript to run
//   - Has static typing (types checked before running)
//   - Made by Microsoft, widely used in industry
//
// JavaScript:
//   function add(a, b) { return a + b; }
//   add("hello", 5); // runs, gives "hello5" — is that what you wanted?
//
// TypeScript:
//   function add(a: number, b: number): number { return a + b; }
//   add("hello", 5); // ❌ ERROR at compile time! "hello" is not a number
//
// WHEN TO USE TYPESCRIPT:
//   ✅ Any project with more than 1-2 files
//   ✅ Team projects (type safety helps everyone)
//   ✅ Long-lived projects
//   ✅ APIs, backends, and complex front-ends
//   ✅ Libraries and npm packages

// ==========================================================
// SECTION 2: HOW TYPE ANNOTATIONS WORK
// ==========================================================
// Syntax: variableName: type = value

// ── Basic type annotations ────────────────────────────────
const myName: string    = "Rohit";
const myAge: number     = 25;
const isActive: boolean = true;

// TypeScript can INFER types (you don't always need to annotate)
const inferredName    = "Rohit"; // TypeScript infers: string
const inferredAge     = 25;      // TypeScript infers: number
const inferredActive  = true;    // TypeScript infers: boolean

// Type inference means less code to write, but same type safety!

// ── Functions with types ──────────────────────────────────
function add(a: number, b: number): number {
  // a: number = parameter 'a' must be a number
  // b: number = parameter 'b' must be a number
  // : number  = function must return a number
  return a + b;
}

console.log(add(5, 10));    // ✅ 15
// console.log(add("5", 10)); // ❌ TypeScript error: string is not assignable to number

// Without return type (TypeScript infers it):
function multiply(a: number, b: number) {
  return a * b; // TypeScript infers return type is number
}

// ==========================================================
// SECTION 3: PRIMITIVE TYPES IN TYPESCRIPT
// ==========================================================

// string — for text
const firstName: string = "Rohit";
const lastName: string  = "Jadhav";
const fullName: string  = `${firstName} ${lastName}`;

// number — for all numbers (integer and decimal)
const age: number         = 25;
const price: number       = 9.99;
const temperature: number = -5;

// boolean — true or false
const isLoggedIn: boolean   = true;
const hasPermission: boolean = false;

// undefined — variable exists but has no value
let notSet: undefined;          // explicitly undefined
let maybe: string | undefined;  // could be string OR undefined

// null — intentional "no value"
const empty: null = null;
let nullableUser: string | null = null; // could be string OR null

// any — like JavaScript (opt-out of type checking — AVOID!)
let anything: any = "could be anything";
anything = 42;    // allowed but unsafe — defeats the purpose of TS
anything = true;  // allowed but unsafe

// unknown — safer alternative to any
let unknownVal: unknown = "hello";
// unknownVal.toUpperCase(); // ❌ Error — must check type first!
if (typeof unknownVal === "string") {
  unknownVal.toUpperCase(); // ✅ now safe
}

// void — function that returns nothing
function logMessage(msg: string): void {
  console.log(msg);
  // no return statement (or just: return;)
}

// never — function that NEVER returns (always throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message); // always throws, never returns
}

// ==========================================================
// SECTION 4: ARRAY TYPES
// ==========================================================

// Two ways to type arrays (both are equivalent):
const numbers: number[]       = [1, 2, 3, 4, 5];
const strings: Array<string>  = ["a", "b", "c"];

// numbers.push("hello"); // ❌ Error: string not assignable to number
numbers.push(6);          // ✅

// Readonly arrays — cannot be mutated:
const readonlyNums: readonly number[] = [1, 2, 3];
// readonlyNums.push(4); // ❌ Error: Property 'push' does not exist

// Mixed array (union types — see section 6):
const mixed: (string | number)[] = [1, "two", 3, "four"];

// ==========================================================
// SECTION 5: OBJECT TYPES
// ==========================================================

// Inline object type annotation:
const person: {
  name: string;
  age:  number;
  email?: string; // ? means OPTIONAL (may be undefined)
} = {
  name: "Rohit",
  age:  25,
  // email is optional — can omit it
};

// person.name = 42;          // ❌ Error: number not assignable to string
// console.log(person.phone); // ❌ Error: 'phone' does not exist on type

// Readonly properties:
const config: {
  readonly host: string; // cannot be changed after creation
  readonly port: number;
} = {
  host: "localhost",
  port: 3000,
};
// config.host = "newhost"; // ❌ Error: Cannot assign to readonly property

// ==========================================================
// SECTION 6: UNION TYPES — Value can be ONE of multiple types
// ==========================================================
// Written with | (pipe character)

let id: string | number; // can be either string or number
id = "abc-123";          // ✅ string
id = 42;                 // ✅ number
// id = true;            // ❌ boolean not allowed

function printId(id: string | number): void {
  // TypeScript requires you to handle both types:
  if (typeof id === "string") {
    console.log("String ID:", id.toUpperCase()); // safe: id is string
  } else {
    console.log("Number ID:", id.toFixed(0));    // safe: id is number
  }
}
printId("abc"); // "String ID: ABC"
printId(42);    // "Number ID: 42"

// Literal types — EXACTLY that value, not just the type:
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north"; // ✅
// dir = "up";                // ❌ "up" is not one of the literal values

type StatusCode = 200 | 201 | 400 | 404 | 500;
let code: StatusCode = 200; // ✅
// code = 999;               // ❌

// ==========================================================
// SECTION 7: TYPE ALIASES — Name Your Types
// ==========================================================

// Give a name to a type for reuse:
type UserID   = string | number;
type Username = string;

type Point = {
  x: number;
  y: number;
};

const p1: Point = { x: 10, y: 20 };
const p2: Point = { x: 0, y: 0 };

function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
console.log(distance(p1, p2)); // ~22.36

// ==========================================================
// SECTION 8: INTERFACES — Another Way to Define Object Shape
// ==========================================================
// interface is similar to type alias for objects
// Key advantage: can be EXTENDED and MERGED

interface User {
  id:     number;
  name:   string;
  email:  string;
  age?:   number;  // ? = optional
}

const user1: User = {
  id:    1,
  name:  "Rohit",
  email: "rohit@example.com",
  // age is optional, omitting it is fine
};

const user2: User = {
  id:    2,
  name:  "Anna",
  email: "anna@example.com",
  age:   30,
};

function greetUser(user: User): string {
  const ageStr = user.age ? `, age ${user.age}` : "";
  return `Hello, ${user.name}${ageStr}!`;
}
console.log(greetUser(user1)); // "Hello, Rohit!"
console.log(greetUser(user2)); // "Hello, Anna, age 30!"

// Extending interface:
interface AdminUser extends User {
  role:        "admin";
  permissions: string[];
}

const admin: AdminUser = {
  id:          1,
  name:        "Rohit",
  email:       "rohit@example.com",
  role:        "admin",
  permissions: ["read", "write", "delete"],
};

// ==========================================================
// SECTION 9: TYPE ANNOTATION ON FUNCTIONS — Complete Guide
// ==========================================================

// Regular function:
function greet(name: string, age: number): string {
  return `Hi, ${name}! You are ${age} years old.`;
}

// Optional parameter (? after name):
function createMessage(title: string, subtitle?: string): string {
  return subtitle ? `${title}: ${subtitle}` : title;
}
console.log(createMessage("Hello"));             // "Hello"
console.log(createMessage("Hello", "World"));    // "Hello: World"

// Default parameter:
function repeat(str: string, times: number = 3): string {
  return str.repeat(times);
}
console.log(repeat("hi"));    // "hihihi"
console.log(repeat("hi", 2)); // "hihi"

// Rest parameters:
function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// Arrow function with types:
const double = (n: number): number => n * 2;
const isEven = (n: number): boolean => n % 2 === 0;

// Function type annotation:
type MathFunc = (a: number, b: number) => number;
const addFn: MathFunc = (a, b) => a + b;
const subFn: MathFunc = (a, b) => a - b;

// ==========================================================
// SECTION 10: TYPE ASSERTION (as) — Tell TypeScript the type
// ==========================================================
// When YOU know the type better than TypeScript

// From HTML/DOM (TypeScript doesn't know specific element type):
// const input = document.getElementById("email") as HTMLInputElement;
// input.value = "test@example.com"; // works because we asserted the type

// From JSON parsing (TypeScript gives 'any'):
const rawData = '{"name":"Rohit","age":25}';
const parsed = JSON.parse(rawData) as User; // tell TS this is a User
console.log(parsed.name); // "Rohit"

// Non-null assertion (!) — tell TS "this is definitely not null"
const maybeNull: string | null = "definitely a string";
const definitelyString = maybeNull!; // ! asserts it's not null

// ⚠️ Use assertions carefully — if you're wrong, runtime errors occur!

// ==========================================================
// SECTION 11: THE DIFFERENCE — Type vs Interface
// ==========================================================

// TYPE ALIAS — can be anything:
type StringOrNumber = string | number;      // union — only with type
type Callback       = () => void;           // function — cleaner with type
type Point2 = { x: number; y: number };    // object

// INTERFACE — object shapes (can be extended):
interface Animal {
  name:  string;
  sound: string;
}
interface Animal {            // ← merged with above! (declaration merging)
  age?: number;               // valid — both declarations combined
}

// Both can describe objects. Key differences:
// type  → unions, intersections, primitive aliases, tuples, conditional types
// interface → declaration merging, preferred for public APIs and class shapes

/*
  INTERVIEW Q&A:
  ==============
  Q: What is TypeScript?
  A: A statically-typed superset of JavaScript made by Microsoft.
     Adds type annotations, interfaces, and generics.
     Compiles to plain JavaScript.

  Q: Why use TypeScript over JavaScript?
  A: 1. Catches type errors at compile time (before runtime)
     2. Better IDE support (autocomplete, refactoring)
     3. Self-documenting code (types tell you what functions expect)
     4. Easier to maintain in large codebases

  Q: What is the difference between any and unknown?
  A: any     → disables type checking completely (unsafe, avoid)
     unknown → type-safe unknown — must check type before using
     Both can hold any value, but unknown is safer.

  Q: What is the ? after a property name?
  A: Makes the property OPTIONAL — it may or may not be present.
     age?: number means age can be a number or undefined.

  Q: What is a union type?
  A: A type that can be one of several types: string | number
     TypeScript requires you to narrow the type before using type-specific methods.

  Q: What is the difference between type alias and interface?
  A: Both describe object shapes. Key differences:
     type → can also be union, intersection, tuple, primitive, conditional
     interface → supports declaration merging (same interface declared twice = merged)
     Both are valid; interface preferred for class contracts and public APIs.

  Q: What is type inference?
  A: TypeScript automatically figures out the type from the value.
     const x = 42; → TypeScript knows x is number without you writing : number
*/
