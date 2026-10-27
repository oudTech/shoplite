# Day 28 (Wed) — The Checkout Page

## What you're building today

`checkout.html` — a page that reads the current cart, shows a summary,
and submits it to yesterday's `POST /orders` on confirmation.

## Concept: the Week 2 state/data split pays off, right now

Remember Day 7's reasoning for splitting `cart-data.js` (pure state) from
`cart.js` (the sidebar's DOM code)? Today is the payoff. Checkout needs
the *same underlying cart state* — the same `CART` array, the same
`getCartSubtotal()` — but displayed completely differently (a full page
summary, not a sidebar). Because Day 7 kept the state logic free of any
sidebar-specific DOM code, `checkout.html` can load `cart-data.js`
directly and reuse every one of its functions without modification. If
Week 2 had jammed cart logic and sidebar rendering into a single file,
today would require either duplicating logic or awkwardly untangling it
— this is the concrete payoff of that earlier separation-of-concerns
decision.

## Build it yourself

**Step 1 — Build the summary view.**
In `checkout.html`, load `data.js` (or fetch products, per Day 14) and
`cart-data.js`. Write a function that renders a read-only summary of the
current cart: each line's name, quantity, per-line subtotal, and the
overall total (`getCartSubtotal()`) — this is deliberately similar to
Day 8's cart-line rendering, but without the remove buttons; checkout is
a review step, not an editing step.

**Step 2 — Handle an empty cart.**
If someone navigates directly to `checkout.html` with nothing in their
cart, don't show a broken or empty-looking order form — show a clear
message and a link back to the store.

**Step 3 — Require login before allowing checkout.**
Use Day 24's `isLoggedIn()`. If the user isn't logged in, don't silently
fail on submit — check this up front and show a clear prompt to log in
first (a link to `auth.html` is enough; you don't need anything fancier).

**Step 4 — Build the "Place Order" submission.**
On confirmation, build the `items` array your Day 27 route expects
(`{ productId, quantity }` — nothing else; recall yesterday's lesson
about what the client should and shouldn't send) directly from `CART`,
and `POST` it to `/orders`, including the `Authorization` header (Day
24's pattern) since the route requires auth.

**Step 5 — Handle both outcomes explicitly.**
On success: clear the cart (Day 7's `clearCart()`), show a clear
confirmation (the created order's id is a nice touch), and redirect or
link to an order confirmation state. On failure — specifically the Day
27 out-of-stock case — show the *actual* error message from the response
body (which product, how much is available), not a generic "something
went wrong," and don't clear the cart, since the order didn't actually
go through.

**Step 6 — Show a loading state during submission.**
Same reasoning as Day 25's auth forms: disable the "Place Order" button
while the request is in flight, to prevent a double-submitted order from
an impatient double-click.

## Self-check

- [ ] Visiting checkout with items in the cart shows an accurate summary
      matching the sidebar's numbers exactly.
- [ ] Visiting checkout with an empty cart shows a clear message, not a
      broken empty form.
- [ ] Visiting checkout while logged out prompts login instead of
      allowing submission.
- [ ] A successful order clears the cart, shows confirmation, and the
      order actually exists (confirm via Postman, `GET` a route you'll
      build tomorrow, or by checking the database directly).
- [ ] Deliberately triggering an out-of-stock rejection (order more of
      something than exists) shows the real error message, and the cart
      is **not** cleared afterward.
- [ ] Rapidly double-clicking "Place Order" results in exactly one order,
      not two.

## Exercise

Without a hint:

1. After a successful order, in addition to clearing the cart, update
   the header's cart badge (Day 8) to reflect the now-empty cart
   immediately, without a page reload.
2. Commit on branch `day-28-checkout-page`.

## Reference solution

Compare against `solutions/week-06/day-28-checkout.js` only after your
own version passes every self-check item.

Tomorrow: letting a user see their own past orders.
