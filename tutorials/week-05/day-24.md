# Day 24 (Thu) — Login/Signup UI and Sharing Auth State

## What you're building today

Real forms: `auth.html` with signup and login, wired to yesterday's
routes, storing the returned token, and a way for the *rest* of the
frontend (the header, the cart, any future protected UI) to know whether
someone's currently logged in.

## Concept: where does the token live in the browser, and who needs to know about it?

The token needs to survive a page reload (same reasoning as Day 7's
cart persistence) — `localStorage` again. But unlike the cart, *many*
different parts of the frontend need to check "is someone logged in right
now" — the header (show "Log in" vs. the user's name), any future
checkout flow, any admin-only UI in Week 7. Rather than each of those
independently reading and parsing `localStorage`, follow the same
state/UI split from Day 7: one small file, `auth-state.js`, owns reading,
writing, and clearing the token, and exposes simple functions
(`isLoggedIn()`, `getToken()`, `logout()`) that everything else calls,
instead of touching `localStorage` directly all over the codebase.

## Build it yourself

**Step 1 — Build `auth-state.js`.**
Write `getToken()` (reads from `localStorage`), `setToken(token)`
(saves it), `clearToken()` (removes it), and `isLoggedIn()` (a simple
boolean based on whether a token exists — for now; you'll make this
smarter in the exercise).

**Step 2 — Build the signup form.**
In `auth.html`, a form with email and password fields. On submit
(remember to prevent the default full-page-reload form submission — look
up `event.preventDefault()`), `POST` to `/signup` (Day 21) following the
Day 14 `fetch` pattern. On success, decide: does signup also log the user
in immediately, or send them to a separate login step? (Either is
defensible — pick one, and make sure your UI's messaging matches whichever
you chose.)

**Step 3 — Build the login form.**
Same page or a toggle between the two — your call. On submit, `POST` to
`/login` (Day 22). On success, take the returned token and pass it to
`setToken()`. On failure (Day 22's `401`), show a clear error message
without revealing whether the email or the password was the problem
(matching yesterday's deliberate ambiguity).

**Step 4 — Reflect login state in the header, everywhere.**
On every page (not just `auth.html`), check `isLoggedIn()` on load and
update the header accordingly — show a logged-in user's identifier and a
"Log out" option instead of a "Log in" link. Wire "Log out" to
`clearToken()` plus updating the header immediately, without requiring a
reload.

**Step 5 — Include the token on requests that need it.**
Anywhere the frontend calls a route that will eventually require
`requireAuth` (nothing does yet except Day 23's `/me` — use that as your
test case), add the `Authorization: Bearer <token>` header to the
`fetch` call, reading the token via `getToken()`.

## Self-check

- [ ] Signing up with a new email and a valid password succeeds and the
      UI clearly confirms it.
- [ ] Signing up with an already-used email shows a clear error (Day
      21's `409`), without a page reload.
- [ ] Logging in with correct credentials stores a token and updates the
      header immediately, without reload.
- [ ] Logging in with wrong credentials shows an error without revealing
      whether the email or password was wrong.
- [ ] Reloading the page after logging in keeps you logged in (the
      header still reflects it) — proving the token actually persisted.
- [ ] Logging out clears the header back to "Log in" immediately, and a
      reload afterward confirms you're genuinely logged out, not just
      visually.
- [ ] Calling `GET /me` from the frontend (wire a temporary test button
      if needed) with a real logged-in token returns your own data.

## Exercise

Without a hint:

1. `isLoggedIn()` currently only checks *whether* a token exists, not
   whether it's expired. JWTs are readable without verifying their
   signature (Day 22's lesson) — look up how to decode (not verify) a
   JWT's payload on the frontend to read its expiration and give
   `isLoggedIn()` a more honest answer, while remembering the frontend
   can never be trusted to *enforce* this — only the backend's
   `requireAuth` actually protects anything.
2. Commit on branch `day-24-auth-ui`.

## Reference solution

Compare against `solutions/week-05/day-24-auth-state.js` and
`solutions/week-05/day-24-auth.js` only after your own version passes
every self-check item.

Tomorrow: Week 5 wraps up with validation and loading-state polish across
everything you've built this week.
