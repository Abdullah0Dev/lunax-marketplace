// hooks/useProduct.js
import { useDispatch, useSelector } from 'react-redux';
import { exploreActions } from '../store/slices/explore.slice';
import { favoritesActions } from '../store/slices/favorites.slice';
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetStoreProductsQuery,
} from '../services/api/product.api';
import { useGetProductDiscountQuery } from '../services/api/discount.api';

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

  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
  } = useGetRelatedProductsQuery(productId, {
    skip: !productId,
  });

  // Fetch product discount
  const {
    data: discount,
    isLoading: discountLoading,
  } = useGetProductDiscountQuery(productId, {
    skip: !productId,
  });

  // Add to recently viewed when product loads
  if (product && !productLoading) {
    dispatch(exploreActions.addRecentlyViewedProduct(product));
  }

  const isFavorite = favorites.products.some(p => p.id === productId);
  
  const toggleFavorite = () => {
    if (product) {
      dispatch(favoritesActions.toggleFavoriteProduct(product));
    }
  };

  return {
    // Product data
    product,
    relatedProducts: relatedProducts || [],
    discount,
    finalPrice: discount ? product?.price * (1 - discount.amount / 100) : product?.price,
    
    // States
    isLoading: productLoading || relatedLoading || discountLoading,
    error: productError,
    isFavorite,
    
    // Actions
    toggleFavorite,
    refetchProduct,
  };
};