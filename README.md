# ShopLite

A real, working mini e-commerce store — browsable products, a cart, user
accounts, checkout, order history, and an admin panel — built day by day
by the OudTech web dev interns over an 8-week curriculum, starting from
CSS + JavaScript only.

**Live demo:** _add your deployed frontend URL here once deployed (Day 37)_
**API base URL:** _add your deployed backend URL here_

## Tech stack

- **Frontend:** vanilla HTML, CSS, and JavaScript — no framework, no build
  step. Chosen deliberately so every line of behavior is visible and
  traceable, since the interns started with CSS/JS only.
- **Backend:** Node.js + Express, providing a REST API.
- **Database:** MongoDB, via Mongoose.
- **Auth:** JWTs, with bcrypt-hashed passwords.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the pieces fit together.

## Project structure

```
shoplite/
├── frontend/           vanilla HTML/CSS/JS — no build step
│   ├── index.html      product catalog, search, cart
│   ├── auth.html       login / signup
│   ├── checkout.html   cart review + place order
│   ├── orders.html     "My Orders" (customer order history)
│   ├── admin.html      admin: manage products & order statuses
│   ├── css/
│   └── js/
├── backend/
│   ├── server.js       app entry point
│   ├── src/
│   │   ├── config/      MongoDB connection
│   │   ├── models/      Product, User, Order (Mongoose schemas)
│   │   ├── routes/      products, auth, orders
│   │   └── middleware/  requireAuth, requireAdmin
│   ├── scripts/         seed.js, make-admin.js (run manually, not via API)
│   └── postman_collection.json
└── tutorials/
    └── week-0X/day-0X.md   the day-by-day curriculum this repo was built from
```

## Setup

### 1. Database

Create a free MongoDB Atlas cluster (or run MongoDB locally). You'll need
a connection string.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: fill in MONGODB_URI and JWT_SECRET (a long random string)
npm run seed        # seeds the original 8 products (safe to skip/rerun)
npm start           # or: npm run dev  (auto-restarts on changes)
```

Confirm it's running: `curl http://localhost:4000/health`

To make a user an admin (there is deliberately no API route for this —
see Day 31):

```bash
npm run make-admin -- someone@example.com
```

### 3. Frontend

No install step. From the project root:

```bash
npx serve frontend
```

Open the URL it gives you. `frontend/js/config.js` auto-detects local vs.
deployed environments — see Day 36 and Day 37 if you're deploying.

## Testing the API directly

Import `backend/postman_collection.json` into Postman or Thunder Client —
it covers every route, including the expected failure cases (invalid ids,
missing auth, bad input).

## API summary

| Method | Route                  | Auth          | Purpose                          |
|--------|-------------------------|---------------|-----------------------------------|
| GET    | /health                | —             | Health check                      |
| GET    | /products              | —             | List all products                 |
| GET    | /products/:id          | —             | Get one product                   |
| POST   | /products              | admin         | Create a product                  |
| PUT    | /products/:id          | admin         | Update a product                  |
| DELETE | /products/:id          | admin         | Delete a product                  |
| POST   | /auth/signup           | —             | Create an account                 |
| POST   | /auth/login            | —             | Log in, get a JWT                 |
| POST   | /orders                | logged in     | Place an order from cart items    |
| GET    | /orders                | logged in     | Your own order history            |
| GET    | /orders/:id            | logged in     | One of your own orders            |
| GET    | /orders/admin/all      | admin         | Every order, every customer       |
| PUT    | /orders/:id/status     | admin         | Update an order's status          |

## How this repo is organised (for interns following the curriculum)

- `tutorials/week-0X/day-0X.md` — one file per day: what you're learning,
  why it matters for ShopLite, the actual code, and an exercise.
- The code in `frontend/` and `backend/` evolves day by day — check
  `git log --oneline` to see exactly what changed on each day, or
  `git log -p -- <file>` to see a single file's history.

## Progress

- [x] Week 1 — JavaScript & UI foundations
- [x] Week 2 — Interactivity & client-side state
- [x] Week 3 — Introduction to the backend
- [x] Week 4 — Real data with MongoDB
- [x] Week 5 — Accounts & authentication
- [x] Week 6 — Checkout & orders
- [x] Week 7 — Admin panel & polish
- [x] Week 8 — Deployment, documentation & demo
