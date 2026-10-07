# Day 13 (Wed) — One Product, and Your First `POST`

## What you're building today

Two new routes: one that finds a *single* product by id, and one that
lets a client *create* a new product. This is your first time handling a
request that can legitimately fail (an id that doesn't exist; a request
body missing required fields) — today you learn to respond to failure
deliberately, with the right status code, instead of letting the server
crash or return something misleading.

## Concept: status codes are information, not decoration

A response isn't just its body — its status code tells the client, at a
glance, what *kind* of thing happened, before it even reads the body.
`200` means "here's what you asked for." `201` specifically means
"something new was created" (distinct from a plain `200`, and you should
use it for your `POST` today). `400` means "the request itself was
malformed — the client's fault, don't retry it unchanged." `404` means
"that specific thing doesn't exist." Getting these right matters because
any real frontend (yours, starting Day 14) will branch its behavior based
on the status code, not by trying to parse an error message out of the
body.

## Build it yourself

**Step 1 — Route parameters.**
Add `GET /products/:id`. Look up how Express exposes the `:id` part of
the URL inside your handler (it's on one of the two objects your handler
receives — you identified what those objects represent back on Day 11).
Remember that everything coming from a URL is a **string**, even if it
looks like a number — you'll need to convert it before comparing against
your products' numeric `id` fields.

**Step 2 — Handle the "not found" case explicitly.**
Find the matching product (think back to `.find()`). If nothing matches,
do **not** send an empty or `null` body with a `200` status — that tells
the client "success, here's... nothing," which is misleading. Explicitly
set a `404` status and send a small JSON error body (e.g.
`{ "error": "Product not found" }`). Look up how to set a status code
*and* send a JSON body together, not with two separate calls that fight
each other.

**Step 3 — Enable your server to read JSON request bodies.**
By default, Express doesn't parse an incoming request's JSON body for
you — you have to turn that on. Look up `express.json()` and how it gets
wired into your `app` (this must happen before any route that needs to
read `req.body`, so think about where in your file this line needs to
go).

**Step 4 — Write `POST /products`.**
This route should read the new product's data out of the request body,
validate it (Step 5), assign it a new unique `id` (think about how — you
don't have a database auto-generating ids yet; what's a simple, correct
way to pick the next id from an in-memory array?), push it onto your
products array, and respond with the newly created product and a `201`
status.

**Step 5 — Validate before you trust anything from the client.**
Before creating the product, check that the request body actually has
the fields you require (at minimum: `name` and `price`). If something's
missing or `price` isn't a valid positive number, respond with `400` and
a clear error message — and, critically, `return` immediately after
sending that response, so the function doesn't keep running and try to
create a product from bad data anyway.

## Self-check

- [ ] `GET /products/1` (or whatever a real id in your data is) returns
      that one product's full data, not the whole array.
- [ ] `GET /products/99999` (an id that doesn't exist) returns a `404`
      status with a clear error body — check the status code in Postman,
      not just the body text.
- [ ] `POST /products` with a valid body (test this in Postman, setting
      the body type to JSON) returns `201` and the new product, including
      its assigned `id`.
- [ ] `POST /products` with a missing `name` returns `400`, not a server
      crash and not a `201` with broken data.
- [ ] After a successful `POST`, `GET /products` shows the new product
      too — confirming it was actually added to the shared array, not
      just echoed back.

## Exercise

Without a hint:

1. Add validation that also rejects a negative or zero `price` with a
   `400`, distinct from a missing `price`, with a message specific enough
   that someone reading only the error would know exactly what to fix.
2. Commit on branch `day-13-post-products`.

## Reference solution

Compare against `solutions/week-03/day-13-server.js` only after your own
version passes every self-check item. Pay attention to exactly where the
reference `return`s after sending an error response, and think through
what would go wrong in your own version if you forgot one.

Tomorrow: pointing your actual frontend at this real backend.
