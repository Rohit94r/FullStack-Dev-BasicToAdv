# Auth Server — Day 7 Project

Express + TypeScript authentication server with fill-in-the-blank exercises.
Implements register, login, JWT access tokens, refresh token rotation (httpOnly cookie),
RBAC, and login rate limiting.

## Setup

```bash
cd project/auth-server
npm install
cp .env.example .env
npm run dev
```

Server runs at `http://localhost:4000`.

## Your Task

Fill in every `TODO` in:

- `src/services/auth.service.ts` — bcrypt, JWT, refresh token store
- `src/controllers/auth.controller.ts` — HTTP responses, cookies
- `src/middleware/auth.middleware.ts` — requireAuth, requireRole
- `src/middleware/rateLimit.middleware.ts` — login rate limiter
- `src/app.ts` — middleware and route mounting

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login (rate limited: 5/min) |
| POST | `/auth/refresh` | Cookie | Rotate refresh token, new access token |
| POST | `/auth/logout` | Cookie | Invalidate refresh token |
| GET | `/users/me` | Bearer | Current user profile |
| GET | `/users` | Admin | List all users |

Pre-seeded admin: `admin@example.com` / `Admin123!`

## curl Test Flow

Save cookies to a file so refresh/logout work:

```bash
BASE=http://localhost:4000
COOKIES=/tmp/auth-cookies.txt

# 1. Register a new user
curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"SecurePass1","name":"Alice"}' \
  | jq .

# Save the accessToken from the response:
# ACCESS="eyJ..."

# 2. Login (also sets refresh cookie)
curl -s -c "$COOKIES" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"SecurePass1"}' \
  | jq .

# Set ACCESS from response accessToken field
ACCESS="<paste-access-token-here>"

# 3. Get current user (protected)
curl -s "$BASE/users/me" \
  -H "Authorization: Bearer $ACCESS" \
  | jq .

# 4. Refresh access token (sends cookie automatically)
curl -s -b "$COOKIES" -c "$COOKIES" -X POST "$BASE/auth/refresh" \
  | jq .

# Update ACCESS with new token from response

# 5. Admin login + list users
curl -s -c "$COOKIES" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq .

ADMIN_ACCESS="<paste-admin-access-token>"

curl -s "$BASE/users" \
  -H "Authorization: Bearer $ADMIN_ACCESS" \
  | jq .

# 6. Logout
curl -s -b "$COOKIES" -X POST "$BASE/auth/logout" -w "\nHTTP %{http_code}\n"
```

## Password Rules (Zod)

- Minimum 8 characters
- At least one uppercase letter
- At least one number

## Architecture

```
Route → Controller → Service → (in-memory store)
         ↑ middleware: validate, requireAuth, requireRole, rateLimit
```

Same layered pattern as Day 6 — auth logic lives in the service, HTTP glue in controllers.
