# Day 17 (Tue) — The Product Schema and Model

## What you're building today

Today the product array becomes a real Mongoose **model** — a schema
describing what a valid product document looks like, plus the tools
Mongoose gives you to query and save documents matching it. By the end of
today, `GET /products` reads from the actual database instead of an
in-memory array.

## Concept: schema, model, document — three different things

These three words get used loosely, but they mean specific, different
things: a **schema** is the *definition* (what fields exist, their types,
which are required) — it's a blueprint, not data. A **model** is what you
get from compiling a schema — an object with methods like `.find()` and
`.create()` that talk to a specific MongoDB collection matching that
blueprint. A **document** is one actual saved record — one specific
product, the way one object in your old `PRODUCTS` array was one specific
product. You define the schema once, compile it into a model once, and
then use that model repeatedly to create, read, update, and delete many
documents.

## Build it yourself

**Step 1 — Define the schema.**
Create `models/Product.js`. Using Mongoose's schema constructor, define
fields matching what your product objects have had since Day 2: `name`
(String, required), `price` (Number, required, and think about whether
you can express "must be positive" directly in the schema — look up
Mongoose's `min` validator), `category` (String), `image` (String),
`stock` (Number, with a sensible default if not provided — look up
Mongoose's `default` option).

Notice `id` is missing from this list on purpose: MongoDB gives every
document its own unique identifier automatically (`_id`) — you don't
need to invent your own incrementing counter the way Day 13's in-memory
array did.

**Step 2 — Compile the model.**
Turn the schema into a model (look up `mongoose.model(...)` and what its
two arguments are — the name matters, since Mongoose uses it to determine
the actual MongoDB collection name). Export the model.

**Step 3 — Write a one-time seed script.**
You need *some* data in the database to work with. Write a small,
separate script (`scripts/seed.js`, not part of your running server) that
connects to the database, deletes any existing products (so re-running
the script doesn't create duplicates every time), and inserts your
original 8 products using the model (look up `Model.insertMany`). Run it
once manually from the terminal.

**Step 4 — Rewrite `GET /products` to query the database.**
Replace the in-memory array read with a Mongoose query (look up
`Product.find()`) — and remember this is now **asynchronous** (a real
database call takes time, same reasoning as Day 9's `fetch`), so your
route handler needs to be `async` and `await` the query.

**Step 5 — Notice what changed in the response shape.**
Query your new `/products` endpoint and look closely at one document.
Compare its fields against what your old hardcoded array had. The
`id: 1, 2, 3...` field is gone, replaced by MongoDB's own `_id` (a long
generated string, not a small number). This is going to matter
tomorrow — don't fix it yet, just notice and understand *why* it changed.

## Self-check

- [ ] Running your seed script populates the database, and running it
      again doesn't create duplicate products.
- [ ] `GET /products` returns 8 documents, sourced from the real
      database (prove this to yourself: stop your server, use a MongoDB
      GUI or the `mongosh` shell to manually delete one product directly
      in the database, restart the server, and confirm `/products` now
      returns 7 — this proves the route isn't secretly still reading
      from an array).
- [ ] Every returned document has MongoDB's `_id` field instead of your
      old numeric `id`.
- [ ] Your route handler is declared `async` and properly `await`s the
      query — remove the `await` temporarily and observe what breaks, to
      understand why it's necessary, then put it back.

## Exercise

Without a hint:

1. Add basic error handling around the `GET /products` query — if the
   database query itself fails (not "no results," but an actual error),
   respond with a `500`, following the same pattern you built in Day 15.
2. Commit on branch `day-17-product-model`.

## Reference solution

Compare against `solutions/week-04/day-17-Product.js` (the model),
`solutions/week-04/day-17-seed.js`, and
`solutions/week-04/day-17-server.js` only after your own version passes
the self-check.

Tomorrow: the `_id` vs `id` question you noticed today comes back — this
time you'll need to actually solve it, in `GET /products/:id`.
