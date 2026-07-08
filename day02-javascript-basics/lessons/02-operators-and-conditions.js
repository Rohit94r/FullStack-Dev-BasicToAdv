// ============================================================
// JAVASCRIPT BASICS — File 2: Operators & Conditions
// Level: Absolute Beginner → Intermediate
// ============================================================

// ==========================================================
// SECTION 1: ARITHMETIC OPERATORS — Math Operations
// ==========================================================
console.log("=== Arithmetic ===");

const a = 10;
const b = 3;

console.log(a + b);   // 13  — addition
console.log(a - b);   // 7   — subtraction
console.log(a * b);   // 30  — multiplication
console.log(a / b);   // 3.333... — division
console.log(a % b);   // 1   — modulus (REMAINDER after division) — very useful!
console.log(a ** b);  // 1000 — exponentiation (10 to the power 3)
console.log(Math.floor(a / b)); // 3 — integer division (use Math.floor)

// Modulus use cases:
// Check if even: num % 2 === 0
// Check if odd:  num % 2 !== 0
// Limit range:   index % arr.length (wraps around)
console.log(10 % 2); // 0 → even
console.log(7  % 2); // 1 → odd

// ==========================================================
// SECTION 2: ASSIGNMENT OPERATORS
// ==========================================================
console.log("=== Assignment ===");

let x = 10;

x += 5;   // same as: x = x + 5  → 15
console.log("+=", x); // 15

x -= 3;   // same as: x = x - 3  → 12
console.log("-=", x); // 12

x *= 2;   // same as: x = x * 2  → 24
console.log("*=", x); // 24

x /= 4;   // same as: x = x / 4  → 6
console.log("/=", x); // 6

x %= 4;   // same as: x = x % 4  → 2
console.log("%=", x); // 2

x **= 3;  // same as: x = x ** 3 → 8
console.log("**=", x); // 8

// Increment and Decrement
let count = 5;
count++;      // count = count + 1 → 6 (post-increment)
console.log(count); // 6

count--;      // count = count - 1 → 5 (post-decrement)
console.log(count); // 5

++count;      // same as count++ but increment happens FIRST
--count;      // same as count-- but decrement happens FIRST

// Pre vs Post increment difference:
let y = 5;
console.log(y++); // prints 5 (THEN increments to 6)
console.log(y);   // 6 — now it's 6

let z = 5;
console.log(++z); // increments to 6 THEN prints 6
console.log(z);   // 6

// ==========================================================
// SECTION 3: COMPARISON OPERATORS — Returns true or false
// ==========================================================
console.log("=== Comparison ===");

console.log(5 > 3);    // true  — greater than
console.log(5 < 3);    // false — less than
console.log(5 >= 5);   // true  — greater than OR equal
console.log(5 <= 4);   // false — less than OR equal

// == vs === (VERY IMPORTANT!)
// == (loose)  → converts types then compares VALUES
// === (strict) → compares TYPE and VALUE (NO conversion) ← use this!
console.log(5 == "5");   // true  ← type converted, then compared
console.log(5 === "5");  // false ← different types (number vs string)
console.log(5 === 5);    // true  ← same type and same value
console.log(0 == false); // true  ← false converts to 0
console.log(0 === false);// false ← number !== boolean
console.log(null == undefined);  // true  (special case)
console.log(null === undefined); // false (different types)

// != vs !== (same concept for NOT equal)
console.log(5 != "5");   // false — loose: they're "equal"
console.log(5 !== "5");  // true  — strict: different types

// ==========================================================
// SECTION 4: LOGICAL OPERATORS
// ==========================================================
console.log("=== Logical ===");

// && (AND) — BOTH must be true
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

// || (OR) — AT LEAST ONE must be true
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false

// ! (NOT) — flips boolean
console.log(!true);    // false
console.log(!false);   // true
console.log(!0);       // true  (0 is falsy, !falsy = true)
console.log(!"");      // true  (empty string is falsy)
console.log(!"hello"); // false (non-empty string is truthy)
console.log(!!42);     // true  (!! converts any value to boolean)

// Short-circuit evaluation — JavaScript is LAZY
// && stops at first FALSY value (or returns last truthy)
// || stops at first TRUTHY value (or returns last falsy)

console.log(false && console.log("never runs")); // false (stops at false)
console.log(true  && "second operand");          // "second operand"
console.log(false || "fallback");                // "fallback"
console.log("first" || "second");               // "first"
console.log(null || "default");                  // "default" (null is falsy)
console.log(0 || 42);                            // 42 (0 is falsy)

// ── Nullish Coalescing (??) — only checks null/undefined ─
// Unlike ||, it doesn't treat 0 or "" as "no value"
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");         // 0 (not null/undefined!)
console.log("" ?? "default");        // "" (not null/undefined!)
console.log(false ?? "default");     // false (not null/undefined!)

// USE CASE: default values
const userTheme = null;
const theme = userTheme ?? "light"; // "light" if userTheme is null/undefined
console.log(theme); // "light"

const volume = 0;
const safeVol = volume ?? 50;    // 0 (not null, so 0 is used!)
const badSafe = volume || 50;    // 50 (|| treats 0 as falsy — wrong!)
console.log(safeVol); // 0 ← correct
console.log(badSafe); // 50 ← incorrect if 0 was intentional

