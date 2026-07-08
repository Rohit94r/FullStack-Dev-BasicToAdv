# Day 4 — TypeScript Interview Questions & Answers

TypeScript is now standard for all serious projects. Know it deeply.

---

## SECTION A — TypeScript Fundamentals

**Q1. What is TypeScript and what problem does it solve?**
A: TypeScript is JavaScript with STATIC TYPES added on top.
   Problems it solves:
   - Catches type errors at COMPILE TIME not at runtime (no more "undefined is not a function").
   - IDE gets rich autocomplete, hover types, instant error highlighting.
   - Code becomes self-documenting — function signatures tell you exactly what to pass.
   - Easier refactoring in large codebases (rename a property and TS shows all broken references).
   TS compiles (transpiles) to plain JS — browsers never see TypeScript.

**Q2. What is the difference between JavaScript and TypeScript?**
A: JavaScript → dynamically typed. Types checked at runtime. No compilation step.
   TypeScript  → statically typed. Types checked at compile time. Must compile to JS.
   TypeScript is a SUPERSET of JavaScript. All valid JS is valid TS. You add types progressively.
   TS adds: type annotations, interfaces, generics, enums, decorators, access modifiers.

**Q3. What is type inference?**
A: TypeScript automatically infers the type from the assigned value — you don't always need to annotate.
   `const name = "Rohit";` → TS infers `string`. You don't need `const name: string = "Rohit"`.
   `const nums = [1, 2, 3];` → infers `number[]`.
   Only annotate when inference fails or when you want to be explicit (function return types, declarations).

**Q4. What is the `any` type? Why should you avoid it?**
A: `any` opts out of type checking for that variable. It can be anything, TS won't complain.
   Why avoid: you lose ALL benefits of TypeScript. No errors, no autocomplete.
   `let x: any = 5; x.foo.bar.baz();` — compiles fine, fails at runtime.
   Alternatives: `unknown` (must narrow before using), specific union types, generics.
   If your codebase has lots of `any`, TypeScript is just "JavaScript with extra steps."

**Q5. What is the difference between `any` and `unknown`?**
A: any     → no restrictions. Can be assigned to anything, anything can be assigned to it.
   unknown  → SAFE any. Must perform type checking (narrowing) before using it.
   ```
   let x: unknown = "hello";
   x.toUpperCase(); // Error! — must narrow first
   if (typeof x === "string") { x.toUpperCase(); } // works
   ```
   Use unknown for values from external sources (API responses, user input) instead of any.

---

## SECTION B — Interfaces vs Type Aliases

**Q6. What is the difference between `interface` and `type`?**
A: Both describe the SHAPE of an object. They are mostly interchangeable.
   Key differences:
   - interface → can be EXTENDED (inheritance): `interface B extends A {}`
   - interface → can be merged (Declaration Merging): two `interface User {}` merge into one.
   - type alias → more powerful: can define unions, tuples, mapped types, conditional types.
   - type alias → cannot be merged.
   Convention: use `interface` for object shapes (especially for OOP/classes).
               use `type` for unions, tuples, complex types, computed types.

**Q7. What is declaration merging in TypeScript?**
A: When you declare the same interface twice, TypeScript MERGES them into one.
   ```
   interface User { name: string; }
   interface User { age: number; }
   // Result: interface User { name: string; age: number; }
   ```
   This happens automatically. Useful for extending third-party library types (module augmentation).
   type aliases CANNOT be merged — redeclaring causes a compile error.

**Q8. What is an intersection type?**
A: Combines multiple types into ONE that has ALL properties of both.
   `type AdminUser = User & Admin;` — must satisfy BOTH User AND Admin.
   Compare to union: `type Result = Success | Error;` — must satisfy ONE of them.
   Use intersections to compose complex types from simpler ones.

**Q9. What is a union type? When do you use it?**
A: A type that can be ONE of several types.
   `type ID = string | number;` — ID can be either string or number.
   `type Status = "pending" | "active" | "inactive";` — string literal union (like enum).
   When using a union, you must NARROW the type before using type-specific methods.
   `if (typeof id === "string") { id.toUpperCase(); }`

---

## SECTION C — Generics

**Q10. What are generics in TypeScript?**
A: Generics allow writing REUSABLE code that works with different types while remaining type-safe.
   Like a placeholder for a type that gets filled in when the function/class is used.
   ```
   function identity<T>(value: T): T { return value; }
   identity<string>("hello") → returns string
   identity<number>(42) → returns number
   ```
   Without generics: you'd need separate functions for each type, or use `any` (unsafe).

