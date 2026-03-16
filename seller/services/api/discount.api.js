// services/api/discount.api.js
import { STORE_ID } from '../../utils';
import { api } from './client';

export const discountApi = api.injectEndpoints({
endpoints: (builder) => ({
    // Get seller's discounts
    getMyDiscounts: builder.query({
      query: () => `/discounts/store/${STORE_ID}`,
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