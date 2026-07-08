# Day 5 Project — Mini Express Clone (Fill-in-the-Blank)

Build a **tiny Express-like framework** from Node's `http` module. When you're done, Express tomorrow will feel obvious — because you wrote it.

## Setup

```bash
cd project/mini-express
npm start
```

Test with curl (see bottom of `src/server.js`).

## Build Order (recommended)

1. `Request.js` — URL parsing + JSON body stream
2. `Response.js` — `status()`, `json()`, `send()`
3. `Router.js` — match `/users/:id` patterns
4. `App.js` — middleware chain + `listen()`
5. `server.js` — demo routes

## Build Checklist

### `src/Request.js`

- [ ] Parse `pathname` and `query` with `URL`
- [ ] `parseBody()` — collect stream chunks, `JSON.parse`

### `src/Response.js`

- [ ] Chainable `status(code)` returns `this`
- [ ] `json(data)` sets `Content-Type` and ends response
- [ ] `send(text)` writes head + body

### `src/Router.js`

- [ ] Convert `/users/:id` → regex + param name list
- [ ] `match(method, pathname)` returns `{ handler, params }`

### `src/App.js`

- [ ] `.get()`, `.post()`, `.delete()` register routes
- [ ] `.use(fn)` adds middleware
- [ ] `_runStack` — call middleware in order; `next()` advances
- [ ] `_handleRequest` — wrap raw req/res, match route, 404, error handler
- [ ] `.listen(port)` — `http.createServer`

### `src/server.js`

- [ ] Logging middleware
- [ ] JSON body parser middleware
- [ ] `GET /health`, `GET /users`, `GET /users/:id`
- [ ] `POST /users`, `DELETE /users/:id`
- [ ] In-memory users array

## The Middleware Mental Model

```
Request → mw1 → mw2 → route handler → Response
            ↓      ↓         ↓
          next() next()    res.json()
```

Each middleware receives `(req, res, next)`. Call `next()` to pass control forward. Skip `next()` if you've already sent a response.

## Test Plan

```bash
# Health
curl http://localhost:4000/health

# List users
curl http://localhost:4000/users

# Get one
curl http://localhost:4000/users/2

# Create
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Meera"}'

# Delete
curl -X DELETE http://localhost:4000/users/3

# 404
curl http://localhost:4000/nope
```

## Self-Test

- [ ] Middleware runs in registration order
- [ ] `req.params.id` works on `/users/:id`
- [ ] `req.query.limit` works on `/users?limit=1`
- [ ] POST without `name` returns 400
- [ ] DELETE missing user returns 404
- [ ] Unmatched route returns 404 JSON

## Why This Matters

Express is ~200 lines of routing + middleware on top of what you build here. After this project, you should explain middleware by drawing **your** `_runStack`, not by memorizing docs.
