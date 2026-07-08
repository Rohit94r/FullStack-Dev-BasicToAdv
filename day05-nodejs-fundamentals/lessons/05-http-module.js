// ============================================================
// DAY 5 — LESSON 5: THE http MODULE — A SERVER WITHOUT EXPRESS
// Level: Intermediate → Advanced (THE most important lesson today)
// Run with:  node 05-http-module.js
// The script starts a server on port 4500, tests itself with
// real HTTP requests, prints the results, then shuts down.
// While it runs you could also try:  curl http://localhost:4500/users
// ============================================================

const http = require("http");

// ─────────────────────────────────────────────────────────────
// SECTION 1: WHAT IS AN HTTP SERVER, REALLY?
// ─────────────────────────────────────────────────────────────
//
// HTTP = a TEXT conversation between two computers.
// The browser/client sends a REQUEST:
//
//     GET /users?limit=2 HTTP/1.1          ← method, path, version
//     Host: localhost:4500                 ← headers (key: value)
//     Accept: application/json
//                                          ← blank line
//     (optional body, e.g. JSON for POST)
//
// The server answers with a RESPONSE:
//
//     HTTP/1.1 200 OK                      ← status line
//     Content-Type: application/json       ← headers
//
//     [{"id":1,"name":"Rohit"}]            ← body
//
// ANALOGY: a restaurant order slip. Method = what to do (GET =
// bring me, POST = add new), path = which dish, headers = special
// instructions ("no onions"), body = the actual package you hand over.
//
// A Node server = ONE function that runs for EVERY request:
//   (req, res) => { read the order (req), write the answer (res) }
// Express (tomorrow) is just a comfortable wrapper around THIS.

// ─────────────────────────────────────────────────────────────
// SECTION 2: A TINY IN-MEMORY "DATABASE"
// ─────────────────────────────────────────────────────────────
// Just an array. It resets each time the server restarts —
// fine for learning; a real DB comes on Day 8.

let users = [
  { id: 1, name: "Rohit" },
  { id: 2, name: "Asha" },
];
let nextId = 3;

// ─────────────────────────────────────────────────────────────
// SECTION 3: RESPONSE HELPERS (we write them once, use everywhere)
// ─────────────────────────────────────────────────────────────

// Send any JS value as JSON with the right status + header.
// WHY the header? Without Content-Type the client only sees bytes
// and must GUESS what they are. The header says "this is JSON".
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  // res.end(body) = "here is the body, the response is finished".
  // A response is a stream — end() closes it. Forget end() and the
  // client waits forever!
  res.end(JSON.stringify(data));
}

// Read the request BODY. Key insight: the body does NOT arrive at
// once — it STREAMS in as chunks (Buffers). We collect chunks until
// the "end" event, then parse. (Streams get a full lesson next.)
// ANALOGY: a letter arriving as puzzle pieces; wait for all pieces,
// then read the sentence.
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk)); // chunk = Buffer
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8"); // bytes → string
        resolve(raw ? JSON.parse(raw) : {}); // string → object
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// ─────────────────────────────────────────────────────────────
// SECTION 4: THE SERVER — routing by hand
// ─────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // req.method = "GET" | "POST" | ... ; req.url = "/users?limit=2"
  // req.url contains path AND query string — we split them with URL.
  // ("http://x" is a dummy base because req.url is relative.)
  const url = new URL(req.url, "http://x");
  const pathname = url.pathname; // "/users"
  const query = url.searchParams; // ?limit=2 → query.get("limit") === "2"

  try {
    // ── ROUTE: GET /users (+ optional ?limit=N) ────────────────
    if (req.method === "GET" && pathname === "/users") {
      const limit = Number(query.get("limit")) || users.length;
      return sendJson(res, 200, users.slice(0, limit));
    }

    // ── ROUTE: GET /users/:id ──────────────────────────────────
    // No Express = no automatic :id. We match the pattern ourselves
    // with a regex: /users/ followed by digits. ([0-9]+) captures them.
    const userMatch = pathname.match(/^\/users\/([0-9]+)$/);
    if (req.method === "GET" && userMatch) {
      const id = Number(userMatch[1]); // the captured digits
      const user = users.find((u) => u.id === id);
      if (!user) return sendJson(res, 404, { error: "User not found" });
      return sendJson(res, 200, user);
    }

    // ── ROUTE: POST /users (create) ────────────────────────────
    if (req.method === "POST" && pathname === "/users") {
      const body = await readJsonBody(req);
      if (!body.name) {
        // 400 Bad Request = "YOUR input is wrong" (client's fault)
        return sendJson(res, 400, { error: "name is required" });
      }
      const user = { id: nextId++, name: body.name };
      users.push(user);
      // 201 Created = "I made a new resource" (not plain 200)
      return sendJson(res, 201, user);
    }

    // ── ROUTE: DELETE /users/:id ───────────────────────────────
    if (req.method === "DELETE" && userMatch) {
      const id = Number(userMatch[1]);
      const before = users.length;
      users = users.filter((u) => u.id !== id);
      if (users.length === before) return sendJson(res, 404, { error: "User not found" });
      // 204 No Content = "done, nothing to say" → body MUST be empty
      res.writeHead(204);
      return res.end();
    }

    // ── No route matched → 404 ────────────────────────────────
    sendJson(res, 404, { error: `Cannot ${req.method} ${pathname}` });
  } catch (err) {
    // Any crash above lands here → 500 Internal Server Error
    // (= "MY fault", the server's fault — vs 4xx = client's fault)
    sendJson(res, 500, { error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// SECTION 5: START, SELF-TEST WITH A REAL HTTP CLIENT, STOP
// ─────────────────────────────────────────────────────────────
// Normally you'd `server.listen(4500)` and leave it running while
// testing with curl/Postman. Here the script also plays CLIENT so
// the whole lesson is self-checking and exits by itself.

// A tiny promise-based HTTP client using Node's own http module.
// (In real code you'd use the built-in global fetch() — this shows
// what fetch does under the hood: response bodies are streams too!)
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "localhost", port: 4500, path, method, headers: { "Content-Type": "application/json" } },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString();
          resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body)); // write body chunks...
    req.end(); // ...and finish the request
  });
}

