// ============================================================
// JAVASCRIPT BASICS — File 3: Loops
// Level: Beginner → Intermediate → Interview Level
// ============================================================

// WHAT IS A LOOP?
// A loop runs the SAME code MULTIPLE TIMES.
// Instead of writing: console.log(1); console.log(2); console.log(3)...
// You write a loop that does it automatically.

// ==========================================================
// SECTION 1: FOR LOOP — when you know how many times
// ==========================================================
// Syntax:
// for (initialization; condition; update) {
//   code to run each iteration
// }
// 1. initialization → runs ONCE at start (let i = 0)
// 2. condition      → checked BEFORE each iteration (i < 5)
// 3. code runs      → if condition is true
// 4. update         → runs AFTER each iteration (i++)
// 5. repeat from 2

console.log("=== Basic for loop ===");
for (let i = 0; i < 5; i++) {
  console.log(`Iteration ${i}`);
}
// Prints: Iteration 0, Iteration 1, Iteration 2, Iteration 3, Iteration 4

// Count UP (0 to 9)
for (let i = 0; i <= 9; i++) {
  process.stdout.write(i + " "); // print without newline
}
console.log(); // newline after: 0 1 2 3 4 5 6 7 8 9

// Count DOWN (5 to 1)
for (let i = 5; i >= 1; i--) {
  process.stdout.write(i + " ");
}
console.log(); // 5 4 3 2 1

// Count by steps of 2 (even numbers)
for (let i = 0; i <= 10; i += 2) {
  process.stdout.write(i + " ");
}
console.log(); // 0 2 4 6 8 10

// ── Loop through an ARRAY ─────────────────────────────────
const fruits = ["apple", "banana", "cherry", "date"];

for (let i = 0; i < fruits.length; i++) {
  console.log(`${i}: ${fruits[i]}`);
}
// 0: apple, 1: banana, 2: cherry, 3: date

// ── Nested loops — loop inside a loop ─────────────────────
// Use case: multiplication table, 2D grids, nested data
console.log("=== Multiplication Table (3x3) ===");
for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 3; col++) {
    process.stdout.write(`${row * col}\t`); // \t = tab
  }
  console.log(); // new line after each row
}
// 1   2   3
// 2   4   6
// 3   6   9

// ==========================================================
// SECTION 2: WHILE LOOP — when condition determines when to stop
// ==========================================================
// Use when you don't know exactly how many iterations upfront.
// Checks condition BEFORE each iteration.

console.log("=== while loop ===");
let count = 1;
while (count <= 5) {
  console.log(`Count: ${count}`);
  count++; // MUST change something or you get infinite loop!
}

// Common use case: keep asking until valid input
// (in Node.js this would use readline, here we simulate)
let userInput = "invalid";
let attempts  = 0;
while (userInput !== "quit" && attempts < 3) {
  console.log(`Attempt ${attempts + 1}: invalid input`);
  attempts++;
  if (attempts === 3) userInput = "quit"; // simulate getting right input
}

// Another use case: process until condition met
let number = 1;
while (number < 100) {
  number *= 2; // keep doubling
}
console.log("First power of 2 >= 100:", number); // 128

// ==========================================================
// SECTION 3: DO...WHILE — runs AT LEAST ONCE
// ==========================================================
// Checks condition AFTER running.
// Even if condition is false, code runs once first.

console.log("=== do...while ===");
let i = 0;
do {
  console.log(`do-while: ${i}`);
  i++;
} while (i < 3);
// Prints: 0, 1, 2

// DIFFERENCE: if condition starts false:
let x = 10;

// while: never runs (10 < 5 is false from the start)
while (x < 5) {
  console.log("while: this never prints");
}

// do-while: runs ONCE even though condition is false
do {
  console.log("do-while: runs once even though x >= 5"); // prints once
} while (x < 5);

// ==========================================================
// SECTION 4: FOR...OF — loop over ITERABLE values
// ==========================================================
// Cleaner way to loop through arrays, strings, Maps, Sets.
// Gets the VALUE directly (not the index).

console.log("=== for...of ===");

// Loop over ARRAY values
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color); // red, green, blue
}

