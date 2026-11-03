# Day 35 (Fri) — Bug Bash and Code Review

## What you're building today

Nothing new. A deliberate, structured hunt for real bugs across the
entire app — the biggest and most adversarial review session yet, right
before Week 8 takes this project toward deployment.

## Concept: why a dedicated bug-bash day, separate from each week's milestone review

Days 10, 20, 25, and 30 each reviewed *that week's* work while it was
fresh. Today is different on purpose: reviewing the *whole* system at
once, after enough time and enough features have accumulated that
interactions *between* features (not just within one) become visible —
the kind of bug that only shows up when Week 2's cart, Week 5's auth, and
Week 6's checkout are all exercised together in a slightly unusual order.
This is also the last checkpoint before Week 8 adds deployment concerns
on top — bugs are cheaper to find now than after that additional
complexity lands.

## Build it yourself

**Step 1 — Re-read every route's status codes and validation, cold.**
Not "does it work" (you've confirmed that repeatedly) — specifically:
does every route validate *everything* it reads from the client before
using it? Are there routes where a required check from an earlier day
quietly wasn't applied to a route added later (e.g., did `PUT /products`
end up with the same validation rigor as `POST /products`, or did it
drift)?

**Step 2 — Try every cross-feature sequence you haven't specifically tried yet.**
Some starting points — extend this list with your own as you think of
more:
- Add items to cart while logged out, *then* log in — does the cart
  survive, and does checkout work correctly afterward?
- Log in as a regular user, then manually navigate to `admin.html` by
  typing the URL — confirm the "not authorized" state, not a partial or
  broken admin UI.
- Start checkout, and in a second tab, have an admin delete one of the
  in-cart products before you submit — what happens? (There's no
  "correct" pre-built answer here — figure out what currently happens,
  decide if it's acceptable, and fix it if it's actually broken, e.g. a
  crash rather than a clear error.)
- Sign up, don't verify anything (you haven't built email verification —
  that's fine, just notice it), and immediately use every authenticated
  feature — confirm nothing assumes a verification step that doesn't
  exist.
- Let a JWT expire mid-session (Day 25's technique) while sitting on the
  cart page, then try to check out — confirm a clean re-login prompt,
  not a silent failure or crash.

**Step 3 — Deliberately feed bad data everywhere, one more time, comprehensively.**
Build (or extend Day 15's) a single Postman collection covering every
route's every validation case, across all of Weeks 3–6 — this is worth
having as a real, saved artifact by the end of today, not just something
you ran ad hoc.

**Step 4 — Fix everything you find, and write it down.**
For each real bug found today, fix it, and add one line to a
`BUGS_FOUND.md` describing what it was and what fixed it — this is a
genuinely useful artifact (for you, and for anyone reviewing your work)
distinct from the code fix itself.

**Step 5 — Re-run Day 30's full customer journey one final time.**
After all of today's fixes, do one complete clean pass — sign up, browse,
cart, checkout, order history, and (as your admin account) manage
products and view all orders — confirming nothing today's fixes broke.

## Self-check

- [ ] Every route's validation was re-read today, not assumed correct
      from memory.
- [ ] You tried at least five genuinely new cross-feature sequences (the
      Step 2 list plus your own), and found and fixed at least one real
      issue from them.
- [ ] Your comprehensive Postman collection runs clean, top to bottom.
- [ ] `BUGS_FOUND.md` exists and has real entries, not placeholder text.
- [ ] Day 30's full journey still passes cleanly after all of today's
      changes.

## Exercise

Without a hint:

1. Pick the single bug you found today that you think was closest to
   being missed entirely (the one you almost didn't think to test), and
   write two sentences in `BUGS_FOUND.md` about *why* it was easy to
   miss — this reflection is the actual skill being built today, more
   than any individual fix.
2. Commit on branch `day-35-bug-bash`.

## Reference solution

No separate reference solution today — today's deliverable is your own
`BUGS_FOUND.md` and whatever fixes it documents.

Next week: deployment. Centralized config, environment-driven CORS, real
documentation, and a rehearsed final demo.