server.listen(4500, async () => {
  console.log("server listening on http://localhost:4500 — running self-tests...\n");

  let r = await request("GET", "/users");
  console.log("GET /users        →", r.status, JSON.stringify(r.body));
  // Expected output: 200 [{"id":1,"name":"Rohit"},{"id":2,"name":"Asha"}]

  r = await request("GET", "/users?limit=1");
  console.log("GET /users?limit=1→", r.status, JSON.stringify(r.body));
  // Expected output: 200 [{"id":1,"name":"Rohit"}]

  r = await request("GET", "/users/2");
  console.log("GET /users/2      →", r.status, JSON.stringify(r.body));
  // Expected output: 200 {"id":2,"name":"Asha"}

  r = await request("GET", "/users/99");
  console.log("GET /users/99     →", r.status, JSON.stringify(r.body));
  // Expected output: 404 {"error":"User not found"}

  r = await request("POST", "/users", { name: "Meera" });
  console.log("POST /users       →", r.status, JSON.stringify(r.body));
  // Expected output: 201 {"id":3,"name":"Meera"}

  r = await request("POST", "/users", {});
  console.log("POST no name      →", r.status, JSON.stringify(r.body));
  // Expected output: 400 {"error":"name is required"}

  r = await request("DELETE", "/users/1");
  console.log("DELETE /users/1   →", r.status, JSON.stringify(r.body));
  // Expected output: 204 null   (204 = success with empty body)

  r = await request("GET", "/nope");
  console.log("GET /nope         →", r.status, JSON.stringify(r.body));
  // Expected output: 404 {"error":"Cannot GET /nope"}

  console.log("\nall self-tests done — shutting down ✅");
  server.close(); // stop accepting connections → node exits cleanly
});

// ─────────────────────────────────────────────────────────────
// SECTION 6: STATUS CODE FAMILIES (memorize the families!)
// ─────────────────────────────────────────────────────────────
// 1xx info (rare) | 2xx success | 3xx redirect | 4xx CLIENT error | 5xx SERVER error
// The big eight:
//   200 OK, 201 Created, 204 No Content,
//   301 Moved Permanently,
//   400 Bad Request, 401 Unauthorized (who are you?),
//   403 Forbidden (I know you — still no), 404 Not Found,
//   500 Internal Server Error

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: How do you create an HTTP server in pure Node?
// A1: http.createServer((req, res) => {...}).listen(port). The
//     callback runs once per request; req is a readable stream of
//     the incoming data, res is a writable stream for the answer.
//
// Q2: Why do you need to collect chunks to read a POST body?
// A2: The body arrives as a stream of Buffer chunks over the
//     network, not all at once. You listen to "data" events,
//     collect chunks, and parse after the "end" event. Express's
//     express.json() middleware does exactly this for you.
//
// Q3: What does res.end() do? What if you forget it?
// A3: It finishes the response stream and sends it. Without it the
//     client hangs waiting until timeout — the response never
//     completes.
//
// Q4: Difference between 401 and 403?
// A4: 401 Unauthorized = you are NOT authenticated (log in first).
//     403 Forbidden = you ARE authenticated, but not allowed to do
//     this (no permission).
//
// Q5: When to use 201 and 204?
// A5: 201 Created after successfully creating a resource (POST),
//     ideally returning the new resource. 204 No Content for
//     success with nothing to return (commonly DELETE).
//
// Q6: What is the Content-Type header for?
// A6: It tells the receiver how to interpret the body bytes:
//     application/json, text/html, image/png... Without it clients
//     must guess.
//
// Q7: How do you get query parameters without Express?
// A7: new URL(req.url, "http://x").searchParams — then
//     .get("limit"). req.url alone is just a string with path+query.
//
// Q8: 4xx vs 5xx — whose fault?
// A8: 4xx = the CLIENT's fault (bad input, missing auth, wrong URL).
//     5xx = the SERVER's fault (bug, crashed dependency).
//
// Q9: What does server.close() do?
// A9: Stops accepting NEW connections and lets existing ones finish;
//     when nothing keeps the event loop alive, the process exits.
//     This is the basis of "graceful shutdown".
//
// Q10: What is Express, in terms of this lesson?
// A10: A thin layer over http.createServer that adds routing,
//      params parsing, middleware chaining and response helpers —
//      everything we hand-wrote here. That's the Day 5 project!
