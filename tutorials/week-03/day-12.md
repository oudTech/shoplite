# Day 12 (Tue) — Serving Product Data: `GET /products`

## What you're building today

Your frontend's `PRODUCTS` array has been living directly in a
frontend JS file since Day 2 — meaning "changing the catalog" has meant
editing frontend code. Today that data moves to the backend, and the
backend exposes it over a real HTTP endpoint. The frontend doesn't
consume it yet (that's Day 14) — today is entirely about getting the
server side right and provable on its own.

## Concept: separating data from the code that displays it

Right now, `PRODUCTS` lives in a file that ships to every browser that
visits the site — anyone can view-source and see (and edit, in their own
browser) the "catalog." A real store's product data needs to live
somewhere the frontend can't directly edit, that can be updated without
redeploying frontend code, and that (starting Week 4) can be queried,
filtered, and eventually changed by an admin. Today's version won't have
a database yet — the array just moves to live in the backend file
instead of the frontend file — but the *shape* of the interaction (the
frontend asks, the backend answers) is what you're establishing, and it
won't change even after Week 4 swaps the array for a real database.

## Build it yourself

**Step 1 — Move the data.**
Copy your `PRODUCTS` array (and `formatPrice`, if you want it available
server-side too, though think about whether formatting is really the
backend's job) into a new file in `backend/`, e.g. `data/products.js`.
Export it (look up `module.exports` for a CommonJS file) so `server.js`
can import it.

**Step 2 — Write the route.**
In `server.js` (or, better, think about whether a giant `server.js` with
every route in it is going to stay readable as you add more — consider
splitting routes into their own file even this early), add:
`GET /products` that responds with the full product list as JSON. Look
up the Express response method for sending JSON specifically (not the
same one you used for plain text on Day 11) — it also sets the right
`Content-Type` header for you automatically, which matters for anything
consuming this endpoint later.

**Step 3 — Think about status codes, even though nothing's failing yet.**
A successful response should explicitly be a `200` (Express defaults to
this, but look up how to set it explicitly, and get in the habit of
thinking about status codes from day one — you'll need to set *different*
ones deliberately starting Day 13).

**Step 4 — Verify it manually.**
Restart your server (or confirm `nodemon` picked up the change), and
visit `/products` directly in your browser. You should see raw JSON.
Count the products in the response and confirm it matches your array.

**Step 5 — Verify it like a real client would.**
A browser address bar can only do `GET` requests, which is fine for
today but won't be enough starting Day 13 (`POST`). Install and open a
tool built for testing APIs directly — look up **Postman** (or `curl`
from the command line, if you'd rather stay in the terminal) and make
the same `GET /products` request through it. Confirm the response body,
and specifically confirm the response's status code reads `200`.

## Self-check

- [ ] `/products` in the browser shows JSON matching every product from
      your original frontend array — same count, same fields.
- [ ] The response's `Content-Type` header (check this in Postman or your
      browser's Network tab) is `application/json`, not plain text.
- [ ] You made the same request through Postman (or `curl`) at least
      once, not just the browser — confirm you can read the status code
      there.
- [ ] Stopping the server and requesting `/products` again fails
      obviously (connection refused) rather than silently — confirm you
      understand *why* it fails once nothing is listening.

## Exercise

Without a hint:

1. Add a second route, `GET /products/count`, returning just
   `{ "count": <number> }` — think about whether this route needs to
   exist *before* or *after* `GET /products/:id` once you add that
   tomorrow (you don't need `:id` yet — just think about the ordering
   question and keep it in mind).
2. Commit on branch `day-12-products-route`.

## Reference solution

Compare against `solutions/week-03/day-12-products.js` (the data file)
and `solutions/week-03/day-12-server.js` only after your own version
passes the self-check.

Tomorrow: a single-product route, and your first `POST`.
