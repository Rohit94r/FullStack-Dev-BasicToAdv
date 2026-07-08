# ============================================================
# DAY 12 — LESSON 2: TAILWIND LAYOUTS (Flexbox + Grid)
# Interview Level: Beginner → Intermediate
# Time: ~60 min
# ============================================================

Day 1 you learned flexbox and grid in raw CSS. Today you rebuild
those same layouts with Tailwind utilities — faster, no context
switching to a `.css` file.

─────────────────────────────────────────────────────────────
## SECTION 1: FLEXBOX RECIPES
─────────────────────────────────────────────────────────────

### Center anything (the #1 pattern)

```html
<div class="flex items-center justify-center min-h-screen">
  <p>Perfectly centered</p>
</div>
```

| Utility | CSS equivalent |
|---------|----------------|
| `flex` | `display: flex` |
| `flex-col` | `flex-direction: column` |
| `items-center` | `align-items: center` |
| `items-start` / `items-end` | align start/end |
| `justify-center` | `justify-content: center` |
| `justify-between` | space between |
| `gap-4` | `gap: 1rem` |
| `flex-1` | `flex: 1 1 0%` (grow to fill) |
| `flex-wrap` | wrap items |
| `shrink-0` | don't shrink |

### Navbar layout

```html
<nav class="flex items-center justify-between px-6 py-4 border-b">
  <a class="text-xl font-bold">Logo</a>
  <div class="flex items-center gap-6">
    <a class="text-slate-600 hover:text-slate-900">Shop</a>
    <a class="text-slate-600 hover:text-slate-900">Cart (3)</a>
  </div>
</nav>
```

### Sidebar + main content

```html
<div class="flex min-h-screen">
  <aside class="w-64 shrink-0 border-r bg-slate-50 p-4">
    Sidebar
  </aside>
  <main class="flex-1 p-6">
    Main content grows to fill remaining space
  </main>
</div>
```

### Card with footer pinned to bottom

```html
<article class="flex flex-col h-80 border rounded-xl overflow-hidden">
  <img class="h-40 w-full object-cover" src="..." alt="" />
  <div class="flex flex-col flex-1 p-4">
    <h3 class="font-semibold">Product title</h3>
    <p class="text-sm text-slate-500 flex-1">Description...</p>
    <button class="mt-4 w-full bg-violet-600 text-white py-2 rounded-lg">
      Add to cart
    </button>
  </div>
</article>
```

─────────────────────────────────────────────────────────────
## SECTION 2: GRID RECIPES
─────────────────────────────────────────────────────────────

```html
<!-- Product grid: responsive columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="border rounded-lg p-4">Product 1</div>
  <div class="border rounded-lg p-4">Product 2</div>
  <!-- ... -->
</div>
```

### Dashboard stats row

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div class="rounded-xl border p-4">
    <p class="text-sm text-slate-500">Revenue</p>
    <p class="text-2xl font-bold">$12,450</p>
  </div>
  <!-- repeat for Orders, Users, Conversion -->
</div>
```

### Holy grail layout (header + sidebar + main + footer)

```html
<div class="grid min-h-screen grid-rows-[auto_1fr_auto] grid-cols-1 md:grid-cols-[240px_1fr]">
  <header class="md:col-span-2 border-b px-6 py-4">Header</header>
  <aside class="hidden md:block border-r p-4">Sidebar</aside>
  <main class="p-6">Content</main>
  <footer class="md:col-span-2 border-t px-6 py-4 text-center text-sm">
    Footer
  </footer>
</div>
```

| Grid utility | Effect |
|--------------|--------|
| `grid-cols-3` | 3 equal columns |
| `grid-cols-[200px_1fr]` | Custom track sizes |
| `col-span-2` | Span 2 columns |
| `row-span-2` | Span 2 rows |
| `auto-rows-fr` | Equal height rows |

─────────────────────────────────────────────────────────────
## SECTION 3: POSITIONING + OVERLAYS
─────────────────────────────────────────────────────────────

```html
<!-- Image with badge overlay -->
<div class="relative">
  <img class="w-full rounded-lg" src="..." alt="" />
  <span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
    Sale
  </span>
</div>

<!-- Full-screen modal backdrop -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
    Modal content
  </div>
</div>
```

─────────────────────────────────────────────────────────────
## SECTION 4: CONTAINER + MAX WIDTH
─────────────────────────────────────────────────────────────

```html
<div class="container mx-auto px-4 max-w-7xl">
  <!-- Content centered with responsive horizontal padding -->
</div>
```

`container` sets max-width per breakpoint. `mx-auto` centers it.

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

Rebuild these from Day 1 using Tailwind only:

1. **Product card grid** — 1/2/3/4 columns responsive
2. **Sticky navbar** — `sticky top-0 z-40 bg-white/80 backdrop-blur`
3. **Two-column checkout** — cart items left, summary right on `lg:`

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: When flex vs grid?**
A: Flex = one-dimensional (row OR column), great for navbars, toolbars,
   aligning items in a line. Grid = two-dimensional, great for page
   layouts and card grids.

**Q: What does `flex-1` do?**
A: `flex: 1 1 0%` — grow to fill available space equally with siblings.

**Q: How do you center with Tailwind?**
A: `flex items-center justify-center` on the parent (most common),
   or `grid place-items-center`, or `absolute inset-0 flex ...` for overlays.
