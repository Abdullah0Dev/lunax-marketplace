// services/api/discount.api.js
import { api } from './client';

export const discountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get active discounts
    getActiveDiscounts: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => 
        `/discounts/active?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.discounts
          ? [
              ...result.discounts.map(({ id }) => ({ type: 'Discount', id })),
              { type: 'Discount', id: 'ACTIVE' },
            ]
          : [{ type: 'Discount', id: 'ACTIVE' }],
      transformResponse: (response) => ({
        discounts: response.discounts || response,
        total: response.total || response.length,
      }),
    }),

    // Get store discounts
    getStoreDiscounts: builder.query({
      query: (storeId) => `/discounts/store/${storeId}`,
      providesTags: (result, error, storeId) => [
        { type: 'Discount', id: `STORE_${storeId}` },
      ],
    }),

    // Get product discount
    getProductDiscount: builder.query({
      query: (productId) => `/discounts/product/${productId}`,
      providesTags: (result, error, productId) => [
        { type: 'Discount', id: `PRODUCT_${productId}` },
      ],
    }),

    // Get best deals
    getBestDeals: builder.query({
      query: (limit = 10) => `/discounts/best-deals?limit=${limit}`,
      providesTags: [{ type: 'Discount', id: 'BEST_DEALS' }],
    }),
  }),
});

export const {
  useGetActiveDiscountsQuery,
  useGetStoreDiscountsQuery,
  useGetProductDiscountQuery,
  useGetBestDealsQuery,
} = discountApi;