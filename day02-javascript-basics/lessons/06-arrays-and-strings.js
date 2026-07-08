// ============================================================
// JAVASCRIPT BASICS — File 6: Arrays & String Methods
// Level: Beginner → Advanced → Interview Level
// ============================================================

// ==========================================================
// SECTION 1: ARRAYS — Ordered List of Values
// ==========================================================

// WHAT IS AN ARRAY?
// An array = an ordered collection of values.
// Each value has an INDEX starting at 0.
// Arrays can hold ANY type of data (even mixed types).

// ── Creating Arrays ───────────────────────────────────────
const fruits  = ["apple", "banana", "cherry"];  // array literal (most common)
const numbers = [1, 2, 3, 4, 5];
const mixed   = [42, "hello", true, null, [1, 2]]; // mixed types
const empty   = []; // empty array

// Array constructor (rarely used):
const arr2 = new Array(3);     // [empty × 3] — array with 3 empty slots
const arr3 = new Array(1, 2, 3); // [1, 2, 3]

// ── Accessing Elements ────────────────────────────────────
console.log(fruits[0]);                    // "apple"   — first element
console.log(fruits[1]);                    // "banana"  — second element
console.log(fruits[fruits.length - 1]);    // "cherry"  — last element
console.log(fruits.at(-1));               // "cherry"  — modern way to get last
console.log(fruits.at(-2));               // "banana"  — second from end

console.log(fruits.length); // 3 — number of elements

// ── Arrays are Reference Types ────────────────────────────
const a1 = [1, 2, 3];
const a2 = a1;        // a2 points to SAME array in memory!
a2.push(4);
console.log(a1);      // [1, 2, 3, 4] — BOTH changed!

const a3 = [...a1];   // create a copy with spread
a3.push(5);
console.log(a1);      // [1, 2, 3, 4] — NOT changed
console.log(a3);      // [1, 2, 3, 4, 5]

// ==========================================================
// SECTION 2: ARRAY DESTRUCTURING
// ==========================================================

const [first, second, third] = fruits;
console.log(first, second, third); // "apple" "banana" "cherry"

// Skip elements:
const [, , thirdFruit] = fruits; // skip first two
console.log(thirdFruit); // "cherry"

// Default values:
const [a = "N/A", b = "N/A", c = "N/A", d = "N/A"] = fruits;
console.log(d); // "N/A" — fruits doesn't have index 3

// Rest pattern:
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Swap variables using destructuring:
let x = 1, y = 2;
[x, y] = [y, x]; // swap!
console.log(x, y); // 2 1

// ==========================================================
// SECTION 3: MUTATING ARRAY METHODS (change original array)
// ==========================================================
const items = ["a", "b", "c"];

// push() — add to END, returns new length
items.push("d");
console.log(items); // ["a", "b", "c", "d"]

items.push("e", "f"); // add multiple at once
console.log(items); // ["a", "b", "c", "d", "e", "f"]

// pop() — remove from END, returns removed element
const removed = items.pop();
console.log(removed); // "f"
console.log(items);   // ["a", "b", "c", "d", "e"]

// unshift() — add to BEGINNING
items.unshift("z");
console.log(items); // ["z", "a", "b", "c", "d", "e"]

// shift() — remove from BEGINNING
const first2 = items.shift();
console.log(first2); // "z"
console.log(items);  // ["a", "b", "c", "d", "e"]

// splice(start, deleteCount, ...itemsToAdd) — add/remove at ANY position
const nums = [1, 2, 3, 4, 5];
const removed2 = nums.splice(2, 1); // remove 1 element at index 2
console.log(removed2); // [3]
console.log(nums);     // [1, 2, 4, 5]

nums.splice(1, 0, 10, 11); // insert at index 1, remove 0, add 10 and 11
console.log(nums); // [1, 10, 11, 2, 4, 5]

// sort() — sorts IN PLACE
const letters = ["c", "a", "b", "d"];
letters.sort(); // alphabetical
console.log(letters); // ["a", "b", "c", "d"]

// sort numbers — MUST provide compare function!
const unsorted = [10, 2, 31, 4];
unsorted.sort();                      // ❌ ["10", "2", "31", "4"] alphabetically — WRONG!
unsorted.sort((a, b) => a - b);      // ✅ [2, 4, 10, 31] — ascending
unsorted.sort((a, b) => b - a);      // ✅ [31, 10, 4, 2] — descending
console.log(unsorted);

