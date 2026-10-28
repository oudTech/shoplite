# Day 30 (Fri) — Milestone Review: The Full Customer Journey

## What you're building today

Nothing new. Today you walk the *entire* system, start to finish, as a
real shopper would — the biggest integration test so far, spanning every
week's work at once.

## Where you should be

Someone can now: sign up, log in, browse and search a real,
database-backed catalog, add items to a cart that survives a reload,
check out (with the server enforcing real prices and real stock, never
trusting the client), see their order appear in their own order history
with accurate historical pricing, and be completely unable to see anyone
else's orders.

## Full walkthrough — two separate user accounts, deliberately

**Step 1 — Fresh state.**
Re-seed your product database (Day 17's script). Clear `localStorage`.

**Step 2 — Full journey as User A.**
Sign up, log in, browse, search, filter, add several items to cart
(including adding the same product twice, to re-confirm Day 7's
merge-not-duplicate behavior still holds), go to checkout, place the
order, confirm the cart clears and the order appears correctly in order
history with the right total and items.

**Step 3 — Full journey as User B, in a way that actually tests isolation.**
Log out. Sign up as a *different* user. Confirm their order history
starts empty (not User A's orders). Place a different order. Confirm
User B only ever sees their own order, and — switch back to User A one
more time — confirm User A still only sees theirs.

**Step 4 — Adversarial pass, across the whole system at once.**
- Try to check out with an empty cart (should be blocked client-side,
  Day 28).
- Try to order more of something than its current stock (should be
  rejected server-side, Day 27) — confirm the specific error message
  names the right product.
- After a stock-enforced rejection, confirm the product's `stock` in the
  database is **unchanged** — a rejected order should have zero side
  effects.
- Try hitting `GET /orders/:id` for User A's order id while logged in as
  User B (copy a real order id from User A's session) — confirm `404`,
  not real data and not a distinct "forbidden."
- Change a product's price via `PUT` after both orders exist. Reload
  both users' order histories and confirm neither one's *past* total or
  line-item prices changed.
- Stop the backend entirely partway through a checkout attempt — confirm
  the frontend shows a sensible error, not a hang or a crash, and that no
  partial order was created.

**Step 5 — Read the whole order flow's code once more, end to end.**
Trace a single request, `POST /orders`, all the way from the checkout
button click through `cart-data.js`, the `fetch` call, `requireAuth`,
the route handler's validation, stock check, snapshotting, and save. Can
you explain every step to someone else without looking anything up? If
there's a step you're fuzzy on, that's this week's actual gap to close
before moving on — not a box to check and forget.

## Self-check

- [ ] Steps 2 and 3 both complete successfully, with correct cross-user
      isolation confirmed concretely, not assumed.
- [ ] Every case in Step 4 behaves exactly as described — any that
      doesn't is a real bug to fix today.
- [ ] You can narrate Step 5's full request path from memory.

## Exercise

Without a hint:

1. In `NOTES.md`, write down what you think is the single most
   security-sensitive piece of code you've written so far in this
   project (across all six weeks), and why — this is a habit worth
   keeping for the rest of the project: knowing where the real risk
   concentrates, rather than treating every line as equally important.
2. Commit on branch `day-30-milestone-review`.

## Reference solution

No separate reference solution today — today's "solution" is a fully
working, cross-verified customer journey in your own codebase.

Next week: the other side of the counter — an admin role, and the UI to
manage products and view all orders.
