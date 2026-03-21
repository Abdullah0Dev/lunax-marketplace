// services/api/store.api.js
import { api } from './client';

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all stores with pagination
    getStores: builder.query({
      query: ({ page = 1, limit = 20, category } = {}) => {
        let url = `/stores?page=${page}&limit=${limit}`;
        if (category) url += `&category=${category}`;
        return url;
      },
      providesTags: (result) =>
        result?.stores
          ? [
              ...result.stores.map(({ id }) => ({ type: 'Store', id })),
              { type: 'Store', id: 'LIST' },
            ]
          : [{ type: 'Store', id: 'LIST' }],
      transformResponse: (response) => ({
        stores: response.stores || response,
        total: response.total || response.length,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
      }),
    }),

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

    // Get stores by category
    getStoresByCategory: builder.query({
      query: (category) => `/stores/category/${category}`,
      providesTags: (result, error, category) => [
        { type: 'Store', id: `CATEGORY_${category}` },
      ],
    }),

    // Get featured stores
    getFeaturedStores: builder.query({
      query: () => '/stores/featured',
      providesTags: [{ type: 'Store', id: 'FEATURED' }],
    }),

    // Get nearby stores (based on location)
    getNearbyStores: builder.query({
      query: ({ lat, lng, radius = 10 }) => 
        `/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      providesTags: [{ type: 'Store', id: 'NEARBY' }],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useGetStoresByCategoryQuery,
  useGetFeaturedStoresQuery,
  useGetNearbyStoresQuery,
} = storeApi;