// reverse() — reverses IN PLACE
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// fill() — fill with a value
const filled = new Array(5).fill(0); // [0, 0, 0, 0, 0]
console.log(filled);

// ==========================================================
// SECTION 4: NON-MUTATING ARRAY METHODS (return new array)
// ==========================================================
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// slice(start, end) — copy portion (does NOT modify original)
console.log(data.slice(2, 5));  // [3, 4, 5] (from index 2 up to not including 5)
console.log(data.slice(-3));    // [8, 9, 10] (last 3)
console.log(data.slice());      // [1,2,3,4,5,6,7,8,9,10] (full copy)

// concat() — merge arrays
const arr1 = [1, 2, 3];
const arr2b = [4, 5, 6];
const merged = arr1.concat(arr2b);
console.log(merged); // [1, 2, 3, 4, 5, 6]
// Modern way: const merged = [...arr1, ...arr2b];

// join() — convert array to string
const words = ["Hello", "World", "Rohit"];
console.log(words.join(" "));  // "Hello World Rohit"
console.log(words.join(", ")); // "Hello, World, Rohit"
console.log(words.join(""));   // "HelloWorldRohit"
console.log(words.join("-"));  // "Hello-World-Rohit"

// flat() — flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());        // [1, 2, 3, 4, [5, 6]] — 1 level
console.log(nested.flat(2));       // [1, 2, 3, 4, 5, 6]   — 2 levels
console.log(nested.flat(Infinity));// fully flattened

// ==========================================================
// SECTION 5: SEARCHING METHODS
// ==========================================================

// indexOf() — find index of value (-1 if not found)
const arr5 = [10, 20, 30, 20, 40];
console.log(arr5.indexOf(20));     // 1 (first occurrence)
console.log(arr5.lastIndexOf(20)); // 3 (last occurrence)
console.log(arr5.indexOf(99));     // -1 (not found)

// includes() — check if value exists
console.log(arr5.includes(30));   // true
console.log(arr5.includes(99));   // false

// find() — first element that passes a test
const users = [
  { id: 1, name: "Rohit" },
  { id: 2, name: "Anna" },
  { id: 3, name: "Bob" },
];
const found = users.find(user => user.name === "Anna");
console.log(found); // { id: 2, name: "Anna" }

const notFound = users.find(user => user.name === "XYZ");
console.log(notFound); // undefined

// findIndex() — index of first match
const idx = users.findIndex(user => user.id === 3);
console.log(idx); // 2

// some() — returns true if AT LEAST ONE passes
console.log(data.some(n => n > 5));   // true  (6,7,8... are > 5)
console.log(data.some(n => n > 99));  // false (no element > 99)

// every() — returns true if ALL pass
console.log(data.every(n => n > 0));  // true  (all > 0)
console.log(data.every(n => n > 5));  // false (1,2,3,4,5 are not > 5)

// ==========================================================
// SECTION 6: ITERATION METHODS
// ==========================================================

// forEach() — run code for each element (no return value)
const prices = [10, 20, 30];
prices.forEach((price, index) => {
  console.log(`Item ${index + 1}: $${price}`);
});

// map() — transform each element, returns NEW array
const doubled = prices.map(price => price * 2);
console.log(doubled); // [20, 40, 60]
console.log(prices);  // [10, 20, 30] — original unchanged!

// filter() — keep elements that pass test, returns NEW array
const evens  = data.filter(n => n % 2 === 0);   // [2, 4, 6, 8, 10]
const larges = data.filter(n => n > 5);           // [6, 7, 8, 9, 10]
console.log(evens, larges);

// reduce() — accumulate to a single value
const sum  = data.reduce((acc, n) => acc + n, 0);  // 55
const product = [1, 2, 3, 4].reduce((acc, n) => acc * n, 1); // 24
console.log("Sum:", sum, "Product:", product);

// flatMap() — map + flatten (1 level)
const sentences = ["Hello World", "JS is fun"];
const wordList  = sentences.flatMap(s => s.split(" "));
console.log(wordList); // ["Hello", "World", "JS", "is", "fun"]

