# Day 16 (Mon) — Connecting to MongoDB with Mongoose

## What you're building today

Your product "database" has been a plain JavaScript array living in
server memory since Day 12 — which means every restart wipes it back to
the original 8 products, and anything added via `POST` vanishes. Today
you connect your backend to a real database, MongoDB, so data actually
persists. You won't move the products themselves yet (tomorrow) — today
is entirely about getting a working, provable connection.

## Concept: what a database gives you that an array doesn't

An in-memory array lives inside your Node process — the moment that
process stops, the data is gone. A database is a separate, persistent
system: your server connects to it, but the data lives independently of
whether your server is running. MongoDB specifically stores data as
JSON-like documents (not rows and columns like a SQL database), which
maps naturally onto the JavaScript objects you've already been working
with all along — a product document looks a lot like your existing
product objects.

**Mongoose** sits between your code and MongoDB. Raw MongoDB will accept
almost any shape of document you throw at it — Mongoose adds a *schema*
layer on top, so you can say "a product document must have a `name`
that's a `String`, a `price` that's a `Number`," and get a clear error
immediately if something violates that, instead of silently accepting bad
data and discovering the problem later.

## Build it yourself

**Step 1 — Get a MongoDB instance to connect to.**
Look up MongoDB Atlas (a free hosted MongoDB) if you don't already have
MongoDB installed locally — either works for this project. Create a
cluster/database and get your **connection string** (a URL-shaped string
containing credentials — treat it like a password).

**Step 2 — Never commit that connection string.**
Look up the `dotenv` package, install it, and create a `.env` file
holding your connection string under some variable name (e.g.
`MONGODB_URI`). Confirm `.env` is listed in your `.gitignore` from Day
11 — a leaked database password in a public repo is a real, common
security mistake, not a hypothetical one.

**Step 3 — Install Mongoose and connect.**
Install `mongoose`. In your server startup code, before (or as part of)
starting to listen, call Mongoose's connect function with your connection
string from `.env` (look up `process.env.<YOUR_VARIABLE_NAME>` to read
it). Figure out how to know, from your own code, whether the connection
succeeded or failed — you want a clear console message either way, not
silence.

**Step 4 — Handle a failed connection deliberately.**
Temporarily break your connection string on purpose (a typo) and confirm
you see a clear failure message when starting the server — then fix it
back. This is the same "prove the failure path actually works" discipline
from Day 9's fetch error handling.

**Step 5 — Confirm the connection is real, not just "no error thrown."**
"No error" isn't the same as "definitely connected" — some connection
issues only reveal themselves once you try to actually use the database.
Look up Mongoose's connection events (there's one specifically for a
successful, open connection) and log something distinct when that fires,
so you have positive proof, not just absence of an error.

## Self-check

- [ ] Starting your server with a correct connection string shows a
      clear "connected" message.
- [ ] Starting your server with a deliberately broken connection string
      shows a clear failure message, not a silent hang or a cryptic
      stack trace you have to decode.
- [ ] Your `.env` file is *not* tracked by git (`git status` shouldn't
      list it) — confirm this explicitly, don't just assume `.gitignore`
      is working.
- [ ] A teammate cloning your repo fresh (simulate this by checking what
      files `git ls-files` actually shows) would have no way to see your
      real connection string.

## Exercise

Without a hint:

1. Add a `.env.example` file (which *is* committed) showing the variable
   name your `.env` needs, with a placeholder value — so someone setting
   up the project knows what to create, without ever seeing a real
   credential.
2. Commit on branch `day-16-mongodb-connection`.

## Reference solution

Compare against `solutions/week-04/day-16-db.js` and
`solutions/week-04/day-16-server.js` only after your own version passes
the self-check. The reference can't include a real connection string
(there isn't a real database for you to connect to in this material) —
focus the comparison on the *structure*: where the connection logic
lives, how failure is surfaced, and how the `.env` value is read.

Tomorrow: an actual Mongoose schema, and moving your product data into
real database documents.