**Q11. What is a generic constraint?**
A: Restricts what types can be used as the generic parameter.
   ```
   function getLength<T extends { length: number }>(item: T): number {
     return item.length;
   }
   ```
   `T extends { length: number }` — T must have a length property.
   Works with: strings, arrays, objects with length. Doesn't work with: numbers, booleans.

**Q12. Write a generic Stack class.**
A: ```
   class Stack<T> {
     private items: T[] = [];
     push(item: T): void { this.items.push(item); }
     pop(): T | undefined { return this.items.pop(); }
     peek(): T | undefined { return this.items[this.items.length - 1]; }
     isEmpty(): boolean { return this.items.length === 0; }
   }
   const numStack = new Stack<number>();
   const strStack = new Stack<string>();
   ```

---

## SECTION D — Utility Types

**Q13. What are utility types? Name the most important ones.**
A: Built-in generic types that transform other types. Save you from writing complex type logic.
   Most important:
   - `Partial<T>`  → makes all properties optional
   - `Required<T>` → makes all properties required
   - `Readonly<T>` → makes all properties readonly
   - `Pick<T, K>`  → picks a subset of properties
   - `Omit<T, K>`  → removes specific properties
   - `Record<K, V>` → creates object type with specific keys and value type
   - `Exclude<T, U>` → removes types from union
   - `ReturnType<T>` → extracts return type of a function type
   - `Awaited<T>`   → unwraps Promise type

**Q14. What does `Partial<T>` do? When do you use it?**
A: Makes every property of T optional (adds `?` to all).
   ```
   interface User { name: string; email: string; age: number; }
   function updateUser(id: string, updates: Partial<User>) { ... }
   updateUser("1", { name: "Rohit" }); // Only send what changed
   ```
   Use for: update/patch functions, form state where fields are filled progressively.

**Q15. What does `Record<K, V>` do?**
A: Creates an object type where keys are of type K and values of type V.
   ```
   type Status = "pending" | "active" | "banned";
   type UsersByStatus = Record<Status, User[]>;
   // { pending: User[], active: User[], banned: User[] }
   ```
   Ensures all keys in a union have corresponding values. Perfect for lookup tables.

**Q16. What is `Pick` vs `Omit`?**
A: Pick → creates new type with ONLY specified properties.
          `type UserPreview = Pick<User, "id" | "name">` — only id and name.
   Omit → creates new type WITHOUT specified properties.
          `type UserNoPass = Omit<User, "password">` — everything except password.
   Use Omit for API responses where you strip sensitive fields.
   Use Pick for DTOs, partial views, form sections.

---

## SECTION E — Enums & Type Narrowing

**Q17. What are TypeScript enums? What are const enums?**
A: Enums define named constants — a set of related values.
   ```
   enum Direction { Up, Down, Left, Right } // numeric: 0,1,2,3
   enum Status { Pending = "PENDING", Active = "ACTIVE" } // string enum
   ```
   const enum → inlined at compile time (no runtime object). Smaller bundle.
   Common pattern: use string enums for values that appear in logs/APIs (readable).
   Alternative: many prefer `type Status = "pending" | "active"` (simpler, no enum overhead).

**Q18. What is type narrowing? Give 3 examples.**
A: Narrowing = using checks to refine a type from broad to specific inside a block.
   1. `typeof` narrowing:
      `if (typeof x === "string") { x.toUpperCase(); }`
   2. `instanceof` narrowing:
      `if (error instanceof NetworkError) { error.statusCode }`
   3. `in` narrowing (property check):
      `if ("email" in user) { user.email }`
   4. Discriminated union (tag narrowing):
      `if (shape.kind === "circle") { shape.radius }` — TS knows it's Circle
   5. Truthiness narrowing:
      `if (user) { user.name }` — TS knows user is not null/undefined

**Q19. What is a discriminated union (tagged union)?**
A: A union type where each member has a literal type property (the discriminant/tag).
   TypeScript uses the tag to narrow the type automatically.
   ```
   type Shape =
     | { kind: "circle"; radius: number }
     | { kind: "rect"; width: number; height: number };
   
   function getArea(s: Shape): number {
     if (s.kind === "circle") return Math.PI * s.radius ** 2; // TS knows it's circle
     return s.width * s.height; // TS knows it's rect
   }
   ```
   Use for: Redux actions, API responses, error types, state machines.

