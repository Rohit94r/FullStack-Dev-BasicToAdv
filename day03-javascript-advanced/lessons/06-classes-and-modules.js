// ============================================================
// DAY 1 — JavaScript: CLASSES & MODULES
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: CLASSES — ES6 Syntax
// ─────────────────────────────────────────────────────────────
// Classes are SYNTACTIC SUGAR over prototypal inheritance.
// Under the hood, it's still prototypes!
// They make OOP code cleaner and more readable.

// ── 1A. Basic Class ───────────────────────────────────────────
class Animal {
  // constructor runs when 'new Animal()' is called
  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
    this.alive = true; // instance property with default value
  }

  // Method — added to Animal.prototype (shared across instances)
  speak() {
    console.log(`${this.name} says ${this.sound}!`);
  }

  // Getter — accessed like a property, runs like a method
  get info() {
    return `${this.name} (${this.sound})`;
  }

  // Setter — validates before setting value
  set animalName(newName) {
    if (typeof newName !== "string" || newName.length < 2) {
      throw new Error("Name must be a string with at least 2 characters");
    }
    this.name = newName;
  }

  // Static method — called on the CLASS, not instances
  static kingdom() {
    return "Animalia";
  }

  // Static property (ES2022)
  static planet = "Earth";

  // toString for custom string representation
  toString() {
    return `Animal: ${this.name}`;
  }
}

const dog  = new Animal("Rex", "Woof");
const cat  = new Animal("Whiskers", "Meow");

dog.speak();                        // "Rex says Woof!"
console.log(dog.info);              // "Rex (Woof)" — uses getter
dog.animalName = "Max";             // uses setter
console.log(Animal.kingdom());      // "Animalia" — static method
console.log(Animal.planet);         // "Earth" — static property
console.log(`${dog}`);              // "Animal: Max" — toString

// ── 1B. Private Fields (ES2022) ───────────────────────────────
// # prefix makes a field truly private (not just conventionally private)
class BankAccount {
  #balance;        // private field declaration
  #owner;          // private field
  #transactionLog = []; // private with default value

  constructor(owner, initialBalance) {
    this.#owner   = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
    this.#transactionLog.push(`+${amount}`);
    return this;  // return this for method chaining
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#transactionLog.push(`-${amount}`);
    return this;
  }

  get balance()  { return this.#balance; }
  get owner()    { return this.#owner; }
  get history()  { return [...this.#transactionLog]; } // return copy

  // Private method
  #formatBalance() {
    return `$${this.#balance.toFixed(2)}`;
  }

  toString() {
    return `${this.#owner}: ${this.#formatBalance()}`;
  }
}

const account = new BankAccount("Rohit", 1000);
account.deposit(500).withdraw(200); // method chaining
console.log(account.balance);       // 1300
console.log(account.history);       // ["+500", "-200"]
// console.log(account.#balance);   // ❌ SyntaxError — truly private!

// ── 1C. Class Inheritance ─────────────────────────────────────
class Dog extends Animal {
  #breed;

  constructor(name, breed) {
    super(name, "Woof"); // MUST call super() first in subclass constructor
    this.#breed = breed;
  }

  // Override parent method
  speak() {
    super.speak(); // call parent's speak()
    console.log(`${this.name} is a ${this.#breed}`);
  }

  fetch(item) {
    console.log(`${this.name} fetches the ${item}!`);
  }

  get breedInfo() {
    return this.#breed;
  }
}

const labrador = new Dog("Buddy", "Labrador");
labrador.speak();           // calls overridden speak
labrador.fetch("ball");     // "Buddy fetches the ball!"
console.log(labrador instanceof Dog);    // true
console.log(labrador instanceof Animal); // true — inheritance chain

// ── 1D. Mixins — Multiple Inheritance Pattern ─────────────────
// JS classes support single inheritance only.
// Use Mixins to compose behavior from multiple sources.

const Serializable = (Base) => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }
  static deserialize(json) {
    return Object.assign(new this(), JSON.parse(json));
  }
};

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
    return this;
  }
};

// Compose multiple mixins
class User extends Timestamped(Serializable(Animal)) {
  constructor(name, email) {
    super(name, "hello");
    this.email = email;
  }
}

const user = new User("Rohit", "rohit@example.com");
console.log(user.createdAt); // has timestamp
console.log(user.serialize()); // JSON string

// ── 1E. Abstract Class Pattern ────────────────────────────────
// JS has no built-in abstract class, but we can simulate:
class Shape {
  constructor(color) {
    if (new.target === Shape) {
      throw new Error("Shape is abstract — cannot instantiate directly");
    }
    this.color = color;
  }

  // Abstract method — must be overridden
  area() {
    throw new Error(`${this.constructor.name} must implement area()`);
  }

