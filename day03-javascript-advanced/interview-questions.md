# Day 3 — JavaScript Advanced Interview Questions & Answers

These are the questions that SEPARATE senior developers from beginners.
Master every answer here.

---

## SECTION A — Scope & Closures

**Q1. What is scope in JavaScript? Name the 3 types.**
A: Scope = where a variable is accessible.
   Global scope  → declared outside any function/block. Accessible everywhere. Avoid polluting it.
   Function scope → `var` and `function` declarations. Only accessible inside that function.
   Block scope   → `let` and `const`. Only accessible inside the `{}` block they are declared in.
   Lexical scope: inner functions can access outer scope. Outer cannot access inner.

**Q2. What is a closure? Why is it one of the most important JS concepts?**
A: A closure is a function that REMEMBERS the variables from its outer scope even after
   that outer function has finished executing.
   ```
   function makeCounter() {
     let count = 0;             // outer variable
     return function() {        // inner function
       count++;                 // still has access to count — this is the closure
       return count;
     };
   }
   const counter = makeCounter(); // outer function done, but count lives on
   counter(); // 1
   counter(); // 2
   ```
   Why important: used in: data privacy (encapsulation), memoization, currying, event handlers,
   module pattern, factory functions. Closures are everywhere in JS.

**Q3. What is the classic closure-in-a-loop bug? How do you fix it?**
A: Bug:
   ```
   for (var i = 0; i < 3; i++) {
     setTimeout(() => console.log(i), 1000); // prints 3, 3, 3
   }
   ```
   Why: var is function-scoped, not block-scoped. All callbacks share the same `i`.
   By the time they run, the loop is done and i=3.
   Fix 1: Use `let` (block-scoped, creates new binding each iteration).
   Fix 2: IIFE — `(function(i) { setTimeout(...)  })(i);`

**Q4. What is the IIFE (Immediately Invoked Function Expression)?**
A: A function that defines and immediately executes itself.
   `(function() { ... })();`
   Why used: create a private scope (before ES modules). Variables inside don't pollute global scope.
   Still seen in: old codebases, some patterns. Replaced mostly by ES modules today.

**Q5. What is lexical scope?**
A: The scope is determined by WHERE the function is WRITTEN (defined), not where it is called.
   Inner functions can access variables of outer functions because of lexical scope.
   This is why closures work — the function "closes over" its lexical environment.

---

## SECTION B — Hoisting

**Q6. What is hoisting?**
A: JavaScript moves DECLARATIONS to the top of their scope before code runs.
   Only the declaration is hoisted, NOT the initialization.
   `var x = 5;` — `var x;` is hoisted, `x = 5;` is not.
   So accessing `x` before `var x = 5;` gives undefined (not error).
   With `let`/`const`: also hoisted but NOT initialized. Accessing before declaration → ReferenceError
   (Temporal Dead Zone).

**Q7. What is the Temporal Dead Zone (TDZ)?**
A: The period between when let/const is hoisted and when it is actually initialized.
   During TDZ, accessing the variable throws: ReferenceError: Cannot access 'x' before initialization.
   ```
   console.log(x); // ReferenceError — TDZ
   let x = 5;
   ```
   This is why `let`/`const` are safer than `var` — you get an error instead of silent undefined.

**Q8. Are function declarations hoisted?**
A: YES. Fully hoisted — both declaration AND implementation.
   You can call a function declaration BEFORE it appears in code:
   `greet(); // works!`
   `function greet() { console.log("Hello"); }`
   But function EXPRESSIONS are not:
   `greet(); // TypeError: greet is not a function`
   `var greet = function() {};` — only var declaration hoisted, not the function value.

---

## SECTION C — The Event Loop

**Q9. What is the JavaScript event loop? Explain in detail.**
A: JS is single-threaded — it can only do one thing at a time.
   The event loop manages HOW async operations are handled.
   Components:
   - Call Stack     → where synchronous code runs. LIFO.
   - Web APIs       → browser provides async capabilities (setTimeout, fetch, DOM events).
                      When an async call is made, it goes here, not the stack.
   - Callback Queue → when async operations finish, their callbacks go here. FIFO.
   - Microtask Queue → higher priority than callback queue. Promises (.then), queueMicrotask go here.
   - Event Loop     → constantly checks: is call stack empty? If yes, take from microtask queue first,
                      then callback queue. Push to stack and run.

