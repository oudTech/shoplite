# Day 21 (Mon) — The User Model, and Why Passwords Are Hashed

## What you're building today

A `User` model, and a `POST /signup` route. No login yet — today is
entirely about correctly creating an account, which means the single most
important lesson of this week: **you must never store a plain-text
password.**

## Concept: hashing, not encryption

Encryption is reversible — with the right key, you get the original text
back. Hashing is **not** reversible: a hash function turns "hunter2" into
some fixed-length string of gibberish, and there is no operation that
turns that gibberish back into "hunter2." When someone logs in, you don't
"decrypt" their stored password to compare it — you hash the password
they just typed and compare the two *hashes*. If your database is ever
breached, an attacker gets a list of hashes, not a list of real
passwords they can use elsewhere (and most people reuse passwords across
sites — this matters beyond just your app).

**bcrypt** specifically is designed to be *slow* on purpose (via a
configurable "cost" — sometimes called salt rounds), which sounds bad
but is exactly the point: hashing one real login attempt taking 100ms is
irrelevant to a real user, but it makes an attacker trying millions of
guessed passwords against a stolen hash dramatically more expensive.
bcrypt also automatically incorporates a random **salt** into every hash,
so two users with the same password get completely different stored
hashes — defeating precomputed lookup-table attacks.

## Build it yourself

**Step 1 — Define the schema.**
Create `models/User.js`. Fields: `email` (String, required, and think
about whether it should be unique — look up Mongoose's `unique` schema
option), `passwordHash` (String, required — notice this is *not* called
`password`, which is a deliberate naming choice to make it obvious, just
from reading the schema, that a plain password is never what's stored
here).

**Step 2 — Install and use bcrypt.**
Install `bcrypt` (or `bcryptjs`, a pure-JS alternative with no native
build step, which can be simpler to install). Look up its `hash`
function — it's asynchronous, and takes the plain password plus a cost
factor (10 is a common default; look up what raising or lowering it
actually trades off).

**Step 3 — Write `POST /signup`.**
Read `email` and `password` from the request body. Validate: both
present, email is a plausible shape (a full RFC-correct email validator
is overkill here — a simple check like "contains an `@`" is enough),
password meets some minimum length you decide on. Hash the password.
Create the user with the *hash*, never the original password. Respond
`201` with... think carefully here: should the response include
`passwordHash`? Decide what a client legitimately needs back, and leave
the rest out.

**Step 4 — Handle a duplicate email.**
Try signing up the same email twice. If you set `unique: true` in Step 1,
Mongoose/MongoDB will reject the second insert with a specific kind of
error — look up how to detect that specific error (it has a recognizable
`code`) and respond `409` (Conflict) with a clear message, rather than
letting a generic `500` leak through or a confusing raw database error
reach the client.

**Step 5 — Prove the hash is actually different from the password.**
After a successful signup, look directly at the stored document (via
Postman isn't enough here — check the database itself, the same way you
verified Day 17's seed data landed for real). Confirm the `passwordHash`
field is a long, unreadable string, nothing resembling the original
password, and that signing up the *same* password under two different
emails produces two *different* hash values (proof the salt is working).

## Self-check

- [ ] A successful signup returns `201` and never echoes back a plain
      password or the `passwordHash` in the response body.
- [ ] The stored `passwordHash` bears no visible resemblance to the
      original password, and looking at it doesn't tell you the
      password's length even approximately (bcrypt hashes are a fixed
      length regardless of input length — confirm this by comparing a
      very short and a very long password's hash lengths).
- [ ] Two different users signing up with the *same* password get
      different `passwordHash` values.
- [ ] Signing up with an email that's already registered returns `409`,
      not `201` and not a raw database error.
- [ ] Signing up with a missing email, missing password, or too-short
      password returns `400` with a specific message.

## Exercise

Without a hint:

1. Add a `createdAt` field to the schema (look up Mongoose's `timestamps`
   schema option, which can add this — and an `updatedAt` — for you
   automatically, without you writing any date logic by hand).
2. Commit on branch `day-21-user-model-signup`.

## Reference solution

Compare against `solutions/week-05/day-21-User.js` and
`solutions/week-05/day-21-server.js` only after your own version passes
every self-check item. This is one of the days worth resisting the urge
to peek on — get the hashing genuinely right yourself first.

Tomorrow: login, and your first encounter with JWTs.