  toString() {
    return `${this.constructor.name}(color=${this.color}, area=${this.area()})`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width  = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// const s = new Shape("red"); // ❌ Error: Shape is abstract
const circle = new Circle("red", 5);
const rect   = new Rectangle("blue", 4, 6);
console.log(circle.toString()); // "Circle(color=red, area=78.53...)"
console.log(rect.toString());   // "Rectangle(color=blue, area=24)"

// ─────────────────────────────────────────────────────────────
// SECTION 2: MODULES — ES Modules (ESM)
// ─────────────────────────────────────────────────────────────
// Modules let you split code into separate files.
// Each file is its own module — variables are private by default.
// You explicitly export what you want to share.

// FILE: math.js
// ─────────────────────────────────────────────
// Named exports — export multiple things by name
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export function subtract(a, b) { return a - b; }
// export class Calculator { ... }
//
// Default export — one per file, for the "main" thing
// export default class MathHelper { ... }

// FILE: main.js
// ─────────────────────────────────────────────
// Named import — use { } with exact names
// import { PI, add, subtract } from "./math.js";
//
// Rename on import:
// import { add as sum } from "./math.js";
//
// Default import — any name you choose:
// import MathHelper from "./math.js";
//
// Import everything as namespace:
// import * as Math from "./math.js";
// Math.add(1, 2);
//
// Import both default and named:
// import MathHelper, { PI, add } from "./math.js";

// ── Dynamic Imports ───────────────────────────────────────────
// Load modules on demand (code splitting, lazy loading)
async function loadModule() {
  if (true) { // some condition
    const { add } = await import("./math.js"); // loads when needed
    console.log(add(2, 3)); // 5
  }
}

// ── CommonJS (Node.js older syntax) ──────────────────────────
// module.exports = { add, subtract }; // exports
// const { add } = require("./math");  // imports
// Note: Can't mix require() and import in same file!

// ─────────────────────────────────────────────────────────────
// SECTION 3: ADVANCED CLASS PATTERNS
// ─────────────────────────────────────────────────────────────

// ── 3A. Singleton Pattern ─────────────────────────────────────
class Singleton {
  static #instance = null;

  #data;

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance; // return existing instance
    }
    this.#data = [];
    Singleton.#instance = this;
  }

  add(item) {
    this.#data.push(item);
    return this;
  }

  getAll() {
    return [...this.#data];
  }
}

const s1 = new Singleton();
const s2 = new Singleton();
s1.add("hello");
console.log(s2.getAll()); // ["hello"] — same instance!
console.log(s1 === s2);   // true

// ── 3B. Observer Pattern ──────────────────────────────────────
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return this; // chaining
  }

  off(event, callback) {
    if (!this.#listeners.has(event)) return this;
    const updated = this.#listeners.get(event).filter(cb => cb !== callback);
    this.#listeners.set(event, updated);
    return this;
  }

  emit(event, ...args) {
    if (!this.#listeners.has(event)) return this;
    this.#listeners.get(event).forEach(cb => cb(...args));
    return this;
  }
}

const emitter = new EventEmitter();
const handler = (data) => console.log("Received:", data);
emitter.on("data", handler);
emitter.emit("data", { id: 1, name: "Test" }); // "Received: { id: 1, name: 'Test' }"
emitter.off("data", handler);
emitter.emit("data", "won't print"); // no listeners

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: Are ES6 classes true classes like in Java?
A: No! ES6 classes are syntactic sugar over prototypal inheritance.
   Under the hood, they use prototype chains, not true OOP classes.

Q: What does 'super' do?
A: In constructor: calls parent class constructor (mandatory before 'this')
   In methods: calls the parent class's method of the same name.

Q: What is the difference between instance and static methods?
A: Instance methods: available on objects created with 'new'
   Static methods: available on the class itself, not instances
   Use case: utility functions, factories belong on static.

Q: How do private class fields work?
A: # prefix (ES2022) makes fields truly private — not accessible outside.
   Unlike convention-based _ prefix, # enforces privacy at language level.

Q: What is a getter/setter?
A: Getter: accessed like a property but runs a function — get info()
   Setter: called like property assignment but validates — set name(v)

Q: What is the difference between ESM and CommonJS?
A: ESM (import/export): static, tree-shakeable, async, browser native
   CJS (require/module.exports): synchronous, dynamic, Node.js original

Q: What are mixins and why use them?
A: Mixins add behavior from multiple sources to a class.
   JS only supports single inheritance, mixins work around this.
   Pattern: const Mixed = Mixin1(Mixin2(BaseClass));

Q: What is the Singleton pattern?
A: Ensures only ONE instance of a class exists.
   Store instance in static property, return it from constructor.
*/
