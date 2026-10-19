# Day 22 (Tue) — Login and JWTs

## What you're building today

`POST /login`, and your first JWT (JSON Web Token) — a signed piece of
proof that says "this request really is from the user who logged in,"
which every protected route from tomorrow onward will check.

## Concept: how does the server "remember" you're logged in?

HTTP is stateless — by default, the server has no memory of the previous
request when a new one comes in. So after a successful login, *something*
has to be handed back to the client and sent along with every future
request, proving "I already proved who I am." A JWT is a compact, signed
string containing some data (commonly, the user's id) that the *server*
can verify wasn't tampered with, because it's signed with a secret only
the server knows. Critically: a JWT is not encrypted — anyone can decode
and *read* what's inside it (look this up and try decoding one by hand
once you have one, just to see) — the signature only proves it wasn't
*altered*. That means you should never put a password or other sensitive
data inside a JWT's payload, only an identifier.

## Build it yourself

**Step 1 — Install `jsonwebtoken`, and add a JWT secret to `.env`.**
This secret is what signs and verifies every token — treat it exactly
like the database credential from Day 16 (never committed, only in
`.env`). Generate a genuinely random, long string for it, not something
guessable.

**Step 2 — Write `POST /login`.**
Read `email` and `password` from the body. Find the user by email — if
none exists, think carefully about your response: should it say "no
user with that email" specifically, or something more generic? (Look up
why real login systems often deliberately give the *same* generic error
for "wrong email" and "wrong password" — think about what a specific
"that email doesn't exist" error would let an attacker do.)

**Step 3 — Compare the password against the stored hash.**
Never compare `password === user.passwordHash` — that would only work if
you'd stored the plain password, which Day 21 specifically avoided. Look
up bcrypt's `compare` function — it takes the plain password and a hash,
and does the comparison correctly on your behalf. If it doesn't match,
respond with the same generic error from Step 2, same status code
(`401`), so a wrong password and a nonexistent email are
indistinguishable from the outside.

**Step 4 — Issue the token.**
On a successful match, sign a JWT (look up `jsonwebtoken`'s `sign`
function) containing the user's id (their MongoDB `_id`) and, if you'd
like, their email — nothing sensitive. Set an expiration (look up the
`expiresIn` option — think about what's reasonable: too short annoys
users, too long increases risk if a token leaks). Respond `200` with the
token.

**Step 5 — Decode a token by hand, once, to build real understanding.**
Take a token your `/login` route just issued, and paste it into a JWT
decoder (or write three lines of Node using the library's `decode`
function). Confirm you can read the payload in plain text — this is the
moment to really internalize that a JWT is *signed*, not *secret*.

## Self-check

- [ ] Correct email and password returns `200` with a token.
- [ ] Wrong password for a real email returns `401` with the same
      message and status as a nonexistent email — confirm both cases
      side by side.
- [ ] Decoding your issued token (Step 5) shows a readable payload with
      the user's id, proving you understand it's not encrypted.
- [ ] Tokens issued for two different users, when decoded, contain
      different ids.
- [ ] Your JWT secret lives only in `.env`, confirmed not tracked by
      git.

## Exercise

Without a hint:

1. Add a check to `/login`'s validation: missing `email` or `password`
   in the body should return `400`, distinct from `401` for a wrong
   credential — think about why mixing these up would be confusing for
   a client trying to handle your API correctly.
2. Commit on branch `day-22-login-jwt`.

## Reference solution

Compare against `solutions/week-05/day-22-server.js` only after your own
version passes every self-check item.

Tomorrow: using this token to actually protect a route.
