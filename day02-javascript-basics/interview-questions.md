# Day 2 — JavaScript Basics Interview Questions & Answers

Try every answer out loud first. Then verify.

---

## SECTION A — Variables & Data Types

**Q1. What are the 3 ways to declare variables? When to use each?**
A: var   → old. Function-scoped. Hoisted. Avoid in modern code.
   let   → block-scoped. Use when value changes (loop counter, reassigning).
   const → block-scoped. Cannot be reassigned. Default choice.
   Rule: always const first. If you need to reassign → let. Never var.

**Q2. What are the 8 data types in JavaScript?**
A: Primitives (7): string, number, bigint, boolean, undefined, null, symbol
   Object (1): object (includes arrays, functions, Date, RegExp, null is a quirk)
   Primitives are stored by VALUE. Objects are stored by REFERENCE.

**Q3. What is the difference between `undefined` and `null`?**
A: undefined → variable declared but no value assigned. JavaScript sets this automatically.
   null      → INTENTIONAL absence of a value. YOU set this deliberately.
   typeof undefined → "undefined". typeof null → "object" (famous JS bug, but it is).
   null == undefined → true. null === undefined → false.

**Q4. What does `typeof` return for these: string, number, boolean, undefined, null, array, function?**
A: typeof "hello"    → "string"
   typeof 42        → "number"
   typeof true      → "boolean"
   typeof undefined → "undefined"
   typeof null      → "object"  ← the famous bug
   typeof []        → "object"
   typeof function(){}  → "function"
   To check for array: Array.isArray(value). To check for null: value === null.

**Q5. What is type coercion? Give 2 dangerous examples.**
A: JS automatically converts types when you use wrong operator.
   Dangerous examples:
   `"5" + 3`  → "53" (number 3 coerced to string, concatenated)
   `"5" - 3`  → 2   (string "5" coerced to number, subtracted)
   `true + 1` → 2   (true coerced to 1)
   `null + 1` → 1   (null coerced to 0)
   Avoid coercion bugs: use === not ==, and convert types explicitly.

**Q6. What is the difference between `==` and `===`?**
A: == (loose)  → checks value only. Performs type coercion.  `"5" == 5` → true.
   === (strict) → checks BOTH value AND type. No coercion. `"5" === 5` → false.
   ALWAYS use ===. Never use == in production code.

---

## SECTION B — Operators & Conditions

**Q7. What is the ternary operator?**
A: A one-line if/else: `condition ? valueIfTrue : valueIfFalse`
   Example: `const label = age >= 18 ? "adult" : "minor";`
   Use for simple conditions only. For complex logic, use full if/else.

**Q8. What is short-circuit evaluation?**
A: JS uses lazy evaluation in logical operators:
   `&&` → if LEFT is falsy, return LEFT (skip right). If LEFT is truthy, return RIGHT.
   `||` → if LEFT is truthy, return LEFT (skip right). If LEFT is falsy, return RIGHT.
   Examples:
   `null && expensiveFunction()` → null (function never called)
   `user || "Guest"` → user if truthy, else "Guest"
   Common use: `user && user.name` (safe property access)

**Q9. What is the nullish coalescing operator `??`?**
A: Returns right side only if left side is null or undefined.
   Difference from ||: `||` triggers on ANY falsy value (0, "", false).
   `??` only triggers on null/undefined.
   Example: `const count = userCount ?? 0` — uses 0 only if userCount is null/undefined.
   If userCount is 0 (falsy), `||` would give 0 from right, `??` keeps the 0 from left.

**Q10. What are truthy and falsy values in JavaScript?**
A: Falsy values (there are exactly 6):
   false, 0, "" (empty string), null, undefined, NaN
   EVERYTHING else is truthy — including: "0", [], {}, Infinity, -1.
   Common gotcha: empty array [] and empty object {} are TRUTHY.
   `if ([]) { ... }` → the block runs.

---

## SECTION C — Loops

**Q11. What is the difference between `for...in` and `for...of`?**
A: for...in → iterates over KEYS (property names) of an object. Also works on arrays (gives indices as strings).
             `for (const key in obj) { obj[key] }` — but avoid using on arrays.
   for...of  → iterates over VALUES of any iterable (array, string, Map, Set, NodeList).
             `for (const item of arr) { item }` — clean and readable. Use this for arrays.

**Q12. When would you use `break` vs `continue`?**
A: break    → immediately EXITS the entire loop.
   continue → SKIPS the current iteration, continues to next.
   Example use: `break` when you found what you were looking for.
                `continue` when you want to skip invalid/falsy items.

**Q13. What is a `do...while` loop? How is it different from `while`?**
A: while     → checks condition BEFORE first iteration. May run 0 times.
   do...while → runs FIRST, then checks condition. ALWAYS runs at least once.
   Use case: showing a menu prompt at least once, then repeating while user hasn't quit.

---

## SECTION D — Functions

**Q14. What is the difference between function declaration and function expression?**
A: Declaration: `function greet() {}` → Hoisted. Can be called BEFORE it appears in code.
   Expression:  `const greet = function() {}` → NOT hoisted. Can only be called after definition.
   Arrow:       `const greet = () => {}` → Expression form. No own `this`, `arguments`.

**Q15. What is an arrow function? What are its key differences from regular functions?**
A: Arrow functions: `const add = (a, b) => a + b;`
   Key differences:
   1. No own `this` — inherits `this` from surrounding scope. HUGE difference.
   2. No own `arguments` object.
   3. Cannot be used as constructor (no `new`).
   4. Shorter syntax.
   Use arrows for: callbacks, array methods, when you need to access outer `this`.
   Use regular functions for: methods, constructors, when you need own `this`.

