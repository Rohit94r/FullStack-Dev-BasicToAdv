// ============================================================
// JAVASCRIPT BASICS — File 7: Modern ES6+ Features
// Level: Intermediate → Interview Level
// These are the features you'll use EVERY DAY in modern JS/React/Node
// ============================================================

// ==========================================================
// SECTION 1: TEMPLATE LITERALS (backticks)
// ==========================================================

const name = "Rohit";
const score = 95.5;

// Old way (ugly string concatenation):
console.log("Hello, " + name + "! Your score is " + score + ".");

// Template literal (modern, clean):
console.log(`Hello, ${name}! Your score is ${score}.`);

// Expressions inside ${}:
console.log(`${name.toUpperCase()} scored ${score > 90 ? "excellent" : "good"}`);
console.log(`Sum: ${5 + 10 * 2}`);          // expressions

// Multi-line strings (no \n needed!):
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Score: ${score}</p>
  </div>
`;

// Tagged template literals (advanced):
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `[${values[i]}]` : "");
  }, "");
}
console.log(highlight`Hello ${name}, your score is ${score}!`);
// "Hello [Rohit], your score is [95.5]!"

// ==========================================================
// SECTION 2: DESTRUCTURING (revisited with more patterns)
// ==========================================================

// ── Array destructuring with rest ─────────────────────────
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// ── Object destructuring in function parameters ────────────
function processUser({ name, age, role = "user" }) {
  return `${name} (${age}) — role: ${role}`;
}
console.log(processUser({ name: "Rohit", age: 25, role: "admin" }));
console.log(processUser({ name: "Anna", age: 30 })); // uses default role

// ── Nested destructuring ──────────────────────────────────
const { address: { city, country = "India" } } = {
  address: { city: "Mumbai" }
};
console.log(city, country); // "Mumbai" "India"

// ==========================================================
// SECTION 3: SPREAD OPERATOR (...)
// ==========================================================

// ── Spread in arrays ──────────────────────────────────────
const a = [1, 2, 3];
const b = [4, 5, 6];
const combined = [...a, ...b];            // [1,2,3,4,5,6]
const withExtra = [...a, 99, ...b];       // [1,2,3,99,4,5,6]
const copy      = [...a];                  // shallow copy of a

// Pass array as arguments:
function addThree(x, y, z) { return x + y + z; }
const nums = [1, 2, 3];
console.log(addThree(...nums)); // 6 — spread as arguments

// ── Spread in objects ─────────────────────────────────────
const defaults = { theme: "light", lang: "en", fontSize: 16 };
const overrides = { theme: "dark", fontSize: 20 };
const settings  = { ...defaults, ...overrides }; // later wins on conflict
console.log(settings); // { theme: "dark", lang: "en", fontSize: 20 }

// Clone + add:
const user = { name: "Rohit", age: 25 };
const admin = { ...user, role: "admin", permissions: ["read", "write", "delete"] };

// ==========================================================
// SECTION 4: REST PARAMETERS vs SPREAD
// ==========================================================
// They look the same (...) but work DIFFERENTLY:
// REST    → collects many into one (in function DEFINITION)
// SPREAD  → expands one into many (when CALLING functions or in arrays)

// Rest: collecting arguments
function sum(...numbers) {       // REST — collects all args into array
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Spread: expanding array
console.log(Math.max(...[3, 7, 1, 9, 4])); // 9 — SPREAD array into args

// ==========================================================
// SECTION 5: SHORT-CIRCUIT AND LOGICAL ASSIGNMENT
// ==========================================================

// Logical OR assignment (||=) — assign if currently falsy
let config1 = { theme: null };
config1.theme ||= "light"; // if theme is falsy, set to "light"
console.log(config1.theme); // "light"

// Logical AND assignment (&&=) — assign if currently truthy
let user2 = { name: "Rohit", active: true };
user2.active &&= false; // only update if currently truthy
console.log(user2.active); // false

// Logical nullish assignment (??=) — assign if null/undefined
let preference = { lang: null, fontSize: 0 };
preference.lang ||= "en";       // "en" (null is falsy)
preference.fontSize ||= 16;     // 16 (0 is falsy — problem!)
preference.fontSize ??= 16;     // 0 (0 is NOT null/undefined — correct!)

// ==========================================================
// SECTION 6: OPTIONAL CHAINING (?.)
// ==========================================================
// Safely access nested properties without crash

const apiResponse = {
  data: {
    user: {
      profile: {
        avatar: "https://example.com/photo.jpg"
      }
    }
  }
};

// Without optional chaining (verbose and error-prone):
const avatar1 = apiResponse &&
                apiResponse.data &&
                apiResponse.data.user &&
                apiResponse.data.user.profile &&
                apiResponse.data.user.profile.avatar;

// With optional chaining (clean and safe!):
const avatar2 = apiResponse?.data?.user?.profile?.avatar;
console.log(avatar2); // "https://example.com/photo.jpg"

const missing = apiResponse?.data?.posts?.[0]?.title; // undefined (no crash)

// Optional method call:
const arr3 = null;
arr3?.forEach(x => console.log(x)); // no crash — just undefined

// Optional function call:
const maybeFunction = undefined;
maybeFunction?.(); // no crash

// Combine with nullish coalescing:
const username = apiResponse?.data?.user?.name ?? "Anonymous";
console.log(username); // "Anonymous"

// ==========================================================
// SECTION 7: NULLISH COALESCING (??)
// ==========================================================
// Return right side ONLY if left is null or undefined
// (NOT for other falsy values like 0, "", false)

const settings2 = {
  volume: 0,        // intentionally 0
  name:   "",       // intentionally empty
  theme:  null,     // not set
};

console.log(settings2.volume ?? 50);  // 0  — 0 is valid!
console.log(settings2.volume || 50);  // 50 — wrong! treats 0 as "no value"

console.log(settings2.name ?? "default"); // "" — empty string is valid!
console.log(settings2.name || "default"); // "default" — wrong!

console.log(settings2.theme ?? "light"); // "light" — null means not set

// ==========================================================
// SECTION 8: OBJECT METHODS — valueOf, toString, Symbol
// ==========================================================

// Enhanced object literals:
const x = 10, y = 20;
const point = {
  x, y,                  // shorthand property names
  toString() {           // method shorthand
    return `(${this.x}, ${this.y})`;
  },
  ["key" + "_" + "dynamic"]: "computed key!", // computed property
};
console.log(point.toString()); // "(10, 20)"

// ==========================================================
// SECTION 9: SETS — Unique Values Only
// ==========================================================

// Set = collection of UNIQUE values (no duplicates)
const set = new Set([1, 2, 3, 2, 1, 3]); // {1, 2, 3}
console.log(set.size);         // 3
console.log(set.has(2));       // true
console.log(set.has(99));      // false

set.add(4);    // {1, 2, 3, 4}
set.delete(1); // {2, 3, 4}

// Iterate:
for (const value of set) {
  console.log(value);
}

// Convert to array:
const arr4 = [...set]; // [2, 3, 4]
const arr5 = Array.from(set);

// Remove duplicates from array:
const withDupes = [1, 2, 3, 2, 1, 4, 3];
const unique    = [...new Set(withDupes)];
console.log(unique); // [1, 2, 3, 4]

// Set operations:
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union (all elements from both):
const union = new Set([...setA, ...setB]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// Intersection (elements in BOTH):
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersection]); // [3, 4]

// Difference (in A but not B):
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log([...difference]); // [1, 2]

// ==========================================================
// SECTION 10: MAPS — Key-Value Store
// ==========================================================

// Map = key-value pairs where ANY type can be a key
// (vs objects where keys are only strings/symbols)
const map = new Map();

map.set("name", "Rohit");    // string key
map.set(1, "one");            // number key
map.set(true, "yes");         // boolean key
const obj = { id: 1 };
map.set(obj, "object key!"); // object as key!

console.log(map.get("name")); // "Rohit"
console.log(map.get(1));      // "one"
console.log(map.get(obj));    // "object key!"
console.log(map.size);        // 4
console.log(map.has("name")); // true

map.delete("name");
console.log(map.has("name")); // false

// Initialize with entries:
const scores = new Map([
  ["Rohit", 95],
  ["Anna",  88],
  ["Bob",   72],
]);

// Iterate Map:
for (const [key, value] of scores) {
  console.log(`${key}: ${value}`);
}

// Convert to array:
console.log([...scores.keys()]);    // ["Rohit", "Anna", "Bob"]
console.log([...scores.values()]);  // [95, 88, 72]
console.log([...scores.entries()]); // [["Rohit",95], ...]

// Map vs Object:
// Map  → any key type, maintains insertion order, .size, better for frequent add/delete
// Object → string/symbol keys only, faster for fixed structure, JSON compatible

// ==========================================================
// SECTION 11: SYMBOLS — Unique Identifiers
// ==========================================================

const sym1 = Symbol("id");
const sym2 = Symbol("id");
console.log(sym1 === sym2); // false — always unique!

// Use as object key:
const user3 = {
  name: "Rohit",
  [sym1]: "private-user-id-123", // hidden from JSON, for...in
};
console.log(user3[sym1]);         // "private-user-id-123"
console.log(JSON.stringify(user3)); // {"name":"Rohit"} — symbol hidden!

// Well-known symbols (customize object behavior):
class Range {
  constructor(start, end) { this.start = start; this.end = end; }

  [Symbol.iterator]() { // makes Range iterable with for...of!
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

const range = new Range(1, 5);
for (const n of range) {
  process.stdout.write(n + " ");
}
console.log(); // 1 2 3 4 5

// Spread works too:
console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5]

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between spread and rest?
  A: Both use ... but work differently:
     REST    (in function definition)  → collects args into array
     SPREAD  (when calling / in array) → expands iterable into individual values

  Q: What is the difference between || and ??
  A: || → treats all FALSY values as "no value" (false, 0, "", null, undefined, NaN)
     ?? → ONLY treats null and undefined as "no value"
     Use ?? when 0 or "" are valid values!

  Q: What is the difference between Map and Object?
  A: Map    → any key type, ordered, .size property, iterable
     Object → only string/symbol keys, better for static data, JSON compatible
     Use Map for dynamic key-value stores, Object for structured data.

  Q: What is the difference between Set and Array?
  A: Set   → unique values only, O(1) lookup with .has(), no index
     Array → can have duplicates, O(n) includes(), indexed access
     Use Set when uniqueness matters or for fast membership checking.

  Q: What is optional chaining?
  A: ?. safely accesses nested properties — returns undefined instead of
     throwing TypeError if any part of the chain is null/undefined.

  Q: What is a Symbol?
  A: A unique primitive value, guaranteed to never equal another Symbol.
     Used as unique object keys that don't appear in JSON or for...in.
     Well-known symbols like Symbol.iterator let you customize behavior.
*/
