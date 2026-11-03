# Day 34 (Thu) — UX Polish: Loading States, ARIA, and Focus

## What you're building today

No new features. Today you go back across the *entire* app — storefront,
cart, auth, checkout, admin — and fix the small things that separate
"functionally correct" from "actually pleasant and accessible to use."

## Concept: accessibility isn't a separate feature, it's a property of what you already built

A sighted, mouse-using tester can click through your whole app and find
zero bugs, while someone using a screen reader or keyboard-only
navigation hits real, blocking problems on the same pages. A button that
is a `<div>` with a click handler (rather than a real `<button>`) can't
be reached by keyboard `Tab` navigation at all. An icon-only button with
no accessible label is announced by a screen reader as just "button" —
useless. A modal (your Day 8 cart panel, functionally) that doesn't move
keyboard focus into itself when opened leaves a keyboard user stuck
interacting with content behind it. These aren't edge cases affecting a
tiny fraction of users doing something unusual — they're basic
usability failures for a meaningful group of real users, and every one
of them is cheap to fix now and progressively more annoying to retrofit
later.

## Build it yourself

**Step 1 — Audit interactive elements.**
Go through every clickable thing in your app — product cards' buttons,
cart controls, forms, admin controls — and confirm each is a real
`<button>` or `<a>`, not a `<div>` or `<span>` with a click handler. Fix
any that aren't (this is also usually less code, not more — native
elements come with keyboard behavior for free).

**Step 2 — Add labels where the visible content alone isn't enough.**
An icon-only button (a close "×", a trash-can delete icon) needs an
`aria-label` describing what it does, since there's no visible text for
a screen reader to announce. Look up `aria-label` and add it wherever a
button's purpose isn't conveyed by its visible text alone.

**Step 3 — Manage focus when the cart panel opens.**
When Day 8's cart panel opens, move keyboard focus into it (its close
button is a reasonable target) — look up the `.focus()` method. When it
closes, return focus to whatever opened it (the cart toggle button) —
without this, a keyboard user's focus is left on an element that's no
longer meaningfully in context.

**Step 4 — Add visible focus states.**
Every interactive element needs a visible indication of keyboard focus —
by default, browsers provide one, but it's common (and a real
accessibility regression) to accidentally remove it with
`outline: none` somewhere in your CSS without replacing it. Look up
`:focus-visible` specifically (as opposed to plain `:focus`, which also
triggers on mouse clicks) and confirm every interactive element has a
clear, visible focus style when tabbed to.

**Step 5 — Loading and disabled-state consistency pass.**
You've built loading states inconsistently across different features
(Day 9's fetch demo, Day 14's product load, Day 25's auth forms, Day
28's checkout). Go through each and confirm: is the loading state
visually consistent (same pattern, not four different styles)? Is every
button that triggers an async action properly disabled while it's
in flight, everywhere, not just the ones you happened to build carefully?

**Step 6 — A full keyboard-only pass.**
Unplug your mouse, or simply don't touch it, and try to complete a full
shopping journey — browse, search, add to cart, open the cart, check
out, log in — using only `Tab`, `Shift+Tab`, `Enter`, and `Space`. Every
single thing you could do with a mouse should be reachable this way.

## Self-check

- [ ] Every interactive control is a real `<button>` or `<a>`, confirmed
      by a `Tab`-only pass reaching every one of them in a sensible
      order.
- [ ] Every icon-only control has a clear `aria-label`.
- [ ] Opening the cart panel moves focus into it; closing it returns
      focus to the toggle button.
- [ ] Every focusable element shows a visible focus indicator when
      tabbed to.
- [ ] You completed a full add-to-cart-through-checkout journey using
      only the keyboard, with no point where you got stuck or lost track
      of where focus was.
- [ ] Every async button (search doesn't count — that's not a button —
      but every add-to-cart, place-order, login, signup, and admin
      save/delete action) disables itself while its request is pending.

## Exercise

Without a hint:

1. Add a visually-hidden ("skip to main content") link at the very top
   of `index.html`, only visible when focused, that jumps a keyboard
   user directly past the header to the product grid — look up the
   standard CSS pattern for this ("visually hidden but focusable").
2. Commit on branch `day-34-accessibility-polish`.

## Reference solution

Compare against `solutions/week-07/day-34-notes.md` (a description of the
specific fixes applied, since this work is spread across nearly every
existing file rather than one new one) only after your own keyboard pass
in Step 6 succeeds end to end.

Tomorrow: a deliberate bug bash — Week 7's last day, and a chance to find
and fix real issues before Week 8's deployment.
