# Day 25 (Fri) — Week 5 Polish and Milestone Review

## What you're building today

Nothing conceptually new — today is about the difference between "the
happy path works" and "this feels like a real product." You'll add
loading and disabled states to the auth forms, tighten validation
messaging, and re-test the whole authentication flow adversarially, the
same discipline as Days 10 and 20.

## Concept: why loading states matter more here than anywhere else so far

A slow product list (Day 14) is mildly annoying. A slow *login* that
gives no feedback is actively confusing — did the click register? Is it
working? Can I click again? Auth actions also have a failure mode your
earlier `fetch` work didn't: **double submission**. If a user clicks
"Sign up" twice quickly before the first request finishes, you might
fire two signup requests — and depending on your backend's error
handling, that could produce a confusing duplicate-email error for a
request the user only meant to send once.

## Build it yourself

**Step 1 — Disable the submit button while a request is in flight.**
For both signup and login: the instant the form submits, disable the
button (and ideally show a small loading indicator, e.g. changing its
text to "Signing up..."), and re-enable it only once the request
resolves — whether it succeeded or failed. This alone solves the
double-submission problem from the concept section.

**Step 2 — Tighten client-side validation before the request even fires.**
Right now, an empty email field probably still gets sent to the backend,
which correctly rejects it — but that's a slower, worse experience than
catching it immediately. Add a quick client-side check (non-empty fields,
a plausible email shape, a minimum password length matching whatever your
backend requires) that shows an inline error *before* firing the
`fetch` at all, without removing the backend validation — the backend
check still has to exist, since a client-side check alone can always be
bypassed by anyone not using your form directly.

**Step 3 — Make every error message specific and visible.**
Walk through every failure case from Days 21–22: missing fields, invalid
email shape, too-short password, duplicate email, wrong credentials.
Confirm each shows a distinct, clearly visible message on the form
itself, not just a `console.log` or a generic "Something went wrong."

**Step 4 — Full adversarial re-test of the whole week.**
- Sign up, without reloading, immediately try to sign up again with the
  *same* email — confirm the `409` path still works from a fresh
  in-memory form state.
- Log in, copy the token from `localStorage`, manually edit one
  character of it in DevTools, then reload — does the app correctly
  treat you as logged out (or show an auth error), rather than crashing
  or silently pretending you're still logged in?
- With a valid token, wait past its expiration (or temporarily set a
  very short `expiresIn` in your backend `.env`-driven config to speed
  this up for testing) and try `/me` again — confirm you get a clean
  `401`, not a hang or a crash.
- Double-click both submit buttons as fast as you can and confirm only
  one request actually fires (Step 1 should have already fixed this —
  this step is where you *prove* it).

## Self-check

- [ ] Both buttons are visibly disabled during their requests and
      re-enable correctly afterward, including after a failed request.
- [ ] Every validation and error case from Days 21–22 shows a clear,
      specific message on the form.
- [ ] Rapid double-clicking either submit button provably fires only one
      request (check your Network tab while doing it).
- [ ] An expired or tampered token is handled gracefully everywhere it's
      used, with no crash and no silent false "still logged in" state.

## Exercise

Without a hint:

1. Add a small `NOTES.md` entry on one authentication edge case you
   *haven't* handled yet (there almost certainly is at least one —
   password reset, email verification, and rate-limiting login attempts
   are all real gaps a production app would need) and why you're
   deferring it for now.
2. Commit on branch `day-25-auth-polish`.

## Reference solution

No separate reference solution today — today's "solution" is the
polished version of your own Days 21–24 code.

Next week: orders and checkout — turning the cart from Week 2 into a
real order, backed by the server, tied to a logged-in user.
