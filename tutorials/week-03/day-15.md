# Day 15 (Fri) — API Testing and Clean 404 Handling

## What you're building today

Right now, a request to a URL your API doesn't define at all (a typo, or
a route you haven't built yet) probably produces Express's default,
ugly HTML error page. Today you replace that with a clean JSON response,
and you build the habit — starting today, for real, not just when
something's already broken — of testing every route deliberately instead
of only "trying it once and moving on."

## Concept: the difference between "not found" and "doesn't exist"

Day 13's `404` for `GET /products/99999` was about a *specific resource*
that doesn't exist, even though the *route* is real and correctly
defined. Today's is different: a request to a URL your API never defined
a handler for at all, like `GET /completely-made-up-path`. Express calls
unmatched requests through to a special fallback if nothing else
handled them — and if you never define one, the client gets Express's
generic default page, not the same clean JSON shape the rest of your API
uses. A well-designed API should feel consistent everywhere, including
its failure paths.

## Build it yourself

**Step 1 — Add a catch-all 404 handler.**
At the very end of your route definitions (order matters — Express tries
routes top to bottom, so this has to come after every real route, or it'll
swallow requests that should have matched something else), add a handler
that matches *any* method and *any* path not already matched, and responds
with a `404` and a JSON error body in the same shape as your other error
responses (Day 13).

**Step 2 — Build a real Postman collection (or a `curl` script).**
Rather than testing routes one-off and forgetting what you checked,
build a saved, reusable set of requests covering:
- `GET /products` (success case).
- `GET /products/:id` for a real id (success) and a fake id (`404`).
- `POST /products` with a valid body (`201`), a missing field (`400`),
  and an invalid price (`400`).
- A request to a route that doesn't exist at all (today's new `404`).
- `GET /health` from Day 11's exercise, if you built it.

**Step 3 — Run the whole collection after any backend change, from now on.**
This is the actual habit being built today — not the collection itself,
but re-running it every time you touch backend code, the same way you
manually re-tested cart behavior in Day 10's milestone review. A route
that quietly breaks because of an unrelated change is much cheaper to
catch now than after Week 6's checkout flow depends on it.

**Step 4 — Make error responses actually useful.**
Look back over every error response you've written since Day 13. Would
someone debugging this API (a teammate, or you in three weeks) know
*exactly* what was wrong from the message alone? Tighten any that are
vague (`"error": "bad request"` tells you nothing; `"error": "price must
be a positive number"` does).

## Self-check

- [ ] A request to a nonsense path returns your clean `404` JSON, not
      Express's default HTML error page.
- [ ] Your full Postman collection (or script) runs top to bottom with
      every request returning the status code you expect.
- [ ] Every error response in your API (`400`s and `404`s) has a message
      specific enough to act on without guessing.
- [ ] You can explain, for every route, what status code it returns in
      each of its distinct cases — not just "it works," but which code,
      when.

## Exercise

Without a hint:

1. Add a global error-handling pattern: wrap anything in your routes that
   could throw an unexpected error (not a validation failure you already
   check for — a genuine bug or edge case you haven't anticipated) so
   that it responds with a `500` and a generic message instead of
   crashing the whole server process.
2. Commit on branch `day-15-api-testing`.

## Reference solution

Compare against `solutions/week-03/day-15-server.js` only after your own
version passes every self-check item, and against
`solutions/week-03/day-15-postman-collection.json` for one example of
what a saved collection covering all of today's cases looks like.

Next week: MongoDB. The in-memory array that's held your product data
since Day 12 gets replaced with a real, persistent database.
