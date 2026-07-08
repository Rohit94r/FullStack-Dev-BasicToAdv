import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  coupon: string | null;
};

// TODO: Load initial state from localStorage if available
// YOUR IDEA:
const initialState: CartState = {
  items: [],
  coupon: null,
};

// ─── ANSWER hint ───
// const saved = localStorage.getItem("cart");
// const initialState: CartState = saved ? JSON.parse(saved) : { items: [], coupon: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // TODO: addItem — if product exists, increment qty; else push with qty: 1
    // YOUR IDEA:
    addItem(_state, _action: PayloadAction<Omit<CartItem, "qty">>) {},

    // TODO: removeItem — filter out by id
    removeItem(_state, _action: PayloadAction<number>) {},

    // TODO: updateQty — set qty for item (remove if qty <= 0)
    updateQty(_state, _action: PayloadAction<{ id: number; qty: number }>) {},

    // TODO: applyCoupon — set coupon string (validate SAVE10 in selector or here)
    applyCoupon(_state, _action: PayloadAction<string>) {},

    // TODO: clearCart — reset items and coupon
    clearCart(_state) {},
  },
});

// ─── ANSWER (only look after trying!) ───
/*
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "qty">>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty(state, action: PayloadAction<{ id: number; qty: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;
      if (action.payload.qty <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        item.qty = action.payload.qty;
      }
    },
    applyCoupon(state, action: PayloadAction<string>) {
      state.coupon = action.payload.toUpperCase();
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
  },
});
*/

export const { addItem, removeItem, updateQty, applyCoupon, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// TODO: Create selectors (in this file or selectors.ts):
// selectCartItems, selectCartCount, selectSubtotal, selectDiscount, selectGrandTotal
// YOUR IDEA:


// ─── ANSWER ───
// import type { RootState } from "./store";
// export const selectCartItems = (s: RootState) => s.cart.items;
// export const selectCartCount = (s: RootState) =>
//   s.cart.items.reduce((sum, i) => sum + i.qty, 0);
// export const selectSubtotal = (s: RootState) =>
//   s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
// export const selectDiscount = (s: RootState) =>
//   s.cart.coupon === "SAVE10" ? selectSubtotal(s) * 0.1 : 0;
// export const selectGrandTotal = (s: RootState) => {
//   const sub = selectSubtotal(s);
//   const disc = selectDiscount(s);
//   const afterDiscount = sub - disc;
//   return afterDiscount + afterDiscount * 0.08; // 8% tax
// };
