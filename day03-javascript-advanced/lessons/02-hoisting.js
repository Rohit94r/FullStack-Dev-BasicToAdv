// ============================================================
// DAY 1 — JavaScript: HOISTING
// Interview Level: Beginner → Advanced
// ============================================================

// HOISTING = JavaScript moves declarations to the TOP of their
//            scope BEFORE code runs. Only DECLARATIONS are hoisted,
//            not INITIALIZATIONS (assignments).
//
// Think of it like: JS reads your whole file first, notes all
// declarations, then runs the code top to bottom.

// ─────────────────────────────────────────────────────────────
// SECTION 1: VAR HOISTING
// ─────────────────────────────────────────────────────────────
// var declarations are hoisted to the top of their FUNCTION scope
// and initialized to: undefined

console.log(myVar); // undefined (NOT ReferenceError — hoisted!)
var myVar = "Hello";
console.log(myVar); // "Hello"

// Behind the scenes, JS sees it like this:
// var myVar;           ← hoisted to top, initialized as undefined
// console.log(myVar);  ← undefined
// myVar = "Hello";     ← assignment stays here
// console.log(myVar);  ← "Hello"

function varHoistExample() {
  console.log(localVar); // undefined (hoisted inside function scope)
  var localVar = "local";
  console.log(localVar); // "local"
}
varHoistExample();

// ─────────────────────────────────────────────────────────────
// SECTION 2: LET AND CONST HOISTING — TEMPORAL DEAD ZONE (TDZ)
// ─────────────────────────────────────────────────────────────
// let and const ARE hoisted, but they are NOT initialized.
// Accessing them before declaration causes: ReferenceError
// The time between hoisting and initialization = TEMPORAL DEAD ZONE (TDZ)

// console.log(myLet);   // ❌ ReferenceError: Cannot access 'myLet' before initialization
let myLet = "I am let";
console.log(myLet);      // "I am let"

// console.log(myConst); // ❌ ReferenceError
const myConst = "I am const";

// TDZ Visual:
// ┌─── TDZ starts (let x is hoisted but not initialized) ───┐
// │  console.log(x); ← ❌ ReferenceError (inside TDZ)      │
// └─── TDZ ends when declaration line is reached ───────────┘
// let x = 10;  ← now x is initialized, safe to use

// ─────────────────────────────────────────────────────────────
// SECTION 3: FUNCTION HOISTING
// ─────────────────────────────────────────────────────────────
// Function DECLARATIONS are fully hoisted — name AND body.
// You can call them BEFORE they are defined.

sayHello(); // ✅ "Hello!" — works! Function declaration is fully hoisted

function sayHello() {
  console.log("Hello!");
}

// Function EXPRESSIONS are NOT hoisted (they're just variables)
// sayBye(); // ❌ TypeError: sayBye is not a function (var is hoisted as undefined)
var sayBye = function () {
  console.log("Bye!");
};
sayBye(); // ✅ works now

// Arrow functions — same as function expressions, NOT fully hoisted
// greet(); // ❌ ReferenceError (let) or TypeError (var)
const greet = () => console.log("Hi!");
greet(); // ✅ works now

// ─────────────────────────────────────────────────────────────
// SECTION 4: CLASS HOISTING
// ─────────────────────────────────────────────────────────────
// Classes ARE hoisted (like let) but NOT initialized → TDZ applies

// const p = new Person(); // ❌ ReferenceError: Cannot access 'Person' before initialization

class Person {
  constructor(name) {
    this.name = name;
  }
}

const p = new Person("Rohit"); // ✅ works
console.log(p.name); // "Rohit"

// ─────────────────────────────────────────────────────────────
// SECTION 5: HOISTING IN PRACTICE — COMMON BUGS
// ─────────────────────────────────────────────────────────────

// ── BUG 1: var in if block ─────────────────────────────────
function bugExample1() {
  if (true) {
    var x = 10; // var leaks OUT of the if block to function scope
  }
  console.log(x); // 10 ← var was hoisted to function top
}
bugExample1();

// Fix: use let
function fixedExample1() {
  if (true) {
    let x = 10; // block scoped
  }
  // console.log(x); // ❌ ReferenceError — block scoped, safe!
}
fixedExample1();

// ── BUG 2: var in loops ────────────────────────────────────
function bugExample2() {
  for (var i = 0; i < 3; i++) {}
  console.log(i); // 3 ← var leaks out of the loop
}
bugExample2();

function fixedExample2() {
  for (let i = 0; i < 3; i++) {}
  // console.log(i); // ❌ block scoped
}
fixedExample2();

// ── BUG 3: function overriding because of hoisting ─────────
function bugExample3() {
  function getValue() { return 1; }
  function getValue() { return 2; } // ← overrides the first one!
  console.log(getValue()); // 2 — both hoisted, second wins
}
bugExample3();

// ─────────────────────────────────────────────────────────────
// SECTION 6: HOISTING ORDER OF PRIORITY
// ─────────────────────────────────────────────────────────────
// When a function declaration and var have the SAME name:
// Function declaration wins!

console.log(typeof foo); // "function" (not undefined!)
var foo = "I am a variable";
function foo() { return "I am a function"; }
// Function declaration hoisted OVER var declaration

// ─────────────────────────────────────────────────────────────
// SECTION 7: VISUAL SUMMARY — WHAT GETS HOISTED HOW
// ─────────────────────────────────────────────────────────────
/*
  ┌──────────────────┬────────────┬─────────────────────┬──────────────────────┐
  │ Declaration Type │  Hoisted?  │   Initialized?      │  Access before decl  │
  ├──────────────────┼────────────┼─────────────────────┼──────────────────────┤
  │ var              │    YES     │  undefined           │  undefined (no error)│
  │ let              │    YES     │  NO (TDZ)            │  ReferenceError      │
  │ const            │    YES     │  NO (TDZ)            │  ReferenceError      │
  │ function decl.   │    YES     │  FULL (name + body)  │  Works perfectly ✅  │
  │ function expr.   │    YES*    │  undefined (var)     │  TypeError           │
  │ arrow function   │    YES*    │  NO (TDZ if let)     │  ReferenceError      │
  │ class            │    YES     │  NO (TDZ)            │  ReferenceError      │
  └──────────────────┴────────────┴─────────────────────┴──────────────────────┘
  * Only the variable binding is hoisted, not the function itself
*/

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is hoisting?
A: JS moves all variable/function DECLARATIONS to the top of their
   scope before execution. Assignments stay where they are.

Q: What is the Temporal Dead Zone (TDZ)?
A: The period between when a let/const variable is hoisted and when
   it's initialized. Accessing it during TDZ → ReferenceError.

Q: What's the difference between var and let hoisting?
A: var → hoisted AND initialized to undefined (no error)
   let  → hoisted BUT NOT initialized (TDZ → ReferenceError)

Q: Are function expressions hoisted?
A: The variable binding is hoisted (as undefined for var, TDZ for let)
   but the function value is NOT. Calling it before declaration
   gives TypeError (if var) or ReferenceError (if let/const).

Q: Which is hoisted first: var or function declaration?
A: Function declarations take priority over var declarations.

Q: Why should you avoid var?
A: var is function-scoped (not block-scoped), hoisted as undefined,
   and can cause bugs. Always use let/const instead.
*/
