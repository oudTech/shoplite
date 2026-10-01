# Day 9 (Thu) — `fetch`, Promises, and `async`/`await`

## What you're building today

Everything so far has lived entirely in the browser, with data that was
already there the moment the page loaded. Starting next week, ShopLite
gets a real backend, and the frontend will need to *ask* for data over
the network — which takes time, and can fail. Today is a sandboxed
detour (a separate `fetch-demo.html`, not part of the store) to learn the
tool for that: `fetch`, and the `async`/`await` syntax that makes it
readable.

## Concept: why network calls can't just return a value directly

`PRODUCTS.find(...)` returns an answer instantly, because the data is
already sitting in memory. A network request can't work that way — the
answer might take 50ms or 5 seconds, or never arrive at all if the
network drops. JavaScript handles this with a **Promise**: an object that
represents a value that *will* exist eventually (or an error that will
happen eventually), not one that exists right now.

`fetch(url)` returns a Promise immediately, before any data has arrived.
`await fetch(url)` is what actually pauses your function (not the whole
page — just that one function) until the Promise settles, and then hands
you the real result to keep working with. `await` only works inside a
function marked `async`. And because a network call can fail (server
down, no internet, bad URL), every `await` around a `fetch` needs a
`try`/`catch` around it — without one, a failed request produces an
unhandled error instead of something your code can react to and show the
user.

## Build it yourself

You'll use a free public test API (`https://jsonplaceholder.typicode.com`)
for this sandbox — it's not part of ShopLite's data, just a safe place to
practice the mechanics before Week 3 connects to a real backend you build
yourself.

**Step 1 — Set up the sandbox page.**
Create `fetch-demo.html` with a button ("Load Data"), an empty container
for results, and a place to show a loading and an error state. Link a new
`fetch-demo.js`.

**Step 2 — Write an `async` function that fetches and shows a loading state.**
Write a function, triggered by the button, that:
- Immediately shows some kind of "Loading..." indicator in the results
  container (before the network call even starts — this matters, because
  the request can take a noticeable moment).
- Is declared `async`.

**Step 3 — Make the actual request.**
Inside a `try` block, `await fetch("https://jsonplaceholder.typicode.com/users")`.
Look up what `fetch`'s resolved value actually is — it's a `Response`
object, **not** your data yet. You need one more `await` step
(`response.json()`, which is itself asynchronous) to get the actual
parsed data out of it.

**Step 4 — Check for a failed response.**
`fetch` only rejects (jumps to `catch`) on a true network failure — a
`404` or `500` from the server still counts as a "successful" fetch as
far as `fetch` is concerned. Look up `response.ok` (or `response.status`)
and, if it indicates failure, explicitly `throw` an error yourself inside
the `try` block so your `catch` handles it consistently either way.

**Step 5 — Display the result, and handle the error case.**
On success, clear the loading indicator and render something simple from
the returned data (a list of names, say — reuse the "loop and build
elements" pattern from Day 3, just with different data). In the `catch`
block, clear the loading indicator and show a clear error message instead
of leaving the user staring at "Loading..." forever.

**Step 6 — Prove the error path actually works.**
Temporarily break the URL on purpose (a typo, or a path that doesn't
exist) and confirm your error message shows up correctly — then fix the
URL back. Skipping this step means your error handling is untested code
that *looks* right but that you've never actually seen run.

## Self-check

- [ ] Clicking the button shows "Loading..." immediately, then replaces
      it with real data once it arrives.
- [ ] You deliberately broke the URL at least once and saw your error
      message appear, not a raw error in the console with a blank page.
- [ ] Look at your Network tab in DevTools while clicking the button —
      confirm you can see the actual request and its timing.
- [ ] Your `async` function has no `.then()` chains in it — everything
      uses `await` inside `try`/`catch`.

## Exercise

Without a hint:

1. Add a second button that fetches a *different* endpoint on the same
   API (e.g. `/posts`) into the same results area, reusing your loading
   and error-handling logic rather than duplicating it.
2. Commit on branch `day-09-fetch-demo`.

## Reference solution

Compare against `solutions/week-02/day-09-fetch-demo.js` only after your
own version passes the self-check. This file is a standalone sandbox and
never gets wired into the main ShopLite pages — Week 3 is where you apply
this same pattern to ShopLite's own backend for real.

Tomorrow: Week 2 milestone review.
