// hooks/useSearch.js
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchActions } from '../store/slices/search.slice';
import { useSearchProductsQuery } from '../services/api/product.api';
import { useGetStoresQuery } from '../services/api/store.api';
import { debounce } from '../utils/helpers';

export const useSearch = () => {
  const dispatch = useDispatch();
  const { recentSearches, filters } = useSelector((state) => state.search);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'stores', 'reels'

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.length >= 2) {
        dispatch(searchActions.addRecentSearch(searchQuery));
      }
    }, 500),
    []
  );

  // Search products
  const {
    data: productResults,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useSearchProductsQuery(
    { q: query, ...filters },
    { skip: query.length < 2 }
  );

  // Search stores
  const {
    data: storeResults,
    isLoading: storesLoading,
  } = useGetStoresQuery(
    { search: query, ...filters },
    { skip: query.length < 2 }
  );

  const handleSearch = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const updateFilters = (newFilters) => {
    dispatch(searchActions.updateFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(searchActions.clearFilters());
  };

  const clearRecentSearches = () => {
    dispatch(searchActions.clearRecentSearches());
  };

  return {
    // State
    query,
    activeTab,
    recentSearches,
    filters,
    
    // Results
    products: productResults?.products || [],
    stores: storeResults?.stores || [],
    totalResults: productResults?.total || 0,
    
    // Loading states
    isLoading: productsLoading || storesLoading,
    
    // Actions
    handleSearch,
    setActiveTab,
    updateFilters,
    clearFilters,
    clearRecentSearches,
    refetchProducts,
  };
};