import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView
} from "react-native";
import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

// API Hooks
import { useDiscountManagement } from "../../../../hooks/useStore";
import { useGetMyDiscountsQuery } from "../../../../services/api/discount.api";
import { useGetMyProductsQuery } from "../../../../services/api/product.api";
import { SafeAreaView } from "react-native-safe-area-context";
import { STORE_ID } from "../../../../utils";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

// Discount percentage options
const DISCOUNT_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 50];

export default function DiscountManagement({ navigation }) {
  // Get products for selection
  const { data: products = [], isLoading: loadingProducts } = useGetMyProductsQuery();
  const { data: discounts = [], refetch } = useGetMyDiscountsQuery();
  const creating = false
  const { createDiscount, toggleDiscount } = useDiscountManagement()
  // State
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name?.english?.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.name?.kurdish?.includes(productSearch) ||
    product.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const openDiscountModal = (discountValue) => {
    setSelectedDiscount(discountValue);
    setAmount(discountValue.toString());
    setModalVisible(true);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCreateDiscount = async () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product");
      return;
    }

    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 100) {
      Alert.alert("Error", "Please enter a valid discount amount (1-100)");
      return;
    }

    try {
      const storeId = STORE_ID; // Get from your store/context

      const discountData = {
        store_id: storeId,
        product_id: selectedProduct.id,
        amount: parseFloat(amount),
        endDate: endDate.toISOString(),
        isActive: true
      };

      await createDiscount(discountData).unwrap();

      Alert.alert("Success", "Discount created successfully!");
      setModalVisible(false);
      resetForm();
      refetch();
    } catch (error) {
      Alert.alert("Error", error?.data?.message || "Failed to create discount");
    }
  };

  const toggleDiscountStatus = async (discount) => {
    try {
      await toggleDiscount({
        id: discount.id,
        isActive: !discount.isActive
      }).unwrap();
      refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to update discount status");
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setAmount("");
    setEndDate(new Date());
    setProductSearch("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderDiscountCard = ({ item }) => {
    const product = products.find(p => p.id === item.product.id);

    return (
      <View style={styles.discountCard}>
        <Image
          source={{ uri: product?.cover_image || 'https://via.placeholder.com/100' }}
          style={styles.productImage}
        />

        <View style={styles.discountInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {product?.name?.english || product?.name?.kurdish}
          </Text>

          <View style={styles.discountBadge}>
            <Text style={styles.discountAmount}>{item.amount}% OFF</Text>
          </View>

          <View style={styles.discountMeta}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.metaText}>Until {formatDate(item.endDate)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.statusButton,
            item.isActive ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => toggleDiscountStatus(item)}
        >
          <Text style={styles.statusText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productItem,
        selectedProduct?.id === item.id && styles.selectedProduct
      ]}
      onPress={() => selectProduct(item)}
    >
      <Image source={{ uri: item.cover_image }} style={styles.productThumb} />
      <View style={styles.productDetails}>
        <Text style={styles.productItemName}>{item.name?.english}</Text>
        <Text style={styles.productItemPrice}>${item.price}</Text>
      </View>
      {selectedProduct?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Header */}
        <LinearGradient
          colors={['#11a1a1', '#f9fafb']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discount Management</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Discount Options Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Discount Percentage</Text>
          <View style={styles.discountGrid}>
            {DISCOUNT_OPTIONS.map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.discountOption}
                onPress={() => openDiscountModal(value)}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionText}>{value}%</Text>
                  <Text style={styles.optionSubtext}>OFF</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Discounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Discounts</Text>
          {discounts.length > 0 ? (
            <FlatList
              data={discounts}
              renderItem={renderDiscountCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.discountList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="pricetag-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No discounts yet</Text>
              <Text style={styles.emptySubtext}>Tap a percentage above to create one</Text>
            </View>
          )}
        </View>

        {/* Create Discount Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create {selectedDiscount}% Discount</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Product Search */}
              <Text style={styles.label}>Select Product</Text>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  value={productSearch}
                  onChangeText={setProductSearch}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Products List */}
              {loadingProducts ? (
                <ActivityIndicator size="large" color="#16a34a" style={styles.loader} />
              ) : (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={item => item.id}
                  style={styles.productList}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text style={styles.noProducts}>No products found</Text>
                  }
                />
              )}

              {/* Discount Amount */}
              <Text style={styles.label}>Discount Amount (%)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter discount percentage"
                maxLength={3}
              />

              {/* Expiration Date */}
              <Text style={styles.label}>Expiration Date</Text>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#6b7280" />
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              )}

              {/* Selected Product Summary */}
              {selectedProduct && (
                <View style={styles.selectedSummary}>
                  <Image source={{ uri: selectedProduct.cover_image }} style={styles.summaryImage} />
                  <View style={styles.summaryDetails}>
                    <Text style={styles.summaryName}>{selectedProduct.name?.english}</Text>
                    <Text style={styles.summaryPrice}>${selectedProduct.price}</Text>
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateDiscount}
                  disabled={creating}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.createText}>Create Discount</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  backButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  section: {
    padding: wp('4%'),
  },

  sectionTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp('2%'),
  },

  discountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  discountOption: {
    width: isTablet ? wp('20%') : wp('27%'),
    marginBottom: 12,
  },

  optionGradient: {
    padding: wp('4%'),
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  optionText: {
    fontSize: RFPercentage(2.4),
    fontWeight: "bold",
    color: "#fff",
  },

  optionSubtext: {
    fontSize: RFPercentage(1.4),
    color: "#fff",
    opacity: 0.9,
  },

  discountList: {
    paddingBottom: hp('2%'),
  },

  discountCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: wp('3%'),
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },

  discountInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  productName: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  discountBadge: {
    backgroundColor: '#fee2e2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },

  discountAmount: {
    color: '#ef4444',
    fontWeight: "700",
    fontSize: RFPercentage(1.6),
  },

  discountMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: RFPercentage(1.4),
    color: "#6b7280",
  },

  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  activeButton: {
    backgroundColor: '#d1fae5',
  },

  inactiveButton: {
    backgroundColor: '#fee2e2',
  },

  statusText: {
    fontSize: RFPercentage(1.4),
    fontWeight: "600",
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },

  emptyText: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: RFPercentage(1.6),
    color: "#9ca3af",
    textAlign: 'center',
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp('5%'),
    maxHeight: hp('80%'),
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  modalTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  label: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: RFPercentage(1.8),
  },

  productList: {
    maxHeight: hp('30%'),
    marginBottom: 12,
  },

  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedProduct: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },

  productThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productItemName: {
    fontSize: RFPercentage(1.8),
    fontWeight: "500",
    color: "#111",
  },

  productItemPrice: {
    fontSize: RFPercentage(1.6),
    color: "#16a34a",
    fontWeight: "600",
  },

  noProducts: {
    textAlign: 'center',
    color: "#9ca3af",
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: RFPercentage(1.8),
    marginBottom: 12,
  },

  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },

  dateText: {
    fontSize: RFPercentage(1.8),
    color: "#111",
  },

  selectedSummary: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86efac',
  },

  summaryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  summaryDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  summaryName: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#111",
  },

  summaryPrice: {
    fontSize: RFPercentage(1.6),
    color: "#16a34a",
    fontWeight: "600",
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  createButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  createText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  loader: {
    padding: 20,
  },
});