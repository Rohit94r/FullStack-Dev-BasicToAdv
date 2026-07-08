// =============================================================================
// DAY 5 PROJECT — server.js (demo)
// In-memory users API — test with curl after you fill in App.js
// Run: npm start
// =============================================================================

const App = require("./App");

const app = new App();
const PORT = process.env.PORT || 4000;

// In-memory "database"
let users = [
  { id: 1, name: "Rohit" },
  { id: 2, name: "Asha" },
];
let nextId = 3;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────

// TODO: app.use logging middleware — console.log method + pathname
// Signature: (req, res, next) => { console.log(...); next(); }
// YOUR IDEA: _________________________________________________
// _____________________

// TODO: app.use JSON body parser middleware
// If method is POST/PUT/PATCH → await req.parseBody(), assign to req.body
// Always call next()
// YOUR IDEA: _________________________________________________
// _____________________

// ── ROUTES ──────────────────────────────────────────────────────────────────

// TODO: GET /health → res.json({ status: "ok" })
// _____________________

// TODO: GET /users → res.json(users) — optional ?limit= query
// YOUR IDEA: _________________________________________________
// _____________________

// TODO: GET /users/:id → find user or 404
// _____________________

// TODO: POST /users → read req.body.name, validate, push new user, 201
// _____________________

// TODO: DELETE /users/:id → remove user or 404, 204 on success
// YOUR IDEA: _________________________________________________
// _____________________

// TODO: 404 handler via app.use at the end (or built into App)
// _____________________

// ── START ───────────────────────────────────────────────────────────────────

// TODO: app.listen(PORT, () => console.log(`Mini Express on http://localhost:${PORT}`))
// _____________________

// ── CURL CHEAT SHEET (after server runs) ──────────────────────────────────────
//
// curl http://localhost:4000/health
// curl http://localhost:4000/users
// curl http://localhost:4000/users/1
// curl -X POST http://localhost:4000/users -H "Content-Type: application/json" -d '{"name":"Meera"}'
// curl -X DELETE http://localhost:4000/users/1
