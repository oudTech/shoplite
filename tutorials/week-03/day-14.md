# Day 14 (Thu) — Connecting the Frontend for Real

## What you're building today

Your frontend has used a hardcoded `PRODUCTS` array since Day 2. Today
that stops — `app.js` fetches the catalog from your Day 12 backend
instead. This is the day the two halves of ShopLite actually become one
system.

## Concept: CORS, and why "it works in Postman" isn't the whole story

Postman doesn't enforce the same rules a browser does. When a page loaded
from one origin (e.g. `http://127.0.0.1:5500`, if you're using a simple
frontend dev server) tries to `fetch` from a different origin
(`http://localhost:3000`, your backend), the browser blocks the response
by default — this is **CORS** (Cross-Origin Resource Sharing), a browser
security feature, not a bug. You'll likely hit this today, see a CORS
error in the console, and need to explicitly enable it on the backend.
Understanding *why* it happens (the browser protecting the user from a
malicious page silently reading data from other sites you're logged into)
makes the fix make sense instead of feeling like a random hoop.

## Build it yourself

**Step 1 — Enable CORS on the backend.**
Look up the `cors` npm package, install it in `backend/`, and wire it
into your Express app (similar to how you wired `express.json()` on Day
13 — before your routes). For now, allowing all origins is fine (you'll
lock this down properly in Week 8, once you're deploying for real).

**Step 2 — Replace the hardcoded array with a fetch, following Day 9's pattern.**
In `app.js`, you no longer need a local `PRODUCTS` array populated by
hand. Instead: write an `async` function that `fetch`es
`http://localhost:3000/products` (matching whatever port your backend
actually listens on), `await`s the parsed JSON, and uses the result the
same way `PRODUCTS` was used before — passed into `renderProducts`,
used to populate the category dropdown, etc.

**Step 3 — Handle the load carefully — this data isn't there instantly anymore.**
Everything on Days 2–10 assumed `PRODUCTS` existed the moment the script
ran. Now there's a real network request first. Show a loading state (same
idea as Day 9) while the fetch is in flight, and think through: which of
your existing functions assumed synchronous, already-loaded data, and now
need to wait for this fetch to resolve before they can run at all?

**Step 4 — Handle a backend that isn't running.**
Stop your backend server on purpose, reload the frontend, and see what
happens. It should show a clear error state (Day 9's pattern again), not
a blank page or a silent console error nobody would notice.

**Step 5 — Re-check search, filter, and cart against live data.**
Nothing about Days 5–8's *logic* should need to change — they operated on
"whatever array of products you have," and that's still true. But
confirm it for real: search, category filtering, and add-to-cart should
all still work identically, now sourced from the backend instead of a
hardcoded array.

## Self-check

- [ ] With the backend running, the frontend loads and displays products
      exactly as before — but you can prove they came from the network
      (check the Network tab, or add one product via Postman's `POST`
      from yesterday and reload the frontend to see it appear).
- [ ] With the backend stopped, the frontend shows a clear error message,
      not a blank page.
- [ ] No CORS error appears in the console when the backend is running.
- [ ] Search, category filtering, and add-to-cart all still work
      correctly against the fetched data.
- [ ] A product added via Postman's `POST /products` (from Day 13) shows
      up on the frontend after a reload, without touching any frontend
      code — proof the two halves are genuinely connected, not just
      coincidentally similar.

## Exercise

Without a hint:

1. Instead of hardcoding `http://localhost:3000` directly inside
   `app.js`, pull it out into one constant near the top of the file (or a
   small separate config file) that every fetch call in the project
   references — you'll be glad you did this in Week 8, when the backend's
   real URL changes for deployment.
2. Commit on branch `day-14-connect-frontend`.

## Reference solution

Compare against `solutions/week-03/day-14-app.js` (and the small backend
change in `solutions/week-03/day-14-server.js`) only after your own
version passes every self-check item.

Tomorrow: proper API testing and clean 404 handling for routes that don't
exist at all.
