# ============================================================
# DAY 12 — LESSON 1: TAILWIND CSS FUNDAMENTALS
# Interview Level: Beginner → Intermediate
# Time: ~75 min
# ============================================================

Tailwind CSS is **utility-first**: instead of writing custom CSS classes,
you compose styles from small, single-purpose utility classes directly
in your JSX/HTML.

```html
<!-- Traditional CSS -->
<button class="btn-primary">Buy</button>
/* styles.css: .btn-primary { background: blue; padding: 8px 16px; ... } */

<!-- Tailwind -->
<button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
  Buy
</button>
```

**Analogy:** Traditional CSS is cooking from scratch. Tailwind is a
well-stocked spice rack — grab exactly what you need, no recipe book.

─────────────────────────────────────────────────────────────
## SECTION 1: SETUP (Vite + React)
─────────────────────────────────────────────────────────────

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import "tailwindcss";
```

That's it for Tailwind v4. Run `npm run dev` and add classes to JSX.

─────────────────────────────────────────────────────────────
## SECTION 2: THE SPACING SCALE (memorize the pattern)
─────────────────────────────────────────────────────────────

Tailwind uses a **consistent numeric scale** (not px in class names):

| Class | Approx size | Use |
|-------|-------------|-----|
| `p-1` | 4px | Tight padding |
| `p-2` | 8px | Small |
| `p-4` | 16px | Default padding |
| `p-6` | 24px | Comfortable |
| `p-8` | 32px | Section spacing |
| `gap-4` | 16px | Flex/grid gap |
| `mt-8` | 32px | Margin top |

Pattern: **number × 4px** (mostly). `m-4` = margin all sides 16px.
`px-4 py-2` = horizontal 16px, vertical 8px.

─────────────────────────────────────────────────────────────
## SECTION 3: COLORS
─────────────────────────────────────────────────────────────

Format: `{property}-{color}-{shade}`

```html
<div class="bg-slate-900 text-white border border-slate-700">
  Dark card
</div>
<p class="text-red-500">Error message</p>
<p class="text-emerald-600">Success</p>
```

Shades: 50 (lightest) → 950 (darkest). `500` is the "base" mid-tone.

Common palette: `slate`, `gray`, `zinc`, `neutral`, `red`, `blue`,
`emerald`, `amber`, `violet`.

─────────────────────────────────────────────────────────────
## SECTION 4: TYPOGRAPHY
─────────────────────────────────────────────────────────────

```html
<h1 class="text-4xl font-bold tracking-tight">Heading</h1>
<p class="text-base text-slate-600 leading-relaxed">Body text</p>
<span class="text-sm font-medium uppercase text-slate-400">Label</span>
```

| Class | Effect |
|-------|--------|
| `text-xs` → `text-9xl` | Font size |
| `font-normal` → `font-black` | Weight |
| `leading-tight` / `leading-relaxed` | Line height |
| `tracking-wide` | Letter spacing |
| `truncate` | Ellipsis overflow |

─────────────────────────────────────────────────────────────
## SECTION 5: STATES — hover, focus, active, disabled
─────────────────────────────────────────────────────────────

Prefix with the state name:

```html
<button class="
  bg-violet-600 text-white px-4 py-2 rounded-lg
  hover:bg-violet-700
  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Add to cart
</button>
```

**Always style `:focus`** for keyboard accessibility!

─────────────────────────────────────────────────────────────
## SECTION 6: RESPONSIVE DESIGN (mobile-first)
─────────────────────────────────────────────────────────────

Unprefixed = mobile. Prefix = **that breakpoint and up**:

| Prefix | Min width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

```html
<!-- 1 column on mobile, 2 on tablet, 4 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  ...
</div>
```

Read it as: "By default 1 col. From `md` upward, 2 cols. From `lg`, 4."

─────────────────────────────────────────────────────────────
## SECTION 7: DARK MODE
─────────────────────────────────────────────────────────────

```html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Adapts to dark mode
</div>
```

Enable in config (or use `class` strategy on `<html class="dark">`).

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

Rebuild your Day 1 portfolio hero section using ONLY Tailwind utilities.
No custom CSS file. Include:
- Responsive heading sizes (`text-3xl md:text-5xl`)
- A CTA button with hover + focus states
- A subtle gradient background (`bg-gradient-to-br from-violet-600 to-indigo-800`)

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: Pros/cons of Tailwind vs plain CSS?**
A: Pros — speed, consistency, no naming fatigue, dead-code elimination
   (Purge). Cons — verbose JSX, learning curve, harder for designers
   who expect separate stylesheets.

**Q: What does "utility-first" mean?**
A: You build designs by composing low-level utility classes instead of
   writing semantic component classes in a CSS file.

**Q: How does Tailwind handle unused CSS in production?**
A: It scans your files and tree-shakes (purges) classes you never used,
   keeping bundle size tiny.

**Q: Mobile-first in Tailwind?**
A: Unprefixed classes apply to all sizes. Breakpoint prefixes (`md:`)
   apply at that width and above.
