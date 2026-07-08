// ============================================================
// JAVASCRIPT BASICS — File 1: Variables & Data Types
// Level: Absolute Beginner → Intermediate
// Run: node 01-variables-and-datatypes.js
// ============================================================

// WHAT IS JAVASCRIPT?
// JavaScript (JS) is a programming language that runs:
//   - In your BROWSER (makes webpages interactive)
//   - On your SERVER (with Node.js — runs apps, APIs)
//   - On your COMPUTER (scripts, CLI tools)
//
// This file → run with Node.js: node this-file.js
// In browser → put in <script> tag

// ==========================================================
// SECTION 1: COMMENTS
// ==========================================================
// Single-line comment: starts with //   (ignored by JavaScript)

/*
  Multi-line comment:
  Everything between slash-star and star-slash is ignored.
  Use to explain complex logic or disable code temporarily.
*/

// ==========================================================
// SECTION 2: console.log — Your Best Friend!
// ==========================================================
// console.log() prints values to the terminal (or browser console).
// Use it to see what your code is doing — like print() in Python.

console.log("Hello, World!");      // prints: Hello, World!
console.log(42);                   // prints: 42
console.log(true);                 // prints: true
console.log(1, 2, "three");        // prints multiple: 1 2 three
console.log("Value:", 100);        // label + value (good practice)

// Other console methods:
console.error("This is an error");     // red in browser console
console.warn("This is a warning");     // yellow in browser console
console.table([{name: "Rohit", age: 25}]); // shows as a table
console.log("---");                    // separator for readability

// ==========================================================
// SECTION 3: VARIABLES — Storing Data
// ==========================================================
// A variable is a NAMED CONTAINER for storing data.
// Think of it like a labeled box: you put something in, name it, use it later.
//
// 3 keywords to create variables: var, let, const

// ── const — use this by default! ────────────────────────
// const = CONSTANT — value CANNOT be changed after creation
// Use for values you don't intend to change
const myName = "Rohit";
const myAge  = 25;
const PI     = 3.14159;

console.log(myName);   // Rohit
console.log(myAge);    // 25
// myAge = 30;         // ❌ ERROR: Assignment to constant variable

// ── let — use when value NEEDS to change ────────────────
// let = VARIABLE — value CAN be changed
let score = 0;
let currentLevel = 1;

score = 100;        // ✅ updating a let variable — allowed
score = score + 50; // ✅ add 50 to current score
console.log("Score:", score); // 150

// ── var — OLD WAY — avoid it! ───────────────────────────
// var has confusing behavior (covered in advanced hoisting file)
// Always use let or const instead
var oldStyle = "don't use var";

// ── Rules for naming variables ────────────────────────────
// ✅ VALID names:
let firstName   = "Rohit";    // camelCase (most common in JS)
let last_name   = "Jadhav";   // snake_case (less common in JS)
let _privateVar = "private";  // underscore prefix (convention for private)
let $jqElement  = "jQuery";   // $ prefix (used by jQuery, avoid otherwise)
let score2      = 99;         // numbers allowed (not as first character)
let CONSTANT_VALUE = 100;     // ALL_CAPS for true constants

// ❌ INVALID names:
// let 2fast = "no";     // cannot start with a number
// let my-name = "no";   // no hyphens
// let let = "no";       // cannot use reserved keywords
// let class = "no";     // reserved keywords: class, if, for, return, etc.

// ── Best Practices ────────────────────────────────────────
// 1. Use const by default
// 2. Use let only when you need to reassign
// 3. Never use var
// 4. Use camelCase: firstName, totalPrice, isLoggedIn
// 5. Boolean names: start with is/has/can: isActive, hasError, canEdit

// ==========================================================
// SECTION 4: DATA TYPES
// ==========================================================
// JavaScript has 8 data types total.
// 7 Primitive types + 1 Object type.
//
// Primitive = stored by VALUE (simple, immutable)
// Object    = stored by REFERENCE (complex, mutable)

// ── Type 1: STRING — text data ──────────────────────────
// Strings are wrapped in quotes: single '' double "" or backticks ``
const singleQuote  = 'Hello';
const doubleQuote  = "World";
const backtick     = `Template literal`;  // most powerful!

// Template literals (backticks) → can embed variables with ${}
const name = "Rohit";
const age  = 25;
const greeting = `Hi, I'm ${name} and I am ${age} years old.`;
console.log(greeting); // Hi, I'm Rohit and I am 25 years old.

