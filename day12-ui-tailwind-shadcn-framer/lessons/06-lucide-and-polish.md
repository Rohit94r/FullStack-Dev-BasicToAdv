# ============================================================
# DAY 12 — LESSON 6: LUCIDE ICONS + UI POLISH
# Interview Level: Beginner → Intermediate
# Time: ~45 min
# ============================================================

Professional UIs use consistent iconography, empty states, skeleton
loaders, and dark mode. This lesson ties the polish together.

─────────────────────────────────────────────────────────────
## SECTION 1: LUCIDE REACT
─────────────────────────────────────────────────────────────

Lucide is the icon set shadcn uses (fork of Feather Icons).

```bash
npm install lucide-react
```

```tsx
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Search,
  Moon,
  Sun,
  PackageOpen,
} from "lucide-react";

<Button size="icon" variant="outline">
  <ShoppingCart className="h-4 w-4" />
</Button>

<span className="flex items-center gap-2">
  <Search className="h-4 w-4 text-muted-foreground" />
  <input ... />
</span>
```

**Sizing convention:** `h-4 w-4` inline with text, `h-5 w-5` in buttons,
`h-8 w-8` or larger for empty states.

Browse all icons: https://lucide.dev/icons/

─────────────────────────────────────────────────────────────
## SECTION 2: DARK MODE TOGGLE (complete pattern)
─────────────────────────────────────────────────────────────

```tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

Place in Navbar. shadcn CSS variables handle the rest.

─────────────────────────────────────────────────────────────
## SECTION 3: EMPTY STATES
─────────────────────────────────────────────────────────────

Never show a blank screen. Empty cart example:

```tsx
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">Your cart is empty</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        Looks like you haven't added anything yet. Browse our products
        and find something you love.
      </p>
      <Button asChild>
        <Link to="/">Start shopping</Link>
      </Button>
    </div>
  );
}
```

Empty states need: icon, headline, helpful description, CTA.

─────────────────────────────────────────────────────────────
## SECTION 4: LOADING STATES (beyond skeleton)
─────────────────────────────────────────────────────────────

```tsx
import { Loader2 } from "lucide-react";

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

Spinner + disabled button = clear feedback during async actions.

─────────────────────────────────────────────────────────────
## SECTION 5: BADGES & STATUS INDICATORS
─────────────────────────────────────────────────────────────

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="secondary">{product.category}</Badge>
<Badge variant="destructive">Out of stock</Badge>

{/* Cart count badge on icon */}
<div className="relative">
  <ShoppingCart className="h-5 w-5" />
  {count > 0 && (
    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
      {count}
    </span>
  )}
</div>
```

─────────────────────────────────────────────────────────────
## SECTION 6: RESPONSIVE MOBILE NAV
─────────────────────────────────────────────────────────────

```tsx
{/* Desktop nav */}
<nav className="hidden md:flex items-center gap-6">...</nav>

{/* Mobile bottom bar */}
<nav className="fixed bottom-0 inset-x-0 md:hidden border-t bg-background flex justify-around py-2">
  <Button variant="ghost" size="sm" className="flex-col h-auto gap-1">
    <Search className="h-5 w-5" />
    <span className="text-xs">Shop</span>
  </Button>
  <Button variant="ghost" size="sm" className="flex-col h-auto gap-1">
    <ShoppingCart className="h-5 w-5" />
    <span className="text-xs">Cart</span>
  </Button>
</nav>
```

Add `pb-16` to main content so bottom nav doesn't overlap.

─────────────────────────────────────────────────────────────
## SECTION 7: POLISH CHECKLIST
─────────────────────────────────────────────────────────────

Before calling UI "done":

- [ ] Consistent spacing (`gap-4`, `p-6` everywhere)
- [ ] Icons on all interactive elements where helpful
- [ ] Hover + focus states on every clickable element
- [ ] Loading skeletons (not spinners alone for content)
- [ ] Empty states with CTA
- [ ] Dark mode works (test both)
- [ ] Mobile layout tested (375px width)
- [ ] `prefers-reduced-motion` respected

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

Polish your cart:
1. Replace all emoji/text icons with Lucide
2. Add EmptyCart component
3. Add ThemeToggle to Navbar
4. Add mobile bottom navigation
5. Run through polish checklist above

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: Why Lucide over Font Awesome?**
A: Tree-shakeable (import only icons used), consistent stroke style,
   first-class React components, matches shadcn ecosystem.

**Q: What makes an empty state effective?**
A: Clear icon, explains WHY it's empty, tells user WHAT to do next (CTA).

**Q: Dark mode implementation with Tailwind + shadcn?**
A: Toggle `dark` class on `<html>`, CSS variables swap colors,
   components use semantic tokens automatically.
