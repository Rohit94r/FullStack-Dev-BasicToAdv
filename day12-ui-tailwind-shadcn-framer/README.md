# DAY 12 — Modern UI: Tailwind + shadcn/ui + lucide + framer-motion

## Today's Goal
Make things BEAUTIFUL fast. Tailwind utility classes, shadcn components,
lucide icons, framer-motion animations — the modern frontend toolkit.

## Content Ready
All **6 lesson files** in `lessons/` and the **UI upgrade guide** in `project/ui-upgrade-guide.md` are pre-built. Follow the guide to upgrade your Day 11 cart.

## Morning Revision (2 hr)
From memory: write a Redux slice with 3 actions + a component using
useSelector/useDispatch. Explain the Redux flow out loud.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-tailwind-fundamentals.md` | Utility-first thinking, spacing/color scales, hover/focus variants, responsive prefixes | 75 min |
| 2 | `02-tailwind-layouts.tsx` | Flexbox/grid utilities, common layouts rebuilt from Day 1 in Tailwind | 60 min |
| 3 | `03-shadcn-setup.md` | What shadcn IS (copy-paste components, not a library!), CLI, theming with CSS variables | 45 min |
| 4 | `04-shadcn-components.tsx` | Button, Card, Dialog, Dropdown, Toast, Form + react-hook-form integration | 90 min |
| 5 | `05-framer-motion.tsx` | motion components, animate/initial/exit, variants, layout animations, AnimatePresence | 75 min |
| 6 | `06-lucide-and-polish.tsx` | Icon usage, dark mode toggle, skeleton loaders, empty states | 45 min |

## Project (6 hours): Upgrade Day 11 Shopping Cart → Production UI
Not a new project — REBUILD the cart UI to look like a real product:

- [ ] Install + configure Tailwind and shadcn in the Day 11 project
- [ ] Navbar: shadcn DropdownMenu (user menu) + cart Sheet (slide-out drawer)
- [ ] Product cards: hover lift + image zoom (framer-motion whileHover)
- [ ] Add-to-cart: button micro-animation + Toast notification
- [ ] Cart items: AnimatePresence exit animations when removing
- [ ] Product grid: staggered entrance animation (variants)
- [ ] Dialog: confirm before clearing cart
- [ ] Skeleton loaders while products fetch
- [ ] Dark mode toggle (persisted)
- [ ] Fully responsive: mobile bottom nav, tablet, desktop
- [ ] Empty cart state with illustration + lucide icons everywhere

## Tonight's Notes
- Tailwind: why utility-first beats custom CSS at scale (and when it doesn't)
- What makes shadcn different from Material UI/Chakra
- framer-motion: initial/animate/exit — one line each
- The spacing scale: what p-4, gap-6, mt-8 mean in px

## Interview Questions
1. Pros/cons of Tailwind vs plain CSS vs CSS-in-JS?
2. How does shadcn/ui differ from a component library?
3. How do you implement dark mode with Tailwind?
4. What is AnimatePresence for?
5. How do you make animations accessible (prefers-reduced-motion)?
