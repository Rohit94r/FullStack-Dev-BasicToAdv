// ============================================================
// JAVASCRIPT BASICS — File 4: Functions
// Level: Beginner → Advanced → Interview Level
// ============================================================

// WHAT IS A FUNCTION?
// A function = a REUSABLE block of code with a name.
// You write it ONCE, use it MANY TIMES.
// Like a "recipe" — define once, cook anytime.

// ==========================================================
// SECTION 1: FUNCTION DECLARATION
// ==========================================================
// Syntax:
// function functionName(parameters) {
//   // body — code to run
//   return value; // optional
// }

// Define the function:
function greet(name) {
  // name is a PARAMETER (variable that receives the input)
  console.log(`Hello, ${name}!`);
  // This function returns nothing (returns undefined)
}

// CALL the function (also called "invoke"):
greet("Rohit");   // "Hello, Rohit!"
greet("Anna");    // "Hello, Anna!"
greet("World");   // "Hello, World!"
// "name" gets a new value each time you call

// Function with RETURN value:
function add(a, b) {
  return a + b; // sends the result back to the caller
  // code after return does NOT run
}

const sum = add(5, 3);        // 8 is returned and stored in 'sum'
console.log(sum);             // 8
console.log(add(10, 20));     // 30
console.log(add(1, 2) * 3);  // 9 — use return value directly in expressions

// Multiple return statements — only ONE can run:
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F"; // default if none above matched
}
console.log(getGrade(95)); // "A"
console.log(getGrade(72)); // "C"
console.log(getGrade(45)); // "F"

// ==========================================================
// SECTION 2: PARAMETERS AND ARGUMENTS
// ==========================================================
// Parameter = variable name in function DEFINITION
// Argument  = actual value passed when function is CALLED

function multiply(a, b) {    // a, b are PARAMETERS
  return a * b;
}
multiply(4, 5);              // 4, 5 are ARGUMENTS

// ── Default Parameters — value if argument not provided ───
function greetUser(name, greeting = "Hello") {
  // greeting defaults to "Hello" if not passed
  console.log(`${greeting}, ${name}!`);
}
greetUser("Rohit");              // "Hello, Rohit!"
greetUser("Anna", "Hi");         // "Hi, Anna!"
greetUser("Bob", "Good morning"); // "Good morning, Bob!"

// More default parameter examples:
function createPost(title, author = "Anonymous", published = false) {
  return { title, author, published };
}
console.log(createPost("My Story"));            // {title, author: "Anonymous", published: false}
console.log(createPost("Tech Blog", "Rohit"));  // {title, author: "Rohit", published: false}

// ── Rest Parameters (...args) — accept ANY number of args ─
function sumAll(...numbers) {
  // numbers is an ARRAY of all arguments passed
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}
console.log(sumAll(1, 2, 3));           // 6
console.log(sumAll(1, 2, 3, 4, 5));    // 15
console.log(sumAll(10));               // 10

// Rest parameter must be LAST:
function logWithPrefix(prefix, ...messages) {
  for (const msg of messages) {
    console.log(`[${prefix}] ${msg}`);
  }
}
logWithPrefix("INFO", "Server started", "Port 3000", "Ready");
// [INFO] Server started
// [INFO] Port 3000
// [INFO] Ready

// ── Extra Arguments — JS doesn't error if you pass too many
function strictAdd(a, b) {
  return a + b;
}
console.log(strictAdd(1, 2, 100, 200)); // 3 — extra args ignored!
console.log(strictAdd(1));              // NaN — 1 + undefined = NaN

// ==========================================================
// SECTION 3: FUNCTION EXPRESSION
// ==========================================================
// Assign function to a variable.
// NOT hoisted (unlike function declarations)!

const square = function(n) {
  return n * n;
};

console.log(square(4));  // 16
console.log(square(9));  // 81

// Named function expression (rare, useful for recursion/debugging)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // can call itself by name
};
console.log(factorial(5)); // 120

// ==========================================================
// SECTION 4: ARROW FUNCTIONS — Modern & Concise Syntax
// ==========================================================
// Shorter syntax for function expressions.
// DIFFERENT behavior for 'this' (explained in advanced files).

// Syntax: (parameters) => { body }
// or shorter forms:

// Multi-line body:
const greetArrow = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};
console.log(greetArrow("Rohit")); // "Hello, Rohit!"

// Single expression — return is IMPLICIT (no braces, no return keyword):
const double  = (n) => n * 2;         // parentheses optional for ONE param
const triple  = n => n * 3;           // no parens for single parameter
const addTwo  = (a, b) => a + b;      // two parameters — parens required

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(addTwo(3, 7)); // 10

// No parameters — use empty parens:
const greetWorld = () => "Hello, World!";
console.log(greetWorld()); // "Hello, World!"

// Return an OBJECT — wrap in parentheses to avoid confusion with body:
const makeUser = (name, age) => ({ name, age }); // ({ }) not { }!
console.log(makeUser("Rohit", 25)); // { name: "Rohit", age: 25 }

// Arrow function with logic:
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
console.log(clamp(5, 1, 10));   // 5  — in range
console.log(clamp(-5, 1, 10));  // 1  — below min
console.log(clamp(15, 1, 10));  // 10 — above max

// ==========================================================
// SECTION 5: FUNCTION AS FIRST-CLASS CITIZENS
// ==========================================================
// In JavaScript, functions are VALUES just like numbers or strings.
// You can: pass functions as arguments, return functions, store in variables.

