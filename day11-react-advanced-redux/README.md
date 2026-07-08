# DAY 11 — React Advanced + Redux Toolkit

## Today's Goal
Custom hooks, context, performance hooks, and Redux Toolkit —
manage state like a production app.

## Content Ready
All **6 lesson files** in `lessons/` and the **shopping-cart** project in `project/shopping-cart/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
Rebuild yesterday's TodoItem with inline editing FROM MEMORY.
Explain the useEffect dependency array out loud.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-custom-hooks.tsx` | Extract logic: useLocalStorage, useFetch, useDebounce | 60 min |
| 2 | `02-usecontext.tsx` | Context API, when to use (theme, auth), provider pattern, pitfalls | 60 min |
| 3 | `03-usereducer.tsx` | Reducer pattern, when useState isn't enough, action objects | 60 min |
| 4 | `04-performance-hooks.tsx` | useMemo, useCallback, React.memo — when they help and when they're useless | 60 min |
| 5 | `05-redux-toolkit.tsx` | Store, slices, createSlice, useSelector/useDispatch, Immer magic | 90 min |
| 6 | `06-rtk-query.tsx` | Data fetching with RTK Query: queries, mutations, cache invalidation | 60 min |

## Project (6 hours): Shopping Cart (React + Redux Toolkit)
Classic Redux interview project — covers the whole state management story.

Features:
- [ ] Product list fetched from fakestoreapi.com (RTK Query)
- [ ] Add to cart / remove / change quantity (cart slice)
- [ ] Cart badge in navbar (useSelector from any component — the POINT of Redux)
- [ ] Cart page: line totals, subtotal, tax, grand total (selectors with memoization)
- [ ] Coupon codes (10% off — reducer logic)
- [ ] Category filter + search + sorting (ui slice or local state — DECIDE and justify!)
- [ ] Persist cart to localStorage (Redux middleware or subscribe)
- [ ] Loading + error states from RTK Query
- [ ] Custom hook useCart() wrapping cart selectors + actions

## Tonight's Notes
- When Context vs Redux vs local state — decision tree
- Redux data flow diagram: dispatch → reducer → store → selector → re-render
- What Immer does in createSlice (why "mutation" is allowed there)
- useMemo vs useCallback — one line each

## Interview Questions
1. When do you need Redux over useState/Context?
2. What is a reducer? Why must it be pure?
3. useMemo vs useCallback vs React.memo?
4. What problem does RTK Query solve?
5. Why is Context bad for frequently-changing state?
6. What is a selector? Why memoize selectors?
