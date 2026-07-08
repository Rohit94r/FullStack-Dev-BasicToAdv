import { useCart } from "../hooks/useCart";

export function Cart() {
  // TODO: Use useCart() hook for items, totals, and actions
  const { items, subtotal, discount, grandTotal, removeItem, updateQty, clearCart } =
    useCart();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt="" width={40} />
            <span>{item.title}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>

            {/* TODO: Quantity controls — updateQty / removeItem */}
            <button onClick={() => { /* YOUR IDEA */ }}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => { /* YOUR IDEA */ }}>+</button>
            <button onClick={() => { /* YOUR IDEA */ }}>Remove</button>
          </li>
        ))}
      </ul>

      {/* TODO: Coupon input — dispatch applyCoupon('SAVE10') */}
      <div>
        <input placeholder="Coupon code" />
        <button>Apply</button>
      </div>

      <div className="totals">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
        <p><strong>Total: ${grandTotal.toFixed(2)}</strong></p>
      </div>

      <button onClick={() => clearCart()}>Clear cart</button>
    </div>
  );
}

// ─── ANSWER hints ───
// updateQty({ id: item.id, qty: item.qty - 1 })
// updateQty({ id: item.id, qty: item.qty + 1 })
// removeItem(item.id)
