# Day 23 (Wed) — Protecting Routes with `requireAuth` Middleware

## What you're building today

A JWT that's issued but never checked is pointless. Today you write
middleware that verifies a token on incoming requests and blocks anyone
without a valid one — and a genuinely protected test route to prove it
actually works.

## Concept: where the token travels, and why middleware is the right shape for this

The client needs to send yesterday's token on every request to a
protected route. Look up the `Authorization` header and the `Bearer`
scheme — this is the conventional place a token travels, not a custom
header you invent yourself, because it's what most HTTP tooling (and
future teammates) expect by default.

Checking "is there a valid token" is needed by *many* routes, not just
one — which is exactly the situation middleware (Day 19's logger,
`express.json()`, `cors()`) is for: write the check once, and apply it
selectively to whichever routes need it, rather than repeating the same
verification code inside every handler that requires login.

## Build it yourself

**Step 1 — Write `requireAuth` middleware.**
Create `middleware/requireAuth.js`. Inside, following the three-parameter
middleware shape from Day 19: read the `Authorization` header, and if
it's missing entirely, respond `401` immediately (don't call `next()` —
the request stops here). If present, extract just the token part (think
about the header's actual format — it's not *only* the token).

**Step 2 — Verify the token.**
Use `jsonwebtoken`'s verify function with your `.env` secret. This can
fail in more than one way — an invalid signature (tampered or wrong
secret), or a token that's expired. Wrap it in `try`/`catch`: on failure,
respond `401` with a clear message; on success, you get back the payload
you signed on Day 22.

**Step 3 — Attach the verified user info to the request.**
Once verified, attach the decoded payload (at least the user id) onto
the request object itself (e.g. `req.userId = decoded.id`) before calling
`next()`. This is *why* the route handlers after this middleware will be
able to know who's making the request — they read it off `req`, never
re-parsing the header themselves.

**Step 4 — Apply it to a real protected route.**
Add a test route, `GET /me`, that uses `requireAuth` (look up how to
apply middleware to a *single* route rather than the whole app, since
not every route should require login — your `/products` routes
shouldn't suddenly need auth). Inside `/me`, use `req.userId` (set by the
middleware) to look up and return the current user's own data — minus
`passwordHash`, obviously.

**Step 5 — Test all three states deliberately.**
No `Authorization` header at all. A header with a garbage/tampered
token. A header with a real, valid token. Confirm each produces the
right outcome — `401`, `401`, and `200` with the correct user's data,
respectively.

## Self-check

- [ ] `GET /me` with no `Authorization` header returns `401`.
- [ ] `GET /me` with a token you've manually altered by one character
      (breaking its signature) returns `401`.
- [ ] `GET /me` with a genuinely valid token (from a real Day 22 login)
      returns `200` with that specific user's data.
- [ ] The response from `/me` never includes `passwordHash`.
- [ ] Logging in as two different users and hitting `/me` with each
      token returns each user's *own* correct data, not one user's data
      leaking to the other.
- [ ] `/products` (from Week 3–4) still works with **no** token at all —
      confirm you didn't accidentally apply `requireAuth` globally.

## Exercise

Without a hint:

1. Make the `401` responses for "missing token" and "invalid/expired
   token" use distinctly worded messages (still both `401` — the status
   code itself shouldn't leak more than necessary — but the message
   should help *you*, debugging your own app during development, tell
   the two cases apart).
2. Commit on branch `day-23-require-auth`.

## Reference solution

Compare against `solutions/week-05/day-23-requireAuth.js` and
`solutions/week-05/day-23-server.js` only after your own version passes
every self-check item.

Tomorrow: the frontend — actual login and signup forms, wired to all of
this.