// Math expressions inside ${}
console.log(`${5 + 3} equals eight`);  // 8 equals eight
console.log(`Next year I'll be ${age + 1}`); // Next year I'll be 26

// Multi-line strings with backticks
const multiLine = `
  Line 1
  Line 2
  Line 3
`;

// ── Type 2: NUMBER — all numeric values ──────────────────
// JavaScript has ONE number type — no int/float separation!
const integer   = 42;
const decimal   = 3.14;
const negative  = -10;
const big       = 1_000_000;  // underscores for readability (ES2021)

// Special number values:
console.log(10 / 0);          // Infinity
console.log(-10 / 0);         // -Infinity
console.log("hello" * 2);     // NaN (Not a Number)
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER);  // -9007199254740991

// Check if something is NaN:
console.log(isNaN("hello" * 2));   // true
console.log(isNaN(42));            // false

// ── Type 3: BOOLEAN — true or false ──────────────────────
// Only two values: true or false
// Used for decisions and conditions
const isLoggedIn  = true;
const hasAccount  = false;
const isAdult     = age >= 18;  // comparison returns boolean
console.log(isAdult); // true (25 >= 18)

// ── Type 4: UNDEFINED — variable declared but not assigned ──
let notAssigned;           // declared but no value given
console.log(notAssigned);  // undefined (not an error!)
console.log(typeof notAssigned); // "undefined"

// Also returned when:
// - accessing object property that doesn't exist
// - function returns nothing

// ── Type 5: NULL — intentional "empty" value ─────────────
// null = "I intentionally have no value"
// undefined = "no value was given"
const emptyValue = null;
console.log(emptyValue);          // null
console.log(typeof null);         // "object" — this is a famous JS bug!

// null vs undefined:
// null      → you intentionally set it to "nothing"
// undefined → variable exists but was never given a value

// ── Type 6: BIGINT — for very large integers ──────────────
// Regular numbers lose precision beyond 2^53
// BigInt handles arbitrarily large integers
const bigNumber = 9007199254740999n;  // add 'n' suffix
const anotherBig = BigInt("12345678901234567890");
console.log(bigNumber + 1n);  // must operate with other BigInts

// ── Type 7: SYMBOL — unique identifier ───────────────────
// Creates a guaranteed unique value — used for advanced patterns
const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log(sym1 === sym2); // false — always unique!

// ── Type 8: OBJECT — complex data ────────────────────────
// Can store multiple values with names (key-value pairs)
// This covers: plain objects, arrays, functions, dates, etc.
const person = {
  name: "Rohit",    // key: value
  age: 25,
  isStudent: false,
};
console.log(person.name);    // "Rohit"  — dot notation
console.log(person["age"]);  // 25       — bracket notation

// Arrays are a special type of object:
const colors = ["red", "green", "blue"];
console.log(colors[0]);  // "red"  — arrays are 0-indexed!

// ==========================================================
// SECTION 5: typeof — Check the Data Type
// ==========================================================
// typeof returns a STRING describing the type of a value

console.log("--- typeof examples ---");
console.log(typeof "hello");       // "string"
console.log(typeof 42);            // "number"
console.log(typeof 3.14);          // "number" (same type as integer!)
console.log(typeof true);          // "boolean"
console.log(typeof undefined);     // "undefined"
console.log(typeof null);          // "object"  ← famous bug! null is NOT an object
console.log(typeof {});            // "object"
console.log(typeof []);            // "object"  ← arrays are objects too!
console.log(typeof function(){}); // "function"
console.log(typeof Symbol());      // "symbol"
console.log(typeof 42n);           // "bigint"

// Better check for arrays:
console.log(Array.isArray([]));         // true
console.log(Array.isArray({}));         // false
console.log(Array.isArray("string"));   // false

// ==========================================================
// SECTION 6: TYPE CONVERSION
// ==========================================================

// ── Explicit Conversion (you control it) ──────────────────

// To Number:
console.log("--- To Number ---");
console.log(Number("42"));       // 42        (string to number)
console.log(Number("3.14"));     // 3.14
console.log(Number(""));         // 0         (empty string)
console.log(Number("hello"));    // NaN       (can't convert)
console.log(Number(true));       // 1
console.log(Number(false));      // 0
console.log(Number(null));       // 0
console.log(Number(undefined));  // NaN
console.log(parseInt("42px"));   // 42        (stops at first non-numeric)
console.log(parseFloat("3.14abc")); // 3.14
console.log(+"42");              // 42        (+ prefix converts to number)

