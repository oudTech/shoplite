# Day 27 (Tue) — `POST /orders`: Server-Side Price and Stock Enforcement

## What you're building today

The route that actually creates an order from a cart — and a critical
security lesson: **never trust a price the client sends you.**

## Concept: why the client's cart data can't be trusted for money

Think about what your Week 2 cart actually is, from the server's point
of view: it's JSON in a request body, and a request body can contain
*anything* — not just what your own frontend would normally send.
Someone using a tool like Postman (exactly like the one you've used all
along for legitimate testing) could send `POST /orders` with a cart
claiming a ₦25,000 product costs ₦1. If your server trusts that price,
you've just built a store anyone can rob.

The fix: the request should only tell the server *which* products and
*how many* — `[{ productId, quantity }]` — nothing about price or name.
The server looks up each product's **real, current** price and name from
the database itself, and that's what gets snapshotted into the order.
The client's cart is a convenience for the user; it is never the source
of truth for what anything actually costs.

## Build it yourself

**Step 1 — Write the route shell.**
`POST /orders`, protected by Day 23's `requireAuth` (an order always
belongs to a logged-in user — `req.userId` tells you who). Read `items`
(an array of `{ productId, quantity }`) from the request body.

**Step 2 — Validate the shape of what came in.**
`items` must be a non-empty array, and each entry needs a plausible
`productId` and a `quantity` that's a positive integer. Reject (`400`)
anything that doesn't meet this before touching the database at all.

**Step 3 — Look up each real product, and build the snapshot.**
For each item, fetch the actual product from the database by its id
(Day 18's `findById`, with the same malformed-id handling you already
built). If any referenced product doesn't exist at all, the whole order
should fail — decide and justify a status code (think about whether this
is really the client's fault, i.e. `400`, or something else).

**Step 4 — Enforce stock.**
For each item, compare the requested `quantity` against that product's
current `stock` (from your Week 4 schema). If any item requests more
than what's in stock, reject the *entire* order (not just that one line)
with a clear `400` message naming which product and how much is
available — think about why silently reducing the quantity instead of
rejecting would be a worse experience, not a better one.

**Step 5 — Build the order and decrement stock together.**
Using the real, server-verified name and price for each item, build the
order's `items` array and compute `total` yourself (server-side —
another value never trusted from the client, for the same reason as
individual prices). Save the order. Then decrement each purchased
product's `stock` by the ordered quantity. Think about what should
happen if the order save succeeds but a stock update partway through
fails — this is a real gap in a project at this stage (a proper fix
involves database transactions, beyond today's scope) — write a comment
acknowledging it rather than silently ignoring the risk.

**Step 6 — Respond, and clear the cart.**
Respond `201` with the created order. The frontend (Day 28) will clear
the client-side cart once it receives this success response — the server
doesn't need to know anything about the cart's *client-side* existence at
all, which is worth noticing: the server only ever dealt with "here are
some products and quantities," never with your Week 2 `CART` array
directly.

## Self-check

- [ ] Submitting an order with a fabricated low price in the request
      body (add a `price` field to a test request on purpose) has **zero**
      effect — the order's stored total reflects the real database price,
      proving the server never reads a client-supplied price at all.
- [ ] Ordering more of a product than its current `stock` is rejected
      with a clear `400`, and no order is created.
- [ ] A successful order correctly decrements the ordered products'
      `stock` — confirm via `GET /products/:id` afterward.
- [ ] An order referencing a nonexistent `productId` is rejected, and no
      partial order is created.
- [ ] The request without a valid auth token is rejected entirely (Day
      23's `requireAuth` doing its job here).
- [ ] The order's stored `total` matches manual arithmetic against the
      real product prices, not anything the client sent.

## Exercise

Without a hint:

1. Add a check that rejects an order with a `quantity` of `0` or
   negative for any item, distinct from the "not enough stock" case,
   with its own specific error message.
2. Commit on branch `day-27-post-orders`.

## Reference solution

Compare against `solutions/week-06/day-27-server.js` only after your own
version passes every self-check item — especially the fabricated-price
test, which is the whole point of today.

Tomorrow: the checkout page itself, and the cart.js/cart-data.js split
from Week 2 pays off.
