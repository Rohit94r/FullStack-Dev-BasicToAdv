# ============================================================
# DAY 12 — LESSON 3: shadcn/ui SETUP
# Interview Level: Beginner → Intermediate
# Time: ~45 min
# ============================================================

## What shadcn/ui IS (and is NOT)

**shadcn/ui is NOT an npm component library** like Material UI or Chakra.
You don't `import { Button } from '@shadcn/ui'`.

Instead, shadcn is a **collection of copy-paste components** built on:
- **Radix UI** — accessible, unstyled primitives (Dialog, Dropdown, etc.)
- **Tailwind CSS** — styling
- **class-variance-authority (cva)** — variant props (`size="sm"`)
- **tailwind-merge + clsx** — merge class names safely

**Analogy:** shadcn gives you IKEA furniture parts + instructions. The
components live IN YOUR codebase (`src/components/ui/`), so you own
and customize them forever.

─────────────────────────────────────────────────────────────
## SECTION 1: INIT IN EXISTING VITE PROJECT
─────────────────────────────────────────────────────────────

From your Day 11 shopping cart folder:

```bash
# 1. Ensure Tailwind is set up (see Lesson 1)

# 2. Init shadcn (follow prompts — pick "Vite", "TypeScript", default paths)
npx shadcn@latest init
```

You'll be asked:
- Style: **Default** or New York
- Base color: **Slate** or Zinc
- CSS variables: **Yes** (enables theming + dark mode)

This creates:
```
src/
├── components/ui/     ← components get added here
├── lib/utils.ts         ← cn() helper
└── index.css            ← CSS variables for theming
```

─────────────────────────────────────────────────────────────
## SECTION 2: ADD COMPONENTS (one at a time)
─────────────────────────────────────────────────────────────

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add input
npx shadcn@latest add badge
```

Each command **copies source files** into `src/components/ui/`.
You can edit them directly — that's the point!

─────────────────────────────────────────────────────────────
## SECTION 3: THE `cn()` HELPER
─────────────────────────────────────────────────────────────

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Use it to merge Tailwind classes without conflicts:

```tsx
<Button className={cn("w-full", isLoading && "opacity-50")} />
```

─────────────────────────────────────────────────────────────
## SECTION 4: THEMING WITH CSS VARIABLES
─────────────────────────────────────────────────────────────

shadcn uses HSL CSS variables in `index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

Components use `bg-background text-foreground` — swap variables,
entire app re-themes.

### Dark mode toggle pattern

```tsx
// Toggle class on <html>
document.documentElement.classList.toggle("dark");
// Persist with localStorage
```

Or use `next-themes` in Next.js projects (Day 13+).

─────────────────────────────────────────────────────────────
## SECTION 5: PATH ALIASES
─────────────────────────────────────────────────────────────

shadcn expects `@/` imports. In `vite.config.ts`:

```ts
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") },
},
```

In `tsconfig.json`:
```json
"paths": { "@/*": ["./src/*"] }
```

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

1. Run `shadcn init` in your cart project
2. Add `button`, `card`, `badge`
3. Replace one raw `<button>` with `<Button variant="outline">`
4. Toggle dark mode on `<html>` and verify Card colors change

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: How is shadcn different from MUI/Chakra?**
A: shadcn copies source into your repo (you own it). MUI/Chakra are
   npm packages with fixed APIs. shadcn = full customization, no version lock-in.

**Q: What is Radix UI's role?**
A: Provides accessible, keyboard-navigable, WAI-ARIA-compliant
   unstyled primitives. shadcn styles them with Tailwind.

**Q: Why CSS variables for theming?**
A: One place to change colors. Components reference semantic tokens
   (`primary`, `muted`) not hard-coded hex values.

**Q: Can you modify shadcn components?**
A: Yes — they're YOUR files. Edit freely. Re-running `add` may overwrite
   unless you use `--overwrite` carefully.
