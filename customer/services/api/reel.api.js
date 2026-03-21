// services/api/reel.api.js
import { api } from './client';

export const reelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get reel feed (paginated)
    getReelFeed: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => 
        `/reels/feed?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.reels
          ? [
              ...result.reels.map(({ id }) => ({ type: 'Reel', id })),
              { type: 'Reel', id: 'FEED' },
            ]
          : [{ type: 'Reel', id: 'FEED' }],
      transformResponse: (response) => ({
        reels: response.reels || response,
        nextPage: response.page + 1,
        hasMore: response.page < response.totalPages,
      }),
    }),

    // Get reels for a specific store
    getStoreReels: builder.query({
      query: (storeId) => `/reels/store/${storeId}`,
      providesTags: (result, error, storeId) => [
        { type: 'Reel', id: `STORE_${storeId}` },
      ],
    }),

    // Get single reel by ID
    getReelById: builder.query({
      query: (id) => `/reels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reel', id }],
    }),

    // Get trending reels
    getTrendingReels: builder.query({
      query: (limit = 5) => `/reels/trending?limit=${limit}`,
      providesTags: [{ type: 'Reel', id: 'TRENDING' }],
    }),

    // Get reels by category
    getReelsByCategory: builder.query({
      query: (category) => `/reels/category/${category}`,
      providesTags: (result, error, category) => [
        { type: 'Reel', id: `CATEGORY_${category}` },
      ],
    }),

    // Like/unlike reel
    likeReel: builder.mutation({
      query: (reelId) => ({
        url: `/reels/${reelId}/like`,
        method: 'POST',
      }),
      async onQueryStarted(reelId, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          reelApi.util.updateQueryData('getReelFeed', {}, (draft) => {
            const reel = draft.reels?.find(r => r.id === reelId);
            if (reel) {
              reel.likes = (reel.likes || 0) + 1;
              reel.isLiked = true;
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetReelFeedQuery,
  useGetStoreReelsQuery,
  useGetReelByIdQuery,
  useGetTrendingReelsQuery,
  useGetReelsByCategoryQuery,
  useLikeReelMutation,
} = reelApi;