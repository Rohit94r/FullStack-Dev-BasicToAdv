// =============================================================================
// DAY 5 — LESSON 7: Events & EventEmitter in Node.js
// =============================================================================
// Node.js is built on an EVENT-DRIVEN architecture.
// The EventEmitter class is the foundation of almost everything in Node:
// HTTP servers, file streams, databases, websockets — all emit events.
// If you understand EventEmitter, you understand how Node works internally.
// =============================================================================

const EventEmitter = require("events");

// =============================================================================
// SECTION 1: What is an EventEmitter?
// =============================================================================
// Think of it like this:
//   - You can "subscribe" to an event (like subscribing to a YouTube channel)
//   - When the event is emitted, all listeners are called
//   - It's the Observer / PubSub pattern built into Node

// Create an instance of EventEmitter
const emitter = new EventEmitter();

// LISTEN for an event — .on(eventName, callback)
emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

// EMIT the event — trigger all listeners
emitter.emit("greet", "Rohit"); // → "Hello, Rohit!"
emitter.emit("greet", "World"); // → "Hello, World!"

// =============================================================================
// SECTION 2: .once() — Listen Only One Time
// =============================================================================
// .on()    → listener called EVERY TIME the event is emitted
// .once()  → listener called only the FIRST TIME, then automatically removed

const emitter2 = new EventEmitter();

emitter2.once("connect", () => {
  console.log("Connected! (this will only fire once)");
});

emitter2.emit("connect"); // → "Connected!"
emitter2.emit("connect"); // → nothing, listener already removed
emitter2.emit("connect"); // → nothing

// =============================================================================
// SECTION 3: Removing Listeners — .off() / .removeListener()
// =============================================================================

const emitter3 = new EventEmitter();

function handleData(data) {
  console.log("Received:", data);
}

emitter3.on("data", handleData);
emitter3.emit("data", "first");  // → "Received: first"

// Remove the specific listener
emitter3.off("data", handleData); // same as .removeListener()
// OR: emitter3.removeListener("data", handleData);

emitter3.emit("data", "second"); // → nothing, listener was removed

// Remove ALL listeners for a specific event
emitter3.removeAllListeners("data");

// =============================================================================
// SECTION 4: Passing Multiple Arguments to Listeners
// =============================================================================

const server = new EventEmitter();

// You can pass any number of arguments
server.on("request", (method, url, statusCode) => {
  console.log(`${method} ${url} → ${statusCode}`);
});

server.emit("request", "GET", "/api/users", 200);
server.emit("request", "POST", "/api/users", 201);

// =============================================================================
// SECTION 5: Error Events — Special Handling Required
// =============================================================================
// "error" is a SPECIAL event in EventEmitter.
// If you emit "error" and there is NO listener for it → Node.js CRASHES.
// ALWAYS add an error listener when working with EventEmitters.

const db = new EventEmitter();

// Without this, emitting "error" would crash Node
db.on("error", (err) => {
  console.error("Database error:", err.message);
});

db.emit("error", new Error("Connection timeout"));
// → "Database error: Connection timeout"

// =============================================================================
// SECTION 6: Listing Current Listeners
// =============================================================================

const emitter4 = new EventEmitter();

emitter4.on("click", () => console.log("Click handler 1"));
emitter4.on("click", () => console.log("Click handler 2"));
emitter4.on("hover", () => console.log("Hover handler"));

// Get all event names
console.log(emitter4.eventNames()); // → ["click", "hover"]

// Get listener count for a specific event
console.log(emitter4.listenerCount("click")); // → 2

// Get array of listeners for event
console.log(emitter4.listeners("hover").length); // → 1

// =============================================================================
// SECTION 7: MaxListeners Warning
// =============================================================================
// By default, EventEmitter warns if you add MORE than 10 listeners to an event.
// This is to catch potential memory leaks (you added a listener but forgot to remove it).

const em = new EventEmitter();
em.setMaxListeners(20); // Increase the limit if you genuinely need more listeners

// =============================================================================
// SECTION 8: CUSTOM EventEmitter CLASS — Real Pattern
// =============================================================================
// In real code, you extend EventEmitter to build classes that emit their own events.
// This is exactly how Node's http.Server, fs.ReadStream etc. are built.

class Database extends EventEmitter {
  constructor(host, port) {
    super(); // Must call super() first
    this.host = host;
    this.port = port;
    this.connected = false;
  }

  connect() {
    console.log(`Connecting to ${this.host}:${this.port}...`);

    // Simulate async connection
    setTimeout(() => {
      this.connected = true;
      // Emit "connect" event — anyone listening gets notified
      this.emit("connect", { host: this.host, port: this.port });
    }, 500);
  }