// ==========================================================
// SECTION 5: IF / ELSE — Making Decisions
// ==========================================================
console.log("=== If / Else ===");

const temperature = 28; // degrees Celsius

// Basic if
if (temperature > 30) {
  console.log("It's hot outside!");
}

// if + else
if (temperature > 30) {
  console.log("Hot");
} else {
  console.log("Not hot"); // prints this
}

// if + else if + else (chain)
if (temperature >= 35) {
  console.log("Very hot!");
} else if (temperature >= 25) {
  console.log("Warm."); // prints this (28 >= 25)
} else if (temperature >= 15) {
  console.log("Cool.");
} else {
  console.log("Cold!");
}

// Nested if
const isRaining = false;
if (temperature > 25) {
  if (isRaining) {
    console.log("Warm but raining — take an umbrella.");
  } else {
    console.log("Great weather! Go outside."); // prints this
  }
}

// ==========================================================
// SECTION 6: TERNARY OPERATOR — One-line if/else
// ==========================================================
// Syntax: condition ? valueIfTrue : valueIfFalse

const userAge = 20;
const status = userAge >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Useful in template literals
const isOnline = true;
console.log(`User is ${isOnline ? "online" : "offline"}`);

// Use in assignments
const discount = userAge >= 60 ? 0.2 : 0;  // 20% discount for seniors

// Nested ternary (avoid making it too complex — use if/else instead)
const score = 85;
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : score >= 60 ? "D"
            : "F";
console.log("Grade:", grade); // "B"

// ==========================================================
// SECTION 7: SWITCH STATEMENT — Multiple specific values
// ==========================================================
// Use switch when checking ONE variable against MANY specific values.
// Cleaner than many else-if chains for specific values.

const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;   // ← IMPORTANT! Without break, falls through to next case!
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
    console.log("Middle of work week"); // handles 3 days
    break;
  case "Friday":
    console.log("TGIF!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Not a valid day"); // fallback — like else
}

// What happens WITHOUT break (fall-through):
const num = 1;
switch (num) {
  case 1:
    console.log("One");   // prints
    // NO BREAK → falls through!
  case 2:
    console.log("Two");   // ALSO prints (unintentional fall-through)
  case 3:
    console.log("Three"); // ALSO prints!
    break;
  case 4:
    console.log("Four");  // doesn't print (stopped by break above)
}
// Output: One, Two, Three — ALL ran because no break after case 1!

// Intentional fall-through (document it!):
function getQuarterName(month) {
  switch (month) {
    case 1:
    case 2:
    case 3:
      return "Q1";  // return also works instead of break
    case 4:
    case 5:
    case 6:
      return "Q2";
    case 7:
    case 8:
    case 9:
      return "Q3";
    case 10:
    case 11:
    case 12:
      return "Q4";
    default:
      return "Invalid month";
  }
}
console.log(getQuarterName(8));  // "Q3"

// ==========================================================
// SECTION 8: OPTIONAL CHAINING (?.) — Safe Property Access
// ==========================================================
// Access nested properties without crashing if one is null/undefined

const user = {
  name: "Rohit",
  address: {
    city: "Mumbai",
    zip: "400001"
  }
};

// Without optional chaining — can crash:
// console.log(user.phone.number); // ❌ TypeError: Cannot read 'number' of undefined

// With optional chaining — safe:
console.log(user.address?.city);        // "Mumbai"
console.log(user.address?.country);     // undefined (no crash!)
console.log(user.phone?.number);        // undefined (no crash!)
console.log(user.profile?.avatar?.url); // undefined (no crash!)

// Combine with nullish coalescing for defaults:
const city = user.address?.city ?? "Unknown city";
const phone = user.phone?.number ?? "No phone";
console.log(city);  // "Mumbai"
console.log(phone); // "No phone"

// Optional chaining with methods:
const arr = null;
console.log(arr?.map(x => x * 2));  // undefined (no crash!)

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between == and ===?
  A: == (loose equality)  → converts types before comparing. "5" == 5 is TRUE.
     === (strict equality) → no type conversion. "5" === 5 is FALSE.
     Always use === to avoid unexpected bugs.

  Q: What is short-circuit evaluation?
  A: && evaluates left side first. If falsy, STOPS and returns left value.
     || evaluates left side first. If truthy, STOPS and returns left value.
     Used for: default values, conditional execution, guard clauses.

  Q: What is the difference between || and ??
  A: || → treats ALL falsy values as "no value" (false, 0, "", null, undefined, NaN)
     ?? → ONLY treats null and undefined as "no value"
     Use ?? when 0 or "" are valid values!

  Q: What does the ternary operator do?
  A: A compact if/else for simple cases.
     condition ? valueIfTrue : valueIfFalse
     Good for: assignments, template literals, simple conditions.
     Don't nest too deeply — use if/else for complex logic.

  Q: When to use switch vs if/else?
  A: switch → when checking ONE value against MANY specific exact values
     if/else → for ranges, conditions, complex expressions
     switch is more readable for 4+ specific value checks.

  Q: What is optional chaining?
  A: user?.address?.city safely accesses nested properties.
     Returns undefined instead of throwing TypeError if any link is null/undefined.
     Use when data might be missing or incomplete.
*/
