import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";
import { useSearchProductsQuery } from "../../../services/api/product.api";
import { useProduct } from "../../../hooks/useProduct";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - wp("10%")) / 2;

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { toggleFavorite, favorites } = useProduct();

  // Use the search query hook
  const {
    data: searchResults,
    isLoading,
    error,
    isFetching,
  } = useSearchProductsQuery(
    { q: query },
    { skip: !query.trim() }, // Skip if query is empty
  );

  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const products = searchResults?.products || [];
  const totalResults = searchResults?.total || 0;

  const productData = products.map((item) => {
    const discountPercentage = item.discount_price
      ? ((item.price - item.discount_price) / item.price) * 100
      : 0;
    console.log("item: ", item);

    return {
      id: item.id,
      name: item.name.kurdish || item.name.english,
      image: { uri: item.cover_image },
      price: item.price,
      discount_price: item.discount_price,
      category: item.category,
      discount: discountPercentage,
      // later
      description: item.description,
      quantity: item.quantity,
      media: item.media,
      store: item.store,
      cover_image: item.cover_image,
      quantity: item.quantity,
      specifications: item.specifications,
    };
  });
  // Sample data with local assets and discount info
  const data = [
    {
      id: "1",
      name: "MacBook Pro",
      originalPrice: 1299,
      price: 1099,
      discount: 15,
      category: "Laptops",
      image: require("../../../assets/images/m920.webp"),
    },
    {
      id: "2",
      name: "Dell XPS",
      originalPrice: 1199,
      price: 1199,
      discount: 0,
      category: "Laptops",
      image: require("../../../assets/images/m920.webp"),
    },
    {
      id: "3",
      name: "HP Spectre",
      originalPrice: 1099,
      price: 899,
      discount: 18,
      category: "Laptops",
      image: require("../../../assets/images/m920.webp"),
    },
    {
      id: "4",
      name: "Lenovo ThinkPad",
      originalPrice: 999,
      price: 999,
      discount: 0,
      category: "Laptops",
      image: require("../../../assets/images/m920.webp"),
    },
    {
      id: "5",
      name: "Asus ROG",
      originalPrice: 1499,
      price: 1299,
      discount: 13,
      category: "Gaming",
      image: require("../../../assets/images/m920.webp"),
    },
    {
      id: "6",
      name: "Acer Swift",
      originalPrice: 799,
      price: 699,
      discount: 12,
      category: "Laptops",
      image: require("../../../assets/images/m920.webp"),
    },
  ];

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!query.trim()) return [];
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  // Animate on mount
  React.useEffect(() => {
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

  // Handle search with debounce
  const handleSearch = useCallback(async (text) => {
    setQuery(text);
    setIsSearching(true);
    setTimeout(() => {
      console.log("searchResults: ", productData, "products", products);
      setIsSearching(false);
    }, 300);
  }, []);

  // Handle product press with animation
  const handleProductPress = useCallback(
    (item) => {
      const storeDetails = item.store;
      console.log("storeDetails: ", storeDetails);

      const enhancedProduct = {
        ...item, // Spread all existing product properties
        storeDetails: {
          // Add store details as a nested object
          id: storeDetails.id,
          number: storeDetails.phone_number.replace("+964", "0"),
          name: storeDetails.name.kurdish || storeDetails.name.english,
          location: storeDetails.address,
          subtitle: "",
          description: storeDetails.description,
          logo: storeDetails.logo,
        },
      };
      const stringifiedProduct = JSON.stringify(enhancedProduct);
      console.log("stringifiedProduct: ", stringifiedProduct);
      const url = `/product/${item.id}`;

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      router.navigate({
        pathname: url,
        params: {
          storeData: stringifiedProduct,
        },
      });
    },
    [router],
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    searchInputRef.current?.focus();
  }, []);

  // Format price with currency
  const formatPrice = (price) => {
    return `IQD ${price.toLocaleString()}`;
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      const hasDiscount = item.discount > 0;
      const discountPercentage = item.discount.toFixed(0);
      const isFavorite =
        favorites.products.length > 0
          ? favorites.products?.some((prod) => prod?.id === item.id)
          : false;
      return (
        <Animated.View
          style={[
            styles.itemContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleProductPress(item)}
            style={styles.card}
          >
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />

              {/* Discount Badge */}
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{discountPercentage}%
                  </Text>
                </View>
              )}

              {/* Price Tag with Discount Highlight */}
              <View
                style={[
                  styles.priceTag,
                  hasDiscount && styles.priceTagDiscounted,
                ]}
              >
                {hasDiscount ? (
                  <>
                    <Text style={styles.discountedPriceText}>
                      {formatPrice(item.discount_price)}
                    </Text>
                    <Text style={styles.originalPriceText}>
                      {formatPrice(item.price)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.priceText}>
                    {formatPrice(item.price)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => {
                toggleFavorite(item);
              }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color="#ff6b6b"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleProductPress, formatPrice],
  );

  const renderEmpty = useCallback(() => {
    if (!query.trim()) {
      return (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Search Products</Text>
          <Text style={styles.emptyText}>
            Type something to search for products, stores, or categories
          </Text>
        </Animated.View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
        <Ionicons name="sad-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptyText}>
          We couldn't find anything for "{query.slice(0, 30)}". Try different
          keywords.
        </Text>
      </Animated.View>
    );
  }, [query, isSearching, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#ff6b6b" />
          <TextInput
            ref={searchInputRef}
            placeholder="Search products, stores..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleSearch}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Results Count */}
      {productData.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {productData.length}{" "}
            {productData.length === 1 ? "result" : "results"} found
          </Text>
        </View>
      )}

      {/* Grid */}
      <FlatList
        data={productData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingTop: Platform.OS === "ios" ? hp("6%") : hp("4%"),
    paddingBottom: hp("2%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  backButton: {
    padding: wp("1%"),
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: wp("3%"),
    marginLeft: wp("2%"),
    height: hp("5.5%"),
  },

  searchInput: {
    flex: 1,
    fontSize: RFPercentage(1.8),
    marginLeft: wp("2%"),
    color: "#000",
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },

  clearButton: {
    padding: wp("1%"),
  },

  resultsHeader: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  resultsText: {
    fontSize: RFPercentage(1.6),
    color: "#666",
    fontWeight: "500",
  },

  listContent: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("10%"),
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

  priceTagDiscounted: {
    backgroundColor: "rgba(255,107,107,0.95)",
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
    marginBottom: hp("0.5%"),
  },

  categoryText: {
    fontSize: RFPercentage(1.4),
    color: "#999",
  },

  favoriteButton: {
    position: "absolute",
    top: wp("2%"),
    right: wp("2%"),
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: wp("2%"),
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
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

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("20%"),
  },

  loadingText: {
    fontSize: RFPercentage(1.6),
    color: "#999",
    marginTop: hp("2%"),
  },
});
