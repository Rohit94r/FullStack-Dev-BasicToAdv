# Day 10 — React Basics Interview Questions & Answers

---

## SECTION A — React Core Concepts

**Q1. What is React? What problem does it solve?**
A: React is a JavaScript LIBRARY for building user interfaces.
   Problem it solves: DOM manipulation is slow and complex. Managing state that's reflected in UI is hard.
   React's approach: Virtual DOM + declarative component model.
   You describe WHAT the UI should look like for a given state.
   React figures out HOW to update the real DOM efficiently.
   Key: React = View layer only. You add router, state, etc. separately.

**Q2. What is the Virtual DOM? How does it help performance?**
A: Virtual DOM = in-memory JavaScript representation of the real DOM tree.
   When state changes:
   1. React re-renders component → creates new Virtual DOM tree.
   2. Compares new tree with old tree (DIFFING / reconciliation).
   3. Calculates minimum changes needed.
   4. Updates ONLY changed parts of real DOM (patching).
   Why faster: real DOM operations are expensive. Batch updating only what changed is much faster than re-rendering everything.
   React 18+ uses concurrent rendering to prioritize updates.

**Q3. What is JSX?**
A: JSX = JavaScript XML. Syntax extension that looks like HTML inside JavaScript.
   `const el = <h1 className="title">Hello {name}!</h1>;`
   Browsers don't understand JSX — Babel/transpiler converts it to:
   `const el = React.createElement("h1", { className: "title" }, "Hello ", name, "!");`
   Rules: use `className` not `class`, `htmlFor` not `for`, self-close empty tags `<img />`.
   Must have one root element per JSX block (or use `<>` Fragment).

**Q4. What is the difference between state and props?**
A: props → data passed FROM parent TO child. Read-only in child. Like function arguments.
   state → data OWNED by the component. Mutable via setState/useState. Triggers re-render when changed.
   
   Parent passes props down. Children emit events up (via callback props).
   State is local. If multiple components need it: "lift state up" to common ancestor, or use context/Redux.

**Q5. What happens when you call `setState` / update state in React?**
A: 1. State update is QUEUED (not immediate — React may batch multiple updates).
   2. React schedules a RE-RENDER of the component and its children.
   3. React calls the function component again (or render() for class components).
   4. New Virtual DOM is produced.
   5. React diffs old vs new Virtual DOM.
   6. Real DOM is updated with minimal changes.
   
   State updates are ASYNCHRONOUS — don't rely on state being updated immediately after setState.
   `const [count, setCount] = useState(0); setCount(count + 1); console.log(count); // Still 0!`

---

## SECTION B — Hooks

**Q6. What is `useState`? What does it return?**
A: Hook for adding state to functional components.
   `const [value, setValue] = useState(initialValue);`
   Returns a TUPLE: [currentValue, setterFunction].
   Calling setValue triggers a re-render with the new value.
   Initial value only used on first render. For expensive initial values: `useState(() => compute())`.
   
   Functional updates: when new state depends on old state, use functional form:
   `setCount(prev => prev + 1)` — always gets the latest value, safe for batched updates.

**Q7. What is `useEffect`? What are its 3 forms?**
A: Hook for side effects: data fetching, subscriptions, manual DOM manipulation, timers.
   Runs AFTER render (not during).
   3 forms:
   1. No deps: `useEffect(() => { ... })` → runs after EVERY render.
   2. Empty deps: `useEffect(() => { ... }, [])` → runs only after FIRST render (componentDidMount equivalent).
   3. With deps: `useEffect(() => { ... }, [dep1, dep2])` → runs after first render AND when deps change.
   
   Cleanup: return a function to clean up: `return () => clearInterval(timer)` — runs before next effect or unmount.

**Q8. What is the exhaustive deps rule for useEffect?**
A: The linter rule says: include ALL values used inside useEffect in the dependency array.
   If you use `user.id` inside the effect, add `user.id` to deps.
   Why: if deps is missing values, effect won't re-run when they change → stale closure bug.
   `// eslint-disable-next-line react-hooks/exhaustive-deps` is a red flag — fix the deps instead.

**Q9. What is `useRef`? When do you use it instead of `useState`?**
A: useRef returns an object with a `.current` property that persists across renders.
   Key: changing `.current` does NOT trigger re-render.
   Use cases:
   - Accessing DOM elements: `const inputRef = useRef(); inputRef.current.focus()`
   - Storing previous values: `const prevCount = useRef(count);`
   - Storing timer/subscription IDs without causing re-renders.
   - Mutable value that doesn't affect UI (tracking if mounted, counting renders).
   
   If you need UI to update: use useState. If you need persistent mutable value without re-render: use useRef.

**Q10. What is `useCallback`? What is `useMemo`?**
A: useMemo → memoizes the RESULT of a computation. Returns cached value until deps change.
             `const sortedList = useMemo(() => [...list].sort(), [list]);`
             Use when: expensive computation that shouldn't run on every render.
   
   useCallback → memoizes the FUNCTION REFERENCE itself. Returns same function until deps change.
                `const handleClick = useCallback(() => setCount(c => c+1), []);`
                Use when: passing callback to memoized child component (prevents child re-render).
   
   IMPORTANT: Don't over-optimize. Memoization has a cost. Only use when you have a measured performance problem.

