// ============================================================
// DAY 1 — JavaScript: ARRAY METHODS & HIGHER ORDER FUNCTIONS
// Interview Level: Beginner → Advanced
// ============================================================

// HIGHER ORDER FUNCTION (HOF) = A function that either:
//   1. Takes another function as ARGUMENT, OR
//   2. RETURNS a function
// Examples: map, filter, reduce, forEach, sort, every, some

// ─────────────────────────────────────────────────────────────
// DATASET — We'll use this throughout
// ─────────────────────────────────────────────────────────────
const products = [
  { id: 1, name: "Laptop",  price: 999,  category: "Electronics", inStock: true  },
  { id: 2, name: "Phone",   price: 699,  category: "Electronics", inStock: false },
  { id: 3, name: "Desk",    price: 299,  category: "Furniture",   inStock: true  },
  { id: 4, name: "Chair",   price: 199,  category: "Furniture",   inStock: true  },
  { id: 5, name: "Monitor", price: 449,  category: "Electronics", inStock: true  },
  { id: 6, name: "Lamp",    price: 49,   category: "Furniture",   inStock: false },
];

// ─────────────────────────────────────────────────────────────
// SECTION 1: CORE ITERATION METHODS
// ─────────────────────────────────────────────────────────────

// ── forEach — iterate, returns undefined (no chaining) ────────
console.log("=== forEach ===");
products.slice(0, 2).forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}: $${product.price}`);
});
// 1. Laptop: $999
// 2. Phone: $699
// Note: forEach always returns undefined — can't chain!

// ── map — transform each element, returns NEW array ──────────
console.log("=== map ===");
// Extract just the names
const names = products.map((p) => p.name);
console.log(names); // ["Laptop", "Phone", "Desk", ...]

// Transform to formatted display objects
const displayCards = products.map((p) => ({
  title:    p.name.toUpperCase(),
  subtitle: `$${p.price}`,
  badge:    p.inStock ? "In Stock" : "Out of Stock",
}));
console.log(displayCards[0]); // { title: 'LAPTOP', subtitle: '$999', badge: 'In Stock' }

// ── filter — keep elements that pass test, returns NEW array ──
console.log("=== filter ===");
const inStockProducts  = products.filter((p) => p.inStock);
const electronics      = products.filter((p) => p.category === "Electronics");
const affordable       = products.filter((p) => p.price < 500);
const inStockElectronics = products.filter(
  (p) => p.inStock && p.category === "Electronics"
);
console.log("In stock:", inStockProducts.length);        // 4
console.log("Electronics:", electronics.length);          // 3
console.log("In-stock electronics:", inStockElectronics.length); // 2

// ── reduce — accumulate to single value ───────────────────────
console.log("=== reduce ===");
// Sum all prices
const totalPrice = products.reduce((acc, p) => acc + p.price, 0);
console.log("Total:", totalPrice); // 2694

// Find most expensive
const mostExpensive = products.reduce(
  (max, p) => (p.price > max.price ? p : max),
  products[0]
);
console.log("Most expensive:", mostExpensive.name); // "Laptop"

// Group by category (reduce → object)
const byCategory = products.reduce((acc, p) => {
  if (!acc[p.category]) acc[p.category] = [];
  acc[p.category].push(p.name);
  return acc;
}, {});
console.log(byCategory);
// { Electronics: ["Laptop", "Phone", "Monitor"], Furniture: ["Desk", "Chair", "Lamp"] }

// Count items per category
const countByCategory = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log(countByCategory); // { Electronics: 3, Furniture: 3 }

// ─────────────────────────────────────────────────────────────
// SECTION 2: SEARCH & CHECK METHODS
// ─────────────────────────────────────────────────────────────

// ── find — returns FIRST match or undefined ───────────────────
const laptop = products.find((p) => p.name === "Laptop");
console.log(laptop?.price); // 999

// ── findIndex — returns INDEX of first match or -1 ────────────
const deskIndex = products.findIndex((p) => p.name === "Desk");
console.log(deskIndex); // 2

// ── some — returns true if AT LEAST ONE matches ───────────────
const hasOutOfStock = products.some((p) => !p.inStock);
console.log("Has out of stock:", hasOutOfStock); // true

// ── every — returns true if ALL match ─────────────────────────
const allHavePrice = products.every((p) => p.price > 0);
console.log("All have price:", allHavePrice); // true

const allInStock = products.every((p) => p.inStock);
console.log("All in stock:", allInStock); // false

// ── includes — check if value exists (uses ===) ───────────────
const nums = [1, 2, 3, 4, 5];
console.log(nums.includes(3)); // true
console.log(nums.includes(9)); // false

// ── indexOf — find index of value (-1 if not found) ──────────
console.log(nums.indexOf(3));  // 2
console.log(nums.indexOf(9));  // -1

// ─────────────────────────────────────────────────────────────
// SECTION 3: TRANSFORMATION METHODS
// ─────────────────────────────────────────────────────────────

// ── sort — sorts IN PLACE, returns same array ─────────────────
// WARNING: Default sort is lexicographic (string-based)!
console.log([10, 2, 31, 4].sort());        // [10, 2, 31, 4] ← WRONG! (string sort)
console.log([10, 2, 31, 4].sort((a, b) => a - b)); // [2, 4, 10, 31] ← correct!

// Sort products by price ascending
const byPriceAsc  = [...products].sort((a, b) => a.price - b.price);
const byPriceDesc = [...products].sort((a, b) => b.price - a.price);

// Sort by name alphabetically
const byName = [...products].sort((a, b) => a.name.localeCompare(b.name));
console.log(byName.map((p) => p.name)); // alphabetical order

// Stable multi-field sort:
const byStockThenPrice = [...products].sort((a, b) => {
  if (a.inStock !== b.inStock) return a.inStock ? -1 : 1; // in-stock first
  return a.price - b.price; // then by price
});

// ── flat — flatten nested arrays ─────────────────────────────
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());     // [1, 2, 3, 4, [5, 6]] — 1 level deep
console.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6]   — 2 levels deep
console.log(nested.flat(Infinity)); // completely flattened

// ── flatMap — map then flatten (1 level) ─────────────────────
const sentences = ["Hello world", "JS is fun"];
const words = sentences.flatMap((s) => s.split(" "));
console.log(words); // ["Hello", "world", "JS", "is", "fun"]

// Equivalent: sentences.map(s => s.split(" ")).flat()

// ── slice — extract portion (NON-MUTATING) ────────────────────
const arr = [1, 2, 3, 4, 5];
console.log(arr.slice(1, 3));   // [2, 3] — from index 1, up to (not including) 3
console.log(arr.slice(-2));     // [4, 5] — last 2 elements
console.log(arr.slice());       // [1,2,3,4,5] — shallow copy

// ── splice — modify in place (MUTATING) ───────────────────────
const fruits = ["apple", "banana", "cherry", "date"];
fruits.splice(1, 2, "blueberry", "cranberry"); // remove 2 at index 1, insert 2
console.log(fruits); // ["apple", "blueberry", "cranberry", "date"]

// ── concat — merge arrays (NON-MUTATING) ─────────────────────
const a = [1, 2];
const b = [3, 4];
const c = a.concat(b, [5, 6]); // [1, 2, 3, 4, 5, 6]
// Modern way: spread operator
const d = [...a, ...b, 5, 6];

// ── reverse — reverses IN PLACE (MUTATING) ────────────────────
const nums2 = [1, 2, 3, 4, 5];
nums2.reverse(); // mutates! [5, 4, 3, 2, 1]
// Safe way: [...nums2].reverse()

// ─────────────────────────────────────────────────────────────
// SECTION 4: CREATING ARRAYS
// ─────────────────────────────────────────────────────────────

// Array.from — create from iterable or array-like
const from1 = Array.from("hello");           // ["h","e","l","l","o"]
const from2 = Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
const from3 = Array.from({ length: 5 }, (_, i) => i * i); // [0,1,4,9,16]
const from4 = Array.from(new Set([1, 2, 2, 3]));           // [1,2,3] — deduplicate!

// Array.of — creates array from arguments
const arr2 = Array.of(1, 2, 3); // [1, 2, 3]

// Array(n) — creates empty array of length n
const empty = new Array(5).fill(0); // [0, 0, 0, 0, 0]

// ─────────────────────────────────────────────────────────────
// SECTION 5: CHAINING — Real-World Example
// ─────────────────────────────────────────────────────────────
console.log("=== Chaining Example ===");

// Get top 3 in-stock electronics sorted by price, return display format
const result = products
  .filter((p) => p.inStock)                          // only in-stock
  .filter((p) => p.category === "Electronics")       // only electronics
  .sort((a, b) => a.price - b.price)                 // sort by price
  .slice(0, 3)                                        // top 3
  .map((p) => `${p.name}: $${p.price}`);             // format

console.log(result); // ["Monitor: $449", "Laptop: $999"]

// ─────────────────────────────────────────────────────────────
// SECTION 6: CUSTOM HIGHER ORDER FUNCTIONS
// ─────────────────────────────────────────────────────────────

// ── Building our own map ──────────────────────────────────────
function myMap(arr, fn) {
  const result = [];
  for (const item of arr) {
    result.push(fn(item));
  }
  return result;
}
console.log(myMap([1, 2, 3], (x) => x * 2)); // [2, 4, 6]

// ── Building our own filter ───────────────────────────────────
function myFilter(arr, predicate) {
  const result = [];
  for (const item of arr) {
    if (predicate(item)) result.push(item);
  }
  return result;
}
console.log(myFilter([1, 2, 3, 4, 5], (x) => x % 2 === 0)); // [2, 4]

// ── Building our own reduce ───────────────────────────────────
function myReduce(arr, fn, initial) {
  let acc = initial;
  for (const item of arr) {
    acc = fn(acc, item);
  }
  return acc;
}
console.log(myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0)); // 10

// ── compose — right-to-left function composition ─────────────
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

const double   = (x) => x * 2;
const addTen   = (x) => x + 10;
const square   = (x) => x * x;

const transform = compose(addTen, double, square); // square → double → addTen
console.log(transform(3)); // square(3)=9, double(9)=18, addTen(18)=28

// ── pipe — left-to-right function composition ─────────────────
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const process = pipe(square, double, addTen); // square → double → addTen
console.log(process(3)); // same result: 28

// ── curry — convert multi-arg fn to chain of single-arg fns ──
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6

const addFive = curriedAdd(5);      // partial application
console.log(addFive(3)(2));         // 10

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What's the difference between map, filter, and reduce?
A: map    → transforms each element, returns array of same length
   filter → keeps elements matching condition, returns shorter array
   reduce → accumulates all elements to single value (any type)

Q: Which array methods mutate the original?
A: MUTATING:     sort, splice, reverse, push, pop, shift, unshift, fill
   NON-MUTATING: map, filter, reduce, slice, concat, flat, flatMap, find

Q: What is a Higher Order Function?
A: A function that takes a function as argument OR returns a function.
   Examples: map, filter, reduce, setTimeout, addEventListener, compose

Q: How do you sort numbers correctly in JS?
A: Use compare function: arr.sort((a, b) => a - b)
   Default sort is alphabetical (lexicographic), not numeric!

Q: What's the difference between find and filter?
A: find   → returns first matching ELEMENT (or undefined)
   filter → returns ALL matching elements as an ARRAY

Q: What's the difference between some and every?
A: some  → true if AT LEAST ONE element passes the test
   every → true only if ALL elements pass the test

Q: What is currying?
A: Transforming a function that takes multiple arguments into a
   chain of functions each taking one argument.
   add(1, 2, 3) → curriedAdd(1)(2)(3)

Q: What is function composition?
A: Combining multiple functions where output of one is input of next.
   compose = right-to-left, pipe = left-to-right

Q: What is flatMap?
A: Equivalent to .map().flat(1) — maps and flattens one level deep.
   Useful when map returns arrays and you want a flat result.
*/
