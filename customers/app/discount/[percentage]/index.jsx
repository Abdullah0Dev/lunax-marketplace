import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProduct } from "../../../hooks/useProduct";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - wp("10%")) / 2;
const isTablet = width >= 768;

// Dummy discount products data
const DISCOUNT_PRODUCTS = [
  {
    id: "1",
    name: {
      kurdish: "مۆبایل سامسۆنگ Galaxy S23",
      english: "Samsung Galaxy S23",
    },
    cover_image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    price: 899,
    discount_price: 719,
    category: "Electronics",
    store: {
      id: "store1",
      name: { kurdish: "تیکنۆ شۆپ", english: "Techno Shop" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 20,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: { kurdish: "لەپتۆپ Dell XPS 15", english: "Dell XPS 15 Laptop" },
    cover_image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
    price: 1499,
    discount_price: 1124,
    category: "Electronics",
    store: {
      id: "store2",
      name: { kurdish: "کۆمپیوتەر وۆرڵد", english: "Computer World" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 25,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "3",
    name: { kurdish: "گوشەک AirPods Pro", english: "AirPods Pro" },
    cover_image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500",
    price: 249,
    discount_price: 199,
    category: "Audio",
    store: {
      id: "store1",
      name: { kurdish: "تیکنۆ شۆپ", english: "Techno Shop" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 20,
    rating: 4.7,
    reviews: 234,
  },
  {
    id: "4",
    name: { kurdish: "ساعت Smart Watch Ultra", english: "Smart Watch Ultra" },
    cover_image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    price: 399,
    discount_price: 279,
    category: "Wearables",
    store: {
      id: "store3",
      name: { kurdish: "تەکنەلۆجی ژیان", english: "Life Technology" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 30,
    rating: 4.6,
    reviews: 167,
  },
  {
    id: "5",
    name: { kurdish: "کامێرا Sony A7 III", english: "Sony A7 III Camera" },
    cover_image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    price: 1999,
    discount_price: 1599,
    category: "Photography",
    store: {
      id: "store2",
      name: { kurdish: "کۆمپیوتەر وۆرڵد", english: "Computer World" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 20,
    rating: 4.9,
    reviews: 56,
  },
  {
    id: "6",
    name: { kurdish: "تابلێت iPad Pro", english: "iPad Pro" },
    cover_image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    price: 1099,
    discount_price: 879,
    category: "Electronics",
    store: {
      id: "store1",
      name: { kurdish: "تیکنۆ شۆپ", english: "Techno Shop" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 20,
    rating: 4.8,
    reviews: 312,
  },
  {
    id: "7",
    name: { kurdish: "سەرمایە 50%", english: "50% Winter Jacket" },
    cover_image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
    price: 199,
    discount_price: 99,
    category: "Fashion",
    store: {
      id: "store4",
      name: { kurdish: "فەیشن ستۆر", english: "Fashion Store" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 50,
    rating: 4.4,
    reviews: 89,
  },
  {
    id: "8",
    name: { kurdish: "پێڵاو Nike Air Max", english: "Nike Air Max Shoes" },
    cover_image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    price: 149,
    discount_price: 104,
    category: "Fashion",
    store: {
      id: "store4",
      name: { kurdish: "فەیشن ستۆر", english: "Fashion Store" },
      logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    },
    discount_percentage: 30,
    rating: 4.7,
    reviews: 234,
  },
];

const DiscountProductsPage = () => {
  const router = useRouter();
  const { percentage } = useLocalSearchParams();
  const { discountedProduct } = useProduct();
  console.log("percentage: ", discountedProduct);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(percentage);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter products by discount percentage
  const filteredProducts = discountedProduct?.filter((product) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "10") return product?.discount_percentage >= 10;
    if (selectedFilter === "15") return product?.discount_percentage >= 15;
    if (selectedFilter === "20") return product?.discount_percentage >= 20;
    if (selectedFilter === "25") return product?.discount_percentage >= 25;
    if (selectedFilter === "30") return product?.discount_percentage >= 30;
    if (selectedFilter === "35") return product?.discount_percentage >= 35;
    if (selectedFilter === "40") return product?.discount_percentage >= 40;
    if (selectedFilter === "50") return product?.discount_percentage >= 50;
    return true;
  }) ?? [];

  const formatPrice = (price) => {
    return `${price.toLocaleString()} IQD`;
  };

  const handleProductPress = (product) => {
    const testProduct = discountedProduct[0]
    const storeDetails = testProduct.store_id;
    console.log("storeDetails: ", testProduct);
// return;
    const enhancedProduct = {
      ...product,
      id: product._id,
      storeDetails: {
        id: storeDetails?._id,
        number: storeDetails?.phone_number.replace("+964", "0"),
        name: storeDetails?.name.kurdish || storeDetails?.name.english,
        location: storeDetails?.address,
        subtitle: "",
        description: storeDetails?.description,
        logo: storeDetails?.logo,
      },
    };
    const stringifiedProduct = JSON.stringify(enhancedProduct);
    const url = `/product/${product.id}`;
    router.push({
      pathname: url,
      params: {
        storeData: stringifiedProduct,
      },
    });
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleProductPress(item)}
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.cover_image }} style={styles.image} />

          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{item.discount_percentage}%
            </Text>
          </View>

          {/* Price Tag */}
          <View style={styles.priceTag}>
            <Text style={styles.discountedPriceText}>
              {formatPrice(item.discount_price)}
            </Text>
            <Text style={styles.originalPriceText}>
              {formatPrice(item.price)}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name.english}
          </Text>

          <View style={styles.storeInfo}>
            <Image source={{ uri: item.store_id.logo }} style={styles.storeLogo} />
            <Text style={styles.storeName} numberOfLines={1}>
              {item.store_id.name.english}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(value)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === value && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Blur Effect */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Discount Deals</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts.length} products on sale
          </Text>
        </View>

        <TouchableOpacity style={styles.filterIconButton}>
          <BlurView intensity={80} tint="dark" style={styles.filterBlur}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          data={[
            { label: "All Deals", value: "all" },
            { label: "10% Off", value: "10" },
            { label: "15% Off", value: "15" },
            { label: "20% Off", value: "20" },
            { label: "25% Off", value: "25" },
            { label: "30% Off", value: "30" },
            { label: "35% Off", value: "35" },
            { label: "40% Off", value: "40" },
            { label: "50%+ Off", value: "50" },
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <FilterButton label={item.label} value={item.value} />
          )}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <FontAwesome6 name="tag" size={18} color="#ff6b6b" />
          <Text style={styles.statText}>Up to 50% OFF</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="flash" size={18} color="#ff6b6b" />
          <Text style={styles.statText}>Limited Time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="thumbs-up" size={18} color="#ff6b6b" />
          <Text style={styles.statText}>Amazing Deals</Text>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptyText}>
              No products with this discount percentage available right now
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default DiscountProductsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingTop: Platform.OS === "ios" ? hp("6%") : hp("4%"),
    paddingBottom: hp("2%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  backButton: {
    width: wp("10%"),
    height: wp("10%"),
  },

  backButtonBlur: {
    width: "100%",
    height: "100%",
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: "bold",
    color: "#000",
  },

  headerSubtitle: {
    fontSize: RFPercentage(1.4),
    color: "#ff6b6b",
    marginTop: hp("0.3%"),
  },

  filterIconButton: {
    width: wp("10%"),
    height: wp("10%"),
  },

  filterBlur: {
    width: "100%",
    height: "100%",
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  filterList: {
    paddingHorizontal: wp("4%"),
    gap: wp("2%"),
  },

  filterButton: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: wp("2%"),
  },

  filterButtonActive: {
    backgroundColor: "#ff6b6b",
  },

  filterText: {
    fontSize: RFPercentage(1.4),
    color: "#666",
    fontWeight: "500",
  },

  filterTextActive: {
    color: "#fff",
  },

  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: wp("4%"),
    marginTop: hp("1.5%"),
    marginBottom: hp("1.5%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("2%"),
  },

  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },

  statText: {
    fontSize: RFPercentage(1.4),
    color: "#333",
    fontWeight: "500",
  },

  listContent: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("10%"),
    paddingTop: hp("1%"),
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  itemContainer: {
    width: CARD_WIDTH,
    marginBottom: hp("2%"),
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff6b6b",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
    zIndex: 2,
  },

  discountText: {
    color: "#fff",
    fontSize: RFPercentage(1.2),
    fontWeight: "bold",
  },

  priceTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },

  priceText: {
    color: "#fff",
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
  },

  discountedPriceText: {
    color: "#fff",
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
  },

  originalPriceText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: RFPercentage(1.2),
    textDecorationLine: "line-through",
    fontWeight: "normal",
  },

  cardContent: {
    padding: wp("3%"),
  },

  productName: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#000",
    marginBottom: hp("0.8%"),
  },

  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.5%"),
    gap: wp("1.5%"),
  },

  storeLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  storeName: {
    fontSize: RFPercentage(1.2),
    color: "#999",
    flex: 1,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },

  ratingText: {
    fontSize: RFPercentage(1.2),
    color: "#666",
    fontWeight: "600",
  },

  reviewsText: {
    fontSize: RFPercentage(1.1),
    color: "#999",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("20%"),
    paddingHorizontal: wp("10%"),
  },

  emptyTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: "bold",
    color: "#000",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },

  emptyText: {
    fontSize: RFPercentage(1.6),
    color: "#999",
    textAlign: "center",
    lineHeight: RFPercentage(2.2),
  },
});
