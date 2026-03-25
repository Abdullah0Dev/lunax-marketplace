// hooks/useExplore.js
import { useDispatch, useSelector } from 'react-redux';
import { exploreActions } from '../services/store/slices/explore.slice';
import {
  useGetStoreByIdQuery,
  useLazyGetStoresByCategoryQuery, // ← Use lazy version
} from '../services/api/store.api';
import { useGetReelFeedQuery } from '../services/api/reel.api';
import { useGetLatestProductsQuery } from '../services/api/product.api';
import { useCallback, useEffect, useState } from 'react';
import { categoriesData } from '../constants';
export const APP_CATEGORIES = categoriesData.flat().map(itm => itm.screen)

export const useExplore = (storeId = null, category = null) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [allReels, setAllReels] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { recentlyViewed, categories, selectedCategory } = useSelector(
    (state) => state.explore
  );

  // Fetch single store if storeId is provided
  const {
    data: store,
    isLoading: storeLoading,
    error: storeError,
    refetch: refetchStore,
  } = useGetStoreByIdQuery(storeId, {
    skip: !storeId,
  });

  // Use lazy query for stores by category
  const [
    fetchStoresByCategory, // ← The trigger function
    {
      data: storesByCategoryData,
      isLoading: categoryStoresLoading,
      error: categoryError,
    }
  ] = useLazyGetStoresByCategoryQuery();

  // Fetch latest products
  const {
    data: latestProducts,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetLatestProductsQuery({ page: 1, limit: 10 });

  // Fetch reels feed
  const {
    data: reelsData,
    isLoading: reelsLoading,
    refetch: refetchReels,
  } = useGetReelFeedQuery({ page: currentPage, limit: 5 });
  // Update allReels when reelsData changes
  useEffect(() => {
    if (reelsData?.reels) {
      if (currentPage === 1) {
        setAllReels(reelsData.reels);
      } else {
        setAllReels(prev => [...prev, ...reelsData.reels]);
      }
      setHasMore(reelsData.hasMore);
    }
  }, [reelsData, currentPage]);

  // Function to load more reels
  const loadMoreReels = useCallback(async () => {
    if (!hasMore || reelsLoading) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore, reelsLoading]);

  // Reset and refresh reels
  const refreshReels = useCallback(async () => {
    setCurrentPage(1);
    setAllReels([]);
    const result = await refetchReels();
    return result;
  }, [refetchReels]);
  // NEW: Pre-fetch all categories at once
  const preFetchAllCategories = async () => {
    console.log("Starting to pre-fetch all categories:", APP_CATEGORIES);

    const fetchPromises = APP_CATEGORIES.map(catName =>
      fetchStoresByCategory({
        category: catName,
        page: 1,
        limit: 10,
      }).catch(err => {
        console.error(`Failed to pre-fetch ${catName}:`, err);
        return null;
      })
    );

    const results = await Promise.all(fetchPromises);
    const successful = results.filter(r => r?.data).length;
    const prodRes = await refetchProducts()
    console.log(`Pre-fetch complete: ${successful}/${APP_CATEGORIES.length} categories loaded`, prodRes);

    return results;
  };
  // Get cached data for a specific category (doesn't fetch if already cached)
  const getCategoryStores = (categoryName) => {
    // This just returns the data from the lazy query's cache
    // RTK Query handles the caching automatically
    return fetchStoresByCategory({
      category: categoryName,
      page: 1,
      limit: 10,
    }, true); // true = prefer cache
  };
  // Automatically fetch if initial category is provided
  useEffect(() => {
    if (category || selectedCategory) {
      fetchStoresByCategory({
        category: category || selectedCategory,
        page: 1,
        limit: 10,
      });
    }
  }, [category, selectedCategory, fetchStoresByCategory]);

  const addRecentlyViewedStore = (storeData) => {
    dispatch(exploreActions.addRecentlyViewedStore(storeData));
  };

  const addRecentlyViewedProduct = (product) => {
    dispatch(exploreActions.addRecentlyViewedProduct(product));
  };

  const setSelectedCategory = (newCategory) => {
    dispatch(exploreActions.setSelectedCategory(newCategory));
  };

  // Function to fetch stores by category with parameters
  const getStoresByCategory = (params) => {
    return fetchStoresByCategory({
      category: params.category,
      page: params.page || 1,
      limit: params.limit || 10,
    });
  };

  return {
    // Data
    store,
    storesByCategory: storesByCategoryData?.stores || [],
    latestProducts: latestProducts?.products || [],
    reels: allReels || [],
    recentlyViewed,
    categories,
    selectedCategory,
    hasMore,
    // Loading states
    isLoading: storeLoading || categoryStoresLoading || productsLoading || reelsLoading,
    error: storeError || categoryError,

    // Actions
    addRecentlyViewedStore,
    addRecentlyViewedProduct,
    setSelectedCategory,
    refetchStore,
    getStoresByCategory,
    preFetchAllCategories, // NEW: Pre-fetch all categories
    loadMoreReels,
    refreshReels,
    refetchReels,
    refetchProducts,
    refetchReels,
  };
};