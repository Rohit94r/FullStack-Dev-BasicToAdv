/*
─────────────────────────────────────────────────────────────
 LESSON 5 — REDUX TOOLKIT (createSlice, store, Provider)
 LEVEL : Intermediate → Advanced
 TOPIC : Global state with Redux Toolkit — the modern way
─────────────────────────────────────────────────────────────

 WHY REDUX?
 When many components need the SAME state and update it from
 anywhere (cart, auth, notifications), prop drilling and
 Context become painful. Redux gives ONE predictable store.

 REDUX DATA FLOW (memorize this!):
   UI → dispatch(action) → reducer → new state in store
        → useSelector reads state → component re-renders

 REDUX TOOLKIT (RTK) fixes old Redux pain:
 - createSlice: reducers + actions in one place (Immer built-in!)
 - configureStore: sensible defaults + DevTools
 - No more boilerplate action types and switch statements
*/

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────
// 1. createSlice — defines state + reducers + auto actions
// ─────────────────────────────────────────────────────────

type CartItem = { id: number; title: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  coupon: string | null;
};

const initialState: CartState = {
  items: [],
  coupon: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Immer magic: you can "mutate" draft state inside reducers!
    addItem(state, action: PayloadAction<Omit<CartItem, "qty">>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty(
      state,
      action: PayloadAction<{ id: number; qty: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    applyCoupon(state, action: PayloadAction<string>) {
      state.coupon = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
  },
});

// Auto-generated action creators:
export const { addItem, removeItem, updateQty, applyCoupon, clearCart } =
  cartSlice.actions;

// ─────────────────────────────────────────────────────────
// 2. configureStore — create the store
// ─────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// Infer TypeScript types from the store (use everywhere!)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ─────────────────────────────────────────────────────────
// 3. Typed hooks (best practice — copy into hooks.ts)
// ─────────────────────────────────────────────────────────

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ─────────────────────────────────────────────────────────
// 4. Components using the store
// ─────────────────────────────────────────────────────────

function CartBadge() {
  const count = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.qty, 0)
  );
  return <span>🛒 {count}</span>;
}

function AddToCartButton({ product }: { product: Omit<CartItem, "qty"> }) {
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(addItem(product))}>Add to cart</button>
  );
}

function CartSummary() {
  const { items, coupon } = useAppSelector((state) => state.cart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;

  return (
    <div>
      <h2>Cart ({items.length} products)</h2>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
      <p>Total: ${(subtotal - discount).toFixed(2)}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 5. Provider — wrap your app ONCE at the root
// ─────────────────────────────────────────────────────────

function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// ─────────────────────────────────────────────────────────
// TODO: Create a uiSlice with sidebarOpen: boolean and
//       reducers toggleSidebar, setSidebarOpen.
// YOUR IDEA:


// ─── ANSWER ───
const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = uiSlice.actions;

export default function Lesson05Demo() {
  return (
    <ReduxProvider>
      <CartBadge />
      <AddToCartButton
        product={{ id: 1, title: "Fjallraven Backpack", price: 109.95 }}
      />
      <CartSummary />
    </ReduxProvider>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: Redux data flow in one sentence?
 A: Components dispatch actions → reducers compute new state →
    store updates → selectors notify subscribed components.

 Q: What does createSlice do?
 A: Defines name, initialState, reducers; auto-generates action
    creators and the reducer function. Uses Immer for "mutable" syntax.

 Q: What is Immer?
 A: Library RTK uses so you can write state.items.push(x) inside
    reducers while still producing immutable updates under the hood.

 Q: Why typed useAppSelector/useAppDispatch?
 A: Full TypeScript autocomplete for state shape and action types.

 Q: When Redux over Context?
 A: Complex shared state, many updates, need devtools, middleware,
    normalized data, or selectors with memoization (reselect).
─────────────────────────────────────────────────────────────
*/