**Q16. What is a default parameter?**
A: A fallback value if the argument is not provided or is undefined.
   `function greet(name = "World") { return "Hello " + name; }`
   `greet()` → "Hello World". `greet("Rohit")` → "Hello Rohit".
   Note: only undefined triggers the default. Passing null or "" does NOT.

**Q17. What is rest parameters vs the arguments object?**
A: arguments → old array-like object with all passed arguments. Not available in arrow functions.
   Rest `...params` → modern. Actual real array. Can use all array methods on it.
   `function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }`
   Always prefer rest parameters over arguments.

**Q18. What is a higher-order function?**
A: A function that takes another function as argument OR returns a function.
   Examples: setTimeout, forEach, map, filter, reduce, addEventListener.
   `[1,2,3].map(num => num * 2)` — map is higher-order, `num => num * 2` is callback.
   Why: enables functional programming patterns, DRY code.

---

## SECTION E — Objects & Arrays

**Q19. What is the difference between dot notation and bracket notation for accessing object properties?**
A: Dot:     `user.name`   — works when key is valid identifier. Preferred.
   Bracket: `user["name"]`— works with any key, including dynamic ones or keys with spaces.
   `const key = "name"; user[key]` → bracket notation required for dynamic keys.

**Q20. What is destructuring?**
A: Extracting values from objects/arrays into named variables.
   Object: `const { name, age } = user;` — same as `const name = user.name; const age = user.age;`
   Array:  `const [first, second] = arr;`
   Rename: `const { name: userName } = user;`
   Default: `const { name = "Guest" } = user;`
   Useful in: function parameters, API response parsing, swapping values.

**Q21. What is the spread operator?**
A: `...` — spreads iterable into individual elements.
   Array copy:  `const copy = [...original]`
   Merge arrays: `const merged = [...arr1, ...arr2]`
   Object clone: `const clone = { ...original, newKey: "value" }` (shallow copy)
   Function call: `Math.max(...[1,2,3])`

**Q22. What is the difference between shallow copy and deep copy?**
A: Shallow → only the top-level properties are copied. Nested objects still share reference.
   `const copy = { ...original }` — shallow. Changing copy.nested.x ALSO changes original.nested.x.
   Deep    → completely independent copy at all levels.
   `const copy = JSON.parse(JSON.stringify(original))` — simple deep copy (loses functions, Dates).
   For complex deep cloning: use structuredClone() (modern) or a library like lodash.cloneDeep().

**Q23. What is the difference between `map`, `filter`, and `reduce`?**
A: map    → transforms each element. Returns NEW array of SAME length.
            `[1,2,3].map(x => x * 2)` → [2,4,6]
   filter → keeps elements that pass a test. Returns NEW array (same or shorter).
            `[1,2,3,4].filter(x => x % 2 === 0)` → [2,4]
   reduce → accumulates values into ONE result (number, string, object, array).
            `[1,2,3].reduce((sum, x) => sum + x, 0)` → 6
   None of them mutate the original array. They return new values.

**Q24. What do `find` and `findIndex` do?**
A: find      → returns the FIRST element that satisfies the test. Returns element or undefined.
   findIndex → returns the INDEX of the first match. Returns index or -1 if not found.
   `[5,12,8,130].find(x => x > 10)` → 12
   `[5,12,8,130].findIndex(x => x > 10)` → 1

**Q25. What is the difference between `splice` and `slice`?**
A: splice → MUTATES the original array. Removes/replaces/inserts elements.
            `arr.splice(start, deleteCount, ...items)`
            Returns the REMOVED elements.
   slice  → Does NOT mutate. Returns a new sub-array.
            `arr.slice(start, end)` (end exclusive)
   Memory: spl-ICE → ICES the array (mutates). sl-ICE → cuts a slice (non-destructive).

---

## SECTION F — ES6+ Modern Features

**Q26. What is template literals and why prefer them over string concatenation?**
A: Template literals use backticks: `` `Hello ${name}` ``
   Advantages:
   - Multi-line strings without \n
   - Embedded expressions `${a + b}`
   - Easier to read than: "Hello " + name + " you are " + age + " years old"
   Always prefer template literals for strings with variables.

**Q27. What is optional chaining `?.`?**
A: Safely accesses deeply nested properties without throwing if intermediate is null/undefined.
   `user?.address?.city` → undefined (no error) if user or address is null.
   Without: `user && user.address && user.address.city` (verbose, error-prone).
   Works on: properties `?.`, methods `?.()`, array index `?.[0]`.

**Q28. What is the difference between `Promise`, `async/await`, and callbacks?**
A: Callback  → old. Function passed as argument. "Callback hell" with nested async.
   Promise    → object representing eventual value. .then() and .catch() chaining.
   async/await → syntactic sugar over Promises. Makes async code look synchronous. Cleanest.
   `async function getUser() { const user = await fetchUser(); return user; }`
   All three are just different ways to handle ASYNCHRONOUS operations.

**Q29. What is the difference between `export default` and named exports?**
A: Named export: `export const PI = 3.14;` — import with exact name: `import { PI } from './math'`
   Default export: `export default function App() {}` — import with any name: `import App from './App'`
   One file can have ONE default export and MANY named exports.
   Prefer named exports for utilities/constants. Default for main module export.

**Q30. What is the Map object and how is it different from a plain object?**
A: Map → collection of key-value pairs where keys can be ANY type (including objects, functions).
   Object → keys are always strings or symbols.
   Map advantages:
   - Preserves insertion order (guaranteed).
   - Has `.size` property.
   - Better performance for frequent addition/removal.
   - Keys can be objects: `map.set(userObj, "admin")`.
   Use object for simple config/data. Use Map when keys need to be non-strings or you need ordering.