**Q10. What runs first — Promise.then or setTimeout?**
A: Promise.then ALWAYS runs before setTimeout, even if setTimeout delay is 0.
   Why: Promises go to the MICROTASK queue (higher priority).
   setTimeout callbacks go to the MACRO-TASK queue (lower priority).
   Order: synchronous code → all microtasks → one macro-task → all microtasks → next macro-task...
   ```
   console.log("1");
   setTimeout(() => console.log("2"), 0);
   Promise.resolve().then(() => console.log("3"));
   console.log("4");
   // Output: 1, 4, 3, 2
   ```

**Q11. What does "non-blocking" mean in Node.js?**
A: When Node.js performs an I/O operation (reading a file, making HTTP request),
   it does NOT wait for it to complete. It registers a callback and moves on.
   When the I/O is done, the callback is added to the event loop queue.
   This allows Node to handle thousands of concurrent connections with a single thread.
   Compare to traditional blocking servers: each request blocks a thread until done.
   Node's non-blocking I/O = high concurrency with low memory usage.

---

## SECTION D — Promises & Async/Await

**Q12. What are the 3 states of a Promise?**
A: Pending   → initial state. Operation not yet complete.
   Fulfilled  → operation completed successfully. .then() is called.
   Rejected   → operation failed. .catch() is called.
   Once a promise is fulfilled or rejected, it is SETTLED and cannot change state.

**Q13. What is `Promise.all`? What happens if one promise rejects?**
A: Takes array of promises. Runs them in parallel. Resolves when ALL resolve.
   Returns array of all results in same order as input.
   If ANY ONE rejects → immediately rejects with that error (fast-fail).
   Use for: parallel operations that all need to succeed (fetch multiple APIs simultaneously).
   `const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);`

**Q14. What is `Promise.allSettled`?**
A: Like Promise.all but WAITS for all promises regardless of failure.
   Returns array of objects: `{ status: "fulfilled", value: ... }` or `{ status: "rejected", reason: ... }`.
   Use for: when you want all results even if some fail (batch operations).
   `const results = await Promise.allSettled([p1, p2, p3]);`

**Q15. What is `Promise.race` and `Promise.any`?**
A: race → resolves/rejects with the FIRST settled promise (whichever finishes first, success or fail).
          Use for: implementing timeouts.
   any  → resolves with the FIRST FULFILLED promise (ignores rejections).
          Rejects only if ALL promises reject.
          Use for: redundant requests (first server to respond wins).

**Q16. What is async/await and what does it return?**
A: `async` marks a function as asynchronous. It always returns a PROMISE.
   `await` pauses execution inside the async function until the promise settles.
   The caller is NOT blocked — the rest of the program continues.
   `await` can only be used inside `async` functions (or top-level in ES modules).
   Always use try/catch with async/await for error handling.

**Q17. How do you handle errors in async/await?**
A: Try/catch:
   ```
   async function getData() {
     try {
       const data = await fetch(url);
       return await data.json();
     } catch (error) {
       console.error("Failed:", error.message);
     }
   }
   ```
   Or attach .catch() at the call site: `getData().catch(err => console.error(err))`

---

## SECTION E — `this` & Prototype

**Q18. What does `this` refer to in JavaScript? Why is it confusing?**
A: `this` is determined by HOW a function is CALLED, not where it is defined.
   - In global scope (non-strict): `this` = window (browser) or global (Node).
   - In a method: `this` = the object the method is called on.
   - In a constructor: `this` = the new object being created.
   - In arrow function: `this` = lexically inherited from outer scope (no own `this`).
   - After .bind(): `this` = what you bound it to.
   - After .call()/.apply(): `this` = first argument.

**Q19. What is the difference between `.call()`, `.apply()`, and `.bind()`?**
A: All three set the `this` context explicitly.
   .call(thisArg, arg1, arg2)  → invokes immediately. Args passed individually.
   .apply(thisArg, [arg1, arg2]) → invokes immediately. Args passed as array.
   .bind(thisArg, arg1)        → does NOT invoke. Returns a NEW function with bound this.
   Memory: Call = comma, Apply = array, Bind = doesn't run.

