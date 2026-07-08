/*
─────────────────────────────────────────────────────────────
 LESSON 1 — CUSTOM HOOKS
 LEVEL : Intermediate (you know useState, useEffect from Day 10)
 TOPIC : Extract reusable logic into hooks: useLocalStorage,
         useFetch, useDebounce — naming rules, composition
─────────────────────────────────────────────────────────────

 WHAT IS A CUSTOM HOOK?
 A function whose name starts with "use" and that calls other hooks.
 It lets you share STATEFUL logic between components without
 copy-pasting useState/useEffect blocks.

 Rules:
 1. Name MUST start with "use" (useLocalStorage, not getLocalStorage)
 2. Can call useState, useEffect, other custom hooks
 3. Each component that calls your hook gets its OWN independent state
 4. Return whatever makes sense: value, setter, object, array

 Analogy: a custom hook is a recipe card. Every kitchen (component)
 that follows the recipe gets its own pot (state), not a shared one.
*/

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────
// 1. useLocalStorage — sync state with localStorage
// ─────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initializer: read from localStorage ONCE on first render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

// Usage example:
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current: {theme}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// 2. useFetch — generic data fetching hook
// ─────────────────────────────────────────────────────────

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true; // ignore stale responses if url changes
    };
  }, [url, trigger]);

  return { data, loading, error, refetch };
}

// ─────────────────────────────────────────────────────────
// 3. useDebounce — delay expensive updates (search, API calls)
// ─────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function SearchDemo() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Only fetch when debouncedQuery changes (not every keystroke)
  const { data, loading } = useFetch<{ title: string }[]>(
    debouncedQuery
      ? `https://fakestoreapi.com/products?limit=5`
      : "" // skip fetch when empty — you'd guard in real code
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {loading && <p>Loading...</p>}
      {data?.map((p) => (
        <p key={p.title}>{p.title}</p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TODO: Build useToggle(initial) → [value, toggle, setValue]
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER (only look after trying!) ───
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue] as const;
}

// ─────────────────────────────────────────────────────────
// TODO: Build useWindowSize() → { width, height }
// YOUR IDEA:


// ─── ANSWER ───
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

export default function Lesson01Demo() {
  return (
    <main>
      <ThemeToggle />
      <SearchDemo />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What makes a function a "custom hook"?
 A: It starts with "use" and calls at least one React hook inside.
    It shares stateful logic, not state itself — each caller gets
    independent state.

 Q: Can you call hooks inside regular functions?
 A: No. Hooks only work at the top level of React components or
    other custom hooks (Rules of Hooks).

 Q: Custom hook vs utility function?
 A: Utility functions are pure helpers (formatDate). Custom hooks
    use React hooks and manage state/effects/lifecycle.

 Q: Why useDebounce?
 A: To avoid firing expensive operations (API calls, filtering)
    on every keystroke. Wait until the user pauses typing.

 Q: Why return [value, setValue] as const?
 A: TypeScript infers a readonly tuple instead of a mutable array,
    giving better autocomplete and type safety.
─────────────────────────────────────────────────────────────
*/