// ── Function as argument (callback) ──────────────────────
function doTwice(fn) {
  fn(); // call the function passed in
  fn(); // call it again
}

function sayHi() {
  console.log("Hi!");
}

doTwice(sayHi); // passes sayHi as argument — prints "Hi!" twice

// With arrow function inline (anonymous function):
doTwice(() => console.log("Hello!")); // "Hello!" twice

// ── Callback function — function called after another finishes
function fetchData(url, onSuccess, onError) {
  // Simulate async operation
  const success = url.includes("valid");
  if (success) {
    onSuccess({ data: "result from " + url });
  } else {
    onError(new Error("Failed to fetch"));
  }
}

fetchData(
  "valid/api/users",
  (result) => console.log("Success:", result.data),  // callback
  (error)  => console.error("Error:", error.message)
);
// Success: result from valid/api/users

// ── Function returning a function ─────────────────────────
function makeMultiplier(multiplier) {
  // Returns a NEW function that uses 'multiplier'
  return function(number) {
    return number * multiplier;
  };
}

const double2 = makeMultiplier(2);  // function that doubles
const triple2 = makeMultiplier(3);  // function that triples

console.log(double2(5));   // 10
console.log(triple2(5));   // 15
console.log(double2(12));  // 24

// ==========================================================
// SECTION 6: SCOPE — Where Can Variables Be Accessed?
// ==========================================================
// Scope determines WHERE a variable is visible/accessible.
// (Detailed file in advanced folder — this is just the basics)

// ── Global scope — accessible everywhere
const globalVar = "I'm global";

function showGlobal() {
  console.log(globalVar); // ✅ can access global variable
}
showGlobal();

// ── Function scope — only inside the function
function myFunction() {
  const localVar = "I'm local";
  console.log(localVar); // ✅ works inside function
}
// console.log(localVar); // ❌ ReferenceError — not accessible outside

// ── Block scope — only inside { }
{
  let blockVar = "I'm block scoped";
  console.log(blockVar); // ✅ works here
}
// console.log(blockVar); // ❌ not accessible outside the block

// ── Lexical scope — child function can see parent's variables
function outer() {
  const outerVar = "outer";

  function inner() {
    console.log(outerVar); // ✅ inner can see outer's variable
  }

  inner();
}
outer(); // "outer"

// ==========================================================
// SECTION 7: IMMEDIATELY INVOKED FUNCTION EXPRESSION (IIFE)
// ==========================================================
// Function that runs IMMEDIATELY after being defined.
// Creates its own scope — variables inside don't pollute global.

(function() {
  const secret = "I'm private";
  console.log("IIFE ran! Secret:", secret);
})();

// Arrow IIFE:
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with argument:
((name) => {
  console.log(`Hello ${name} from IIFE`);
})("Rohit");

// ==========================================================
// SECTION 8: RECURSION — Function calling itself
// ==========================================================
// A recursive function calls ITSELF.
// Must have: base case (stop condition) + recursive case.

// Countdown:
function countdown(n) {
  if (n <= 0) {   // BASE CASE — stop recursion
    console.log("Done!");
    return;
  }
  console.log(n);
  countdown(n - 1); // RECURSIVE CALL — calls itself with smaller n
}
countdown(5); // 5, 4, 3, 2, 1, Done!

// Factorial: n! = n * (n-1) * (n-2) * ... * 1
// 5! = 5 * 4 * 3 * 2 * 1 = 120
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);  // recursive case
}
console.log(factorial(5)); // 120

// Sum of array with recursion:
function sumArray(arr) {
  if (arr.length === 0) return 0;            // base case: empty array
  return arr[0] + sumArray(arr.slice(1));   // first + rest
}
console.log(sumArray([1, 2, 3, 4, 5])); // 15

// Fibonacci:
// 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
// Each number = sum of previous two
function fibonacci(n) {
  if (n <= 0) return 0;      // base case
  if (n === 1) return 1;     // base case
  return fibonacci(n - 1) + fibonacci(n - 2); // recursive case
}
console.log(fibonacci(10)); // 55

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between function declaration and function expression?
  A: Declaration: function foo() {} → hoisted (usable before definition)
     Expression:  const foo = function() {} → NOT hoisted (must define first)
     Arrow:       const foo = () => {} → NOT hoisted, no own 'this'

  Q: What is the difference between parameters and arguments?
  A: Parameters → variables in function DEFINITION: function add(a, b)
     Arguments  → actual values when CALLING: add(5, 10)

  Q: What are rest parameters?
  A: ...args collects all remaining arguments into an ARRAY.
     function sum(...nums) → nums is an array of all passed values.
     Must be the LAST parameter.

  Q: What is a callback function?
  A: A function passed as an argument to another function,
     to be called later (after some operation completes).
     setTimeout(callback, 1000) — callback runs after 1 second.

  Q: What are arrow functions and how are they different?
  A: Shorter syntax. Key differences:
     1. No own 'this' (uses surrounding lexical this)
     2. Cannot be used as constructors (no new)
     3. No arguments object (use ...args instead)
     4. Implicit return for single expressions

  Q: What is recursion and what is a base case?
  A: Recursion = function calling itself.
     Base case = the STOPPING condition that prevents infinite recursion.
     Without a base case → stack overflow error (infinite calls).

  Q: What is an IIFE?
  A: Immediately Invoked Function Expression.
     Defines AND calls a function at the same time.
     Creates isolated scope — variables inside don't affect global scope.
*/
