// ============================================================
// DAY 1 — JavaScript: PROTOTYPE & THIS KEYWORD
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: PROTOTYPE — THE BASICS
// ─────────────────────────────────────────────────────────────
// JavaScript uses PROTOTYPAL inheritance (not classical).
// Every object has a hidden property: [[Prototype]] (also __proto__)
// that points to another object (its prototype).
// When you access a property, JS looks:
//   1. On the object itself
//   2. On its prototype
//   3. On prototype's prototype (prototype CHAIN)
//   4. Until it hits null → undefined

// ── 1A. Object Prototype ───────────────────────────────────────
const animal = {
  breathe() {
    console.log("Breathing...");
  },
  eat() {
    console.log("Eating...");
  },
};

const dog = {
  bark() {
    console.log("Woof!");
  },
};

// Set dog's prototype to animal
Object.setPrototypeOf(dog, animal);
// Or: dog.__proto__ = animal; (older way, not recommended)

dog.bark();    // ✅ "Woof!" — own method
dog.breathe(); // ✅ "Breathing..." — found on prototype (animal)
dog.eat();     // ✅ "Eating..."    — found on prototype chain

// Property lookup chain:
// dog → animal → Object.prototype → null

console.log(dog.hasOwnProperty("bark"));    // true  — own property
console.log(dog.hasOwnProperty("breathe")); // false — inherited

// ── 1B. Object.create() ───────────────────────────────────────
// Best way to create objects with a specific prototype
const cat = Object.create(animal); // cat's prototype IS animal
cat.meow = function () {
  console.log("Meow!");
};

cat.meow();    // ✅ own method
cat.breathe(); // ✅ inherited from animal

// ─────────────────────────────────────────────────────────────
// SECTION 2: CONSTRUCTOR FUNCTIONS & PROTOTYPE
// ─────────────────────────────────────────────────────────────
// Before ES6 classes, constructor functions were used.
// Understanding this helps understand how classes work under the hood.

function Person(name, age) {
  // 'this' refers to the new object being created
  this.name = name;
  this.age  = age;
}

// Add methods to the PROTOTYPE (not inside constructor)
// So all instances SHARE the method (memory efficient)
Person.prototype.greet = function () {
  console.log(`Hi, I'm ${this.name}, age ${this.age}`);
};

Person.prototype.toString = function () {
  return `Person(${this.name}, ${this.age})`;
};

const rohit = new Person("Rohit", 25);
const anna  = new Person("Anna", 30);

rohit.greet(); // "Hi, I'm Rohit, age 25"
anna.greet();  // "Hi, I'm Anna, age 30"

// Both share the SAME greet function from prototype (not two copies)
console.log(rohit.greet === anna.greet); // true — same function!

// What 'new' does behind the scenes:
// 1. Creates a new empty object {}
// 2. Sets its [[Prototype]] to Person.prototype
// 3. Runs Person() with 'this' = new object
// 4. Returns the new object

// ── 2A. Prototype Chain ───────────────────────────────────────
// rohit → Person.prototype → Object.prototype → null
console.log(Object.getPrototypeOf(rohit) === Person.prototype); // true
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of chain

// ── 2B. Inheritance via Prototype ─────────────────────────────
function Employee(name, age, company) {
  Person.call(this, name, age); // call parent constructor
  this.company = company;
}

// Set up prototype chain: Employee.prototype → Person.prototype
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee; // fix constructor reference

Employee.prototype.introduce = function () {
  console.log(`I'm ${this.name} at ${this.company}`);
};

const emp = new Employee("Rohit", 25, "TechCorp");
emp.greet();     // "Hi, I'm Rohit, age 25" — inherited from Person
emp.introduce(); // "I'm Rohit at TechCorp"

console.log(emp instanceof Employee); // true
console.log(emp instanceof Person);   // true — prototype chain!

// ─────────────────────────────────────────────────────────────
// SECTION 3: THE 'this' KEYWORD
// ─────────────────────────────────────────────────────────────
// 'this' refers to the EXECUTION CONTEXT — who called the function.
// 'this' is determined at CALL TIME, not definition time.
// (Exception: arrow functions which capture 'this' from lexical scope)

// ── 3A. this in Global Scope ──────────────────────────────────
// In browser: this === window
// In Node.js: this === {} (module.exports) at top level
// In strict mode: this === undefined at top level
console.log(this); // In Node.js: {}

// ── 3B. this in Regular Function ──────────────────────────────
function showThis() {
  console.log(this); // In non-strict: global object. Strict: undefined
}
showThis();

// ── 3C. this in Method (Object context) ───────────────────────
const user = {
  name: "Rohit",
  greet() {
    console.log(`Hello, ${this.name}`); // this = user object
  },
};
user.greet(); // "Hello, Rohit"

// ── 3D. LOSING 'this' — Classic Bug ──────────────────────────
const greetFn = user.greet; // extract method from object
// greetFn();    // 'this' is now undefined (strict) or global — BUG!
// console.log(this.name) → undefined or error

// Fix 1: .bind()
const boundGreet = user.greet.bind(user); // permanently binds this=user
boundGreet(); // "Hello, Rohit" ✅

// Fix 2: Arrow function in class/object
const user2 = {
  name: "Anna",
  greet: function () {
    const inner = () => {
      console.log(this.name); // arrow captures outer 'this' = user2
    };
    inner();
  },
};
user2.greet(); // "Anna" ✅

