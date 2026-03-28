// services/api/reel.api.js
import { getStoreId } from '../../utils';
import { api } from './client';

export const reelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get seller's reels
    getMyReels: builder.query({
      // query: async () => {
      //   const storeId = await getStoreId();
      //   return `/reels/store/${storeId}`;
      // },
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        try {
          const storeId = await getStoreId();
          console.log("storeId:", storeId);

          if (!storeId) {
            return { error: { status: 404, data: "Store ID not found" } };
          }

          // Make the actual request
          const result = await baseQuery(`/reels/store/${storeId}`, queryApi, extraOptions);
          console.log("Result:", result);

          return result;
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Reel', id })),
            { type: 'Reel', id: 'LIST' },
          ]
          : [{ type: 'Reel', id: 'LIST' }],
    }),

    // Check upload limit
    getUploadLimit: builder.query({
      // query: async () => {
      //   const storeId = await getStoreId();
      //   return `/reels/limit/${storeId}`;
      // },
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        try {
          const storeId = await getStoreId();
          console.log("storeId:", storeId);

          if (!storeId) {
            return { error: { status: 404, data: "Store ID not found" } };
          }

          // Make the actual request
          const result = await baseQuery(`/reels/limit/${storeId}`, queryApi, extraOptions);
          console.log("Result:", result);

          return result;
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Reel'],
    }),

    // Upload reel
    uploadReel: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/reels/upload/${id}`,
        method: 'POST',
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
        headers: formData instanceof FormData
          ? { 'Accept': 'application/json' } // Don't set Content-Type for FormData
          : { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reel', id },
        { type: 'Reel', id: 'LIST' },
      ],

      // Track upload progress
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        // Optimistic add with loading state
        const tempId = 'temp-' + Date.now();
        dispatch(
          reelApi.util.updateQueryData('getMyReels', undefined, (draft) => {
            draft.unshift({
              id: tempId,
              title: JSON.parse(formData._parts.find(p => p[0] === 'metadata')?.[1])?.title,
              uploading: true,
              progress: 0,
            });
          })
        );

        try {
          const { data } = await queryFulfilled;
          // Replace temp with real data
          dispatch(
            reelApi.util.updateQueryData('getMyReels', undefined, (draft) => {
              const index = draft.findIndex(r => r.id === tempId);
              if (index !== -1) {
                draft[index] = { ...data, uploading: false };
              }
            })
          );
        } catch {
          // Remove temp on error
          dispatch(
            reelApi.util.updateQueryData('getMyReels', undefined, (draft) => {
              const index = draft.findIndex(r => r.id === tempId);
              if (index !== -1) draft.splice(index, 1);
            })
          );
        }
      },
    }),

    // Update reel metadata
    updateReel: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/reels/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reel', id },
        { type: 'Reel', id: 'LIST' },
      ],
    }),

    // Delete reel
    deleteReel: builder.mutation({
      query: (id) => ({
        url: `/reels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Reel', id },
        { type: 'Reel', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyReelsQuery,
  useGetUploadLimitQuery,
  useUploadReelMutation,
  useUpdateReelMutation,
  useDeleteReelMutation,
} = reelApi;