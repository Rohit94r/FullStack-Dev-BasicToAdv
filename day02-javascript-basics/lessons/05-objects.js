// ============================================================
// JAVASCRIPT BASICS — File 5: Objects
// Level: Beginner → Advanced → Interview Level
// ============================================================

// WHAT IS AN OBJECT?
// An object = a collection of RELATED DATA and FUNCTIONS.
// Data is stored as key-value pairs (like a dictionary or map).
// Functions inside objects are called METHODS.

// Real-world analogy:
// A "car" object has: color, brand, speed (properties)
//                     and accelerate(), brake() (methods)

// ==========================================================
// SECTION 1: CREATING OBJECTS
// ==========================================================

// ── Object Literal (most common way) ─────────────────────
const person = {
  // key: value pairs
  firstName: "Rohit",         // string property
  lastName:  "Jadhav",        // string property
  age:       25,              // number property
  isStudent: false,           // boolean property
  hobbies:   ["coding", "reading", "gaming"], // array property
  address: {                  // nested object
    city:    "Mumbai",
    country: "India",
    zip:     "400001",
  },

  // METHOD — a function stored as a property
  greet: function() {
    return `Hi, I'm ${this.firstName} ${this.lastName}!`;
    // 'this' refers to the object the method is called on
  },

  // Arrow functions as methods — AVOID! (no 'this' binding)
  // badMethod: () => `Hi, I'm ${this.firstName}`, // 'this' won't work!

  // Method shorthand (ES6 — preferred):
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  getBirthYear() {
    return new Date().getFullYear() - this.age;
  }
};

console.log(person);              // entire object
console.log(person.firstName);   // "Rohit" — dot notation
console.log(person["age"]);      // 25      — bracket notation (use with dynamic keys)
console.log(person.address.city); // "Mumbai" — nested access
console.log(person.greet());     // "Hi, I'm Rohit Jadhav!"
console.log(person.getFullName()); // "Rohit Jadhav"

// ── When to use bracket notation ─────────────────────────
const key = "firstName"; // dynamic key stored in a variable
console.log(person[key]); // "Rohit" — can't do this with dot notation!

const prop = "age";
console.log(person[prop]); // 25

// ==========================================================
// SECTION 2: ADDING, MODIFYING, DELETING PROPERTIES
// ==========================================================

const car = {
  brand: "Toyota",
  color: "white",
};

// ADD new property:
car.model = "Camry";           // dot notation
car["year"] = 2023;            // bracket notation
console.log(car); // { brand, color, model: "Camry", year: 2023 }

// MODIFY existing property:
car.color = "red";
car["year"] = 2024;
console.log(car.color); // "red"

// DELETE a property:
delete car.color;
console.log(car.color); // undefined — property is gone

// CHECK if property EXISTS:
console.log("brand" in car);         // true  — 'in' operator
console.log("color" in car);         // false — was deleted
console.log(car.hasOwnProperty("brand")); // true
console.log(car.hasOwnProperty("color")); // false

// ==========================================================
// SECTION 3: DESTRUCTURING — Extract values easily
// ==========================================================

const user = {
  name:    "Rohit",
  age:     25,
  email:   "rohit@example.com",
  country: "India",
};

// Without destructuring (old way):
const name1   = user.name;
const age1    = user.age;

// With destructuring (ES6 — much cleaner!):
const { name, age, email } = user;
console.log(name, age, email); // "Rohit" 25 "rohit@example.com"

// Rename while destructuring:
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // "Rohit" 25

// Default values if property doesn't exist:
const { country, city = "Unknown" } = user;
console.log(country); // "India"
console.log(city);    // "Unknown" (not in user object)

// Skip properties you don't need:
const { name: n, email: e } = user; // only name and email
console.log(n, e);

// Nested destructuring:
const student = {
  name: "Rohit",
  scores: {
    math:    90,
    english: 85,
    science: 88,
  }
};

const { name: studentName, scores: { math, english } } = student;
console.log(studentName, math, english); // "Rohit" 90 85

// Destructuring in function parameters:
function printUser({ name, age, email = "N/A" }) {
  // Instead of printUser(user) and using user.name, user.age...
  console.log(`${name} (${age}) — ${email}`);
}
printUser(user); // "Rohit (25) — rohit@example.com"

// ==========================================================
// SECTION 4: SPREAD OPERATOR {...} — Copy and Merge Objects
// ==========================================================

const defaults = {
  theme:    "light",
  language: "en",
  fontSize: 16,
};

const userPrefs = {
  theme:    "dark",  // overrides default
  fontSize: 18,      // overrides default
};

// Merge objects — later properties override earlier ones:
const finalSettings = { ...defaults, ...userPrefs };
console.log(finalSettings);
// { theme: "dark", language: "en", fontSize: 18 }

// Copy an object (shallow copy):
const original = { name: "Rohit", age: 25 };
const copy = { ...original };
copy.name = "Anna"; // changes copy but NOT original
console.log(original.name); // "Rohit" — unchanged
console.log(copy.name);     // "Anna"

// Add/override while spreading:
const updatedUser = { ...user, age: 26, city: "Pune" };
console.log(updatedUser.age);  // 26 (updated)
console.log(updatedUser.city); // "Pune" (added)
console.log(user.age);         // 25 (original unchanged)

// ── Shallow vs Deep copy warning ─────────────────────────
const nested = { name: "Rohit", address: { city: "Mumbai" } };
const shallowCopy = { ...nested };

shallowCopy.address.city = "Pune"; // modifies SHARED reference!
console.log(nested.address.city);  // "Pune" — ALSO changed! (shallow copy bug)

