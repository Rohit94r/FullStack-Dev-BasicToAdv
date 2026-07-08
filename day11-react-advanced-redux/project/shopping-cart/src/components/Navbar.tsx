import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export function Navbar() {
  // TODO: Read cart count from useCart() or useSelector directly
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <Link to="/">Shop</Link>

      {/* TODO: Show cart badge with item count — this proves Redux works globally */}
      <Link to="/cart">
        Cart {/* YOUR IDEA: show cartCount here */}
      </Link>
    </nav>
  );
}

// ─── ANSWER ───
// <Link to="/cart">Cart ({cartCount})</Link>
