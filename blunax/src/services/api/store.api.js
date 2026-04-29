// services/api/store.api.js
import { getStoreId } from '../../utils';
import { api } from './client';

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get seller's own store
    getMyStore: builder.query({
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        try {
          const storeId = await getStoreId();
          console.log("storeId:", storeId);

          if (!storeId) {
            return { error: { status: 404, data: "Store ID not found" } };
          }

          // Make the actual request
          const result = await baseQuery(`/stores/${storeId}`, queryApi, extraOptions);
          console.log("Result:", result);

          return result;
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },

      providesTags: ['Store'],
      // Cache for offline
      keepUnusedDataFor: 999999,
    }),

    // Update store details
    updateStore: builder.mutation({
      query: ({ id, ...updates }) => {
        return ({
          url: `/stores/${`${id}`}`,
          method: 'PUT',
          body: updates,
        })
      },
      invalidatesTags: ['Store'],
      // Optimistic update
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getMyStore', undefined, (draft) => {
            Object.assign(draft, updates);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update store logo/cover
    updateStoreImages: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/stores/${id}/images`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetMyStoreQuery,
  useUpdateStoreMutation,
  useUpdateStoreImagesMutation,
} = storeApi;