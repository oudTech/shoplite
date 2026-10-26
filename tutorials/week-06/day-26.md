# Day 26 (Mon) — The Order Schema: Why Orders Snapshot Data

## What you're building today

An `Order` model. No routes yet — today is entirely about the schema
design, and specifically about a subtlety that's easy to get wrong: an
order needs to remember what a product *was* at the moment of purchase,
not just link to what it *currently* is.

## Concept: why an order can't just store product ids and quantities

Your first instinct might be: an order is just `userId` plus a list of
`{ productId, quantity }` — after all, you can always look up the
product's current name and price from its id. Think through what goes
wrong with that: six months from now, you (the admin, Week 7) change a
product's price, or rename it, or delete it entirely. Every *past* order
referencing that product would now silently show the *new* price when
displayed — a customer's receipt would retroactively change. That's not
just confusing, it's wrong: an order is a historical record of what
actually happened, and it needs to freeze that moment in time.

The fix: each line in an order stores a **snapshot** — the product's
name and price *as they were* at checkout — copied at the moment of
purchase, alongside a reference to the product's id (still useful, for
things like "show me all orders containing this product," but never used
to look up the *display* price of a past order).

## Build it yourself

**Step 1 — Design the order-line sub-schema.**
Each line in an order needs: `productId` (a reference — look up
Mongoose's `ObjectId` type with a `ref` option, which is how Mongoose
represents "this points at a document in another collection"), `name`
(String — the snapshot), `price` (Number — the snapshot, per unit),
`quantity` (Number). Think about whether this needs to be its own
separate model or can be a plain sub-object embedded directly in the
order — look up Mongoose's embedded/nested schema pattern, since an order
line has no reason to exist independently of its order.

**Step 2 — Design the order itself.**
Fields: `userId` (ObjectId, `ref: "User"`, required — every order belongs
to someone), `items` (an array of Step 1's order-line shape), `total`
(Number — also a snapshot-style computed value, stored rather than
recalculated every time, so a past order's total never silently drifts
even if your total-calculation *logic* changes later), `status` (String
— think about what values make sense: at minimum something like
`"pending"`, and think ahead to whether you'll need more later), and
timestamps (Day 21's `timestamps` option again).

**Step 3 — Think through, but don't build yet, what creates an order.**
Tomorrow's `POST /orders` will take the *current* cart, and for each
line, needs to copy the product's *current* name and price into the
snapshot — meaning it has to look up the real product from the database
at that exact moment, not trust whatever the client claims the price is.
Write this reasoning down as a comment at the top of your model file —
you'll implement it tomorrow, but understanding *why* before you write
the route matters more than the code itself.

## Self-check

- [ ] Your schema has no field that, read alone six months from now,
      would give a wrong answer if the referenced product had since
      changed.
- [ ] You can explain, without looking anything up, why `items` stores
      `name` and `price` directly instead of only a `productId`.
- [ ] Your `total` is a stored field, not something you're planning to
      compute on the fly every time an order is displayed.

## Exercise

Without a hint:

1. Add a `shippingAddress` field (a simple embedded sub-object — street,
   city, whatever fields make sense) to the order schema, thinking about
   whether it should be required at this stage or optional until
   checkout actually collects it (tomorrow).
2. Commit on branch `day-26-order-schema`.

## Reference solution

Compare against `solutions/week-06/day-26-Order.js` only after you've
written down your own reasoning for the snapshot design, per Step 3 —
this is a "understand why before checking" day even more than most.

Tomorrow: `POST /orders`, where all of this snapshotting actually happens,
plus real stock enforcement.
