# Day 5 (Fri) — Array Methods: Search & Filter

## What you're building today

A store with 8 hardcoded products doesn't need search. A store with
hundreds does. Today you build live search and category filtering — and
this is also the first day your UI reacts to user *input*, not just
loads once and sits still.

## Concept: `.filter()` doesn't change the original list

`Array.prototype.filter()` takes an array and a test function, and
returns a **new** array containing only the items that passed the test.
Critically, it does not touch the original array. This matters a lot
here: `PRODUCTS` needs to stay the full, untouched catalog forever, no
matter how many times someone types into the search box or picks a
category — every new keystroke filters *from the original list again*,
not from whatever was already filtered.

You'll also want `.map()` (transform every item into something else —
here, pulling just the `category` out of every product) and the `Set`
object (a collection that automatically drops duplicate values) to build
the category dropdown's options without hardcoding a fixed list of
categories that would go stale the moment someone adds a ninth product in
a new category.

## Build it yourself

**Step 1 — Add the controls to the page.**
In `index.html`, add a text `<input type="search">` and a `<select>`
above your product grid, inside some kind of toolbar wrapper. Give both
elements ids you can reference from JS. The select needs at least one
default option meaning "show every category" — decide what its `value`
should be (something that can never collide with a real category name,
like `"all"`).

**Step 2 — Populate the category dropdown from real data, not by hand.**
Don't hardcode `<option>` tags for each category — if a product's
category changes or a new one is added, hardcoded options would silently
go stale. Instead, write a function that:
- Takes the full product list.
- Extracts every product's `category` (think `.map()`).
- Removes duplicates (think `new Set(...)`, then spread it back into an
  array).
- For each unique category, creates and appends an `<option>` element to
  your `<select>`.

Call this function once, with `PRODUCTS`, when the page loads.

**Step 3 — Write the actual filtering logic.**
Write a function with no parameters that:
- Reads the *current* value of the search input and the *current* value
  of the category select.
- Runs `PRODUCTS.filter(...)`, where the test for each product checks
  **two** things at once: does the product's name include the search
  term (case-insensitively — think about `.toLowerCase()` on both sides
  of the comparison), **and** does its category match the selected one
  (or is `"all"` selected, meaning skip the category check entirely)?
- Returns the filtered array.

Think carefully about why this reads from the inputs *live*, each time
it's called, rather than being handed the search term as a parameter —
you want one function you can call from multiple event listeners without
each one having to know how to read every input itself.

**Step 4 — Re-render whenever either control changes.**
Write a small function that calls your Step 3 function and passes the
result straight into `renderProducts` from Day 3. Attach this function as
an event listener on **both** the search input and the category select —
think about which event fires on every keystroke for a text input (not
`change`, which only fires when you click away) versus what fires on a
select when its value changes.

**Step 5 — Wire the initial page load.**
On page load, you still need the dropdown populated (Step 2) and the
full grid rendered (already done Day 3) — confirm both still happen in
the right order before anything else runs.

## Self-check

- [ ] Typing into the search box filters the grid on every keystroke, not
      just when you press Enter or click away.
- [ ] The category dropdown lists every real category from your data —
      temporarily add a ninth product with a brand-new category to
      `PRODUCTS`, reload, and confirm it shows up in the dropdown without
      you touching the dropdown code.
- [ ] Selecting a category **and** typing a search term at the same time
      correctly narrows by both together, not just whichever you touched
      most recently.
- [ ] Search for something that matches nothing — confirm you see Day 3's
      empty-state message, not a blank silent grid.
- [ ] Clear the search box back to empty — confirm the full (currently
      category-filtered) list comes back, proving you're always filtering
      from the original `PRODUCTS`, not from an already-filtered list.

## Exercise

Without a hint:

1. Add a "Sort by price" dropdown (low→high / high→low) that works
   together with the existing search and category filter — all three
   should apply at once.
2. Commit on branch `day-05-search-filter`.

## Reference solution

Compare against `solutions/week-01/day-05.js` (and the small HTML
addition in `solutions/week-01/day-05-index-snippet.html`) only after
your own version passes every self-check item above. Pay particular
attention to whether your filter function checks *both* conditions in a
single `.filter()` call, or whether you filtered twice in sequence —
either can work, but understand which one you wrote and why.

That's Week 1 done — a browsable, searchable, filterable product catalog,
entirely client-side. Week 2 makes it interactive: an actual cart.
