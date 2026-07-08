# Day 7 — Authentication & Security Interview Questions & Answers

Authentication is the #1 topic in backend interviews. Know it deeply.

---

## SECTION A — Password Security

**Q1. Why should you NEVER store plain text passwords in a database?**
A: If the database is breached (SQL injection, insider threat, backup leak):
   - Plain text → attacker immediately has all passwords.
   - Same password across sites (most users reuse passwords) → all their accounts compromised.
   - You expose your users to account takeover at other services.
   Even with HTTPS, you must store passwords securely. HTTPS only protects data in transit.

**Q2. What is password hashing? How is it different from encryption?**
A: Hashing   → ONE-WAY transformation. Cannot be reversed to get the original.
              `hash("password123")` → "$2a$12$..."
              Verification: hash the input again, compare hashes.
   Encryption → TWO-WAY. Can decrypt with a key. Used for sensitive data (credit card numbers).
   Passwords must be HASHED, not encrypted.
   Why: if the encryption key leaks, all passwords are decrypted. Hash can't be reversed.

**Q3. What is bcrypt? What is the cost factor (salt rounds)?**
A: bcrypt is a password hashing algorithm designed to be SLOW (adaptive).
   Slow by design — makes brute force/dictionary attacks impractical.
   Salt: random data added to each password before hashing. Ensures two identical passwords produce different hashes.
   Cost factor (rounds): 2^rounds iterations. Higher = slower = more secure.
   rounds=10 → ~100ms. rounds=12 → ~400ms. rounds=14 → ~1.5s.
   Standard: 10-12 rounds. 12 is recommended for new projects (2024).
   bcrypt vs Argon2: Argon2 is newer and technically better. bcrypt is still widely used and fine.

**Q4. What is a rainbow table attack? How does salt prevent it?**
A: Rainbow table → precomputed table of (plaintext → hash) pairs for common passwords.
   Without salt: attacker looks up "5f4dcc3b..." in table → "password". Instant crack.
   With salt: each hash is `hash(password + randomSalt)`. Must rebuild rainbow table PER SALT.
   Since each password has a unique random salt, rainbow tables become useless.
   bcrypt automatically generates and stores the salt as part of the hash string.
   The stored hash includes: algorithm + cost + salt + hash → all-in-one string.

