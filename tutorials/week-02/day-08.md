# Day 8 (Wed) — The Cart Sidebar

## What you're building today

`CART` has been working correctly since yesterday, but invisibly — nobody
shopping on this site can see it. Today you build the sidebar: a panel
that opens, lists what's in the cart, shows a subtotal, and lets someone
remove items or change quantities.

## Concept: render-from-state, again

This is the same pattern as `renderProducts` from Day 3, applied to a
different piece of state: don't try to carefully patch the cart's HTML
line by line as things change. Instead, write **one** function —
`renderCart()` — that wipes the cart panel and rebuilds it completely
from whatever `CART` currently holds, and call that one function after
*every* change (add, remove, quantity update). It's less code to get
right than trying to keep the DOM perfectly in sync by hand, and it's
impossible for the display to drift out of sync with the real state,
because the display **is** a direct reflection of the state, every time.

## Build it yourself

**Step 1 — Add the sidebar's HTML shell.**
In `index.html`, add a cart panel element (hidden by default via CSS —
think about which CSS property actually removes it from layout vs. just
makes it invisible) containing: a close button, an empty container where
cart line items will render, and a subtotal display. Also add a button
somewhere in the header to open the cart, and give it a way to show the
current item count (a small badge).

**Step 2 — Open and close it.**
Write functions (or one toggle function) that add/remove a CSS class on
the cart panel to show or hide it. Wire the header's cart button to open
it, and the panel's close button to close it. Decide, and implement,
whether clicking outside the panel should also close it — think about
what a real store's cart drawer usually does.

**Step 3 — Render one cart line.**
Following the Day 3 pattern exactly: write a function that takes **one**
cart line (`{ id, quantity }`) and returns **one** DOM element showing
that line — look up the actual product from `PRODUCTS` by `id` to get its
name, price, and image, show the quantity, a per-line subtotal
(`price × quantity`), and a remove button. Give the remove button a way
to know which product it belongs to (`dataset.id`, same trick as Day 3's
card).

**Step 4 — Render the whole cart.**
Write `renderCart()`: clear the cart's line-item container, and if `CART`
is empty, show an empty-cart message (same idea as Day 3's empty product
grid). Otherwise, loop over `CART` and append one rendered line (Step 3)
per entry. Update the subtotal display using yesterday's
`getCartSubtotal()`, and update the header badge using
`getCartCount()`.

**Step 5 — Wire remove and quantity changes.**
Using the same event-delegation approach from Day 6 (one listener on the
cart's line-item container, not one per remove button), handle clicks on
a remove button by calling yesterday's `removeFromCart`, then calling
`renderCart()` again immediately after — think about why skipping that
second call would leave the sidebar showing stale data even though `CART`
itself updated correctly. If you add quantity +/- controls, wire those the
same way, through `updateQuantity`.

**Step 6 — Call `renderCart()` from everywhere it needs to run.**
It needs to run: once on page load (so the badge is correct even before
the cart is opened), and after every cart mutation — which means your Day
7 `addToCart` call in the Day 6 click handler needs a `renderCart()` call
right after it too.

## Self-check

- [ ] Opening and closing the cart works from both the header button and
      the panel's own close button.
- [ ] Adding a product updates the header badge *immediately*, even
      without opening the panel.
- [ ] The subtotal shown in the panel always matches manual arithmetic
      for whatever's currently in the cart.
- [ ] Removing a line updates the panel instantly — no reload needed —
      and the subtotal and badge update too.
- [ ] Reload the page with items already in the cart (from Day 7's
      persistence) — the badge and panel show the correct saved state
      immediately, without needing to open and close anything first.
- [ ] An empty cart shows a clear message, not a blank panel.

## Exercise

Without a hint:

1. Add quantity +/- buttons to each cart line (if you haven't already),
   wired to `updateQuantity`, with the line disappearing entirely if the
   quantity is decreased to 0.
2. Commit on branch `day-08-cart-sidebar`.

## Reference solution

Compare against `solutions/week-02/day-08-cart.js` (and the small HTML
addition in `solutions/week-02/day-08-index-snippet.html`) only after
your own version passes every self-check item. Notice that the reference
keeps *all* of this in a new `cart.js` file, separate from yesterday's
`cart-data.js` — the same state/UI split from Day 7's concept section,
now visible as two actual files.

Tomorrow: a short detour into `fetch` and promises, to prepare for Week 3
when the cart starts talking to a real backend.
