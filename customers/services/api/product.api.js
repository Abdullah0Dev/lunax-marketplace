// services/api/product.api.js
import { api } from './client';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get products for a store
    getStoreProducts: builder.query({
      query: ({ storeId, page = 1, limit = 20 }) =>
        `/products/store/${storeId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { storeId }) => [
        { type: 'Product', id: `STORE_${storeId}` },
      ],
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      transformResponse: (response) => ({
        ...response,
        finalPrice: response.discount_price || response.price,
        hasDiscount: !!response.discount_price,
      }),
    }),

    // Search products
    searchProducts: builder.query({
      query: ({ q, category, minPrice, maxPrice, sortBy = 'relevance' }) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sortBy) params.append('sortBy', sortBy);

        return `/products/search?${params.toString()}`;
      },
      providesTags: (result, error, searchParams) => [
        { type: 'Product', id: `SEARCH_${JSON.stringify(searchParams)}` },
      ],
      transformResponse: (response) => ({
        products: response.products || response,
        total: response.total || response.length,
        facets: response.facets || null,
      }),
    }),


    // Get related products
    getLatestProducts: builder.query({
      query: ({ page = 1, limit = 20 }) => `/products/latest/?page=${page}&limit=${limit}`,
      providesTags: (result, error) => [
        { type: 'Product', id: `LATEST_PRODUCTS` },
      ],
      transformResponse: (response) => ({
        products: response.products || response,
        nextPage: response.page + 1,
        hasMore: response.page < response.totalPages,
      }),
    }),

  }),
});

export const {
  useGetStoreProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetLatestProductsQuery,
} = productApi;