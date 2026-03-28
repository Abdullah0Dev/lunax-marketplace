// services/api/product.api.js
import { getStoreId } from '../../utils';
import { api } from './client';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products for seller's store
    getMyProducts: builder.query({
      // query: async () => {
      //   const storeId = await getStoreId();
      //   return `/products/store/${storeId}`;
      // },
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        try {
          const storeId = await getStoreId();
          console.log("storeId:", storeId);

          if (!storeId) {
            return { error: { status: 404, data: "Store ID not found" } };
          }

          // Make the actual request
          const result = await baseQuery(`/products/store/${storeId}`, queryApi, extraOptions);
          console.log("Result:", result);

          return result;
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },

      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Product', id })),
            { type: 'Product', id: 'LIST' },
          ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Get single product
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Create product
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],

      // Optimistic update
      async onQueryStarted(product, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData('getMyProducts', undefined, (draft) => {
            draft.push({ ...product, id: 'temp-' + Date.now(), syncing: true });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],

      // Optimistic delete
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData('getMyProducts', undefined, (draft) => {
            const index = draft.findIndex((p) => p.id === id);
            if (index !== -1) draft.splice(index, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update product quantity
    updateQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/products/${id}/quantity`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
  }),
});

export const {
  useGetMyProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateQuantityMutation,
} = productApi;