**Q20. What is the prototype chain?**
A: Every JavaScript object has a hidden `__proto__` property pointing to its prototype.
   When you access a property, JS looks: own properties → prototype → prototype's prototype → ... → null.
   `Array.prototype.map` — that's why all arrays have `.map()` — they inherit from Array.prototype.
   `Object.prototype` is at the top of all chains.

**Q21. What is `Object.create()`?**
A: Creates a new object with specified prototype.
   `const obj = Object.create(proto)` — obj.__proto__ === proto.
   Use for: prototypal inheritance without classes.
   `Object.create(null)` creates object with NO prototype (pure hash map).

---

## SECTION F — Classes & Modules

**Q22. What are JavaScript classes? Are they just syntactic sugar?**
A: YES. Classes in JS are syntactic sugar over prototype-based inheritance.
   Under the hood, `class Dog extends Animal` sets up the prototype chain.
   But ES6 classes are stricter — they always run in strict mode,
   and cannot be called without `new`.

**Q23. What is the difference between `extends` and implementing prototype inheritance manually?**
A: Class with extends:
   `class Dog extends Animal { ... }` — clean, readable, sets up prototype chain automatically.
   Manual: `Dog.prototype = Object.create(Animal.prototype);` — verbose, error-prone.
   Always use class syntax in modern code.

**Q24. What is the difference between static methods and instance methods?**
A: Instance methods → available on instances (`new Dog()`). `this` = instance.
   Static methods   → called on the CLASS itself. `this` = class. Not available on instances.
   `static create() {}` — `Dog.create()` works. `dog.create()` throws TypeError.
   Use static for factory methods, utilities that don't need instance state.

**Q25. What are ES modules? What is the difference from CommonJS?**
A: ES Modules (ESM): `import/export` syntax. Browser-native. Async. `.js` in browsers, `.mjs` or "type":"module".
   CommonJS: `require()/module.exports`. Node.js original system. Synchronous.
   Key differences:
   - ESM is static (imports resolved at parse time). CommonJS is dynamic.
   - ESM has tree-shaking (unused exports eliminated by bundlers).
   - ESM is strict mode by default.
   - Modern Node supports both. New projects should use ESM.

---

## SECTION G — Array Methods & Functional Programming

**Q26. What is the difference between `forEach` and `map`?**
A: forEach → executes function for side effects. Returns undefined. Cannot chain.
   map     → transforms and returns NEW array. Chainable.
   Never use map just for side effects (forEach is correct then).
   Never use forEach when you need the result (use map, filter, reduce).

**Q27. What does `reduce` do? Write it from scratch.**
A: Accumulates array to a single value.
   ```
   Array.prototype.myReduce = function(callback, initial) {
     let acc = initial;
     for (let i = 0; i < this.length; i++) {
       acc = callback(acc, this[i], i, this);
     }
     return acc;
   };
   ```
   Can implement map and filter using only reduce. It is the most powerful array method.

**Q28. What is a pure function?**
A: A function that:
   1. Given the same inputs, ALWAYS returns the same output.
   2. Has NO side effects (doesn't modify external state, no I/O, no randomness).
   Example pure: `const add = (a, b) => a + b`
   Example impure: `function greet() { console.log("Hi " + name); }` — depends on outer name, has console side effect.
   Why: pure functions are predictable, testable, cacheable (memoizable).

**Q29. What is currying?**
A: Converting a function that takes multiple arguments into a chain of functions each taking one argument.
   `const add = a => b => a + b;`
   `add(5)(3)` → 8
   `const add5 = add(5);` — creates a partially applied function
   `add5(3)` → 8, `add5(10)` → 15
   Why: create reusable specialized functions from general ones.

**Q30. What is memoization?**
A: Caching the result of an expensive function call so repeated calls with the same input
   return the cached result instead of recomputing.
   ```
   function memoize(fn) {
     const cache = {};
     return function(n) {
       if (cache[n] !== undefined) return cache[n];
       cache[n] = fn(n);
       return cache[n];
     };
   }
   ```
   Use for: expensive calculations like Fibonacci, API responses, complex renders.
   React uses memoization in useMemo and useCallback.
