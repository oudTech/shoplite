# Day 3 (Wed) — DOM Manipulation: Rendering the Catalog

## What you're building today

`PRODUCTS` from Day 2 is just data sitting in a file — invisible to
anyone visiting the page. Today you write the code that turns that data
into an actual grid of product cards a shopper could look at.

## Concept: two responsibilities, two functions

There are two genuinely different jobs here, and conflating them is the
single most common mistake at this stage:

- **Building one card.** Given one product, produce one piece of HTML (or
  one DOM element) representing it. This job doesn't care how many
  products exist, or where the card ends up — it just turns _one product_
  into _one card_.
- **Filling the grid.** Given a _list_ of products, put a card for each
  one on the page, and make sure old cards don't pile up if this runs
  again (which it will — every time you search or filter later in the
  week, the whole grid needs to be redrawn from scratch).

Why split these into two separate functions instead of one big one? Because
you will need "build one card" again and again for the rest of this
project — in search results, in the cart sidebar, in the admin panel —
but you'll only ever need "wipe and refill the whole grid" in a couple of
specific places. A function that does one focused job is reusable. A
function that does five things at once has to be rewritten every time you
need just one of those five things elsewhere.

This is why, once you write these two functions, you'll see the second
one _calling_ the first one in a loop — one function per product, driven
by the function that owns the full list.

## Build it yourself

**Step 1 — Give the page something to render into.**
Open `frontend/index.html`. Inside `<body>`, you need one empty container
element the JavaScript will fill. Add a `<section>` with an `id` you'll
reference from JS (call it something like `product-grid`) — leave it
empty; a comment inside it like `<!-- product cards render here -->` is
enough for now. Also link your (not-yet-written) `frontend/css/styles.css`
in the `<head>`, and load `frontend/js/data.js` and a new
`frontend/js/app.js` at the bottom of `<body>`, in that order — think
about _why_ the order matters: `app.js` is about to use `PRODUCTS`, which
only exists after `data.js` has already run.

**Step 2 — Grab a reference to your container, once.**
In `app.js`, get a reference to the grid element by its id
(`document.getElementById(...)`). Store it in a variable at the top of
the file. You'll use this reference repeatedly — look it up once, not
every time you need it.

**Step 3 — Write the "one card" function.**
Write a function that takes exactly **one** product object as its
parameter and **returns** one DOM element. Before writing the body, plan
it out:

- What HTML element type is a sensible container for a card? (An
  `<article>` is a reasonable, semantic choice — think about why a
  generic `<div>` is _technically_ fine but less meaningful.)
- Give it a class name you can style later.
- You'll need to know _which_ product a card represents when it's
  clicked, days from now. Store the product's id somewhere on the element
  itself — look up `element.dataset` and think about how you'd use it to
  attach an arbitrary id to a DOM element.
- Build the actual visible content: an image, the name, the formatted
  price (you already wrote `formatPrice` yesterday — use it, don't
  reinvent it). Decide whether you build this with `innerHTML` and a
  template literal, or with individual `createElement`/`appendChild`
  calls — either is valid; know which one you chose and why.
- Return the finished element. A function that builds something and
  doesn't return it is useless to whatever calls it.

Skeleton to fill in yourself — don't copy this, use it to check your own
structure once you've written a first attempt:

```js
function createProductCard(product) {
  // 1. create the container element
  // 2. give it a class name
  // 3. store the product's id on it, for later
  // 4. build its visible content using product's fields
  // 5. return the element
}
```

**Step 4 — Write the "fill the grid" function.**
Write a second function that takes a **list** of products. Its job:

- Clear out whatever's currently in the grid container first — think
  about why this matters. (Hint: what happens if this function runs
  twice without clearing first?)
- Handle the case where the list is empty — what should a shopper see
  instead of a blank, silent grid?
- For every product in the list, call your Step 3 function to build its
  card, and add that card into the grid.

**Step 5 — Actually call it.**
At the bottom of `app.js`, call your "fill the grid" function with the
full `PRODUCTS` array so something shows up when the page loads.

## Self-check

Open `frontend/index.html` directly in a browser (or serve it with
`npx serve frontend`) and verify:

- [ ] You see 8 unstyled product cards — ugly is fine, today is not about
      CSS.
- [ ] Each card shows the right name and a correctly formatted price.
- [ ] Open DevTools and inspect one card's element — confirm the
      product's id is actually stored on it somewhere findable.
- [ ] Temporarily call your "fill the grid" function with an empty array
      (`[]`) instead of `PRODUCTS` — confirm you see a sensible message,
      not a blank silent section. Then put `PRODUCTS` back.
- [ ] Call your "fill the grid" function _twice_ in a row with the same
      list — confirm you still see 8 cards, not 16. If you see 16, you
      forgot to clear the container first.

## Exercise

Without being told how, on your own:

1. Add each product's `category` visibly inside its card.
2. Make broken image URLs fail gracefully — if an image can't load, show
   a fallback instead of the browser's default broken-image icon. Look
   up the `error` event on `<img>` elements.
3. Commit your work on branch `day-03-render-products`.

## Reference solution

Compare your two functions against `solutions/week-01/day-03.js` only
after your self-check above fully passes. When you compare, specifically
check: did the reference solution also split this into two functions
with the same two responsibilities you chose? If it structured things
differently, think about _why_ before assuming your version is wrong —
there's more than one reasonable way to write this, as long as the two
responsibilities stay separate.

Tomorrow we make this actually look like a store.
