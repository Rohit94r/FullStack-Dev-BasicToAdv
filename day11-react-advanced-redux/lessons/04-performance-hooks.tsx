/*
─────────────────────────────────────────────────────────────
 LESSON 4 — PERFORMANCE HOOKS
 LEVEL : Intermediate → Advanced
 TOPIC : useMemo, useCallback, React.memo — when they help,
         when they're useless (premature optimization trap)
─────────────────────────────────────────────────────────────

 THE PROBLEM
 React re-renders a component when its state or props change.
 Sometimes that re-render is expensive (heavy computation) or
 causes unnecessary child re-renders (new function/object refs).

 THE THREE TOOLS
 1. useMemo     — memoize a COMPUTED VALUE
 2. useCallback — memoize a FUNCTION reference
 3. React.memo  — skip re-render if props are shallow-equal

 GOLDEN RULE: Don't optimize until you MEASURE a problem.
 These hooks add complexity. Most components don't need them.
*/

import {
  memo,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────
// 1. useMemo — expensive computation
// ─────────────────────────────────────────────────────────

function ExpensiveList({ items }: { items: number[] }) {
  // Without useMemo: filters on EVERY render (even unrelated state changes)
  // With useMemo: only recalculates when `items` changes
  const sortedEvens = useMemo(() => {
    console.log("Computing sorted evens...");
    return items.filter((n) => n % 2 === 0).sort((a, b) => a - b);
  }, [items]);

  return (
    <ul>
      {sortedEvens.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────
// 2. useCallback — stable function reference for memoized children
// ─────────────────────────────────────────────────────────

type ItemProps = {
  id: number;
  label: string;
  onRemove: (id: number) => void;
};

// React.memo: skip re-render if props haven't changed (shallow compare)
const MemoizedItem = memo(function Item({ id, label, onRemove }: ItemProps) {
  console.log(`Rendering item ${id}`);
  return (
    <div>
      {label}
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
});

function ItemList() {
  const [items, setItems] = useState([
    { id: 1, label: "Apple" },
    { id: 2, label: "Banana" },
  ]);
  const [count, setCount] = useState(0);

  // ❌ WITHOUT useCallback: new function every render → MemoizedItem
  //    always re-renders because onRemove reference changed
  // ✅ WITH useCallback: same function reference unless deps change
  const handleRemove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>
        Unrelated count: {count}
      </button>
      {items.map((item) => (
        <MemoizedItem
          key={item.id}
          id={item.id}
          label={item.label}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. When NOT to use these hooks
// ─────────────────────────────────────────────────────────

function SimpleCounter() {
  const [n, setN] = useState(0);

  // ❌ USELESS: adding 1 is not expensive
  const doubled = useMemo(() => n * 2, [n]);

  // ❌ USELESS: no memoized child depends on this
  const increment = useCallback(() => setN((c) => c + 1), []);

  return (
    <button onClick={increment}>
      {n} × 2 = {doubled}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// TODO: Memoize a ProductCard with React.memo. Parent passes
//       product + onAddToCart. Use useCallback in parent.
// YOUR IDEA:


// ─── ANSWER ───
type Product = { id: number; title: string; price: number };

const ProductCard = memo(function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: number) => void;
}) {
  return (
    <div>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAdd(product.id)}>Add</button>
    </div>
  );
});

function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [products, filter]
  );

  const handleAdd = useCallback((id: number) => {
    console.log("Added", id);
  }, []);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={handleAdd} />
      ))}
    </div>
  );
}

export default function Lesson04Demo() {
  const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
  return (
    <main>
      <ExpensiveList items={numbers} />
      <ItemList />
      <SimpleCounter />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: useMemo vs useCallback?
 A: useMemo caches a VALUE (result of computation).
    useCallback caches a FUNCTION reference. useCallback(fn, deps)
    is equivalent to useMemo(() => fn, deps).

 Q: What does React.memo do?
 A: Wraps a component to skip re-render if props are shallow-equal
    to the previous render's props.

 Q: When should you NOT use these?
 A: Simple components, cheap computations, no memoized children.
    Premature optimization adds bugs and complexity.

 Q: Does useMemo guarantee no re-computation?
 A: React may discard the cache (e.g. if deps array is wrong).
    It's a performance hint, not a semantic guarantee.

 Q: Why do new object/function props break React.memo?
 A: React.memo uses shallow comparison. {} !== {} every render,
    so the child always re-renders unless you stabilize refs
    with useMemo/useCallback.
─────────────────────────────────────────────────────────────
*/
