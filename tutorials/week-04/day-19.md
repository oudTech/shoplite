# Day 19 (Thu) — Request Logging and a Full CRUD Test Pass

## What you're building today

A small but genuinely useful addition — middleware that logs every
request your server handles — plus a disciplined, complete re-test of
everything Days 16–18 built, the same "walk through it like a skeptical
user" habit from Day 10, now applied to your API instead of the frontend.

## Concept: middleware runs *between* the request and your route

You've used two pieces of middleware already without necessarily naming
them that way: `express.json()` (Day 13) and `cors()` (Day 14) — both are
functions that run on *every* request, before it reaches your actual
route handler, each one able to inspect or modify the request (or short-
circuit it entirely) before passing control onward. Today you write your
own: a logging middleware that runs on every request and prints something
useful — method, path, and how long the request took — without needing to
add logging code inside every individual route by hand.

## Build it yourself

**Step 1 — Write a logging middleware function.**
Look up the exact shape Express middleware functions take (three
parameters — you've seen two of them constantly in your route handlers;
the third is what tells Express "I'm done, let the next thing run").
Inside it: record the current time, log the request's method and path,
then call the third parameter so the request actually continues to
whatever route matches it.

**Step 2 — Measure how long the request actually took.**
This requires hooking into *after* the response is sent, not just at the
start — look up the response object's `"finish"` event, which fires once
Express has actually sent the response back. Calculate and log the
elapsed time there, along with the final status code (also available on
the response object).

**Step 3 — Register it in the right place.**
Middleware only applies to routes registered *after* it. Decide where
this needs to go relative to `express.json()`, `cors()`, and your actual
routes — and think about whether logging should also cover your Day 15
404 catch-all and error handler, or just successful routes (there's a
reasonable argument either way; pick one and be able to explain it).

**Step 4 — Full CRUD walkthrough, from a clean database.**
Re-seed your database (Day 17's script). Then, using Postman (build on
your Day 15 collection), walk through, in order: list all products,
create one, fetch that specific one by its real `_id`, update it, fetch
it again and confirm the update actually stuck, delete it, and fetch it
one more time confirming `404`. Watch your new logging output the whole
time — every one of these requests should produce a clear log line.

**Step 5 — Re-test every failure path too, not just the happy path.**
Malformed id on `GET`, `PUT`, and `DELETE`. Missing required fields on
`POST` and `PUT`. A completely unknown route. Confirm every one still
returns the status code you expect, now that the underlying routes talk
to a real database instead of an array — a passing test suite from Day
15 doesn't guarantee it still passes after Days 16–18's rewrite, which is
exactly why you're re-running all of it today.

## Self-check

- [ ] Every request you make (success or failure) produces a log line
      with method, path, status code, and a duration.
- [ ] The duration numbers are plausible — a simple `GET` should be much
      faster than nothing, and a failing request still gets logged
      (confirm your middleware placement doesn't accidentally skip the
      404/500 paths, unless you deliberately decided it should).
- [ ] The full CRUD walkthrough from Step 4 works end to end against a
      freshly seeded database, with no manual intervention between steps.
- [ ] Every failure-path case from Step 5 still returns the correct
      status code.

## Exercise

Without a hint:

1. Make the logging middleware skip logging for one specific route of
   your choosing (e.g. `/health`, if you built it) — think about where
   in the middleware function you'd need to check the path and return
   early, before the timing logic even starts.
2. Commit on branch `day-19-logging-and-retest`.

## Reference solution

Compare against `solutions/week-04/day-19-logger.js` and
`solutions/week-04/day-19-server.js` only after your own version passes
the self-check.

Tomorrow: Week 4 wraps up. Next week: real user accounts, with hashed
passwords and login.
