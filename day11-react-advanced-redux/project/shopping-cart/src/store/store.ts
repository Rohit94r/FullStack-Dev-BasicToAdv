import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./cartSlice";
import { productsApi } from "./api";

// TODO: Configure the Redux store with cart reducer + RTK Query reducer/middleware
// YOUR IDEA:


// ─── ANSWER (only look after trying!) ───
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// TODO: Optional — persist cart to localStorage on every change
// Hint: store.subscribe(() => { localStorage.setItem('cart', ...) })
// YOUR IDEA:


// ─── ANSWER ───
// store.subscribe(() => {
//   const { items, coupon } = store.getState().cart;
//   localStorage.setItem("cart", JSON.stringify({ items, coupon }));
// });
