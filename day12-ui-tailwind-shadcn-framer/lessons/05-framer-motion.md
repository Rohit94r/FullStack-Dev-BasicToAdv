# ============================================================
# DAY 12 — LESSON 5: FRAMER MOTION
# Interview Level: Intermediate
# Time: ~75 min
# ============================================================

Framer Motion (`motion` package) is the standard animation library for
React. It declaratively animates components on mount, exit, hover, and
layout changes.

```bash
npm install framer-motion
```

─────────────────────────────────────────────────────────────
## SECTION 1: BASIC motion COMPONENT
─────────────────────────────────────────────────────────────

Replace any HTML element with `motion.*`:

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}   // starting state
  animate={{ opacity: 1, y: 0 }}      // end state
  transition={{ duration: 0.4 }}      // how to get there
>
  Fades in and slides up
</motion.div>
```

| Prop | Meaning |
|------|---------|
| `initial` | State before animation |
| `animate` | Target state |
| `exit` | State when removed (needs AnimatePresence) |
| `transition` | Duration, easing, delay, spring |

─────────────────────────────────────────────────────────────
## SECTION 2: HOVER & TAP (micro-interactions)
─────────────────────────────────────────────────────────────

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-violet-600 text-white px-4 py-2 rounded-lg"
>
  Add to cart
</motion.button>
```

Product card lift effect:

```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
  transition={{ type: "spring", stiffness: 300 }}
  className="rounded-xl border bg-card"
>
  {/* card content */}
</motion.div>
```

─────────────────────────────────────────────────────────────
## SECTION 3: VARIANTS — orchestrate children
─────────────────────────────────────────────────────────────

Define animation states once, reuse everywhere:

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }, // delay each child
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-6">
  {products.map((p) => (
    <motion.div key={p.id} variants={item}>
      <ProductCard product={p} />
    </motion.div>
  ))}
</motion.div>
```

**Staggered grid entrance** — the signature "polished app" feel.

─────────────────────────────────────────────────────────────
## SECTION 4: AnimatePresence — EXIT ANIMATIONS
─────────────────────────────────────────────────────────────

React removes DOM nodes instantly. AnimatePresence keeps them alive
long enough to animate OUT.

```tsx
import { AnimatePresence, motion } from "framer-motion";

<ul>
  <AnimatePresence mode="popLayout">
    {cartItems.map((item) => (
      <motion.li
        key={item.id}
        layout                        // animate position when siblings removed
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20, height: 0 }}
        transition={{ duration: 0.2 }}
      >
        {item.title} × {item.qty}
      </motion.li>
    ))}
  </AnimatePresence>
</ul>
```

**Rules:**
1. Wrap exiting elements in `<AnimatePresence>`
2. Each child needs a unique `key`
3. Define `exit` prop on the motion component

─────────────────────────────────────────────────────────────
## SECTION 5: LAYOUT ANIMATIONS
─────────────────────────────────────────────────────────────

```tsx
<motion.div layout className="rounded-lg bg-violet-100 p-4">
  {/* When content/size changes, framer smoothly animates the transition */}
</motion.div>
```

Use `layout` when cart count badge changes size or grid reflows.

─────────────────────────────────────────────────────────────
## SECTION 6: ACCESSIBILITY — prefers-reduced-motion
─────────────────────────────────────────────────────────────

```tsx
import { useReducedMotion } from "framer-motion";

function ProductGrid({ products }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      ...
    </motion.div>
  );
}
```

Or globally in CSS:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
  }
}
```

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

Add to Day 11 cart:
1. Staggered product grid entrance (variants)
2. `whileHover` lift on product cards
3. `AnimatePresence` when removing cart items
4. Cart badge `layout` animation when count changes

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: initial vs animate vs exit?**
A: `initial` = before enter. `animate` = visible state. `exit` = when
   unmounting (requires AnimatePresence).

**Q: What is AnimatePresence for?**
A: Enables exit animations when React removes components from the tree.

**Q: How make animations accessible?**
A: Respect `prefers-reduced-motion` via `useReducedMotion()` or CSS.
   Don't animate essential information only through motion.

**Q: Framer Motion vs CSS animations?**
A: CSS = great for simple hover/transitions. Framer = orchestration,
   exit animations, layout, gesture, React integration.
