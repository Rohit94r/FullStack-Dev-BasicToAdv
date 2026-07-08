# Day 12 Project — UI Upgrade Guide (Day 11 Shopping Cart)

**Not a new project.** Upgrade your existing Day 11 cart to production-quality UI
using Tailwind, shadcn/ui, framer-motion, and Lucide icons.

Work through each step in order. Complete one step fully before moving on.

---

## Step 0: Prerequisites

- Day 11 cart runs (`npm run dev` works)
- Redux + RTK Query still functional (don't break state while styling!)

---

## Step 1: Install Tailwind (30 min)

```bash
cd day11-react-advanced-redux/project/shopping-cart
npm install -D tailwindcss @tailwindcss/vite
```

1. Add `tailwindcss()` to `vite.config.ts` plugins
2. Replace `src/index.css` with `@import "tailwindcss";`
3. Remove old CSS class names from components (or migrate gradually)
4. Verify: add `className="text-red-500"` to any element — it should work

**Checkpoint:** App still loads products and adds to cart.

---

## Step 2: Init shadcn/ui (20 min)

```bash
npx shadcn@latest init
npx shadcn@latest add button card badge input skeleton toast sheet dialog dropdown-menu
```

1. Configure `@/` path alias in `vite.config.ts` + `tsconfig.json`
2. Add `<Toaster />` to `App.tsx` root
3. Replace one `<button>` with `<Button>` — confirm it renders

**Checkpoint:** shadcn Button works, dark mode CSS variables exist.

---

## Step 3: Navbar upgrade (45 min)

**File:** `src/components/Navbar.tsx`

TODO tasks:
- [ ] Wrap in `sticky top-0 z-40 border-b bg-background/80 backdrop-blur`
- [ ] Use `container mx-auto flex items-center justify-between px-4 h-14`
- [ ] Logo: `font-bold text-lg`
- [ ] Cart: `Button variant="ghost"` with `ShoppingCart` icon + count `Badge`
- [ ] Add `ThemeToggle` component (see Lesson 6)
- [ ] Desktop: horizontal links. Mobile: hide, use bottom nav (Step 8)

**YOUR IDEA first, then compare with:**

```tsx
// Cart badge pattern
<Button variant="ghost" size="icon" className="relative" asChild>
  <Link to="/cart">
    <ShoppingCart className="h-5 w-5" />
    {cartCount > 0 && (
      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
        {cartCount}
      </Badge>
    )}
  </Link>
</Button>
```

---

## Step 4: Product grid + cards (60 min)

**File:** `src/components/ProductList.tsx`

- [ ] Outer: `container mx-auto px-4 py-8`
- [ ] Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- [ ] Each product → shadcn `Card` with image, title, price, Add button
- [ ] Loading: 6× `Skeleton` cards (not "Loading..." text)
- [ ] Error: friendly message + retry button calling `refetch()`

**Framer motion (install first: `npm install framer-motion`):**
- [ ] Wrap grid in motion container with stagger variants (Lesson 5)
- [ ] `whileHover={{ y: -4 }}` on each card

---

## Step 5: Add-to-cart feedback (30 min)

- [ ] On add: `toast({ title: "Added to cart", description: product.title })`
- [ ] Button: `whileTap={{ scale: 0.95 }}` micro-animation
- [ ] Optional: brief "Added ✓" state on button for 1 second

---

## Step 6: Cart page / Sheet drawer (60 min)

Choose ONE primary cart UI:
- **Desktop:** full `/cart` page
- **Mobile:** `Sheet` slide-out from Navbar (recommended for both!)

**File:** `src/components/Cart.tsx`

- [ ] Line items: flex row with image, title, qty controls (`Minus`/`Plus` icons)
- [ ] `AnimatePresence` on item list for remove animation
- [ ] Totals section in `Card` at bottom
- [ ] Coupon: shadcn `Input` + `Button`
- [ ] Clear cart: `Dialog` confirmation (not instant delete!)
- [ ] Empty state: `PackageOpen` icon + CTA (Lesson 6)

---

## Step 7: Filters + search bar (45 min)

Add above product grid:
- [ ] Search: `Input` with `Search` icon (client-side filter is fine)
- [ ] Category: `DropdownMenu` with categories from API
- [ ] Sort: price low/high via `DropdownMenu`

Decide: ui slice vs local state — write your reasoning in `notes.md`.

---

## Step 8: Responsive mobile nav (30 min)

- [ ] Hide desktop nav links below `md:`
- [ ] Fixed bottom bar: Shop | Cart | Theme (see Lesson 6)
- [ ] Add `pb-20` to main content area

---

## Step 9: Dark mode (20 min)

- [ ] `ThemeToggle` in Navbar
- [ ] Persist to `localStorage`
- [ ] Test ALL pages in both modes — fix any hard-coded colors

---

## Step 10: Final polish pass (30 min)

Run the checklist from Lesson 6:
- Spacing consistent
- Focus rings visible (tab through entire app)
- No layout shift when loading
- `prefers-reduced-motion` — disable stagger if reduced

---

## Definition of Done

Your upgraded cart should:
1. Fetch products (RTK Query) ✓
2. Cart state works globally (Redux) ✓
3. Looks like a real e-commerce UI (not a homework assignment)
4. Animations feel smooth, not distracting
5. Works on mobile (375px) and desktop (1280px)

---

## Interview practice

After finishing, explain out loud:
1. Why shadcn over Material UI for this project?
2. What AnimatePresence solves that CSS can't?
3. How dark mode works in your app (3 steps: toggle → class → CSS vars)