---

## SECTION C — Component Patterns

**Q11. What is the React component lifecycle?**
A: Functional components with hooks:
   Mount   → component renders for first time. useEffect(fn, []) runs after.
   Update  → state/props change → re-render. useEffect(fn, [deps]) runs when deps change.
   Unmount → component removed from DOM. useEffect cleanup function runs.
   
   Equivalent hooks: componentDidMount → useEffect(fn, [])
                     componentDidUpdate → useEffect(fn, [deps])
                     componentWillUnmount → return () => cleanup inside useEffect

**Q12. What is conditional rendering in React?**
A: Rendering different content based on conditions.
   Methods:
   1. `if/else` with early return: `if (!user) return <Loading />;`
   2. Ternary: `{isLoggedIn ? <Dashboard /> : <Login />}`
   3. `&&` short-circuit: `{error && <ErrorBanner message={error} />}`
      WARNING: `{count && <Component />}` — if count=0, renders "0" (falsy but truthy). Use `{count > 0 && <Component />}`.
   4. Switch/object map for multiple conditions.

**Q13. What is a key in React lists? Why is it important?**
A: Key is a special string prop that helps React identify which items changed/added/removed.
   Without key: React can't efficiently diff list changes. May re-render wrong items.
   Key must be UNIQUE among siblings. Stable (same key = same item across renders).
   
   BAD: `key={index}` — reordering causes wrong keys. Causes bugs with forms and animations.
   GOOD: `key={item.id}` — stable, unique from database.
   WORST: No key at all — React warns, slow performance.

**Q14. What is component composition?**
A: Building complex UIs by combining smaller components. The React way.
   Prefer composition over inheritance.
   Patterns:
   - Children prop: `<Card><Button /></Card>` — Card renders `{children}`
   - Render props: pass render function as prop
   - Higher-Order Components (HOC): function that wraps component → returns enhanced component
   - Compound components (advanced): shared state via context

---

## SECTION D — State Management

**Q15. What is prop drilling? How do you solve it?**
A: Prop drilling = passing props through many intermediate components that don't need them.
   `App → Page → Section → Row → Cell → TargetComponent`
   Middle components pass props they don't use. Pain to maintain.
   
   Solutions:
   1. React Context — built-in solution for global/semi-global state.
   2. Redux Toolkit — for complex, frequently changing, shared state.
   3. Zustand — lightweight alternative to Redux.
   4. Component composition — restructure components to avoid the drill.
   5. react-query/TanStack Query — for server state (avoid prop drilling for API data).

**Q16. What is React Context?**
A: Built-in mechanism to share values across component tree without explicit prop passing.
   ```jsx
   const ThemeContext = createContext("light");
   
   function App() {
     return (
       <ThemeContext.Provider value="dark">
         <DeepChild />  {/* Can access "dark" without props */}
       </ThemeContext.Provider>
     );
   }
   
   function DeepChild() {
     const theme = useContext(ThemeContext);  // "dark"
     return <div className={theme}>...</div>;
   }
   ```
   Use for: theme, language/i18n, auth user, settings.
   DON'T use for: frequently changing data (every context consumer re-renders on change).

---

## SECTION E — Performance

**Q17. When does a React component re-render?**
A: A component re-renders when:
   1. Its own STATE changes.
   2. Its PARENT re-renders (unless memoized).
   3. Its PROPS change.
   4. Its context value changes (if it uses useContext).
   
   Children of a re-rendering parent also re-render by default.
   Prevent unnecessary re-renders: React.memo() for components, useMemo for values, useCallback for functions.

**Q18. What is `React.memo`?**
A: HOC that memoizes a component. Skips re-rendering if props haven't changed (shallow comparison).
   `const MemoizedComponent = React.memo(MyComponent);`
   Without memo: parent re-renders → child re-renders even if same props.
   With memo: child only re-renders if props actually changed.
   
   Problem: functions create new reference on every render → memo thinks props changed.
   Solution: wrap function props with useCallback too.
   
   Don't over-use — memo has cost. Profile first.

**Q19. What is React Strict Mode?**
A: `<React.StrictMode>` wrapper. Development-only feature. Doesn't affect production.
   Does: double-invokes render and effects to detect side effects.
   Warns about: deprecated APIs, unexpected side effects, missing keys.
   Useful for: catching bugs early. Keep it on in development.

**Q20. What is the difference between controlled and uncontrolled components?**
A: Controlled → form state managed by React (useState). Value prop + onChange handler.
               `<input value={name} onChange={e => setName(e.target.value)} />`
               React is the single source of truth. Easy to validate/transform input.
   Uncontrolled → form state lives in the DOM. Access with useRef.
                  `<input ref={inputRef} defaultValue="initial" />`
                  `inputRef.current.value` on submit.
   Prefer controlled for: validation, formatting, derived values.
   Use uncontrolled for: file inputs (must be uncontrolled), performance-critical forms.
