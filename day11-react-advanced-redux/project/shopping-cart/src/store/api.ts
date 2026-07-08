import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

// TODO: Create RTK Query API for fakestoreapi.com
// Endpoints needed:
//   - getProducts (all products)
//   - getCategories (category list)
//   - getProductsByCategory(category: string)
// YOUR IDEA:


// ─── ANSWER (only look after trying!) ───
/*
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "products",
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    getCategories: builder.query<string[], void>({
      query: () => "products/categories",
    }),
    getProductsByCategory: builder.query<Product[], string>({
      query: (category) => `products/category/${encodeURIComponent(category)}`,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
*/

// Placeholder so TypeScript doesn't break before you implement:
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/" }),
  endpoints: () => ({}),
});

export const useGetProductsQuery = () => ({
  data: undefined as Product[] | undefined,
  isLoading: true,
  error: undefined,
  refetch: () => {},
});