// To String:
console.log("--- To String ---");
console.log(String(42));         // "42"
console.log(String(true));       // "true"
console.log(String(null));       // "null"
console.log(String(undefined));  // "undefined"
console.log((42).toString());    // "42"
console.log((255).toString(16)); // "ff"  (hex)
console.log((7).toString(2));    // "111" (binary)

// To Boolean:
console.log("--- To Boolean ---");
// FALSY values — these are ALL the false ones (only 6!):
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(-0));        // false
console.log(Boolean(""));        // false  (empty string)
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false

// TRUTHY values — EVERYTHING ELSE is true:
console.log(Boolean(true));      // true
console.log(Boolean(1));         // true   (any non-zero number)
console.log(Boolean(-1));        // true
console.log(Boolean("hello"));   // true   (any non-empty string)
console.log(Boolean("0"));       // true   ← "0" as STRING is truthy!
console.log(Boolean([]));        // true   ← empty array is truthy!
console.log(Boolean({}));        // true   ← empty object is truthy!

// ── Implicit Conversion (JavaScript does it automatically) ─
console.log("--- Implicit Conversion ---");
// String + anything = concatenation (string wins!)
console.log("5" + 3);     // "53"  (NOT 8!)
console.log("5" + true);  // "5true"
console.log(5 + "");      // "5"   (number to string)

// Other operators: convert to number first
console.log("5" - 3);     // 2    (string "5" → number 5)
console.log("5" * 2);     // 10
console.log("5" / 2);     // 2.5
console.log(true + true); // 2    (booleans → numbers)
console.log(false + 1);   // 1

// ==========================================================
// SECTION 7: WORKING WITH STRINGS
// ==========================================================
const str = "Hello, World!";

// Length (number of characters)
console.log(str.length);              // 13

// Access individual characters (0-indexed)
console.log(str[0]);                  // "H"
console.log(str[7]);                  // "W"
console.log(str[str.length - 1]);     // "!" (last character)

// Common string methods (strings are IMMUTABLE — methods return NEW strings)
console.log(str.toUpperCase());       // "HELLO, WORLD!"
console.log(str.toLowerCase());       // "hello, world!"
console.log(str.includes("World"));   // true
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("!"));       // true
console.log(str.indexOf("o"));        // 4  (first occurrence)
console.log(str.lastIndexOf("o"));    // 8  (last occurrence)
console.log(str.slice(7, 12));        // "World"
console.log(str.slice(-6));           // "orld!" (from end)
console.log(str.replace("World", "Rohit")); // "Hello, Rohit!"
console.log("  trim me  ".trim());    // "trim me" (removes spaces from both ends)
console.log("Hello".repeat(3));       // "HelloHelloHello"
console.log("a,b,c".split(","));      // ["a", "b", "c"]
console.log(str.charAt(1));           // "e"
console.log(str.charCodeAt(0));       // 72  (ASCII code of 'H')

// String padding (useful for formatting)
console.log("5".padStart(3, "0"));   // "005"
console.log("hi".padEnd(5, "."));    // "hi..."

/*
  INTERVIEW Q&A:
  ==============
  Q: What are the 8 data types in JavaScript?
  A: Primitive (7): string, number, boolean, null, undefined, bigint, symbol
     Object (1): object (includes arrays, functions, dates)

  Q: What is the difference between null and undefined?
  A: null      → intentional absence of value (you set it to null)
     undefined → variable exists but was never assigned a value

  Q: What are falsy values in JavaScript?
  A: false, 0, -0, "", null, undefined, NaN — only THESE 6 (plus 0n bigint)
     Everything else is truthy (including "0", [], {})

  Q: Why does typeof null return "object"?
  A: It's a bug in the original JavaScript (1995) that was never fixed
     for backward compatibility. null is NOT actually an object.

  Q: What is the difference between == and ===?
  A: == (loose equality) → converts types before comparing
     === (strict equality) → NO type conversion, both type AND value must match
     Always use === in real code!
     "5" == 5  → true  (converts string to number)
     "5" === 5 → false (different types)

  Q: What is NaN and how do you check for it?
  A: NaN = Not a Number (result of invalid math like "hello" * 2)
     Check: isNaN(value) or Number.isNaN(value)
     Weird: NaN === NaN is false! Use isNaN() to check.

  Q: What is the difference between var, let, and const?
  A: var   → function-scoped, hoisted as undefined (avoid!)
     let   → block-scoped, not hoisted, can be reassigned
     const → block-scoped, not hoisted, cannot be reassigned
*/
