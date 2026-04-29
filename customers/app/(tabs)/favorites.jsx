import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { favoritesActions } from "../../services/store/slices/favorites.slice";
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProduct } from "../../hooks/useProduct";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const FavoritesTab = () => {
  const dispatch = useDispatch();
  const { favorites, toggleFavorite } = useProduct();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
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

  // Get favorites from Redux store
  const favoriteProducts = useSelector((state) => state.favorites.products);
  const favoriteStores = useSelector((state) => state.favorites.stores);

  // Combine favorites for display
  const allFavorites = useMemo(() => {
    return [
      ...favoriteProducts.map((p) => ({ ...p, type: "product" })),
      ...favoriteStores.map((s) => ({ ...s, type: "store" })),
    ];
  }, [favoriteProducts, favoriteStores]);

  const formatPrice = (price) => {
    return `${price.toLocaleString()} IQD`;
  };

  const getItemName = (item) => {
    if (item.type === "product") {
      return item.name?.kurdish || item.name?.english || item.title || "Product";
    } else {
      return item.name?.kurdish || item.name?.english || item.title?.kurdish || item.title?.english || "Store";
    }
  };

  const getItemImage = (item) => {
    if (item.type === "product") {
      return item.cover_image || item.thumbnail_url;
    } else {
      return item.logo || item.cover_image;
    }
  };

  const handleRemoveFromFavorite = useCallback(
    (item) => {
      const itemName = getItemName(item);
      Alert.alert(
        "Remove from Favorites",
        `Remove "${itemName}" from favorites?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              toggleFavorite(item);
            },
          },
        ],
      );
    },
    [toggleFavorite],
  );

  const handleNavigateToDetails = useCallback((item) => {
    if (item.type === "product") {
      // Navigate to product details
      const enhancedProduct = {
        ...item,
        storeDetails: item.store_id ? {
          id: item.store_id.id,
          name: item.store_id.name?.kurdish || item.store_id.name?.english,
          logo: item.store_id.logo,
        } : null,
      };
      const stringifiedProduct = JSON.stringify(enhancedProduct);
      router.push({
        pathname: `/product/${item.id}`,
        params: { productData: stringifiedProduct },
      });
    } else {
      // Navigate to store page
      router.push(`/store/${item.id}`);
    }
  }, [router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - add your actual refresh logic if needed
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const renderRightActions = useCallback(
    (progress, dragX, item) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      
      return (
        <Animated.View style={[styles.swipeDelete, { opacity: trans }]}>
          <TouchableOpacity
            style={styles.swipeDeleteButton}
            onPress={() => handleRemoveFromFavorite(item)}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.swipeDeleteText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleRemoveFromFavorite],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const itemName = getItemName(item);
      const imageUrl = getItemImage(item);
      const hasDiscount = item.type === "product" && item.discount_price && item.discount_price < item.price;
      const discountPercentage = hasDiscount
        ? Math.round(((item.price - item.discount_price) / item.price) * 100)
        : 0;
      const displayPrice = item.type === "product" 
        ? (item.discount_price || item.price)
        : null;

      return (
        <Animated.View
          style={[
            styles.itemWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Swipeable
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item)
            }
            overshootRight={false}
            containerStyle={styles.swipeableContainer}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => handleNavigateToDetails(item)}
              style={styles.card}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cardImage}
                  defaultSource={require("../../assets/images/m62.png")}
                />
                
                {/* Type Badge */}
                {/* <View style={[
                  styles.typeBadge,
                    item.type === "product" ? styles.productBadge : styles.storeBadge
                ]}>
                  <Ionicons 
                    name={item.type === "product" ? "cube-outline" : "storefront-outline"} 
                    size={12} 
                    color="#fff" 
                  />
                  <Text style={styles.typeBadgeText}>
                    {item.type === "product" ? "Product" : "Store"}
                  </Text>
                </View> */}

                {/* Discount Badge for Products */}
                {hasDiscount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discountPercentage}%</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {itemName}
                </Text>
                
                {item.type === "product" && (
                  <>
                    {displayPrice && (
                      <View style={styles.priceContainer}>
                        {hasDiscount ? (
                          <>
                            <Text style={styles.discountedPrice}>
                              {formatPrice(displayPrice)}
                            </Text>
                            <Text style={styles.originalPrice}>
                              {formatPrice(item.price)}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.price}>
                            {formatPrice(displayPrice)}
                          </Text>
                        )}
                      </View>
                    )}
                    
                    {item.category && (
                      <View style={styles.categoryTag}>
                        <Ionicons name="pricetag-outline" size={10} color="#999" />
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    )}
                  </>
                )}
 
              </View>

              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleRemoveFromFavorite(item)}
              >
                <LinearGradient
                  colors={["#ff6b6b", "#ff4757"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.favoriteGradient}
                >
                  <Ionicons name="heart" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
          </Swipeable>
        </Animated.View>
      );
    },
    [handleNavigateToDetails, renderRightActions, fadeAnim, scaleAnim],
  );

  const renderHeader = useCallback(() => {
    const totalFavorites = allFavorites.length;
    
    return (
      <View style={styles.header}>
        <LinearGradient
          colors={["rgb(17, 67, 84)", "rgb(10, 186, 244)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons name="heart" size={28} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Favorites</Text>
              <Text style={styles.headerSubtitle}>
                {totalFavorites} {totalFavorites === 1 ? "item" : "items"} saved
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalFavorites}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }, [allFavorites.length]);

  const renderEmpty = useCallback(
    () => (
      <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
        </View>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Start adding products and stores to your favorites
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push("/(tabs)")}
        >
          <LinearGradient
            colors={["rgb(17, 67, 84)", "rgb(10, 186, 244)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreGradient}
          >
            <Text style={styles.exploreButtonText}>Start Exploring</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    ),
    [router, fadeAnim],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allFavorites}
        keyExtractor={(item) => `${item.type}_${item.id}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0ABAF4"
            colors={["#0ABAF4"]}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    marginBottom: hp("2%"),
  },

  headerGradient: {
    width: wp("92%"),
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: hp("2%"),
    shadowColor: "#0ABAF4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2.5%"),
    gap: wp("3%"),
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: "bold",
    color: "#fff",
  },

  headerSubtitle: {
    fontSize: RFPercentage(1.3),
    color: "rgba(255,255,255,0.8)",
    marginTop: hp("0.3%"),
  },

  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
  },

  headerBadgeText: {
    color: "#fff",
    fontSize: RFPercentage(1.6),
    fontWeight: "bold",
  },

  listContent: {
    paddingBottom: hp("10%"),
  },

  itemWrapper: {
    marginHorizontal: wp("4%"),
    marginBottom: hp("1.5%"),
  },

  swipeableContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: wp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },

  imageContainer: {
    position: "relative",
  },

  cardImage: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },

  typeBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: wp("1.5%"),
    paddingVertical: hp("0.3%"),
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  productBadge: {
    backgroundColor: "#0ABAF4",
  },

  storeBadge: {
    backgroundColor: "#ff6b6b",
  },

  typeBadgeText: {
    color: "#fff",
    fontSize: RFPercentage(1),
    fontWeight: "600",
  },

  discountBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    backgroundColor: "#ff6b6b",
    paddingHorizontal: wp("1.5%"),
    paddingVertical: hp("0.3%"),
    borderRadius: 8,
  },

  discountText: {
    color: "#fff",
    fontSize: RFPercentage(1),
    fontWeight: "bold",
  },

  cardContent: {
    flex: 1,
    marginLeft: wp("3%"),
    justifyContent: "center",
    gap: hp("0.5%"),
  },

  cardTitle: {
    color: "#000",
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    lineHeight: RFPercentage(2.4),
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },

  price: {
    fontSize: RFPercentage(1.6),
    color: "#0ABAF4",
    fontWeight: "bold",
  },

  discountedPrice: {
    fontSize: RFPercentage(1.6),
    color: "#0ABAF4",
    fontWeight: "bold",
  },

  originalPrice: {
    fontSize: RFPercentage(1.3),
    color: "#999",
    textDecorationLine: "line-through",
  },

  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },

  categoryText: {
    fontSize: RFPercentage(1.2),
    color: "#999",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },

  locationText: {
    fontSize: RFPercentage(1.2),
    color: "#999",
    flex: 1,
  },

  favoriteButton: {
    position: "absolute",
    top: wp("2%"),
    right: wp("2%"),
  },

  favoriteGradient: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  swipeDelete: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: wp("20%"),
    marginVertical: hp("0%"),
    borderRadius: 16,
    marginLeft: wp("2%"),
  },

  swipeDeleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: hp("0.5%"),
  },

  swipeDeleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.3),
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("25%"),
    paddingHorizontal: wp("10%"),
  },

  emptyIconContainer: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },

  emptyTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("1%"),
  },

  emptyText: {
    fontSize: RFPercentage(1.6),
    color: "#999",
    textAlign: "center",
    marginBottom: hp("3%"),
    lineHeight: RFPercentage(2.2),
  },

  exploreButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#0ABAF4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  exploreGradient: {
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("1.5%"),
  },

  exploreButtonText: {
    color: "#fff",
    fontSize: RFPercentage(1.6),
    fontWeight: "600",
  },
});

export default FavoritesTab;