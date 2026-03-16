// hooks/useStore.js
import { useMemo } from 'react';
import { useGetMyStoreQuery, useUpdateStoreMutation } from '../services/api/store.api';
import { useCreateProductMutation, useDeleteProductMutation, useGetMyProductsQuery, useUpdateProductMutation, useUpdateQuantityMutation } from '../services/api/product.api';
import { useDeleteReelMutation, useGetMyReelsQuery, useGetUploadLimitQuery, useUpdateReelMutation, useUploadReelMutation } from '../services/api/reel.api';
import { useCreateDiscountMutation, useDeleteDiscountMutation, useGetMyDiscountsQuery, useToggleDiscountMutation, useUpdateDiscountMutation } from '../services/api/discount.api';

export const useStoreDashboard = () => {
  const { data: store, isLoading: storeLoading, error: storeError } = useGetMyStoreQuery();
  const { data: products, isLoading: productsLoading } = useGetMyProductsQuery();
  const { data: reels, isLoading: reelsLoading } = useGetMyReelsQuery();
  const { data: discounts, isLoading: discountsLoading } = useGetMyDiscountsQuery();

  const stats = useMemo(() => ({
    totalProducts: products?.length || 0,
    totalReels: reels?.length || 0,
    totalDiscounts: discounts?.length || 0,
    todayReels: reels?.filter(r => 
      new Date(r.createdAt).toDateString() === new Date().toDateString()
    ).length || 0,
  }), [products, reels, discounts]);

  return {
    store,
    products,
    reels,
    discounts,
    stats,
    isLoading: storeLoading || productsLoading || reelsLoading || discountsLoading,
    error: storeError,
  };
};

export const useProductManagement = () => {
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateQuantity] = useUpdateQuantityMutation();

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
  };
};

export const useReelManagement = () => {
  const { data: limit } = useGetUploadLimitQuery();
  const [uploadReel] = useUploadReelMutation();
  const [updateReel] = useUpdateReelMutation();
  const [deleteReel] = useDeleteReelMutation();

  const canUploadToday = limit?.remaining > 0;

  return {
    uploadReel,
    updateReel,
    deleteReel,
    uploadLimit: limit,
    canUploadToday,
  };
};

export const useDiscountManagement = () => {
  const [createDiscount] = useCreateDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();
  const [deleteDiscount] = useDeleteDiscountMutation();
  const [toggleDiscount] = useToggleDiscountMutation();

  return {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    toggleDiscount,
  };
};