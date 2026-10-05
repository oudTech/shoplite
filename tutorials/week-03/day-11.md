# Day 11 (Mon) — Your First Node/Express Server

## What you're building today

Everything so far has run entirely in the browser. Today that changes:
you start a real server — a separate program, running on your own
machine, that the browser will eventually talk to over HTTP. By the end
of today it does almost nothing (one route that proves it's alive), but
it's the foundation Weeks 3–8 build on.

## Concept: what a server actually is

A browser and a server are two separate programs that talk to each other
over HTTP requests and responses. Your frontend files (`index.html`,
`app.js`, etc.) are static files a browser can open directly — no server
needed for those to *display*. But dynamic behavior — "give me the
current list of products," "remember this order," "check this
password" — needs a program that's always running, holding real data,
and responding to requests. That program is the backend. **Express** is
a library that makes writing that program much less tedious than
handling raw HTTP yourself: it gives you a clean way to say "when a
request for this URL and method comes in, run this function."

## Build it yourself

**Step 1 — Set up the project.**
In a new `backend/` folder (a sibling to your `frontend/` folder, not
inside it — think about why keeping them separate makes sense even
though they'll eventually run together), run `npm init` to create a
`package.json`. Then install Express (look up the npm install command —
you'll be typing `npm install <package-name>` a lot from here on).

**Step 2 — Write the smallest possible server.**
Create `server.js`. You need to:
- Import Express (look up the `require` syntax for a CommonJS package,
  since that's what a fresh `npm init` project uses by default).
- Call it to create an `app`.
- Define one route: when a `GET` request comes in for `/`, respond with
  some simple text or JSON proving the server is alive. Look up
  Express's method for defining a route (it mirrors the HTTP method
  name) and what its handler function receives (two objects — figure out
  what each one represents by reading a few real examples before you
  write your own).
- Tell the app to start listening on a port (`3000` is a common choice
  during development — pick one, note it, you'll need it constantly).

**Step 3 — Run it and actually look at it.**
Start the server (`node server.js`). Open the URL in your *browser* (not
just trusting that it started without errors) and confirm you see your
response. Then stop the server (`Ctrl+C`) and start it again — get
comfortable with this cycle, because you'll restart the server constantly
while developing.

**Step 4 — Auto-restart on file changes.**
Restarting manually after every edit gets old fast. Look up `nodemon` —
install it, and figure out how to add an npm script (in `package.json`'s
`"scripts"` section) that runs your server through it, so you can just
run one short command and have the server restart itself whenever you
save a file.

**Step 5 — Add a `.gitignore`.**
Before committing anything, make sure `node_modules/` never gets
committed — it's regenerated from `package.json` by anyone who clones the
repo, and committing it bloats the repo for no benefit. Look up the
standard Node `.gitignore` contents if you're unsure what else belongs in
it.

## Self-check

- [ ] Visiting your route in the browser shows your response, not an
      error page.
- [ ] Stopping and restarting the server works cleanly, with no leftover
      "port already in use" errors (if you hit that, look up how to find
      and stop whatever's still using the port).
- [ ] Editing your route's response text and saving, with `nodemon`
      running, updates the browser after a refresh — no manual restart.
- [ ] `node_modules/` is not tracked by git (`git status` shouldn't list
      files inside it).

## Exercise

Without a hint:

1. Add a second route, `GET /health`, that returns a small JSON object
   (not plain text) with at least a status field — this is a common
   pattern real deployed services use to let monitoring tools check
   "is this thing alive."
2. Commit on branch `day-11-express-setup`.

## Reference solution

Compare against `solutions/week-03/day-11-server.js` and
`solutions/week-03/day-11-package.json` only after your own version
passes the self-check. Note there isn't much to "get wrong" today — the
real point is getting comfortable with the run/edit/restart loop you'll
live in for the rest of this backend work.

Tomorrow: serving ShopLite's actual product data from this server.
