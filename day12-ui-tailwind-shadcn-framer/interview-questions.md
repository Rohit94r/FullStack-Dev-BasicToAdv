# Day 12 — Tailwind CSS, shadcn/ui & Framer Motion Interview Questions & Answers

---

## SECTION A — Tailwind CSS

**Q1. What is Tailwind CSS? How is it different from Bootstrap?**
A: Tailwind: utility-first CSS framework. Pre-built utility classes for every CSS property.
   `className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg"`
   Bootstrap: component-based. Pre-built styled components (`.btn`, `.card`, `.navbar`).
   
   Tailwind pros: no naming (no BEM), no specificity wars, tree-shaken (only used classes in bundle), easy to customize.
   Tailwind cons: long class strings, learning the class names, needs PostCSS setup.
   Bootstrap pros: ready components, less to write initially.
   Bootstrap cons: hard to customize, generic look, large CSS bundle.

**Q2. How does Tailwind's purging/tree-shaking work?**
A: In production builds, Tailwind scans all files (configured in `content` in tailwind.config.js).
   It REMOVES any Tailwind classes that aren't used in your code.
   Result: tiny CSS file (often < 10KB) instead of the full Tailwind bundle (3MB+).
   NEVER dynamically construct class names: `className={\`text-${color}-500\`}` — color string not in source → purged.
   Use full class names: `{positive ? "text-green-500" : "text-red-500"}` — both strings present in source.

**Q3. What is the difference between `flex` and `grid` in Tailwind?**
A: `flex` → flexbox. 1D layout. `flex-row` or `flex-col`. Good for: navbar, button groups, card rows.
   `grid` → CSS Grid. 2D layout. `grid-cols-3` for 3-column grid. Good for: dashboard, image gallery, page layouts.
   Common flex classes: `flex`, `flex-col`, `items-center`, `justify-between`, `gap-4`, `flex-1`, `flex-wrap`.
   Common grid classes: `grid`, `grid-cols-3`, `col-span-2`, `gap-6`, `place-items-center`.

**Q4. What are Tailwind breakpoints and how do you use them?**
A: Responsive prefixes: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+), `2xl:` (1536px+).
   Mobile-first: base class applies to all sizes. Prefixed class applies from that breakpoint up.
   `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"` — 1 col mobile, 2 tablet, 3 desktop.
   `className="text-sm md:text-base lg:text-lg"` — responsive text size.

**Q5. What are Tailwind plugins and the `@apply` directive?**
A: `@apply` → extract repeated Tailwind classes into a CSS class (for DRY reuse).
   ```css
   /* In global.css */
   .btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors; }
   ```
   Use sparingly — the point of Tailwind is inline utilities. Only extract when the same combo repeats many times.
   Plugins: extend Tailwind with custom utilities, components, or base styles.
   `tailwindcss/forms` — better default form styles.
   `tailwindcss/typography` — `prose` class for rich text formatting.
   `tailwindcss/aspect-ratio` — aspect ratio utilities.

---

## SECTION B — shadcn/ui

**Q6. What is shadcn/ui? Is it a component library?**
A: NOT a traditional library — it's a collection of COPY-PASTE React components built on:
   - Radix UI (headless, accessible primitives)
   - Tailwind CSS (styling)
   
   Traditional library: `npm install @chakra-ui/react` → opaque dependency, hard to customize.
   shadcn/ui: `npx shadcn-ui@latest add button` → copies component SOURCE CODE into your project.
   
   Benefits: full ownership, full customization, no dependency to update/break, learn from the code.
   Radix provides: accessibility (ARIA, keyboard nav), unstyled. Tailwind provides: visual style.

**Q7. What is Radix UI? Why is it used as the foundation?**
A: Radix UI provides HEADLESS (unstyled) accessible UI primitives.
   Handles everything accessibility-related: ARIA attributes, keyboard navigation, focus management,
   screen reader announcements — all without any styles.
   Examples: Dialog, DropdownMenu, Select, Tabs, Accordion, Tooltip, Popover.
   You bring your own styles (Tailwind in shadcn's case).
   Why: accessibility is HARD to get right. Radix does it correctly. You don't have to.

**Q8. How do you customize a shadcn/ui component?**
A: Since the component is IN your codebase (not in node_modules):
   1. Open the component file (e.g., `components/ui/button.tsx`).
   2. Modify the Tailwind classes in the `cva` (class-variance-authority) definition.
   3. Add new variants, change sizes, add new props.
   You have 100% control. No fighting against library styles.
   
   The `cn()` utility (clsx + tailwind-merge): merges Tailwind classes intelligently.
   `cn("px-4 text-sm", isActive && "bg-blue-500", className)` — handles conflicts, conditionals.

---

## SECTION C — Framer Motion

**Q9. What is Framer Motion?**
A: Production-quality animation library for React. Declarative API, physics-based animations.
   Core: replace HTML elements with `motion.div`, `motion.button` etc.
   Add `animate`, `initial`, `exit`, `transition` props → animations happen automatically.
   `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>`

**Q10. What is `AnimatePresence`? When is it needed?**
A: AnimatePresence enables animations for components being REMOVED from the DOM.
   React normally removes elements instantly. AnimatePresence waits for exit animation first.
   ```jsx
   <AnimatePresence>
     {isVisible && (
       <motion.div
         key="modal"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}    // This runs before removal
       >
         <Modal />
       </motion.div>
     )}
   </AnimatePresence>
   ```
   Use for: modals, toasts, page transitions, list item removal.

**Q11. What are motion variants?**
A: Named animation states that can be shared across multiple elements.
   ```jsx
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
   };
   const itemVariants = {
     hidden: { y: 20, opacity: 0 },
     visible: { y: 0, opacity: 1 },
   };
   
   <motion.ul variants={containerVariants} initial="hidden" animate="visible">
     {items.map(item => (
       <motion.li key={item.id} variants={itemVariants}>{item.name}</motion.li>
     ))}
   </motion.ul>
   ```
   `staggerChildren` → each child animates in sequence with a delay. Beautiful list animations.

**Q12. When should you NOT use animations?**
A: When: users have `prefers-reduced-motion` enabled (vestibular disorders, epilepsy).
   Always respect this:
   ```css
   @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; } }
   ```
   Framer Motion has built-in support: `useReducedMotion()` hook.
   Also avoid: animations that delay user interaction, excessive/distracting animations, animations on every element.
   Animate purposefully: guide attention, provide feedback, create continuity.