**Q20. What is a type guard? What is the difference between `typeof`, `instanceof`, and custom guards?**
A: Type guard = any expression that narrows the type in a conditional block.
   typeof     → checks primitive types (string, number, boolean, function).
   instanceof → checks if object is instance of a class. Only works with classes.
   Custom guard: `function isUser(val: any): val is User { return val && typeof val.name === "string"; }`
   The `val is User` return type annotation tells TypeScript this function narrows to User.
   Use custom guards for complex type checking of API responses or union types.

---

## SECTION F — Advanced TypeScript

**Q21. What are mapped types?**
A: Types that create new types by transforming each property of an existing type.
   ```
   type Nullable<T> = { [K in keyof T]: T[K] | null };
   type Optional<T> = { [K in keyof T]?: T[K] };
   type ReadonlyAll<T> = { readonly [K in keyof T]: T[K] };
   ```
   This is how Partial, Required, Readonly are implemented internally.

**Q22. What are conditional types?**
A: Types that conditionally resolve based on a check: `T extends U ? X : Y`
   ```
   type IsString<T> = T extends string ? true : false;
   type Flatten<T> = T extends Array<infer U> ? U : T;
   // Flatten<string[]> → string, Flatten<number> → number
   ```
   Use with `infer` to extract types from within other types.

**Q23. What is `keyof`?**
A: `keyof T` produces a union of ALL property names of type T as string literals.
   ```
   interface User { name: string; age: number; }
   type UserKey = keyof User; // "name" | "age"
   ```
   Use for: type-safe property access in generics.
   `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }`

**Q24. What is `typeof` in type position vs value position?**
A: In VALUE position: `typeof x` → returns a string ("string", "number", etc.) at RUNTIME.
   In TYPE position:  `type T = typeof x` → captures the TS TYPE of x at COMPILE TIME.
   ```
   const config = { host: "localhost", port: 3000 };
   type Config = typeof config; // { host: string; port: number }
   ```
   Very useful for extracting types from runtime values without duplicating.

**Q25. What is the `ReturnType` utility type?**
A: Extracts the return type of a function type.
   ```
   function getUser() { return { name: "Rohit", age: 25 }; }
   type UserResult = ReturnType<typeof getUser>; // { name: string; age: number }
   ```
   Use when: you want the return type of a function but don't want to define a separate interface.
   The type automatically updates if the function's return changes.

**Q26. What is the `as const` assertion?**
A: Makes TypeScript infer the NARROWEST possible type (literal types, readonly).
   ```
   const colors = ["red", "green", "blue"] as const;
   // type: readonly ["red", "green", "blue"] — not string[]
   type Color = typeof colors[number]; // "red" | "green" | "blue"
   ```
   Without: `string[]`. With as const: `readonly ["red", "green", "blue"]`.
   Use for: defining string literal unions from arrays, config objects that shouldn't change.

**Q27. What is the `never` type?**
A: `never` represents values that NEVER occur.
   Used in: functions that never return (throw, infinite loop), exhaustive checks.
   ```
   function assertNever(x: never): never {
     throw new Error("Unexpected value: " + x);
   }
   ```
   In exhaustive switch: if you add a new case to a discriminated union without handling it
   in the switch, the default branch catches it as `never` and TypeScript errors — forcing you to handle it.

**Q28. What is `strict` mode in TypeScript? What does enabling it do?**
A: `"strict": true` in tsconfig.json enables a set of strict checks.
   Includes: strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization.
   strictNullChecks: `null` and `undefined` are NOT assignable to other types. You must handle them.
   noImplicitAny: can't leave types unspecified where inference fails (forces explicit annotation).
   ALWAYS enable strict mode. It makes TypeScript actually catch real bugs.

**Q29. What is `tsconfig.json` and what are the most important options?**
A: Configuration file for the TypeScript compiler. Key options:
   `"target"`: which JS version to compile to (es2020, es2022).
   `"module"`: module system (commonjs for Node, es2020 for browser).
   `"outDir"`: where compiled JS files go (./dist).
   `"rootDir"`: where source TS files are (./src).
   `"strict"`: enable all strict checks.
   `"esModuleInterop"`: allow default imports from CommonJS modules.
   `"paths"`: configure path aliases (e.g., @/utils → ./src/utils).

**Q30. What is the difference between `ts-node` and compiling with `tsc`?**
A: `tsc` → the TypeScript COMPILER. Produces actual .js files. Use for production builds.
   `ts-node` → runs TypeScript files directly in Node.js without producing .js files.
               Uses ts-node's runtime compilation. Use for development/scripts.
   `tsx` → modern replacement for ts-node. Faster, supports ESM better.
   `tsc --watch` → watches for changes and recompiles. Use alongside nodemon for dev server.
