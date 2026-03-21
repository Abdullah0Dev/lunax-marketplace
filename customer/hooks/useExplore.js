// hooks/useExplore.js
import { useDispatch, useSelector } from 'react-redux';
import { exploreActions } from '../store/slices/explore.slice';
import { 
  useGetStoresQuery,
  useGetFeaturedStoresQuery 
} from '../services/api/store.api';
import { useGetActiveDiscountsQuery } from '../services/api/discount.api';
import { useGetReelFeedQuery } from '../services/api/reel.api';

export const useExplore = () => {
  const dispatch = useDispatch();
  const { recentlyViewed, categories, selectedCategory } = useSelector(
    (state) => state.explore
  );

  // Fetch featured stores
  const { 
    data: featuredStores,
    isLoading: featuredLoading,
    refetch: refetchFeatured 
  } = useGetFeaturedStoresQuery();

  // Fetch all stores
  const { 
    data: stores,
    isLoading: storesLoading,
    refetch: refetchStores 
  } = useGetStoresQuery({ page: 1, limit: 10 });

  // Fetch active discounts
  const { 
    data: discounts,
    isLoading: discountsLoading 
  } = useGetActiveDiscountsQuery({ limit: 5 });

  // Fetch reels feed
  const { 
    data: reels,
    isLoading: reelsLoading 
  } = useGetReelFeedQuery({ limit: 5 });

  const addRecentlyViewedStore = (store) => {
    dispatch(exploreActions.addRecentlyViewedStore(store));
  };

  const addRecentlyViewedProduct = (product) => {
    dispatch(exploreActions.addRecentlyViewedProduct(product));
  };

  const setSelectedCategory = (category) => {
    dispatch(exploreActions.setSelectedCategory(category));
  };

  return {
    // Data
    featuredStores: featuredStores?.stores || [],
    stores: stores?.stores || [],
    discounts: discounts?.discounts || [],
    reels: reels?.reels || [],
    recentlyViewed,
    categories,
    selectedCategory,
    
    // Loading states
    isLoading: featuredLoading || storesLoading || discountsLoading || reelsLoading,
    
    // Actions
    addRecentlyViewedStore,
    addRecentlyViewedProduct,
    setSelectedCategory,
    refetchFeatured,
    refetchStores,
  };
};