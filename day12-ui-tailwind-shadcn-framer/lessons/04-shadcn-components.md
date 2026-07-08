# ============================================================
# DAY 12 — LESSON 4: shadcn/ui COMPONENTS
# Interview Level: Intermediate
# Time: ~90 min
# ============================================================

This lesson covers the shadcn components you'll use daily in the
Day 11 cart upgrade and all future projects.

─────────────────────────────────────────────────────────────
## SECTION 1: BUTTON — variants and sizes
─────────────────────────────────────────────────────────────

```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link style</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Loading...</Button>
```

Use `asChild` to render as a link:

```tsx
import { Link } from "react-router-dom";

<Button asChild>
  <Link to="/cart">View cart</Link>
</Button>
```

─────────────────────────────────────────────────────────────
## SECTION 2: CARD — product cards, stats, forms
─────────────────────────────────────────────────────────────

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card className="overflow-hidden">
  <img src={product.image} alt="" className="h-48 w-full object-contain p-4" />
  <CardHeader>
    <CardTitle className="line-clamp-2">{product.title}</CardTitle>
    <CardDescription>${product.price}</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button className="w-full" onClick={onAdd}>Add to cart</Button>
  </CardFooter>
</Card>
```

─────────────────────────────────────────────────────────────
## SECTION 3: DIALOG — confirm destructive actions
─────────────────────────────────────────────────────────────

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Clear cart</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Clear your cart?</DialogTitle>
      <DialogDescription>
        This removes all items. This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive" onClick={clearCart}>Clear</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

─────────────────────────────────────────────────────────────
## SECTION 4: SHEET — slide-out cart drawer
─────────────────────────────────────────────────────────────

Perfect for mobile cart without leaving the product page:

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Cart (3)</Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-full sm:max-w-md">
    <SheetHeader>
      <SheetTitle>Your cart</SheetTitle>
    </SheetHeader>
    {/* Cart items here */}
  </SheetContent>
</Sheet>
```

─────────────────────────────────────────────────────────────
## SECTION 5: DROPDOWN MENU — user menu, sort options
─────────────────────────────────────────────────────────────

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Sort ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setSort("price-asc")}>
      Price: low to high
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setSort("price-desc")}>
      Price: high to low
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

─────────────────────────────────────────────────────────────
## SECTION 6: TOAST — feedback after actions
─────────────────────────────────────────────────────────────

```bash
npx shadcn@latest add toast
npx shadcn@latest add sonner   # alternative — many prefer sonner
```

```tsx
// App root — add Toaster once
import { Toaster } from "@/components/ui/toaster";

// In component:
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

function handleAdd() {
  dispatch(addItem(product));
  toast({
    title: "Added to cart",
    description: product.title,
  });
}
```

─────────────────────────────────────────────────────────────
## SECTION 7: SKELETON — loading states
─────────────────────────────────────────────────────────────

```tsx
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
    </Card>
  );
}

// In ProductList while isLoading:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {Array.from({ length: 6 }).map((_, i) => (
    <ProductCardSkeleton key={i} />
  ))}
</div>
```

─────────────────────────────────────────────────────────────
## SECTION 8: FORM + react-hook-form (optional deep dive)
─────────────────────────────────────────────────────────────

```bash
npx shadcn@latest add form
npm install react-hook-form @hookform/resolvers zod
```

shadcn Form wraps react-hook-form with accessible labels and errors.
Use for coupon code, checkout, login forms.

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

In your cart project, replace:
1. Raw product divs → `Card` components
2. "Clear cart" button → `Dialog` confirmation
3. Navbar cart link → `Sheet` drawer on mobile
4. Add to cart → `toast()` notification
5. Loading state → `Skeleton` grid

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: Why Sheet vs Dialog?**
A: Sheet slides from edge (great for cart, filters, mobile nav).
   Dialog centers on screen (confirmations, forms).

**Q: How does shadcn ensure accessibility?**
A: Radix primitives handle focus trap, ESC to close, ARIA roles,
   keyboard navigation. shadcn adds visual styling.

**Q: Toast vs inline alert?**
A: Toast = transient global feedback (item added). Inline alert =
   persistent context-specific message (form validation error).
