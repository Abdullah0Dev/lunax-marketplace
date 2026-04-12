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
    // Update your mutation to properly handle FormData
    uploadReel: builder.mutation({
      query: (formData) => {
        // formData is already a FormData object
        return {
          url: `/reels/upload`,
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type - let browser/RN set it with boundary
            'Accept': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, formData) => [
        { type: 'Reel', id: 'LIST' },
      ],

      // Remove onQueryStarted if it's causing issues, or fix it:
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        // Don't try to parse formData._parts - it's internal
        // Instead, either remove optimistic update or create a simpler one

        const tempId = 'temp-' + Date.now();

        // Simple optimistic update without parsing formData
        dispatch(
          reelApi.util.updateQueryData('getMyReels', undefined, (draft) => {
            draft.unshift({
              id: tempId,
              title: { english: 'Uploading...', kurdish: '...' },
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
                draft[index] = { ...data.reel, uploading: false };
              }
            })
          );
        } catch (error) {
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