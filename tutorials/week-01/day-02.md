# Day 2 (Tue) — JavaScript Refresher: Modelling the Product Catalog

## What you're learning
Modern JS syntax: `let`/`const`, arrow functions, template literals,
destructuring, and the difference between arrays and objects.

## Why it matters for ShopLite
Before we can show a single product on screen, we need to decide what a
"product" *is* in code. Today we model the entire catalog as data — no UI
yet. Every feature for the next 7 weeks touches this shape.

## The code

Open `frontend/js/data.js` — it's already filled in for reference, but type
it out yourself in a scratch file first so it sticks:

```js
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 25000,
    category: "Electronics",
    image: "https://via.placeholder.com/300x300?text=Headphones",
    stock: 12,
  },
  // ...more products
];
```

Notice:
- It's an **array** (`[...]`) of **objects** (`{...}`) — a list of
  structured records, exactly like a spreadsheet row.
- Every object has the *same keys*. This consistency is what lets us loop
  over them generically later instead of writing custom code per product.

### Quick refresher exercises (do these in the browser console or a scratch
file — not in `data.js`)

```js
// destructuring
const { name, price } = PRODUCTS[0];
console.log(name, price);

// template literals
console.log(`${name} costs ₦${price}`);

// arrow functions
const formatPrice = (n) => `₦${n.toLocaleString()}`;
console.log(formatPrice(25000)); // ₦25,000
```

## Exercise
1. Add two more products of your own to `PRODUCTS` in `data.js`, matching
   the same shape exactly.
2. Write a `formatPrice(amount)` arrow function at the bottom of `data.js`
   that returns a string like `₦25,000` (use `toLocaleString()`).
3. Commit on a new branch: `day-02-product-data`.

Tomorrow we put this data on the actual page.