  query(sql) {
    if (!this.connected) {
      // Emit "error" event if not connected
      this.emit("error", new Error("Not connected to database"));
      return;
    }

    // Simulate query execution
    setTimeout(() => {
      const fakeResult = [{ id: 1, name: "Rohit" }, { id: 2, name: "Priya" }];
      // Emit "data" with results
      this.emit("data", fakeResult);
      // Emit "end" when query is complete
      this.emit("end");
    }, 300);
  }

  disconnect() {
    this.connected = false;
    this.emit("close");
  }
}

// Using the custom class
const myDB = new Database("localhost", 5432);

// Register all listeners BEFORE calling connect()
myDB.on("connect", (info) => {
  console.log(`✓ Connected to ${info.host}:${info.port}`);
  myDB.query("SELECT * FROM users");
});

myDB.on("data", (rows) => {
  console.log(`✓ Got ${rows.length} rows:`, rows);
});

myDB.on("end", () => {
  console.log("✓ Query complete");
  myDB.disconnect();
});

myDB.on("close", () => {
  console.log("✓ Disconnected");
});

myDB.on("error", (err) => {
  console.error("✗ Error:", err.message);
});

myDB.connect();

// =============================================================================
// SECTION 9: EventEmitter in Real Node.js APIs
// =============================================================================
// These all extend EventEmitter under the hood:
// - http.Server        → emits: "request", "error", "close", "listening"
// - fs.ReadStream      → emits: "data", "end", "error", "close"
// - net.Socket         → emits: "connect", "data", "end", "error", "close"
// - process (global)   → emits: "exit", "uncaughtException", "SIGINT"
// - readline.Interface → emits: "line", "close"

const { Readable } = require("stream");
const { createReadStream } = require("fs");

// This is what happens when you read a file as a stream:
// const stream = createReadStream("large-file.txt");
// stream.on("data", (chunk) => { /* process chunk */ });
// stream.on("end", () => { /* all data read */ });
// stream.on("error", (err) => { /* handle error */ });

// The stream is an EventEmitter that emits these events automatically!

// =============================================================================
// SECTION 10: process Events (Built-in EventEmitter)
// =============================================================================
// The `process` object IS an EventEmitter. It emits crucial events.

// Runs before Node exits — good for cleanup
process.on("exit", (code) => {
  // Only synchronous code here — async won't run
  console.log(`Process exiting with code: ${code}`);
});

// Catch unhandled Promise rejections (prevents silent failures)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1); // Always exit on unhandled rejection
});

// Catch uncaught synchronous errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Always exit — process is in unknown state
});

// Handle Ctrl+C gracefully (SIGINT)
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  // Close DB connections, stop servers, etc.
  process.exit(0);
});

// =============================================================================
// SECTION 11: FILL IN THE BLANK EXERCISE
// =============================================================================

class ChatRoom extends EventEmitter {
  constructor(name) {
    // FILL IN: call super()
    // ______________________

    this.name = name;
    this.users = [];
  }

  join(username) {
    this.users.push(username);
    // FILL IN: emit a "join" event with the username
    // ______________________
  }

  leave(username) {
    this.users = this.users.filter((u) => u !== username);
    // FILL IN: emit a "leave" event with the username
    // ______________________
  }

  sendMessage(from, message) {
    if (!this.users.includes(from)) {
      // FILL IN: emit an "error" event with a "User not in room" message
      // ______________________
      return;
    }
    // FILL IN: emit a "message" event with { from, message, time: new Date() }
    // ______________________
  }
}

// Create a room and test it:
const room = new ChatRoom("general");

// FILL IN: listen for the "join" event — log `${user} joined ${room.name}`
// ______________________

// FILL IN: listen for the "message" event — log `[${time}] ${from}: ${message}`
// ______________________

// FILL IN: listen for the "leave" event — log `${user} left`
// ______________________

// FILL IN: listen for "error" event — log the error message
// ______________________

// Call join, sendMessage, leave to test
// room.join("Rohit");
// room.sendMessage("Rohit", "Hello everyone!");
// room.leave("Rohit");

// =============================================================================
// KEY INTERVIEW POINTS TO REMEMBER
// =============================================================================
// 1. EventEmitter = the heart of Node.js. Everything async in Node is event-based.
// 2. .on() → repeated listener. .once() → one-time listener.
// 3. "error" event is special — must have a listener or Node crashes.
// 4. Extend EventEmitter to build your own event-driven classes.
// 5. process is a global EventEmitter — use it for graceful shutdown.
// 6. Too many listeners on one event = possible memory leak (Node warns at 10).
// 7. Streams (ReadStream, WriteStream) are EventEmitters — "data", "end", "error".
