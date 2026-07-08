import { useGetProductsQuery } from "../store/api";
import { useAppDispatch } from "../hooks/useCart";
import { addItem } from "../store/cartSlice";

type ProductListProps = {
  category?: string;
  search?: string;
};

export function ProductList({ category, search }: ProductListProps) {
  const dispatch = useAppDispatch();

  // TODO: Fetch products with useGetProductsQuery (or category variant)
  // Handle isLoading and error states
  // YOUR IDEA:
  const { data: products, isLoading, error } = useGetProductsQuery();

  // TODO: Filter products by search term (client-side is fine for MVP)
  // YOUR IDEA:
  const filtered = products;

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products.</p>;

  return (
    <div className="product-grid">
      {filtered?.map((product) => (
        <article key={product.id} className="product-card">
          <img src={product.image} alt={product.title} width={80} />
          <h3>{product.title}</h3>
          <p>${product.price.toFixed(2)}</p>
          {/* TODO: dispatch addItem with { id, title, price, image } */}
          <button
            onClick={() => {
              // YOUR IDEA:
            }}
          >
            Add to cart
          </button>
        </article>
      ))}
    </div>
  );
}

// ─── ANSWER (only look after trying!) ───
/*
  const filtered = products?.filter((p) => {
    const matchesSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? p.category === category : true;
    return matchesSearch && matchesCategory;
  });

  <button
    onClick={() =>
      dispatch(
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        })
      )
    }
  >
    Add to cart
  </button>
*/
