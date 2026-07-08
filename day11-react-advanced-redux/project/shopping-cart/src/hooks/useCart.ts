import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  removeItem,
  updateQty,
  applyCoupon,
  clearCart,
} from "../store/cartSlice";

// Typed Redux hooks — export these for the whole app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// TODO: Build useCart() — wraps selectors + dispatch actions
// Return: items, cartCount, subtotal, discount, grandTotal,
//         addItem, removeItem, updateQty, applyCoupon, clearCart
// YOUR IDEA:
export function useCart() {
  const dispatch = useAppDispatch();

  // YOUR IDEA: select from store
  const items = useAppSelector((s) => s.cart.items);

  return {
    items,
    cartCount: 0,
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
    removeItem: (id: number) => dispatch(removeItem(id)),
    updateQty: (payload: { id: number; qty: number }) =>
      dispatch(updateQty(payload)),
    applyCoupon: (code: string) => dispatch(applyCoupon(code)),
    clearCart: () => dispatch(clearCart()),
  };
}

// ─── ANSWER (only look after trying!) ───
/*
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const coupon = useAppSelector((s) => s.cart.coupon);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;
  const afterDiscount = subtotal - discount;
  const grandTotal = afterDiscount + afterDiscount * 0.08;

  return {
    items,
    cartCount,
    subtotal,
    discount,
    grandTotal,
    removeItem: (id: number) => dispatch(removeItem(id)),
    updateQty: (payload: { id: number; qty: number }) =>
      dispatch(updateQty(payload)),
    applyCoupon: (code: string) => dispatch(applyCoupon(code)),
    clearCart: () => dispatch(clearCart()),
  };
}
*/