// Loop with index using entries():
for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`); // 0: red, 1: green, 2: blue
}

// Loop over a STRING (iterates each character)
for (const char of "Hello") {
  process.stdout.write(char + "-"); // H-e-l-l-o-
}
console.log();

// Loop over a Set (unique values)
const uniqueNums = new Set([1, 2, 3, 2, 1]); // {1, 2, 3}
for (const num of uniqueNums) {
  console.log(num); // 1, 2, 3
}

// Loop over a Map
const userMap = new Map([["name", "Rohit"], ["age", 25]]);
for (const [key, value] of userMap) {
  console.log(`${key}: ${value}`); // name: Rohit, age: 25
}

// ==========================================================
// SECTION 5: FOR...IN — loop over OBJECT KEYS
// ==========================================================
// Use for plain objects. Gets KEYS (property names).
// AVOID for arrays (use for...of instead).

console.log("=== for...in ===");

const person = {
  name: "Rohit",
  age: 25,
  city: "Mumbai",
  isStudent: false,
};

for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
// name: Rohit, age: 25, city: Mumbai, isStudent: false

// Check if property is own (not inherited):
for (const key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key, "=", person[key]);
  }
}

// ==========================================================
// SECTION 6: BREAK and CONTINUE
// ==========================================================

// ── break — EXIT the loop immediately ─────────────────────
console.log("=== break ===");

// Find first even number greater than 5
for (let n = 0; n < 20; n++) {
  if (n > 5 && n % 2 === 0) {
    console.log("Found:", n); // Found: 6
    break; // stop the loop — don't check remaining numbers
  }
}

// Break in while loop
let attempts = 0;
while (true) { // infinite loop! — must break out manually
  attempts++;
  console.log("Attempt:", attempts);
  if (attempts >= 3) break; // exit after 3 attempts
}

// ── continue — SKIP current iteration, move to next ───────
console.log("=== continue ===");

// Print only odd numbers
for (let n = 1; n <= 10; n++) {
  if (n % 2 === 0) continue; // skip even numbers
  process.stdout.write(n + " ");
}
console.log(); // 1 3 5 7 9

// Skip "invalid" items in array
const items = ["apple", null, "banana", undefined, "cherry", ""];
for (const item of items) {
  if (!item) continue; // skip falsy values (null, undefined, "")
  console.log("Valid item:", item);
}

// ── Labeled loops — break/continue nested loops ───────────
// Break out of OUTER loop from inside inner loop
outer: for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 1 && c === 1) {
      console.log(`Breaking at [${r}][${c}]`);
      break outer; // breaks the OUTER loop (not just inner)
    }
    process.stdout.write(`[${r}][${c}] `);
  }
}
console.log();
// [0][0] [0][1] [0][2] [1][0] Breaking at [1][1]

// ==========================================================
// SECTION 7: PRACTICAL LOOP EXAMPLES
// ==========================================================

// ── Sum of array ──────────────────────────────────────────
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = 0;
for (const num of numbers) {
  sum += num;
}
console.log("Sum:", sum); // 55

// ── Find max value ────────────────────────────────────────
const values = [3, 7, 2, 9, 4, 1, 8];
let max = values[0]; // start with first element
for (const val of values) {
  if (val > max) max = val;
}
console.log("Max:", max); // 9

// ── Count occurrences ─────────────────────────────────────
const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const wordCount = {};
for (const word of words) {
  wordCount[word] = (wordCount[word] || 0) + 1;
}
console.log(wordCount); // { apple: 3, banana: 2, cherry: 1 }

// ── Filter without .filter() ─────────────────────────────
const scores = [45, 78, 23, 91, 65, 88, 12];
const passing = [];
for (const s of scores) {
  if (s >= 60) passing.push(s);
}
console.log("Passing scores:", passing); // [78, 91, 65, 88]

// ── FizzBuzz — classic interview question! ────────────────
// Print numbers 1-20. If divisible by 3: "Fizz".
// If by 5: "Buzz". If by both: "FizzBuzz". Else: the number.
console.log("=== FizzBuzz ===");
for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0)     console.log("FizzBuzz");  // divisible by both 3 and 5
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else                  console.log(i);
}

// ── Build string patterns ─────────────────────────────────
// Triangle pattern:
console.log("=== Triangle ===");
for (let row = 1; row <= 5; row++) {
  console.log("*".repeat(row)); // *, **, ***, ****, *****
}

// Reverse triangle:
for (let row = 5; row >= 1; row--) {
  console.log("*".repeat(row)); // *****, ****, ***, **, *
}

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between for, for...of, and for...in?
  A: for      → classic loop with index, condition, update. Use for arrays with index.
     for...of → iterates VALUES of any iterable (array, string, Set, Map).
     for...in → iterates KEYS of an object. Don't use for arrays.

  Q: What is the difference between break and continue?
  A: break    → EXIT the loop completely, move on after the loop.
     continue → SKIP current iteration, move to next iteration.

  Q: What is an infinite loop and how do you avoid it?
  A: Loop that never stops (condition never becomes false).
     Avoid by ensuring: loop variable changes, condition can become false,
     or break is reachable.

  Q: When do you use while vs for?
  A: for   → when you know the NUMBER of iterations upfront.
     while → when iterations depend on a CONDITION (don't know count).

  Q: What does do...while guarantee?
  A: The code block runs AT LEAST ONCE, even if condition is false.
     Useful for: menus (show menu first, then check if user wants to exit).

  Q: How do you exit multiple nested loops?
  A: Use labeled break: label: for(...) { for(...) { break label; } }
     Or restructure into functions using return.
*/
