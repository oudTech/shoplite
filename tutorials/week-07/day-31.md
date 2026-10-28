# Day 31 (Mon) — Role-Based Access: `isAdmin` and `requireAdmin`

## What you're building today

An `isAdmin` flag on the user model, and a second middleware —
`requireAdmin` — that only lets admin users through. No admin *features*
yet, just the gate.

## Concept: why there must be no API route that makes someone an admin

Think through the design constraint before writing anything: if your API
had a route like `PUT /users/:id { isAdmin: true }` that any logged-in
user could call on themselves, your entire access-control system would
be decorative — anyone could grant themselves admin with one request.
The rule this leads to: **`isAdmin` must never be settable through any
route a regular user can reach.** It gets set directly in the database
(by you, manually, for now — a real product would have a separate,
carefully separately-secured admin-invitation flow, which is beyond this
project's scope) — never through `POST /signup`, never through any
`PUT` a logged-in user calls on their own account.

This is the same category of lesson as Day 27's "never trust a
client-supplied price" — the common thread across this whole week: some
fields are the server's to decide, never the client's, no matter how the
request is shaped.

## Build it yourself

**Step 1 — Add the field.**
In `models/User.js` (Day 21), add `isAdmin` (Boolean, `default: false`).
Confirm it defaults correctly by signing up a fresh user and checking the
database directly — it should be `false`, not missing/undefined.

**Step 2 — Make yourself an admin, deliberately out-of-band.**
Using `mongosh`, a MongoDB GUI, or a one-off script you run manually
(not a route), set `isAdmin: true` on one specific user document — your
own test account. This manual, deliberate, outside-the-API step *is* the
security boundary — internalize why doing it this way, instead of
building a convenient API route for it, is the entire point.

**Step 3 — Write `requireAdmin` middleware.**
It should run *after* `requireAuth` (it needs `req.userId` to already be
set), look up that user, and check `isAdmin`. If false or the user
somehow doesn't exist, respond `403` (Forbidden — distinct from `401`;
think about the difference: `401` means "we don't know who you are,"
`403` means "we know exactly who you are, and the answer is no").

**Step 4 — Build one real protected admin route to prove it works.**
Add `GET /admin/ping` (or similar), chained with both `requireAuth` and
`requireAdmin` (look up how to apply more than one middleware to a single
route in Express — the order you list them in matters). It should return
something simple confirming access.

**Step 5 — Test all three states.**
No token: `401` (from `requireAuth`, `requireAdmin` never even runs).
Valid token, non-admin user: `403` (from `requireAdmin`). Valid token,
admin user: `200`.

## Self-check

- [ ] A fresh signup always has `isAdmin: false`, confirmed directly in
      the database, not just assumed.
- [ ] `GET /admin/ping` returns `401` with no token, `403` for a
      logged-in non-admin, and `200` only for your manually-flagged admin
      account.
- [ ] You cannot find any route, anywhere in your API, that lets a
      logged-in user set their own or anyone else's `isAdmin` field —
      confirm this by re-reading every `PUT`/`POST` route you've written
      and checking exactly which fields from the request body they
      actually use.
- [ ] `/products` and other non-admin routes still work for a regular
      logged-in (or even logged-out) user — confirm `requireAdmin` is
      only on the routes that need it.

## Exercise

Without a hint:

1. Extend `requireAdmin`'s error message to be genuinely useful during
   your own development (e.g. distinguishing "no such user" from "user
   exists but isn't an admin" in what gets logged server-side — the
   response to the *client* should stay a generic `403` either way, but
   your own console log can be more specific).
2. Commit on branch `day-31-admin-role`.

## Reference solution

Compare against `solutions/week-07/day-31-requireAdmin.js` and
`solutions/week-07/day-31-server.js` only after your own version passes
every self-check item.

Tomorrow: an actual admin UI — creating, editing, and deleting products
through a real interface instead of Postman.