// Deep copy (simple way for plain objects):
const deepCopy = JSON.parse(JSON.stringify(nested));
deepCopy.address.city = "Delhi";
console.log(nested.address.city);   // "Pune" — NOT changed (independent)

// ==========================================================
// SECTION 5: OBJECT METHODS — Useful Built-in Methods
// ==========================================================

const profile = {
  name:   "Rohit",
  age:    25,
  skills: ["JS", "TS"],
  active: true,
};

// Object.keys() — array of keys
console.log(Object.keys(profile));
// ["name", "age", "skills", "active"]

// Object.values() — array of values
console.log(Object.values(profile));
// ["Rohit", 25, ["JS", "TS"], true]

// Object.entries() — array of [key, value] pairs
console.log(Object.entries(profile));
// [["name","Rohit"], ["age",25], ["skills",["JS","TS"]], ["active",true]]

// Iterate using for...of + entries:
for (const [key, value] of Object.entries(profile)) {
  console.log(`${key}: ${value}`);
}

// Object.assign() — merge objects (like spread)
const base = { x: 1, y: 2 };
const extra = { y: 99, z: 3 };
Object.assign(base, extra); // modifies base IN PLACE!
console.log(base); // { x: 1, y: 99, z: 3 }

// Object.freeze() — prevent ALL modifications
const frozen = Object.freeze({ name: "Rohit", age: 25 });
frozen.name = "Anna"; // silently fails (or throws in strict mode)
console.log(frozen.name); // still "Rohit"

// Object.fromEntries() — convert entries back to object
const entries = [["name", "Rohit"], ["age", 25]];
const fromEntries = Object.fromEntries(entries);
console.log(fromEntries); // { name: "Rohit", age: 25 }

// Map to object:
const map = new Map([["a", 1], ["b", 2]]);
const fromMap = Object.fromEntries(map);
console.log(fromMap); // { a: 1, b: 2 }

// ==========================================================
// SECTION 6: COMPUTED PROPERTY NAMES
// ==========================================================
// Use variables or expressions as object keys

const prefix = "user";
const obj = {
  [`${prefix}Name`]: "Rohit",  // key = "userName"
  [`${prefix}Age`]:  25,       // key = "userAge"
};
console.log(obj.userName); // "Rohit"
console.log(obj.userAge);  // 25

// Very useful for building objects dynamically:
function createConfig(key, value) {
  return { [key]: value };  // key is a variable!
}
console.log(createConfig("theme", "dark"));  // { theme: "dark" }
console.log(createConfig("port", 3000));     // { port: 3000 }

// ==========================================================
// SECTION 7: SHORTHAND PROPERTIES (ES6)
// ==========================================================
// When property name = variable name, you can use shorthand!

const myName = "Rohit";
const myAge  = 25;
const myCity = "Mumbai";

// Old way:
const userOld = { myName: myName, myAge: myAge, myCity: myCity };

// New way (shorthand — property name = variable name):
const userNew = { myName, myAge, myCity };
console.log(userNew); // { myName: "Rohit", myAge: 25, myCity: "Mumbai" }

// Very common in React and modern JS!

// ==========================================================
// SECTION 8: CHECKING AND ITERATING OBJECTS
// ==========================================================

const config = {
  host: "localhost",
  port: 3000,
  debug: true,
  timeout: 5000,
};

// Check if key exists:
console.log("host" in config);            // true
console.log("password" in config);        // false
console.log(config.password === undefined); // true (but could be explicitly undefined)

// Better check (handles explicitly set undefined values):
console.log(Object.hasOwn(config, "host")); // true (modern, preferred)

// Count properties:
console.log(Object.keys(config).length); // 4

// Is object empty?
const isEmpty = (obj) => Object.keys(obj).length === 0;
console.log(isEmpty({}));      // true
console.log(isEmpty(config));  // false

// Convert object to query string:
const params = { page: 1, limit: 10, sort: "name" };
const queryString = Object.entries(params)
  .map(([k, v]) => `${k}=${v}`)
  .join("&");
console.log(queryString); // "page=1&limit=10&sort=name"

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between dot notation and bracket notation?
  A: Dot notation:     obj.property (static, fixed key name)
     Bracket notation: obj["property"] or obj[variable] (dynamic key)
     Use bracket when key is in a variable or has special characters.

  Q: What is destructuring?
  A: Extract values from objects/arrays into named variables.
     const { name, age } = user → clean, concise extraction.

  Q: What does the spread operator do to objects?
  A: Creates a shallow copy or merges objects.
     { ...obj1, ...obj2 } → merges both. Later properties win on conflict.

  Q: What is a shallow copy vs deep copy?
  A: Shallow: nested objects are still shared (same reference).
     Deep: completely independent (no shared references).
     Spread/Object.assign = shallow. JSON.parse+stringify = deep (simple cases).

  Q: What does Object.freeze() do?
  A: Prevents adding, removing, or modifying properties.
     "Freezes" the object. Changes silently fail (or throw in strict mode).
     Note: It's SHALLOW — nested objects are NOT frozen!

  Q: What does 'this' refer to inside an object method?
  A: 'this' refers to the object the method is called ON.
     person.greet() → 'this' is 'person' inside greet.
     Don't use arrow functions for methods — they don't have their own 'this'.

  Q: What is the difference between Object.keys(), values(), entries()?
  A: keys()    → array of property names (keys)
     values()  → array of property values
     entries() → array of [key, value] pairs (most versatile)
*/
