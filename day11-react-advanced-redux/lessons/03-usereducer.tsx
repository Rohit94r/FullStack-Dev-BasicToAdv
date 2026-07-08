/*
─────────────────────────────────────────────────────────────
 LESSON 3 — useReducer
 LEVEL : Intermediate
 TOPIC : Reducer pattern, action objects, counter + todo examples
─────────────────────────────────────────────────────────────

 WHAT IS useReducer?
 Like useState, but for COMPLEX state logic. You describe changes
 as ACTION OBJECTS dispatched to a PURE REDUCER FUNCTION.

   dispatch({ type: "INCREMENT" })  →  reducer(state, action)  →  newState

 When to use useReducer instead of useState:
 ✅ Next state depends on previous state in multiple ways
 ✅ Many related state updates (todo list CRUD)
 ✅ You want predictable, testable state transitions
 ❌ Simple boolean or counter — useState is fine

 The reducer MUST be pure: (state, action) => newState
 No fetch, no localStorage, no Math.random() inside reducer!
*/

import { useReducer, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────
// 1. Counter reducer — the hello world
// ─────────────────────────────────────────────────────────

type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET"; payload: number };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "RESET":
      return 0;
    case "SET":
      return action.payload;
    default:
      return state; // always handle unknown actions safely
  }
}

function Counter() {
  const [count, dispatch] = useReducer(counterReducer, 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "SET", payload: 100 })}>
        Set 100
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2. Todo reducer — the real-world pattern
// ─────────────────────────────────────────────────────────

type Todo = { id: string; text: string; done: boolean };

type TodoState = { todos: Todo[]; filter: "all" | "active" | "done" };

type TodoAction =
  | { type: "ADD"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | { type: "DELETE"; payload: string }
  | { type: "SET_FILTER"; payload: TodoState["filter"] }
  | { type: "CLEAR_DONE" };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: crypto.randomUUID(), text: action.payload, done: false },
        ],
      };
    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    case "DELETE":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "CLEAR_DONE":
      return { ...state, todos: state.todos.filter((t) => !t.done) };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
  });

  const visible = state.todos.filter((t) => {
    if (state.filter === "active") return !t.done;
    if (state.filter === "done") return t.done;
    return true;
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).todo as HTMLInputElement;
          if (input.value.trim()) {
            dispatch({ type: "ADD", payload: input.value.trim() });
            input.value = "";
          }
        }}
      >
        <input name="todo" placeholder="Add todo..." />
        <button type="submit">Add</button>
      </form>

      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => dispatch({ type: "TOGGLE", payload: t.id })}
            />
            {t.text}
            <button onClick={() => dispatch({ type: "DELETE", payload: t.id })}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <div>
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
          >
            {f}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "CLEAR_DONE" })}>
          Clear done
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TODO: Build a cartReducer with ADD_ITEM, REMOVE_ITEM,
//       UPDATE_QTY actions. State: { items: { id, qty }[] }
// YOUR IDEA:


// ─── ANSWER ───
type CartItem = { id: number; title: string; qty: number };

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "qty"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QTY"; payload: { id: number; qty: number } };

function cartReducer(
  state: CartItem[],
  action: CartAction
): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload);
    case "UPDATE_QTY":
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
      );
    default:
      return state;
  }
}

export default function Lesson03Demo() {
  return (
    <main>
      <Counter />
      <TodoApp />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What is a reducer?
 A: A pure function (state, action) => newState that describes
    HOW state changes in response to dispatched actions.

 Q: Why must reducers be pure?
 A: Predictability, testability, time-travel debugging (Redux).
    Side effects belong in middleware, thunks, or useEffect.

 Q: useReducer vs useState?
 A: useReducer when logic is complex or many related updates.
    useState for simple independent values.

 Q: What is an action?
 A: A plain object with a `type` string (and optional payload)
    describing WHAT happened, not HOW to change state.

 Q: How does this relate to Redux?
 A: useReducer is React's built-in mini-Redux. Redux scales this
    pattern app-wide with a single store, middleware, and devtools.
─────────────────────────────────────────────────────────────
*/
