/*
─────────────────────────────────────────────────────────────
 LESSON 6 — RTK QUERY (createApi, useGetQuery, useMutation)
 LEVEL : Advanced
 TOPIC : Data fetching + caching built into Redux Toolkit
─────────────────────────────────────────────────────────────

 WHAT PROBLEM DOES RTK QUERY SOLVE?
 Fetching data usually means: loading state, error state, cache,
 refetching, deduplication, optimistic updates... RTK Query handles
 ALL of this with auto-generated hooks.

 You still use Redux store — RTK Query adds a "api" slice automatically.

 FLOW:
   createApi → defines endpoints → generates hooks
   useGetProductsQuery() → { data, isLoading, error, refetch }
   useAddProductMutation() → [mutate, { isLoading }]
*/

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

// ─────────────────────────────────────────────────────────
// 1. Define types for the API
// ─────────────────────────────────────────────────────────

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

// ─────────────────────────────────────────────────────────
// 2. createApi — the core setup
// ─────────────────────────────────────────────────────────

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fakestoreapi.com/",
  }),
  tagTypes: ["Product", "Cart"],
  endpoints: (builder) => ({
    // QUERY = GET data (cached automatically)
    getProducts: builder.query<Product[], void>({
      query: () => "products",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    getProductsByCategory: builder.query<Product[], string>({
      query: (category) => `products/category/${category}`,
    }),

    // MUTATION = POST/PUT/DELETE (not cached, triggers side effects)
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

// Auto-generated React hooks — use these in components!
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
} = productsApi;

// ─────────────────────────────────────────────────────────
// 3. Add RTK Query reducer + middleware to store
// ─────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(productsApi.middleware),
});

// ─────────────────────────────────────────────────────────
// 4. Component examples
// ─────────────────────────────────────────────────────────

function ProductList() {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products. <button onClick={refetch}>Retry</button></p>;

  return (
    <ul>
      {products?.map((p) => (
        <li key={p.id}>
          {p.title} — ${p.price}
        </li>
      ))}
    </ul>
  );
}

function ProductDetail({ id }: { id: number }) {
  const { data: product, isFetching } = useGetProductByIdQuery(id);

  if (isFetching) return <p>Loading...</p>;
  if (!product) return <p>Not found</p>;

  return (
    <div>
      <img src={product.image} alt={product.title} width={120} />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
    </div>
  );
}

function CreateProductForm() {
  const [createProduct, { isLoading, isSuccess }] = useCreateProductMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    await createProduct({
      title: (form.title as HTMLInputElement).value,
      price: Number((form.price as HTMLInputElement).value),
      description: "Created via RTK Query",
      category: "test",
      image: "https://via.placeholder.com/150",
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <input name="price" type="number" placeholder="Price" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </button>
      {isSuccess && <p>Created! List will auto-refetch (invalidatesTags).</p>}
    </form>
  );
}

// ─────────────────────────────────────────────────────────
// TODO: Add a searchProducts query that accepts a search string
//       and calls products?limit=5 (fake filter for demo).
// YOUR IDEA:


// ─── ANSWER ───
// Add to endpoints:
// searchProducts: builder.query<Product[], string>({
//   query: (q) => `products?limit=5`, // real app: backend search param
//   // skip option in hook: useSearchProductsQuery(q, { skip: !q })
// }),

function App() {
  return (
    <Provider store={store}>
      <ProductList />
      <ProductDetail id={1} />
      <CreateProductForm />
    </Provider>
  );
}

export default App;

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What problem does RTK Query solve?
 A: Boilerplate for fetching: loading/error states, caching,
    deduplication, refetching, cache invalidation, optimistic updates.

 Q: Query vs Mutation?
 A: Query = read data (GET), cached, auto-refetches on invalidation.
    Mutation = write data (POST/PUT/DELETE), triggers cache updates.

 Q: What are tags (providesTags / invalidatesTags)?
 A: Cache labels. When a mutation invalidates "Product/LIST", all
    queries that provide that tag refetch automatically.

 Q: RTK Query vs React Query?
 A: Both excellent. RTK Query integrates with Redux store/devtools;
    React Query is standalone. Pick based on team/stack.

 Q: Why add api.middleware to the store?
 A: Required for RTK Query's caching, invalidation, and background
    refetch logic to work.
─────────────────────────────────────────────────────────────
*/
