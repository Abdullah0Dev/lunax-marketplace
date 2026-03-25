// hooks/useProduct.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exploreActions } from '../services/store/slices/explore.slice';
import { favoritesActions } from '../services/store/slices/favorites.slice';
import {
  useGetProductByIdQuery,
  useGetLatestProductsQuery, // For related products
} from '../services/api/product.api';

export const useProduct = (productId) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  // Fetch product details
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
    refetch: refetchProduct,
  } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  // Fetch related products (using latest products as related)
  const {
    data: relatedData,
    isLoading: relatedLoading,
  } = useGetLatestProductsQuery({ page: 1, limit: 10 }, {
    skip: !productId,
  });

  // Add to recently viewed when product loads
  useEffect(() => {
    if (product && !productLoading) {
      dispatch(exploreActions.addRecentlyViewedProduct(product));
    }
  }, [product, productLoading, dispatch]);

  const isFavorite = favorites.products.some(p => p.id === productId);

  const toggleFavorite = (customProduct = null) => {
    const productToToggle = customProduct || product;
    console.log("data to add: ", productToToggle);

    if (productToToggle) {
      dispatch(favoritesActions.toggleFavoriteProduct(productToToggle));
    }
  };

  // Calculate final price (product may have discount_price from API transform)
  const finalPrice = product?.discount_price || product?.price;

  return {
    // Product data
    product,
    relatedProducts: relatedData?.products || [],
    finalPrice,
    hasDiscount: !!product?.discount_price,

    // States
    isLoading: productLoading || relatedLoading,
    error: productError,
    isFavorite,
    favorites,
    // Actions
    toggleFavorite,
    refetchProduct,
  };
};