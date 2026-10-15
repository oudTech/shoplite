# Day 20 (Fri) — Week 4 Milestone Review

## What you're building today

Nothing new. Same discipline as Day 10, aimed at the backend: verify
everything Weeks 3–4 built actually holds together, under conditions you
deliberately try to break, and fix what you find.

## Where you should be

ShopLite now has: a real Express server, a MongoDB database backing
product data, full CRUD on products, request logging, consistent status
codes and error shapes across every route, and a frontend (Day 14) that
talks to all of it over real HTTP instead of a hardcoded array.

## Full walkthrough

**Step 1 — Start from nothing.**
Drop your entire products collection (or point at a fresh database) and
re-run your Day 17 seed script. Start your backend fresh.

**Step 2 — Frontend, end to end, against the real backend.**
Open the frontend. Confirm the catalog loads, search and filter still
work (Days 5, 14), and the cart still works (Days 6–8) — all of this
logic hasn't changed since Week 2, but it's now running against a real,
persisted, network-backed catalog instead of a hardcoded array, and that
substitution should be completely invisible to a user.

**Step 3 — Backend, deliberately adversarial.**
Beyond your Day 19 CRUD walkthrough, specifically try to break things:
- Send a `POST` with a `price` field that's a string instead of a
  number (e.g. `"price": "free"`) — does your validation catch it, or
  does something confusing happen?
- Send a `PUT` to an id that's well-formed but doesn't exist.
- Stop your MongoDB connection entirely (or point your `.env` at a wrong
  URI) while the server is running, and hit `/products` — what happens?
  Is the failure visible and sensible, or does the server hang or crash
  ungracefully?
- Create a product via `POST`, then immediately hammer `GET /products`
  from two Postman tabs at once — does anything race or duplicate?

**Step 4 — Read every route again, end to end.**
For every route across `week-03` and `week-04`'s solutions (and your own
versions), confirm: does it validate its input before trusting it? Does
it use the right status code for every distinct outcome? Does an error
response actually explain what was wrong? Fix anything that doesn't hold
up — same review discipline as Day 10's Step 4, now applied to backend
code with real consequences (bad data reaching a real database is worse
than bad data reaching a hardcoded array).

## Self-check

- [ ] The full frontend experience works correctly against the real,
      freshly-seeded backend, with zero frontend code changes needed.
- [ ] Every adversarial case in Step 3 either fails gracefully with a
      sensible status code, or you've identified it as a genuine gap and
      fixed it.
- [ ] You reviewed every route's validation and status codes and found
      (and fixed) at least one thing you'd improve — if you find
      nothing, look harder, especially at `PUT`.

## Exercise

Without a hint:

1. Write down, in `NOTES.md`, the single biggest difference in how you
   think about "does this work?" now versus at the end of Week 2 — Week 2
   only had a hardcoded array that could never really fail; Week 3–4
   introduced a network and a real database, both of which can. What
   changed about how you test as a result?
2. Commit on branch `day-20-milestone-review`.

## Reference solution

No separate reference solution today — today's "solution" is whatever
Step 3–4 surfaced, fixed, in your own backend code.

Next week: user accounts. Signup, login, hashed passwords, and JWTs.