// ── 3E. call(), apply(), bind() ───────────────────────────────
// All three explicitly set 'this' for a function

function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: "Rohit" };
const person2 = { name: "Anna" };

// .call(thisArg, arg1, arg2, ...) — invokes immediately
introduce.call(person1, "Hello", "!");  // "Hello, I'm Rohit!"
introduce.call(person2, "Hi", ".");     // "Hi, I'm Anna."

// .apply(thisArg, [arg1, arg2]) — invokes immediately, args as array
introduce.apply(person1, ["Hey", "?"]); // "Hey, I'm Rohit?"

// .bind(thisArg, arg1, ...) — returns NEW function (doesn't invoke)
const rohitIntro = introduce.bind(person1, "Namaste");
rohitIntro("!"); // "Namaste, I'm Rohit!"
rohitIntro("."); // "Namaste, I'm Rohit." (reusable!)

// ── 3F. this in Arrow Functions ───────────────────────────────
// Arrow functions do NOT have their own 'this'.
// They INHERIT 'this' from the surrounding LEXICAL scope.
// Arrow functions are NOT suitable as methods!

const timer = {
  seconds: 0,
  start() {
    // Using regular function in setInterval would lose 'this'
    setInterval(() => {
      this.seconds++; // 'this' is inherited from start() context = timer
      console.log(this.seconds);
    }, 1000);
  },
};
// timer.start(); // would print 1, 2, 3... (works because arrow)

// ❌ Arrow function as method — wrong!
const badObj = {
  name: "bad",
  greet: () => {
    console.log(this.name); // 'this' is NOT badObj! It's outer scope.
  },
};

// ── 3G. this in Classes ───────────────────────────────────────
class Counter {
  constructor() {
    this.count = 0;
    // Binding in constructor — useful for event listeners
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
    console.log(this.count);
  }

  // Class field arrow function — auto-bound!
  decrement = () => {
    this.count--;
    console.log(this.count);
  };
}

const c = new Counter();
c.increment(); // 1 ✅
c.decrement(); // 0 ✅

// ── 3H. this in Event Listeners ───────────────────────────────
// (Browser only — just for knowledge)
// button.addEventListener("click", function() {
//   console.log(this); // this = the button element
// });
// button.addEventListener("click", () => {
//   console.log(this); // this = outer scope (NOT button!) ← common bug
// });

// ── 3I. new.target — detect if called with new ────────────────
function Car(model) {
  if (!new.target) {
    throw new Error("Must call Car with new keyword!");
  }
  this.model = model;
}
const myCar = new Car("Tesla"); // ✅
// Car("Tesla"); // ❌ Error: Must call Car with new keyword!

// ─────────────────────────────────────────────────────────────
// SECTION 4: PROTOTYPE METHODS — BUILT-IN USAGE
// ─────────────────────────────────────────────────────────────

// All arrays inherit from Array.prototype:
const arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// You can add to Array.prototype (but DON'T in real code — pollutes global!)
// Array.prototype.sum = function() {
//   return this.reduce((acc, val) => acc + val, 0);
// };
// [1, 2, 3].sum(); // 6

// ── 4A. hasOwnProperty vs in operator ────────────────────────
const obj = { x: 1 };
console.log("x" in obj);                    // true — own property
console.log("toString" in obj);             // true — inherited from Object.prototype
console.log(obj.hasOwnProperty("x"));       // true — own
console.log(obj.hasOwnProperty("toString")); // false — inherited

// ── 4B. for...in loops prototype chain ───────────────────────
function Parent() { this.a = 1; }
Parent.prototype.b = 2;
const child = new Parent();
child.c = 3;

for (const key in child) {
  // Includes inherited properties!
  console.log(key); // a, c, b
}

for (const key in child) {
  if (child.hasOwnProperty(key)) {
    console.log("Own:", key); // a, c (excludes b — inherited)
  }
}

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is the prototype chain?
A: A chain of objects linked by [[Prototype]] (__proto__). When you access
   a property, JS walks up the chain until it finds it or hits null.

Q: What does 'new' do?
A: 1. Creates new empty object
   2. Sets __proto__ to Constructor.prototype
   3. Binds 'this' to the new object inside constructor
   4. Returns the new object (unless constructor returns an object)

Q: What is the difference between __proto__ and prototype?
A: __proto__  → instance's link to its prototype (every object has it)
   prototype  → property on FUNCTIONS/constructors used when creating instances

Q: What are 4 ways to set 'this'?
A: 1. Implicit binding: obj.method() → this = obj
   2. Explicit binding: fn.call(ctx) / fn.apply(ctx) / fn.bind(ctx)
   3. new binding: new Fn() → this = new object
   4. Default: standalone fn() → global (or undefined in strict mode)

Q: Why don't arrow functions work as methods?
A: Arrow functions don't have their own 'this' — they capture it from
   the surrounding lexical scope (usually global/module), not the object.

Q: What is the difference between call, apply, and bind?
A: call(ctx, a, b)    → invokes immediately, args listed individually
   apply(ctx, [a, b]) → invokes immediately, args as array
   bind(ctx, a)       → returns new bound function, doesn't invoke

Q: How does prototypal inheritance differ from classical?
A: Classical (Java/C++): classes define blueprints, instances are copies.
   Prototypal (JS): objects inherit directly from other objects via chain.
   ES6 classes are syntactic sugar over prototypal inheritance.
*/
