# Day 11 Project — Shopping Cart (Redux Toolkit + RTK Query)

Build a production-style shopping cart that fetches products from
[Fake Store API](https://fakestoreapi.com/) and manages cart state with Redux Toolkit.

## Setup (do this first — type every command!)

```bash
# 1. Create Vite + React + TypeScript app
npm create vite@latest shopping-cart -- --template react-ts
cd shopping-cart

# 2. Install Redux Toolkit (includes RTK Query + React-Redux)
npm install @reduxjs/toolkit react-redux

# 3. Optional: React Router for /cart page
npm install react-router-dom

# 4. Start dev server
npm run dev
```

## Project structure

```
shopping-cart/
├── src/
│   ├── main.tsx              ← wrap App with <Provider store={store}>
│   ├── App.tsx               ← routes: / (products) and /cart
│   ├── store/
│   │   ├── store.ts          ← configureStore (cart + api reducers)
│   │   ├── cartSlice.ts      ← cart state + reducers (TODO)
│   │   └── api.ts            ← RTK Query fakestoreapi (TODO)
│   ├── hooks/
│   │   └── useCart.ts        ← custom hook wrapping selectors (TODO)
│   └── components/
│       ├── Navbar.tsx        ← cart badge (TODO)
│       ├── ProductList.tsx   ← fetch + display products (TODO)
│       └── Cart.tsx          ← line items + totals (TODO)
└── README.md
```

## Features checklist

- [ ] Product list from `fakestoreapi.com/products` (RTK Query)
- [ ] Add / remove / update quantity (cart slice)
- [ ] Cart badge in navbar (`useSelector` from anywhere)
- [ ] Subtotal, tax (8%), coupon `SAVE10` (10% off), grand total
- [ ] Category filter + search (decide: ui slice or local state — justify in notes!)
- [ ] Persist cart to `localStorage` (subscribe to store or middleware)
- [ ] Loading + error UI from RTK Query
- [ ] Custom `useCart()` hook

## How to work through this project

1. Read each file's `TODO` comment
2. Close the `ANSWER` section and write YOUR code first
3. Compare, fix, understand WHY
4. App must run before you sleep!

## Fake Store API endpoints

| Endpoint | Use |
|----------|-----|
| `GET /products` | All products |
| `GET /products/categories` | Category list |
| `GET /products/category/{cat}` | Filter by category |
| `GET /products/{id}` | Single product |

Base URL: `https://fakestoreapi.com/`

## Interview prep (after building)

Explain out loud:
1. Redux data flow in YOUR app (dispatch → reducer → selector)
2. Why RTK Query instead of useEffect + fetch?
3. Where would you add optimistic updates for "add to cart"?
