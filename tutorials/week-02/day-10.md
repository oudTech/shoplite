# Day 10 (Fri) — Week 2 Milestone Review

## What you're building today

Nothing new. Today you step back, test everything you've built like a
skeptical user would, deliberately try to break it, and fix whatever you
find — this is the habit that separates "it worked when I built it" from
"it actually works."

## Where you should be

By the end of today, ShopLite (entirely client-side, no backend yet)
should let someone: browse a full catalog, search and filter it live,
add products to a cart, see the cart update in real time, reload the page
without losing the cart, remove items, and understand — because you wrote
every function yourself — exactly how each of those pieces works and why
they're split into the files they're in.

## Full walkthrough — do this from a completely fresh browser state

**Step 1 — Clear everything.**
Clear `localStorage` for your page (DevTools → Application tab), then
hard-reload.

**Step 2 — Walk through as a first-time shopper.**
- Browse the full catalog. Every card shows the right name, price,
  category, and image (or the fallback image if a URL is bad).
- Search for something that exists — confirm live filtering.
- Search for something that doesn't exist — confirm the empty state, not
  a blank grid or a console error.
- Filter by category alone, then combine it with a search term.
- Add several different products to the cart, including adding the
  *same* product twice — confirm quantities merge instead of duplicating
  lines.
- Open the cart, confirm the subtotal is arithmetically correct.
- Remove an item from the cart and confirm the subtotal and badge update
  immediately.
- Reload the page. Confirm the cart survived, badge and all — *without*
  opening the cart panel first.

**Step 3 — Deliberately try to break it.**
Try each of these on purpose. If any of them produces a broken UI or a
console error, that's a real bug to fix today, not tomorrow:
- Add a product to the cart, then immediately search for something that
  filters it out of the visible grid — does the cart still show it
  correctly?
- Resize the browser to a narrow width while the cart panel is open.
- Click "Add to Cart" very rapidly, several times in a row, on the same
  product.
- Open DevTools, manually corrupt the `localStorage` cart value (edit it
  to invalid JSON), then reload — does your `loadCart()` from Day 7 crash
  the whole page, or fail gracefully?

**Step 4 — Read your own code like a reviewer.**
Open every file you've written this week and, for each function, ask
yourself: does its name describe exactly what it does? Is there any
function doing two unrelated jobs that should be two functions (the same
question that justified splitting `createProductCard` from
`renderProducts` back on Day 3)? Fix anything that doesn't hold up —
small renames and splits now are far cheaper than leaving them for
Week 6, when the backend and checkout flow will be built directly on top
of this code.

## Self-check

- [ ] Every scenario in Step 2 works exactly as described, from a
      cleared, fresh state.
- [ ] Every scenario in Step 3 either works correctly or fails gracefully
      (a visible error message, not a broken page or silent data loss).
- [ ] You found and fixed at least one thing during Step 4, even a small
      one — if you truly found nothing, look harder at your longest
      function.

## Exercise

Without a hint:

1. Write down (in a `NOTES.md` or similar) one thing about your Week 1–2
   code you'd do differently if you started over, and why. This isn't
   busywork — the ability to critique your own past code is exactly what
   improves your *next* piece of code.
2. Commit on branch `day-10-milestone-review`.

## Reference solution

There's no separate reference solution today — today's "solution" is
whatever bugs Step 3 surfaced, fixed, in your own codebase from Days 6–9.

Next week: a real backend. ShopLite's product data stops being a
hardcoded array and starts living on a server you build yourself, with
Node and Express.
