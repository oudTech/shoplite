# Day 6 (Mon) — Wiring Up "Add to Cart" with Event Delegation

## What you're building today

Every product card needs an "Add to Cart" button. The obvious approach —
attach a click listener to each button as you create it — has a hidden
trap you're about to discover. Today you learn why, and the pattern that
avoids it: **event delegation**.

## Concept: why you can't just attach a listener per button

Think about `renderProducts`: every time it runs (a new search, a new
category), it wipes `productGrid` and rebuilds every card from scratch —
brand new DOM elements. Any listener you attached directly to an old
button is gone with it, attached to an element that no longer exists.
If you only attach listeners at the *first* render, buttons created by
every later render are silently dead.

You could re-attach listeners after every render, but there's a cleaner
fix: **event delegation**. Clicks *bubble* — a click on a button inside
`productGrid` also fires (as it bubbles up) on `productGrid` itself. So
instead of one listener per button, attach **one listener, once, on
`productGrid`**, and inside it, check what was actually clicked. That one
listener never gets destroyed, no matter how many times the grid re-renders.

## Build it yourself

**Step 1 — Add a button to each card.**
In `createProductCard` (Day 3), add a `<button>` inside the card's
`innerHTML`, something like "Add to Cart". Give it a class name you can
target in JS (e.g. `add-to-cart-btn`). Do **not** attach a click listener
to it here — that's the trap described above.

**Step 2 — Attach exactly one listener, on the grid.**
Somewhere that runs once (not inside `createProductCard` or
`renderProducts`), attach a single `"click"` listener to `productGrid`.

**Step 3 — Figure out what was actually clicked.**
Inside that listener, the event object's `target` is the exact element
clicked — which might be the button, or (if your button has an icon or
nested span) something *inside* the button. Look up
`event.target.closest(...)` — it walks up from the clicked element to the
nearest ancestor matching a selector, which is exactly what you need to
reliably find "the add-to-cart button, if one was clicked" regardless of
what nested element the user's cursor happened to land on.

If `closest()` returns `null`, the click wasn't on a button at all (maybe
the card background, or empty grid space) — your listener should do
nothing in that case.

**Step 4 — Find out which product was clicked.**
The button itself doesn't know which product it belongs to — but its
*card* does (`dataset.id`, from Day 3). From the clicked button, use
`closest()` again to find the ancestor `.product-card`, read its
`dataset.id`, and use that to look up the actual product object out of
`PRODUCTS` (think `.find()`).

**Step 5 — Prove the wiring works.**
You haven't built real cart logic yet — that's tomorrow. For today,
`console.log` the product you found, and confirm in DevTools that
clicking each button's card logs the *correct* product, not always the
first one, and not `undefined`.

## Self-check

- [ ] Clicking "Add to Cart" on any card logs that exact product's data,
      not the wrong one and not `undefined`.
- [ ] Type a search term that re-renders the grid with fewer cards, then
      click a button on one of the *newly rendered* cards — it still
      works, proving your listener survived the re-render.
- [ ] Clicking somewhere on a card that isn't the button (e.g. the image)
      does not log anything or throw an error.
- [ ] Open DevTools' Elements panel and confirm there is exactly **one**
      click listener on `#product-grid`, not one per button (some
      browsers let you inspect this under the element's "Event Listeners"
      tab).

## Exercise

Without a hint:

1. Add a second button to each card, "View Details", with its own class.
   Extend your delegated listener to tell the two buttons apart and log a
   different message for each — without adding a second listener.
2. Commit on branch `day-06-event-delegation`.

## Reference solution

Compare against `solutions/week-02/day-06-app.js` (a modified version of
`day-03-app.js` with the button and delegation added) only after your own
version passes the self-check. Pay attention to *where* the listener is
attached in the reference — on the grid, not on `document` or `body` —
and think about why attaching it even higher up would still technically
work but be a worse choice.

Tomorrow: turning that logged product into an actual cart.