// ==========================================================
// SECTION 7: CREATING ARRAYS
// ==========================================================

// Array.from() — create from iterable or array-like
console.log(Array.from("hello"));              // ["h","e","l","l","o"]
console.log(Array.from({ length: 5 }, (_, i) => i + 1)); // [1,2,3,4,5]
console.log(Array.from({ length: 5 }, (_, i) => i * i)); // [0,1,4,9,16]
console.log(Array.from(new Set([1,2,2,3,3]))); // [1,2,3] — remove duplicates!

// Array.of() — create array from arguments
console.log(Array.of(1, 2, 3)); // [1, 2, 3]

// Ranges:
const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
console.log(range(1, 5));   // [1, 2, 3, 4, 5]
console.log(range(10, 15)); // [10, 11, 12, 13, 14, 15]

// ==========================================================
// SECTION 8: STRING METHODS — Complete Reference
// ==========================================================
const str = "  Hello, World! JavaScript is Amazing!  ";

// Case conversion:
console.log(str.toUpperCase());    // ALL CAPS
console.log(str.toLowerCase());    // all lowercase

// Whitespace:
console.log(str.trim());          // "Hello, World! JavaScript is Amazing!"
console.log(str.trimStart());     // removes only leading spaces
console.log(str.trimEnd());       // removes only trailing spaces

// Search:
console.log(str.includes("World"));       // true
console.log(str.includes("Python"));      // false
console.log(str.startsWith("  Hello"));   // true (includes spaces)
console.log(str.endsWith("!  "));         // true
console.log(str.indexOf("JavaScript"));   // 16 (first occurrence)
console.log(str.lastIndexOf("is"));       // 27

// Extract:
console.log(str.slice(2, 7));    // "Hello" — slice(start, end)
console.log(str.slice(-9, -2));  // "Amazing" — from end

// Replace:
console.log(str.replace("World", "Rohit"));      // replace first match
console.log(str.replace(/is/gi, "IS"));           // regex: replace ALL, case-insensitive
console.log(str.replaceAll("i", "I"));            // replaceAll (ES2021)

// Split:
console.log("a,b,c,d".split(","));               // ["a","b","c","d"]
console.log("Hello World".split(" "));           // ["Hello","World"]
console.log("abc".split(""));                    // ["a","b","c"] — each character

// Repeat & Pad:
console.log("*".repeat(5));         // "*****"
console.log("7".padStart(3, "0")); // "007" — pad with leading zeros
console.log("hi".padEnd(5, ".")); // "hi..." — pad at end

// Character access:
console.log("hello".charAt(1));     // "e"
console.log("hello"[1]);            // "e" — same result
console.log("A".charCodeAt(0));     // 65 — ASCII/Unicode code

// Check types (useful):
const isDigit = (ch) => ch >= "0" && ch <= "9";
console.log(isDigit("5")); // true
console.log(isDigit("a")); // false

/*
  INTERVIEW Q&A:
  ==============
  Q: What is the difference between push/pop and shift/unshift?
  A: push/pop   → add/remove from END of array
     shift/unshift → add/remove from BEGINNING of array
     pop/shift return the removed element.
     push/unshift return the new length.

  Q: What is the difference between slice and splice?
  A: slice(start, end) → NON-MUTATING. Returns copy of portion.
     splice(start, count, ...items) → MUTATING. Removes/inserts in place.

  Q: How do you remove duplicates from an array?
  A: [...new Set(arr)] or Array.from(new Set(arr))
     Set only keeps unique values, then convert back to array.

  Q: What is the difference between find and filter?
  A: find()   → returns FIRST matching element (or undefined)
     filter() → returns ALL matching elements as NEW array

  Q: What is the difference between map, filter, and reduce?
  A: map    → transform each item, returns same-length array
     filter → keep matching items, returns shorter array
     reduce → accumulate to single value (any type)

  Q: How do you sort an array of numbers correctly?
  A: arr.sort((a, b) => a - b)  → ascending
     arr.sort((a, b) => b - a)  → descending
     Default sort() is alphabetical — WRONG for numbers!

  Q: What does Array.from() do?
  A: Creates an array from:
     - Iterables (strings, Sets, Maps)
     - Array-like objects
     - With callback: Array.from({length: 5}, (_, i) => i) → [0,1,2,3,4]
*/
