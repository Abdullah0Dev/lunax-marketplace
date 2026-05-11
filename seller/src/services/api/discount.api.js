// services/api/discount.api.js
import { getStoreId } from '../../utils';
import { api } from './client';

export const discountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get seller's discounts
    getMyDiscounts: builder.query({
      // query: async () => {
      //   const storeId = await getStoreId();
      //   return `/discounts/store/${storeId}`;
      // },
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        try {
          const storeId = await getStoreId();
          console.log("storeId:", storeId);

          if (!storeId) {
            return { error: { status: 404, data: "Store ID not found" } };
          }

          // Make the actual request
          const result = await baseQuery(`/discounts/store/${storeId}`, queryApi, extraOptions);
          console.log("Result:", result);

          return result;
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },

      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Discount', id })),
            { type: 'Discount', id: 'LIST' },
          ]
          : [{ type: 'Discount', id: 'LIST' }],
    }),

    // Create discount
    createDiscount: builder.mutation({
      query: (discount) => ({
        url: '/discounts',
        method: 'POST',
        body: discount,
      }),
      invalidatesTags: [{ type: 'Discount', id: 'LIST' }],
    }),

    // Update discount
    updateDiscount: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/discounts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Discount', id },
        { type: 'Discount', id: 'LIST' },
      ],
    }),

    // Delete discount
    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/discounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Discount', id },
        { type: 'Discount', id: 'LIST' },
      ],
    }),

    // Toggle discount active status
    toggleDiscount: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/discounts/${id}`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Discount', id }],
    }),
  }),
});

export const {
  useGetMyDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useToggleDiscountMutation,
} = discountApi;