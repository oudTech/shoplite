# Day 29 (Thu) — Order History: `GET /orders` and the Orders Page

## What you're building today

`GET /orders`, scoped to the logged-in user's *own* orders only, and an
`orders.html` page that lists them.

## Concept: scoping a query to "mine," not "everyone's"

This is a different kind of protection from Day 23's `requireAuth` —
`requireAuth` answers "is this a real, logged-in user at all?" but says
nothing about *which* data that user should see. A backend bug here is
easy to write and easy to miss: if `GET /orders` returns *all* orders in
the database regardless of who's asking, every logged-in user could see
every other user's purchase history. The route must explicitly filter by
`userId` matching the *requester's own* id (`req.userId`, set by
`requireAuth`) — never take a user id from a query parameter or the
request body for this, since a client could simply put a different
user's id there.

## Build it yourself

**Step 1 — Write `GET /orders`, protected by `requireAuth`.**
Query the `Order` model for documents where `userId` equals `req.userId`
— **not** all orders. Sort them, most recent first (look up Mongoose's
`.sort()` and what value on your `timestamps`-generated `createdAt`
field gives you newest-first).

**Step 2 — Also write `GET /orders/:id` for a single order's detail.**
Same `requireAuth` protection, plus one more check specific to this
route: after fetching the order by its id, confirm its `userId` actually
matches `req.userId` before returning it. If it doesn't match — meaning
this is a real order, just not this user's — respond the same way as "not
found" (`404`), **not** some kind of "forbidden" response that would
confirm to an attacker that *an* order exists at that id, just not
theirs. Think through why leaking that distinction is itself a small
information leak worth avoiding.

**Step 3 — Build `orders.html`.**
Fetch `/orders` (with the auth header) on load. Render a list — order
id (or a shortened version), date, status, total, and item count are
enough for a list view. Handle the empty-state ("no orders yet") the
same way you've handled every other empty state since Day 3.

**Step 4 — Link into an order's detail.**
Clicking an order in the list fetches and shows its full detail (line
items, quantities, snapshotted prices) — either inline (expand/collapse)
or via a query parameter pointing at `GET /orders/:id`. Either approach
is fine; the important part is that the detail view is built entirely
from what the *order document* stored (Day 26's snapshots), never by
re-looking-up current product data — confirm this by changing a
product's price (via `PUT`, Week 4) after placing an order, and checking
that the order's historical detail still shows the *original* price.

## Self-check

- [ ] `GET /orders` returns only the logged-in user's own orders — test
      this concretely: log in as two different users (Week 5), place an
      order as each, and confirm each only ever sees their own in
      `orders.html`.
- [ ] `GET /orders/:id` for an order that belongs to a *different* user
      returns `404`, not the order's data and not a distinct "forbidden"
      status.
- [ ] Changing a product's price after an order was placed does **not**
      change that historical order's displayed line-item price —
      concrete proof Day 26's snapshotting works end to end.
- [ ] `orders.html` with no orders yet shows a clear empty state, not a
      blank page or an error.
- [ ] Both routes require a valid auth token — no token returns `401`,
      never order data.

## Exercise

Without a hint:

1. Add simple status display styling (a colored badge, say) so
   `"pending"` visually stands out from any other status value you might
   introduce later (e.g. once an admin can mark orders as shipped, in
   Week 7).
2. Commit on branch `day-29-order-history`.

## Reference solution

Compare against `solutions/week-06/day-29-server.js` and
`solutions/week-06/day-29-orders.js` only after your own version passes
every self-check item — the cross-user isolation test in particular is
worth actually doing yourself, not just reading about.

Tomorrow: Week 6 milestone review — the full customer journey, start to
finish.
