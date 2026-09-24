# Day 4 (Thu) — CSS: Making It Look Like a Real Store

## What you're building today

Yesterday's grid works but looks like a list of broken furniture — no
spacing, no visual grouping, nothing to guide the eye. Today you write
the CSS that makes it look intentional, and makes it hold up on a phone
screen, since that's how most real shoppers will actually visit.

## Concept: layout is a decision, not a default

Two CSS layout systems solve almost everything you'll need here:
**Flexbox** (one-dimensional — a row or a column of items) and **Grid**
(two-dimensional — rows *and* columns together, which is exactly what a
product catalog is). Before writing any CSS today, decide which one fits
"a grid of product cards that should re-flow its column count based on
the screen width" — that decision should point you toward one of the two
fairly clearly.

Responsiveness here doesn't mean "add a media query for every screen
size." A well-chosen CSS Grid setting can make columns appear and
disappear on their own as the container resizes, with **zero** media
queries. Look up `repeat()`, `auto-fill`, and `minmax()` together — the
combination of those three is what gives you that behavior. Only reach
for an explicit `@media` query afterward, for anything that specific
combination can't handle on its own (for instance, shrinking the minimum
card width further on very small screens).

## Build it yourself

**Step 1 — Reset the obvious inconsistencies.**
Different browsers apply slightly different default spacing to `<body>`
and other elements. Start `styles.css` with a small reset: at minimum,
set `box-sizing: border-box` globally (look up why — it changes how
`width`/`height` interact with `padding`/`border`, and it will save you
constant confusion later), and remove `body`'s default margin.

**Step 2 — Style the page shell.**
Give `.site-header` a background color and enough padding that it doesn't
look cramped against the browser edge. Give `<main>` a reasonable
`max-width` and center it — an edge-to-edge layout on a wide desktop
monitor is uncomfortable to read.

**Step 3 — Lay out the grid itself.**
Apply `display: grid` to your `#product-grid` (or `.product-grid`) from
yesterday. Now the actual decision: write a `grid-template-columns` value
using `repeat(auto-fill, minmax(<some-width>, 1fr))`. Try a few different
minimum widths (`180px`? `220px`? `260px`?) and resize your browser
window to see how the column count changes on its own. Pick whichever
minimum width looks right at both a narrow and a wide window. Add a
reasonable `gap` between cards — don't let them touch.

**Step 4 — Style one card.**
Give `.product-card` a white (or light) background distinct from the
page background, rounded corners, and a subtle `box-shadow` so it reads
as a raised, tappable object rather than a flat rectangle. Make sure the
image inside doesn't distort — look up `object-fit: cover` and
`aspect-ratio` together to keep every product image the same shape
regardless of its original dimensions.

**Step 5 — Add one small interactive touch.**
Add a `:hover` style on `.product-card` — a slightly deeper shadow or a
small lift (`transform: translateY(...)`) — paired with a `transition` so
the change animates instead of snapping instantly. This is optional
polish, but it's the first moment your interface responds to the user
doing something, which is worth practicing now.

**Step 6 — Handle the very small screen case.**
If your Step 3 minimum width doesn't already look right on a very narrow
phone width (~360px), add one `@media (max-width: 480px)` rule that
lowers the minimum card width just for that range. Resist adding more
media queries than this — if you're reaching for a fourth or fifth one,
that's usually a sign Step 3's `minmax()` value needs adjusting instead.

## Self-check

- [ ] Resize your browser from very wide to very narrow — the column
      count changes smoothly, with no horizontal scrollbar appearing at
      any width.
- [ ] No product image looks stretched or squashed, regardless of its
      original size.
- [ ] Hovering a card gives some visible feedback.
- [ ] The empty-state message from Day 3 (when you tested it with `[]`)
      still looks reasonable, not broken, with your new styles applied.
- [ ] Open DevTools' device toolbar and check an actual phone width
      (375px is a common one) — nothing overlaps or overflows sideways.

## Exercise

On your own, no hints:

1. Style the `<h3>` (product name) and `.price` text so the price is
   visually distinct — a different color or weight, so a shopper's eye
   goes to the price without having to read every word.
2. Pick your palette's colors deliberately, and write down (in a
   comment) which color you're using for what role — you'll need this
   again on Day 5 when styling the color-role reference sheet the whole
   design system will build on.
3. Commit on branch `day-04-styling`.

## Reference solution

Compare against `solutions/week-01/day-04.css` after your own version
passes the self-check above. Specifically compare your
`grid-template-columns` value against the reference's — there's no single
correct number, but check that the *technique* (`auto-fill` +
`minmax()`) matches, not just the literal pixel values.

Tomorrow: search and filtering.
