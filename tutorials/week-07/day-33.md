# Day 33 (Wed) — Locking Down Product Writes, and the Admin Orders View

## What you're building today

Two things: actually applying `requireAdmin` to `POST`/`PUT`/`DELETE`
`/products` (closing yesterday's assumption), and a new admin view of
*all* orders across every customer — not just one user's own, the way
Day 29's `/orders` route deliberately worked.

## Concept: the same route, different rules, for different callers

You already built `GET /orders` scoped to `req.userId` (Day 29) — that's
correct and must stay correct for regular customers. An admin, though,
legitimately needs to see *every* order, to fulfill and manage the
store. This is a case for a **separate route** (`GET /admin/orders`),
not a parameter that changes `GET /orders`'s behavior — think through why
a query parameter like `?all=true` on the *customer* route would be
dangerous: it would mean the *same* route's access rules depend on a
client-controlled flag, which is exactly the kind of thing that's easy to
implement wrong and easy to exploit if it ever is. A distinct route
under a distinct `requireAdmin`-protected path keeps the two concerns
completely separate and independently reasoned-about.

## Build it yourself

**Step 1 — Apply `requireAdmin` to the product write routes.**
Go back to your `POST`, `PUT`, and `DELETE` `/products` routes (Week 4)
and chain `requireAuth, requireAdmin` onto each, the same way Day 31's
`/admin/ping` did. Leave `GET /products` and `GET /products/:id`
unprotected — browsing the catalog is a public, unauthenticated action,
and should stay that way.

**Step 2 — Confirm yesterday's admin UI still works.**
Since yesterday's UI already sent an admin's token, this change should be
invisible to a real admin using `admin.html` — but *test it*, don't just
assume. Also confirm: a non-admin (or logged-out) attempt at
`POST /products` via Postman now correctly gets `403` (or `401`), not
`201`.

**Step 3 — Write `GET /admin/orders`.**
Protected by `requireAuth` + `requireAdmin`. Unlike Day 29's customer
route, this one queries *all* orders, no `userId` filter. Sort by most
recent first, same as before.

**Step 4 — Populate the customer info on each order.**
An admin needs to know *whose* order they're looking at — but an order
document only stores a `userId` reference (Day 26), not the customer's
email. Look up Mongoose's `.populate()` method — it can automatically
replace a referenced id with the actual related document's data in the
query result, so each order's `userId` field can come back as the full
(or partial — you can limit which fields) user document instead of just
an id.

**Step 5 — Build the admin orders view.**
In `admin.html` (or a separate `admin-orders.html`, your call), list all
orders with the customer's email, date, status, total, and item count.
This is read-only for today — no status-changing controls yet (that's a
reasonable future extension, but not required here).

## Self-check

- [ ] `POST`, `PUT`, `DELETE` on `/products` all correctly reject a
      non-admin (or logged-out) caller now, while `GET` remains open to
      everyone.
- [ ] `GET /admin/orders` returns orders from *every* customer, not just
      one — confirm by placing orders as two different users (Day 30's
      setup) and seeing both appear here, unlike Day 29's per-user
      `/orders`.
- [ ] Each order in the admin view shows real customer identifying
      info (email), not just a raw `userId` string.
- [ ] `GET /admin/orders` itself is properly protected — a non-admin
      token gets `403`, not real order data from every customer.
- [ ] Yesterday's admin product UI still works exactly as before, now
      that the routes underneath actually enforce `requireAdmin`.

## Exercise

Without a hint:

1. Add basic filtering to `GET /admin/orders` — a query parameter for
   `status` (e.g. `?status=pending`) that, when present, narrows the
   results, and does nothing (returns everything) when absent.
2. Commit on branch `day-33-admin-orders-lockdown`.

## Reference solution

Compare against `solutions/week-07/day-33-server.js` and
`solutions/week-07/day-33-admin-orders.js` only after your own version
passes every self-check item.

Tomorrow: UX polish — loading states, accessibility basics, and focus
handling, applied across the whole app.
