// ============================================================
// DAY 1 — JavaScript: CLOSURES & SCOPE
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: SCOPE
// ─────────────────────────────────────────────────────────────
// Scope = where a variable is ACCESSIBLE (visible) in your code.
// JavaScript has 4 types of scope:
//   1. Global Scope
//   2. Function Scope
//   3. Block Scope   (ES6: let / const)
//   4. Lexical Scope (child can see parent's variables)

// ── 1A. GLOBAL SCOPE ──────────────────────────────────────────
var globalVar = "I am global";  // accessible EVERYWHERE
let globalLet = "Also global";  // but prefer let/const over var

function readGlobal() {
  console.log(globalVar); // ✅ works — function can read global
}
readGlobal(); // "I am global"

// ── 1B. FUNCTION SCOPE ────────────────────────────────────────
// Variables declared with var/let/const inside a function
// are ONLY accessible inside that function.
function functionScope() {
  var localVar = "only inside here";
  let localLet = "also only inside";
  console.log(localVar); // ✅ works
}
// console.log(localVar); // ❌ ReferenceError — localVar is not defined

// ── 1C. BLOCK SCOPE ───────────────────────────────────────────
// let and const are block-scoped (inside { })
// var is NOT block-scoped — it leaks out of blocks!
{
  let blockLet = "block scoped";
  var blockVar = "NOT block scoped — I leak!";
  console.log(blockLet); // ✅ works
}
// console.log(blockLet); // ❌ ReferenceError
console.log(blockVar);   // ✅ "NOT block scoped — I leak!" ← dangerous!

// Real example of var leaking from a loop:
for (var i = 0; i < 3; i++) {
  // i is accessible outside this loop because var is function-scoped
}
console.log(i); // 3 ← var leaked out!

for (let j = 0; j < 3; j++) {
  // j is block-scoped to the for loop
}
// console.log(j); // ❌ ReferenceError — j is block scoped

// ── 1D. LEXICAL SCOPE ─────────────────────────────────────────
// A function defined INSIDE another function can access
// the outer function's variables. This is Lexical Scope.
// "Lexical" means: determined by WHERE you write the code (not where it runs).

function outer() {
  let outerVar = "I am from outer";

  function inner() {
    // inner can see outerVar because it's defined INSIDE outer
    console.log(outerVar); // ✅ "I am from outer"
  }

  inner();
}
outer();

// ─────────────────────────────────────────────────────────────
// SECTION 2: CLOSURES
// ─────────────────────────────────────────────────────────────
// CLOSURE = A function that REMEMBERS its outer scope
//           even after the outer function has RETURNED.
//
// Every function in JS is a closure — it keeps a reference
// to the variables in the scope where it was created.
//
// Simple definition: Inner function + Outer scope variables = CLOSURE

// ── 2A. BASIC CLOSURE ─────────────────────────────────────────
function makeGreeting(name) {
  // 'name' is in makeGreeting's scope
  return function () {
    // This returned function CLOSES OVER 'name'
    // Even after makeGreeting finishes, 'name' is remembered
    console.log(`Hello, ${name}!`);
  };
}

const greetRohit = makeGreeting("Rohit"); // makeGreeting finishes here
const greetAnna  = makeGreeting("Anna");

greetRohit(); // "Hello, Rohit!" ← still remembers 'name'
greetAnna();  // "Hello, Anna!"  ← different closure, different 'name'

// ── 2B. CLOSURE AS COUNTER (Classic Interview Question) ────────
function makeCounter() {
  let count = 0; // private variable — not accessible outside

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 2
// console.log(count); // ❌ ReferenceError — count is private!

// ── 2C. CLOSURE IN LOOPS — CLASSIC INTERVIEW TRAP ──────────────
// Problem: var shares the same binding across all iterations
console.log("--- var loop trap ---");
for (var k = 0; k < 3; k++) {
  setTimeout(function () {
    console.log(k); // prints 3, 3, 3 — NOT 0, 1, 2!
  }, 100);
}
// Why? var k is shared. By the time setTimeout fires, loop is done → k = 3

// Fix 1: use let (creates a new binding per iteration)
console.log("--- let fix ---");
for (let m = 0; m < 3; m++) {
  setTimeout(function () {
    console.log(m); // ✅ prints 0, 1, 2
  }, 200);
}

// Fix 2: use IIFE (Immediately Invoked Function Expression)
console.log("--- IIFE fix ---");
for (var n = 0; n < 3; n++) {
  (function (capturedN) {
    setTimeout(function () {
      console.log(capturedN); // ✅ prints 0, 1, 2
    }, 300);
  })(n);
}

// ── 2D. PRACTICAL CLOSURE: DATA PRIVACY / ENCAPSULATION ────────
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private — cannot be accessed directly

  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      console.log(`Deposited ${amount}. Balance: ${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log("Insufficient funds");
        return;
      }
      balance -= amount;
      console.log(`Withdrew ${amount}. Balance: ${balance}`);
    },
    getBalance() {
      return balance; // controlled access
    },
  };
}

const myAccount = createBankAccount(1000);
myAccount.deposit(500);   // Deposited 500. Balance: 1500
myAccount.withdraw(200);  // Withdrew 200.  Balance: 1300
console.log(myAccount.getBalance()); // 1300
// myAccount.balance; // ❌ undefined — truly private!

// ── 2E. CLOSURE: MEMOIZATION (Advanced Interview Topic) ─────────
// Memoization = cache expensive function results using closures
function memoize(fn) {
  const cache = {}; // closure variable — persists across calls

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log("Cache hit for:", key);
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

function slowSquare(n) {
  // Imagine this is a heavy computation
  return n * n;
}

const memoizedSquare = memoize(slowSquare);
console.log(memoizedSquare(5)); // computes: 25
console.log(memoizedSquare(5)); // Cache hit: 25 (no recomputation)
console.log(memoizedSquare(6)); // computes: 36

// ── 2F. CLOSURE: PARTIAL APPLICATION ───────────────────────────
// Create a new function with some arguments pre-filled
function multiply(a, b) {
  return a * b;
}

function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const double  = partial(multiply, 2); // presets a = 2
const triple  = partial(multiply, 3); // presets a = 3

console.log(double(5));  // 10
console.log(triple(5));  // 15

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is a closure?
A: A function that retains access to its outer (lexical) scope
   even after the outer function has returned.

Q: What is the difference between var, let, const scope?
A: var  → function-scoped (leaks out of blocks/loops)
   let  → block-scoped (safe, preferred)
   const → block-scoped + cannot be reassigned

Q: Why does var in a loop not work with setTimeout?
A: var is function-scoped and shared. When callbacks fire,
   the loop is already done and var holds the final value.
   Fix: use let (new binding per iteration) or IIFE.

Q: What is lexical scope?
A: Scope is determined by WHERE the function is written,
   not where it's called.

Q: Can you create private variables in JS without classes?
A: Yes! Using closures — declare var inside function,
   return only methods that access it.

Q: What is a practical use of closures?
A: 1. Data encapsulation/privacy
   2. Factory functions (makeCounter, makeGreeting)
   3. Memoization
   4. Partial application / Currying
   5. Event handlers that remember state
*/
