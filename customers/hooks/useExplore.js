// hooks/useExplore.js
import { useDispatch, useSelector } from 'react-redux';
import { exploreActions } from '../services/store/slices/explore.slice';
import {
  useGetStoreByIdQuery,
  useLazyGetStoresByCategoryQuery,
} from '../services/api/store.api';
import { useGetReelFeedQuery } from '../services/api/reel.api';
import { useLazyGetLatestProductsQuery } from '../services/api/product.api'; // ← Use lazy version
import { useCallback, useEffect, useState } from 'react';
import { categoriesData } from '../constants';

export const APP_CATEGORIES = categoriesData.flat().map(itm => itm.screen);

export const useExplore = (storeId = null, category = null) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [allReels, setAllReels] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  // ---- Latest Products Pagination States ----
  const [latestProductsPage, setLatestProductsPage] = useState(1);
  const [allLatestProducts, setAllLatestProducts] = useState([]);
  const [latestProductsHasMore, setLatestProductsHasMore] = useState(true);
  
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
    fetchStoresByCategory,
    {
      data: storesByCategoryData,
      isLoading: categoryStoresLoading,
      error: categoryError,
    }
  ] = useLazyGetStoresByCategoryQuery();

  // Use lazy query for latest products
  const [
    fetchLatestProducts,
    {
      data: latestProductsData,
      isLoading: productsLoading,
      isFetching: productsFetching,
      error: productsError,
    }
  ] = useLazyGetLatestProductsQuery();

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

  // Load more reels
  const loadMoreReels = useCallback(async () => {
    if (!hasMore || reelsLoading) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore, reelsLoading]);

  // Refresh reels
  const refreshReels = useCallback(async () => {
    setCurrentPage(1);
    setAllReels([]);
    const result = await refetchReels();
    return result;
  }, [refetchReels]);

  // --- Latest Products Pagination Handlers ---
  // Initial fetch of latest products (page 1)
  useEffect(() => {
    fetchLatestProducts({ page: 1, limit: 10 });
  }, []); // runs once on mount

  // Update allLatestProducts when new data arrives
  useEffect(() => {
    if (latestProductsData?.products) {
      if (latestProductsPage === 1) {
        setAllLatestProducts(latestProductsData.products);
      } else {
        setAllLatestProducts(prev => [...prev, ...latestProductsData.products]);
      }
      setLatestProductsHasMore(latestProductsData.hasMore ?? false);
    }
  }, [latestProductsData, latestProductsPage]);

  // Load more products (infinite scroll)
  const loadMoreLatestProducts = useCallback(async () => {
    if (!latestProductsHasMore || productsLoading || productsFetching) return;
    const nextPage = latestProductsPage + 1;
    setLatestProductsPage(nextPage);
    await fetchLatestProducts({ page: nextPage, limit: 10 });
  }, [latestProductsHasMore, productsLoading, productsFetching, fetchLatestProducts, latestProductsPage]);

  // Refresh products (pull-to-refresh)
  const refreshLatestProducts = useCallback(async () => {
    setLatestProductsPage(1);
    setAllLatestProducts([]);
    setLatestProductsHasMore(true);
    const result = await fetchLatestProducts({ page: 1, limit: 10 });
    return result;
  }, [fetchLatestProducts]);

  // Pre-fetch all categories
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
    // Optionally refresh products as well
    await refreshLatestProducts();
    console.log(`Pre-fetch complete: ${successful}/${APP_CATEGORIES.length} categories loaded`);
    return results;
  };

  // Get cached data for a specific category
  const getCategoryStores = (categoryName) => {
    return fetchStoresByCategory({
      category: categoryName,
      page: 1,
      limit: 10,
    }, true);
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
    latestProducts: allLatestProducts,               // ← now paginated
    reels: allReels || [],
    recentlyViewed,
    categories,
    selectedCategory,
    hasMore,
    latestProductsHasMore,                          // ← expose hasMore for products
    // Loading states
    isLoading: storeLoading || categoryStoresLoading || productsLoading || reelsLoading,
    productsLoading,          
    error: storeError || categoryError || productsError,

    // Actions
    addRecentlyViewedStore,
    addRecentlyViewedProduct,
    setSelectedCategory,
    refetchStore,
    getStoresByCategory,
    preFetchAllCategories,
    loadMoreReels,
    refreshReels,
    refetchReels,
    // Product pagination actions
    loadMoreLatestProducts,                         // ← new
    refreshLatestProducts,                          // ← new (also acts as refetch)
    refetchProducts: refreshLatestProducts,         // ← backward compatibility
  };
};