# Day 32 (Tue) — Admin Product Management UI

## What you're building today

`admin.html` — a page, reachable only by an actual admin, listing every
product with the ability to create, edit, and delete them through a real
interface, using the `PUT`/`POST`/`DELETE` routes you already built back
in Week 4.

## Concept: the backend already enforces this — the frontend page is a convenience, not the security boundary

This is worth being precise about: `requireAdmin` (Day 31) is what
actually prevents a non-admin from creating or deleting products — that
protection lives entirely on the server. Today's `admin.html` page is
just a *convenient interface* to routes that were already secure before
you wrote a single line of frontend code. If someone bypassed your
`admin.html` entirely and hit `POST /products` directly with a
non-admin token, the server would still correctly reject it. Keep this
distinction sharp: a "hidden" admin page that anyone could technically
navigate to is not a security measure — the *routes'* own checks are.
Today's UI work is about making a legitimate admin's job pleasant, not
about building the actual defense.

## Build it yourself

**Step 1 — Gate the page itself, as a UX nicety (not security).**
On `admin.html` load, check `isLoggedIn()` (Day 24). You don't yet know
if this user is an *admin* just from that — call `GET /me` (Day 23) and
check the returned `isAdmin` field (you'll need to add `isAdmin` to what
`/me` returns, if it doesn't already). If not logged in or not an admin,
show a clear "not authorized" message and don't render the management
UI at all. Remember: this check is purely for a legitimate admin's
experience — the real enforcement already happened server-side.

**Step 2 — List all products with edit/delete controls.**
Reuse Day 3's rendering pattern, but each row/card now includes "Edit"
and "Delete" buttons, and probably more detail than the customer-facing
grid (stock level, category, maybe the raw `_id` for reference).

**Step 3 — Build a create/edit form.**
One form, reused for both: creating starts it empty, editing pre-fills it
with an existing product's data (name, price, category, image, stock).
On submit, decide based on whether you're creating or editing which
route and method to call (`POST` vs `PUT`) — think about how you'll track
"which mode is this form currently in" (a hidden field holding the
current product's `_id` when editing, cleared when creating, is one
reasonable approach).

**Step 4 — Wire delete, with a confirmation.**
A delete button should ask for confirmation (even a plain browser
`confirm()` is fine here) before actually calling `DELETE /products/:id`
— an accidental delete of real product data is a genuinely bad outcome,
worth one extra click of friction to prevent.

**Step 5 — Include the admin's token on every request.**
Every create/edit/delete call needs the `Authorization` header (Day 24's
pattern) — these routes will start requiring `requireAdmin` starting
tomorrow (Day 33 wires it into the actual product routes; today you're
building the UI assuming that protection, even before it's fully wired
server-side, so you don't have to redo this frontend work tomorrow).

**Step 6 — Refresh the list after every mutation.**
After a successful create, edit, or delete, re-fetch and re-render the
product list (or update it locally, following Day 8's cart-sidebar
pattern of "re-render from the true current state" — pick whichever you
find clearer) so the admin sees the effect of their action immediately.

## Self-check

- [ ] A logged-out visitor to `admin.html` sees "not authorized," not the
      management UI.
- [ ] A logged-in non-admin sees the same "not authorized" message.
- [ ] Your actual test admin account can create a new product and see it
      appear in the list immediately.
- [ ] Editing an existing product correctly pre-fills the form, and
      saving updates that same product (confirm by its unchanged `_id`),
      not creating a duplicate.
- [ ] Deleting requires a confirmation step, and the product disappears
      from the list immediately afterward.
- [ ] The customer-facing storefront (`index.html`) reflects admin
      changes correctly on reload (a deleted product no longer appears,
      an edited product shows the new data) — confirming the two pages
      really do share the same backend data.

## Exercise

Without a hint:

1. Add simple form validation matching your backend's rules (name
   required, price a non-negative number) shown inline, *before*
   submitting — same reasoning as Day 25's client-side validation for
   auth forms.
2. Commit on branch `day-32-admin-products-ui`.

## Reference solution

Compare against `solutions/week-07/day-32-admin.js` only after your own
version passes every self-check item.

Tomorrow: actually wiring `requireAdmin` onto the product write routes
themselves, closing the loop this page has been assuming.
