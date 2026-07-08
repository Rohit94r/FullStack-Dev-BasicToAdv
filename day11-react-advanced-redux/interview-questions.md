# Day 11 — React Advanced & Redux Toolkit Interview Questions & Answers

---

## SECTION A — Advanced Hooks

**Q1. What is `useReducer`? When to use it over `useState`?**
A: `useReducer(reducer, initialState)` → like Redux but local to a component.
   Returns `[state, dispatch]`.
   reducer = `(state, action) => newState` — pure function.
   
   Use when:
   - Multiple sub-values that change together.
   - Next state depends on previous state in complex ways.
   - Complex state logic (toggle, reset, multiple actions).
   - State transitions are more readable as named actions.
   `useState` is fine for simple values. `useReducer` for complex state machines.

**Q2. What is the `useContext` + `useReducer` pattern?**
A: Combine them to build a lightweight global state (poor-man's Redux):
   ```jsx
   const StateContext = createContext(null);
   const DispatchContext = createContext(null);
   
   function AppProvider({ children }) {
     const [state, dispatch] = useReducer(reducer, initialState);
     return (
       <StateContext.Provider value={state}>
         <DispatchContext.Provider value={dispatch}>
           {children}
         </DispatchContext.Provider>
       </StateContext.Provider>
     );
   }
   ```
   Separating state and dispatch contexts: dispatch consumers don't re-render when state changes.

**Q3. What is `useImperativeHandle`?**
A: Customizes what is exposed when parent uses `ref` on a child component.
   Combined with `forwardRef`.
   Use for: exposing imperative APIs from a component (focus, scroll, play/pause).
   ```jsx
   const Input = forwardRef((props, ref) => {
     const inputRef = useRef();
     useImperativeHandle(ref, () => ({
       focus: () => inputRef.current.focus(),
       clear: () => { inputRef.current.value = ""; }
     }));
     return <input ref={inputRef} />;
   });
   ```
   Parent: `inputRef.current.focus()` — only calls the exposed methods.

**Q4. What is `useLayoutEffect` vs `useEffect`?**
A: useEffect       → runs AFTER browser has painted the screen (asynchronous).
   useLayoutEffect → runs AFTER DOM mutations but BEFORE browser paints (synchronous).
   
   Use useLayoutEffect for: reading DOM layout (getBoundingClientRect), preventing visual flicker.
   Use useEffect for: almost everything else. Prefer it — it doesn't block painting.
   Example: tooltip positioning (calculate position before browser paints → no flicker).

---

## SECTION B — Redux Toolkit

**Q5. What is Redux? What problem does it solve?**
A: Redux is a global state management library.
   Problem: state needed by many components, complex state transitions, time-travel debugging.
   Core concepts:
   - Store → single JS object holding ALL app state.
   - Action → plain object describing what happened `{ type: "users/add", payload: user }`.
   - Reducer → pure function: `(state, action) => newState`. No side effects.
   - Dispatch → sends actions to the store.
   - Selector → extracts a slice of state from store.
   React components dispatch actions → reducer updates store → components re-render.

**Q6. What is Redux Toolkit (RTK)? Why was it created?**
A: Redux Toolkit is the OFFICIAL recommended way to write Redux. Reduces boilerplate dramatically.
   Vanilla Redux problems:
   - Too much boilerplate (action types, action creators, reducers all separate).
   - Must install immer separately for immutable state.
   - Async handling (thunks) complex to set up.
   RTK solutions:
   - `createSlice` → reducer + action creators + action types in ONE place.
   - Immer built-in → write "mutating" code, RTK handles immutability.
   - `createAsyncThunk` → handles loading/success/error states automatically.
   - `configureStore` → includes DevTools and middleware automatically.

**Q7. What is `createSlice`? Write a basic example.**
A: ```javascript
   import { createSlice } from "@reduxjs/toolkit";
   
   const counterSlice = createSlice({
     name: "counter",          // Used as prefix in action types
     initialState: { value: 0 },
     reducers: {
       increment: (state) => { state.value += 1; },   // "Mutating" (actually Immer)
       decrement: (state) => { state.value -= 1; },
       incrementBy: (state, action) => { state.value += action.payload; },
       reset: () => ({ value: 0 }),   // Can return new state
     }
   });
   
   export const { increment, decrement, incrementBy, reset } = counterSlice.actions;
   export default counterSlice.reducer;
   ```
   Actions auto-generated: `counter/increment`, `counter/decrement`, `counter/incrementBy`.

**Q8. What is Immer and why can you "mutate" state in RTK reducers?**
A: Immer is a library that lets you write code that LOOKS like it mutates state, but actually produces a new immutable state behind the scenes.
   Redux rule: reducers must be pure, must not mutate state.
   Without Immer: `return { ...state, value: state.value + 1 }` — verbose spreading.
   With Immer (built into RTK): `state.value += 1` — clean and readable.
   Immer uses JavaScript Proxy to track changes and produce a new object.
   Only works inside createSlice/createReducer — NOT in your normal code.

**Q9. What is `createAsyncThunk`?**
A: Handles async operations in Redux with automatic loading/success/error states.
   ```javascript
   const fetchUsers = createAsyncThunk("users/fetch", async (_, { rejectWithValue }) => {
     try {
       const response = await fetch("/api/users");
       return await response.json();
     } catch (err) {
       return rejectWithValue(err.message);
     }
   });
   
   // In the slice:
   extraReducers: (builder) => {
     builder
       .addCase(fetchUsers.pending,   (state) => { state.loading = true; state.error = null; })
       .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
       .addCase(fetchUsers.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
   }
   ```

**Q10. What is RTK Query? How does it differ from `createAsyncThunk`?**
A: RTK Query is a full data fetching and caching solution built into Redux Toolkit.
   With createAsyncThunk: you manually manage loading, error, data state in reducers.
   With RTK Query: automatic caching, deduplication, polling, prefetching, optimistic updates.
   ```javascript
   const apiSlice = createApi({
     reducerPath: "api",
     baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
     endpoints: (builder) => ({
       getUsers: builder.query({ query: () => "/users" }),
       createUser: builder.mutation({ query: (user) => ({ url: "/users", method: "POST", body: user }) }),
     }),
   });
   
   export const { useGetUsersQuery, useCreateUserMutation } = apiSlice;
   // In component: const { data, isLoading, error } = useGetUsersQuery();
   ```
   RTK Query replaces react-query + manual Redux setup.

---

## SECTION C — Performance Patterns

**Q11. What is React.memo and when should you use it?**
A: React.memo wraps a component. Skips re-render if props are shallowly equal.
   ```jsx
   const ExpensiveList = React.memo(({ items, onSelect }) => {
     return items.map(item => <Item key={item.id} item={item} onSelect={onSelect} />);
   });
   ```
   WHEN: parent re-renders frequently, child is expensive, props don't change often.
   WHEN NOT: component is cheap to render, props change often (memo overhead > render cost).
   With custom comparison: `React.memo(Component, (prev, next) => prev.id === next.id)`.

**Q12. What is code splitting? How does it work in React?**
A: Code splitting = break bundle into smaller chunks loaded on demand.
   Without: entire app loads on first visit (huge bundle → slow initial load).
   With: only load code for current route on demand.
   ```jsx
   import { lazy, Suspense } from "react";
   
   const Dashboard = lazy(() => import("./Dashboard"));  // Loaded only when rendered
   
   function App() {
     return (
       <Suspense fallback={<Loading />}>
         <Dashboard />  {/* Bundle chunk downloaded here, first time only */}
       </Suspense>
     );
   }
   ```
   Next.js does this automatically per page/route.

---

## SECTION D — Patterns

**Q13. What is the render props pattern?**
A: A component that renders what a function prop tells it to.
   ```jsx
   function MouseTracker({ render }) {
     const [pos, setPos] = useState({ x: 0, y: 0 });
     return (
       <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
         {render(pos)}  {/* Render what the parent tells us */}
       </div>
     );
   }
   
   <MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
   ```
   Mostly replaced by hooks (custom hooks are cleaner for logic sharing).

**Q14. What is a Higher-Order Component (HOC)?**
A: A function that takes a component and returns an ENHANCED component.
   ```jsx
   function withAuth(WrappedComponent) {
     return function AuthenticatedComponent(props) {
       if (!currentUser) return <Redirect to="/login" />;
       return <WrappedComponent {...props} user={currentUser} />;
     };
   }
   ```
   HOCs add behavior without modifying the original component.
   Use for: authentication, logging, theming (when hooks don't apply).
   Mostly replaced by hooks in modern React.

**Q15. What is the compound component pattern?**
A: Multiple components that share implicit state via context.
   ```jsx
   function Select({ children, onChange }) {
     const [selected, setSelected] = useState(null);
     return (
       <SelectContext.Provider value={{ selected, setSelected, onChange }}>
         {children}
       </SelectContext.Provider>
     );
   }
   Select.Option = function Option({ value, children }) {
     const { selected, setSelected, onChange } = useContext(SelectContext);
     return <div onClick={() => { setSelected(value); onChange(value); }}>{children}</div>;
   };
   
   // Usage:
   <Select onChange={setLang}>
     <Select.Option value="en">English</Select.Option>
     <Select.Option value="hi">Hindi</Select.Option>
   </Select>
   ```
   Used in: Radix UI, Headless UI, Reach UI.
