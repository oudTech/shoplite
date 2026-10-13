# Day 18 (Wed) — Full CRUD, and the `_id` Problem

## What you're building today

`GET /products/:id`, `PUT /products/:id` (update), and
`DELETE /products/:id`, all against the real database. But first, you
have to actually deal with yesterday's `_id` observation — your Day 13
route logic assumed a small numeric `id`, and that assumption is now
wrong.

## Concept: work through the `_id` problem yourself, don't skip to the answer

Here's the situation, spelled out: your frontend (Day 14) and your Day 13
route both compared `product.id` against a value converted with
`Number(...)`. MongoDB's `_id` is not a small integer — it's a generated
string-like value (an `ObjectId`). Before writing any code today, answer
these for yourself:
- If a request comes in as `GET /products/68f2a9.../`, what does
  `Number("68f2a9...")` produce, and what would that break in code
  written like Day 13's?
- Does the *frontend* need to change at all, given that it never
  constructed ids itself — it always just displayed and echoed back
  whatever the backend gave it?
- Is there a Mongoose method built specifically for "find one document by
  its `_id`" that doesn't require you to manually convert or compare
  anything yourself?

Work out your own answers before reading further or opening the
reference — this is exactly the kind of "the finished code would have
hidden this from you" moment the whole rewrite of these tutorials exists
to preserve.

## Build it yourself

**Step 1 — Fix `GET /products/:id`.**
Rewrite it to query the database by `_id` instead of filtering an array
by a converted number. Look up Mongoose's shortcut method for "find by
id" specifically (it exists precisely because this is such a common
query). Keep your Day 13 behavior: a real id returns the document, a
nonexistent one returns your `404` JSON shape.

**Step 2 — Handle a *malformed* id, not just a missing one.**
Try requesting `/products/not-a-real-id`. An `ObjectId`-shaped query
against a string that isn't validly shaped throws an error inside
Mongoose, rather than just returning nothing — so this is a *different*
failure case from "valid id format, but nothing found." Catch it (a
`try`/`catch` around your async query) and respond with `400` (malformed
request), keeping it distinct from your existing `404` (well-formed
id, not found).

**Step 3 — Rewrite `POST /products` for the database.**
Same validation logic as Day 13, but instead of pushing onto an array and
manually assigning an id, use the model to actually create and save the
new document (look up `Product.create(...)`) — letting MongoDB assign the
`_id` for you. Respond `201` with the saved document.

**Step 4 — Write `PUT /products/:id`.**
Validate the request body the same way as `POST` (reuse that logic rather
than copy-pasting it twice — think about pulling it into a small shared
function). Use a Mongoose update method that finds by id and applies the
changes, returning the *updated* document (look up the option that
controls whether you get the old or new version back — the default may
surprise you). Handle "id doesn't exist" the same way as Step 1.

**Step 5 — Write `DELETE /products/:id`.**
Delete the matching document (look up the appropriate Mongoose method).
Decide what to respond with on success — a full `200` with the deleted
document, or a `204` with no body are both defensible; pick one and be
consistent. Handle "id doesn't exist" the same as the others.

## Self-check

- [ ] `GET`, `PUT`, and `DELETE` all correctly return `404` for a
      well-formed id that doesn't exist in the database.
- [ ] All three correctly return `400` (not a crash, not a `404`) for a
      garbage, malformed id like `"abc"`.
- [ ] `POST` creates a real document you can immediately `GET` by the
      `_id` it returned.
- [ ] `PUT` actually persists — `GET` the same product again afterward
      and confirm the change is really there, not just echoed back in
      the `PUT` response.
- [ ] `DELETE` actually removes it — a subsequent `GET` for that same id
      returns `404`.
- [ ] You can explain, in your own words, why `_id` broke your old
      numeric-comparison logic and what specifically fixed it — write
      this down before checking the reference.

## Exercise

Without a hint:

1. Add a check to `PUT` and `DELETE` (or reuse across all three
   write routes) that rejects requests where the id parameter isn't even
   shaped like a valid `ObjectId` *before* hitting the database at all —
   look up Mongoose's built-in validity check for this, rather than
   relying only on catching the database's own error.
2. Commit on branch `day-18-crud-and-objectid`.

## Reference solution

Compare against `solutions/week-04/day-18-server.js` only after you've
worked through the concept questions yourself and your own version passes
the self-check. This is one of the more important days to genuinely
struggle with before peeking — the `_id`-vs-number mismatch is a real bug
class you'll hit again in other projects.

Tomorrow: a milestone review, plus basic request logging.