**Q5. Walk through the login process with bcrypt.**
A: Registration:
   1. Receive password from client.
   2. `bcrypt.hash(password, 12)` → generates salt, hashes, returns "$2a$12$..." string.
   3. Store the HASH in database. NEVER the plain password.
   
   Login:
   1. Receive email + password from client.
   2. Look up user by email.
   3. If user not found → return 401 (DON'T say "email not found" — timing attack).
   4. `bcrypt.compare(inputPassword, storedHash)` → returns true/false.
   5. If false → return 401 "Invalid credentials".
   6. If true → generate JWT and return it.

---

## SECTION B — JWT (JSON Web Tokens)

**Q6. What is a JWT? What are its 3 parts?**
A: JWT = JSON Web Token. A compact, self-contained token for transmitting auth info.
   Format: `header.payload.signature` (3 parts separated by dots).
   
   Header: `{ "alg": "HS256", "typ": "JWT" }` (base64url encoded)
   Payload: `{ "sub": "user-id", "role": "admin", "iat": 1234567890, "exp": 1234654290 }` (base64url encoded)
   Signature: `HMACSHA256(base64(header) + "." + base64(payload), SECRET)` — proves token wasn't tampered with.
   
   JWT is NOT encrypted by default — payload is just base64 encoded (anyone can read it).
   Never put sensitive data (SSN, credit card) in payload.
   The SIGNATURE proves authenticity — only the server (with the secret) can create valid tokens.

**Q7. What is the difference between JWT and sessions?**
A: Sessions (stateful):
   - Server stores session data (memory, Redis, DB). Client gets session ID cookie.
   - Every request: server looks up session ID → loads session data.
   - Logout: delete session from server. Immediate effect.
   - Drawback: requires shared storage for multiple servers (Redis).
   
   JWT (stateless):
   - No server storage. Client holds the token. Server only stores the signing secret.
   - Every request: server verifies signature → reads payload. No database lookup.
   - Logout: cannot truly invalidate (token valid until expiry). Must use blocklist or short expiry.
   - Scales easily — any server can verify any JWT.
   JWT wins for: microservices, stateless APIs, horizontal scaling.
   Sessions win for: requiring immediate logout, sensitive applications, less token management complexity.

**Q8. What information should be in the JWT payload?**
A: Include: user ID (sub), role, email (optional), iat (issued at), exp (expiry).
   DO include: identifiers needed for authorization decisions.
   NEVER include: password, payment info, SSN, any sensitive PII.
   Remember: payload is BASE64 ENCODED, not encrypted. Anyone can read it.
   Keep it minimal — JWT is sent with every request, smaller = faster.

**Q9. What is token expiry? What is the tradeoff?**
A: JWT has an `exp` claim with a Unix timestamp.
   After expiry, the server rejects the token and client must get a new one.
   Short expiry (15min): more secure. Stolen token becomes useless quickly. But user logs in frequently.
   Long expiry (7 days): better UX. But stolen token can be used for 7 days.
   Best practice: short-lived ACCESS token (15min-1hr) + long-lived REFRESH token (7-30 days).

**Q10. What is the Refresh Token pattern? How does it work?**
A: Solves: access tokens must be short-lived (security), but users can't log in every 15 minutes.
   
   Flow:
   1. Login → server issues: ACCESS token (15min) + REFRESH token (7 days).
   2. Client stores both. Uses access token for API calls.
   3. Access token expires (401) → client silently sends refresh token to `/auth/refresh`.
   4. Server verifies refresh token (from database/Redis, not JWT verify).
   5. Server issues NEW access token. Client continues without user noticing.
   6. Logout → DELETE refresh token from server. Cannot get new access tokens.
   
   Refresh token stored in: HttpOnly cookie (most secure) OR localStorage (convenient but XSS risk).
   Access token stored in: memory (most secure) OR localStorage.

---

## SECTION C — Cookies vs Authorization Header

**Q11. What is the difference between storing tokens in localStorage vs HttpOnly cookies?**
A: localStorage:
   - Accessible from JavaScript (`localStorage.getItem("token")`).
   - VULNERABLE to XSS (Cross-Site Scripting). If attacker injects JS → they read your token.
   - Easy to implement. No CSRF protection needed.
   
   HttpOnly Cookie:
   - Cannot be read by JavaScript. Browser manages it automatically.
   - PROTECTED from XSS.
   - VULNERABLE to CSRF (Cross-Site Request Forgery). Must use CSRF tokens.
   - `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict`
   
   Best practice: access token in memory (fastest, no storage attack), refresh token in HttpOnly cookie.

**Q12. What are the important cookie security flags?**
A: HttpOnly  → cannot be accessed via JavaScript. Prevents XSS token theft.
   Secure    → only sent over HTTPS. Never over HTTP.
   SameSite  → controls cross-site sending:
               Strict → only sent for same-site requests (blocks CSRF).
               Lax    → sent for same-site + top-level navigation (good default).
               None   → sent for all requests (needs Secure flag).
   Domain    → which domains receive the cookie.
   Path      → which paths trigger the cookie.
   Max-Age   → expiry in seconds (or Expires date).
   
   Recommended: `HttpOnly; Secure; SameSite=Strict; Max-Age=604800` (7 days).

**Q13. What is XSS and how does it relate to token storage?**
A: XSS (Cross-Site Scripting): attacker injects malicious JS into your site.
   If user's browser runs attacker's JS → it can call `localStorage.getItem("token")` → stolen.
   Prevention:
   - Sanitize all user inputs before rendering (don't render raw HTML from users).
   - Content Security Policy (CSP) headers — restrict what scripts can execute.
   - HttpOnly cookies (JS can't read them even if XSS exists).
   - Avoid dangerouslySetInnerHTML in React.

**Q14. What is CSRF and how do you prevent it?**
A: CSRF (Cross-Site Request Forgery): attacker tricks logged-in user's browser into making
   an unwanted request to your API (e.g., by clicking a link on malicious.com).
   Browsers automatically include cookies → the request appears authenticated.
   
   Prevention:
   - SameSite=Strict cookie flag (browser won't send cookie for cross-site requests).
   - CSRF tokens (random token in request + cookie; server verifies they match).
   - Check Origin/Referer headers.
   - With SameSite=Strict, CSRF is mostly a solved problem in modern browsers.

---

## SECTION D — Authorization (RBAC)

**Q15. What is the difference between authentication and authorization?**
A: Authentication → "Who are you?" → Verify identity (login with password/token).
   Authorization  → "What can you do?" → Verify permissions (can this user access this resource?).
   Auth checks happen in ORDER: authenticate first, then authorize.
   401 = authentication failure (not logged in).
   403 = authorization failure (logged in but not allowed).

**Q16. What is RBAC?**
A: Role-Based Access Control. Users are assigned roles, roles have permissions.
   Example roles: guest, user, moderator, admin, superadmin.
   Example permissions: read:own, write:own, read:any, write:any, delete:any.
   Instead of checking individual user IDs, check the user's ROLE.
   `if (user.role === "admin") { /* allow */ }`
   Scales well — adding a permission to "moderator" role affects all moderators.

**Q17. How do you implement route-level authorization in Express?**
A: Create middleware that checks the user's role:
   ```javascript
   function requireRole(...roles) {
     return (req, res, next) => {
       if (!req.user) return res.status(401).json({ error: "Not authenticated" });
       if (!roles.includes(req.user.role)) {
         return res.status(403).json({ error: "Insufficient permissions" });
       }
       next();
     };
   }
   app.delete("/api/users/:id", authenticate, requireRole("admin"), userController.remove);
   ```

---

## SECTION E — Security Best Practices

**Q18. What is the principle of least privilege?**
A: Users (and systems) should only have access to what they NEED for their specific function.
   Admin users shouldn't have database root credentials for a task that needs read-only.
   API tokens should only have scopes needed (read, not write+delete).
   Service accounts should only access the specific tables/resources they need.
   Why: limits blast radius if account is compromised.

**Q19. What are the OWASP Top 10 security risks? Name 5.**
A: OWASP Top 10 (2021):
   1. Broken Access Control — users can access resources they shouldn't.
   2. Cryptographic Failures — weak encryption, plain text passwords.
   3. Injection — SQL injection, command injection.
   4. Insecure Design — fundamental design flaws.
   5. Security Misconfiguration — default credentials, open ports, verbose errors.
   6. Vulnerable Components — outdated dependencies with known CVEs.
   7. Authentication Failures — weak passwords, missing brute force protection.
   8. Data Integrity Failures — unsigned JWTs, insecure deserialization.
   9. Logging Failures — not logging security events.
   10. SSRF — Server-Side Request Forgery.

**Q20. What is SQL injection? How do you prevent it?**
A: SQL injection: attacker injects SQL code into input fields.
   Example: `SELECT * FROM users WHERE email = '${email}'`
   If email = `'; DROP TABLE users; --` → the entire users table is deleted.
   
   Prevention:
   1. NEVER concatenate user input into SQL strings.
   2. Use PARAMETERIZED QUERIES (prepared statements): `WHERE email = $1`
   3. Use an ORM like Prisma (it uses parameterized queries automatically).
   4. Input validation (reject unexpected characters early).
   5. Principle of least privilege (database user can't drop tables).
