// services/api/store.api.js
import { api } from './client';

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({ 
    // Get single store by ID with full details
    getStoreById: builder.query({
      query: (id) => `/stores/${id}`,
      providesTags: (result, error, id) => [{ type: 'Store', id }],
      transformResponse: (response) => ({
        ...response,
        // Ensure bilingual names are accessible
        nameKurdish: response.name?.kurdish,
        nameEnglish: response.name?.english,
      }),
    }),

    // Get available store categories
    getAvailableCategories: builder.query({
      query: () => `/stores/categories/`,
      providesTags: (result, error, { category }) => [
        { type: 'Store', id: `CATEGORIES_${category}` },
      ],
      // do nothing
      transformResponse: (response) => ({
        ...response,
      }),
    }),

    // Get products by category
    getStoresByCategory: builder.query({
      query: ({ category, page = 1, limit = 20 }) =>
        `/stores/category/${category}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { category }) => [
        { type: 'Store', id: `CATEGORY_${category}` },
      ],
    }),

    // Get featured stores
    // getFeaturedStores: builder.query({
    //   query: () => '/stores/featured',
    //   providesTags: [{ type: 'Store', id: 'FEATURED' }],
    // }),

    // Get nearby stores (based on location)
    // getNearbyStores: builder.query({
    //   query: ({ lat, lng, radius = 10 }) =>
    //     `/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    //   providesTags: [{ type: 'Store', id: 'NEARBY' }],
    // }),
  }),
});

export const {
  useLazyGetStoreByIdQuery,
  useGetStoreByIdQuery,
  useGetStoresByCategoryQuery,
  useLazyGetStoresByCategoryQuery
  // useGetFeaturedStoresQuery,
  // useGetNearbyStoresQuery,
} = storeApi;