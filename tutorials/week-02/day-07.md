# Day 7 (Tue) — Cart State and localStorage

## What you're building today

The cart needs to remember what's in it — not just in memory (gone on
refresh) but across page reloads. Today you build the cart's *state*
layer: a separate file responsible only for tracking what's in the cart
and persisting it, with zero DOM code in it. Tomorrow you build the
*sidebar UI* that displays it.

## Concept: why state and UI are two separate files

Yesterday's `console.log` proved you can identify which product was
clicked. Today, instead of writing cart logic straight into your click
handler, you'll put it in its own file: `cart-data.js`. Why separate it
from the DOM code in `app.js`?

Because "what's in the cart" and "how the cart looks on screen" are
different responsibilities that change for different reasons. If you ever
change how the cart displays (a sidebar today, maybe a full page later),
the *state* logic — adding items, merging duplicates, computing a
subtotal — shouldn't need to change at all. Keeping them separate means
you can test "does adding the same product twice correctly bump the
quantity to 2" without touching a single DOM element. You already did a
smaller version of this split on Day 3 (`createProductCard` vs
`renderProducts`) — this is the same idea at a larger scale.

## Build it yourself

**Step 1 — Decide the cart's shape.**
A cart is a list of *cart lines*, not a list of full product objects.
Think about why: if `PRODUCTS` ever changes (price update, restock), a
cart holding a full copy of the old product object would go stale. What's
the minimum a cart line needs to know? At least the product's `id` and a
`quantity` — everything else (name, price, image) can be looked up from
`PRODUCTS` by `id` whenever you need to *display* the cart. Declare an
empty array, `CART`, to hold these lines.

**Step 2 — Write `addToCart(productId)`.**
This function should:
- Check whether a cart line for this `productId` already exists in
  `CART` (think `.find()`).
- If it exists, increment its `quantity` instead of adding a duplicate
  line — adding the same product twice should result in **one** line
  with `quantity: 2`, not two lines.
- If it doesn't exist, push a new line (`{ id: productId, quantity: 1 }`)
  onto `CART`.

**Step 3 — Write `removeFromCart(productId)` and
`updateQuantity(productId, newQuantity)`.**
`removeFromCart` should filter `CART` down to lines that don't match the
given id (think back to Day 5's `.filter()`). `updateQuantity` should find
the matching line and set its `quantity` — and decide what should happen
if `newQuantity` is `0` or negative (hint: that's really a removal).

**Step 4 — Write two small "derived data" helpers.**
- `getCartCount()` — the total number of items across all lines (not the
  number of *lines* — two lines with quantity 3 and 2 should count as 5).
  Think `.reduce()`.
- `getCartSubtotal()` — the total price, which means for each cart line
  you need to look up the matching product in `PRODUCTS` by `id` to get
  its price, then multiply by that line's quantity, then sum. This is the
  clearest example yet of why storing just an `id` in the cart line (not
  a full copy of the product) was the right call in Step 1 — you always
  get the *current* price.

**Step 5 — Persist to `localStorage`.**
`localStorage` only stores strings, so saving an array means
`JSON.stringify`-ing it first, and loading means `JSON.parse`-ing what
comes back. Write a `saveCart()` that stores `CART` under some key (pick
a name unlikely to collide with anything else, e.g. `"shoplite-cart"`),
and call it at the end of every function from Steps 2–3 that changes
`CART` — think about why forgetting this in even one of those functions
would produce a cart that mysteriously "forgets" changes made through it
alone. Then write a `loadCart()` that reads that key back and parses it
if present, defaulting `CART` to `[]` if nothing's stored yet (first
visit) — call `loadCart()` once, when this file first runs.

**Step 6 — Wire yesterday's button to real state.**
Back in `app.js`'s delegated click handler from Day 6, replace the
`console.log` with a call to `addToCart(product.id)`.

## Self-check

- [ ] Add the same product three times — `CART` (check in DevTools
      console) has **one** line with `quantity: 3`, not three lines.
- [ ] Reload the page — the cart is still there (open the console and
      check `CART`, or inspect `localStorage` in DevTools' Application
      tab).
- [ ] `getCartCount()` returns the sum of quantities, not the number of
      lines, when you have more than one product in the cart.
- [ ] `getCartSubtotal()` returns a number that matches manual
      arithmetic: add up `price × quantity` for each line yourself and
      compare.
- [ ] `removeFromCart` on a product not in the cart doesn't throw an
      error — `CART` should just stay unchanged.
- [ ] Clear `localStorage` manually in DevTools, reload — cart starts
      empty with no errors in the console.

## Exercise

Without a hint:

1. Write a `clearCart()` function that empties `CART` completely and
   updates `localStorage` to match.
2. Commit on branch `day-07-cart-state`.

## Reference solution

Compare against `solutions/week-02/day-07-cart-data.js` only after your
own version passes every self-check item. Pay attention to *when*
`saveCart()` gets called in the reference — after every single mutation,
never batched or skipped — and compare that against your own version.

Tomorrow: the sidebar that actually shows all of this on screen.
