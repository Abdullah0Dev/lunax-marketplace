// services/api/store.api.js
import { STORE_ID } from '../../utils';
import { api } from './client';

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get seller's own store
    getMyStore: builder.query({
      query: () => `/stores/${STORE_ID}`,
      providesTags: ['Store'],
      // Cache for offline
      keepUnusedDataFor: 999999,
    }),

    // Update store details
    updateStore: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/stores/${`${STORE_ID}`}`,
        method: 'PUT',
        body: updates,
      }),
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