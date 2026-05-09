import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { isTablet, storeData } from "../../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useExplore } from "../../hooks/useExplore";
import { FlashList } from "@shopify/flash-list";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - wp("10%")) / 2;

const StoreTab = () => {
  const router = useRouter();
  const {
    latestProducts,
    productsLoading,
    loadMoreLatestProducts,
    latestProductsHasMore,
    refreshLatestProducts,
  } = useExplore();

  // Transform data for rendering with discount calculation
  const itemData = latestProducts.map((prod) => {
    const hasDiscount = prod.discount_price && prod.discount_price < prod.price;
    const discountPercentage = hasDiscount
      ? Math.round(((prod.price - prod.discount_price) / prod.price) * 100)
      : 0;

    return {
      ...prod,
      title: prod.name.kurdish || prod.name.english,
      image: prod.cover_image,
      storeImage: prod.store_id?.logo,
      storeName: prod.store_id?.name?.kurdish || prod.store_id?.name?.english,
      price: prod.price,
      discount_price: prod.discount_price,
      hasDiscount,
      discountPercentage,
      rating: prod.rating || 4.5,
    };
  });

  const handleViewProduct = (productId, product) => {
    const storeDetails = product.store;
    const enhancedProduct = {
      ...product,
      storeDetails: {
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
    const url = `/product/${productId}`;
    router.navigate({
      pathname: url,
      params: {
        storeData: stringifiedProduct,
      },
    });
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} IQD`;
  };

  // Header component with gradient and stats
  const Header = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={["rgb(17, 67, 84)", "rgb(10, 186, 244)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Image
            source={require("../../assets/images/m911.png")}
            style={styles.headerIcon}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>بەرهەمێن نوێ</Text>
            <Text style={styles.headerSubtitle}>نوێترین و باشترین بەرهەم</Text>
          </View>
          <View style={styles.statsBadge}>
            <Text style={styles.statsBadgeText}>{itemData.length}+</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Banner */}
      {/* <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <FontAwesome6 name="fire" size={16} color="#0ABAF4" />
          <Text style={styles.statText}>New Arrivals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="pricetag" size={16} color="#0ABAF4" />
          <Text style={styles.statText}>Best Deals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="flash" size={16} color="#0ABAF4" />
          <Text style={styles.statText}>Limited Time</Text>
        </View>
      </View> */}
    </View>
  );

  // Footer loading indicator
  const Footer = () => {
    if (!productsLoading && !latestProductsHasMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#0ABAF4" />
        {productsLoading && (
          <Text style={styles.loadingText}>Loading more products...</Text>
        )}
        {!latestProductsHasMore && itemData.length > 0 && (
          <Text style={styles.endText}>✨ No more products to show</Text>
        )}
      </View>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptyText}>
        Check back later for new products and deals
      </Text>
    </View>
  );

  // Render each product item with enhanced design
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewProduct(item.id, item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />

        {/* Discount Badge */}
        {item.hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
          </View>
        )}

        {/* Store Logo Overlay */}
        {item.storeImage && (
          <View style={styles.storeLogoContainer}>
            <Image source={item.storeImage} style={styles.storeLogo} />
          </View>
        )}

        {/* Price Tag */}
        <View
          style={[
            styles.priceTag,
            item.hasDiscount && styles.priceTagDiscounted,
          ]}
        >
          {item.hasDiscount ? (
            <>
              <Text style={styles.discountedPriceText}>
                {formatPrice(item.discount_price)}
              </Text>
              <Text style={styles.originalPriceText}>
                {formatPrice(item.price)}
              </Text>
            </>
          ) : (
            <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
          )}
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.storeInfo}>
          <Ionicons name="storefront-outline" size={12} color="#999" />
          <Text style={styles.storeName} numberOfLines={1}>
            {item.storeName || "Unknown Store"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={itemData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        ListEmptyComponent={EmptyState}
        onEndReached={loadMoreLatestProducts}
        onEndReachedThreshold={0.5}
        onRefresh={refreshLatestProducts}
        refreshing={productsLoading && latestProducts.length === 0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        estimatedItemSize={300}
      />
    </SafeAreaView>
  );
};

export default StoreTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  contentContainer: {
    paddingBottom: isTablet ? hp("10%") : hp("15%"),
  },

  headerContainer: {
    marginTop: isTablet ? hp("2%") : hp("2%"),
    marginBottom: hp("2%"),
  },

  headerGradient: {
    width: wp("92%"),
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
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
    paddingVertical: hp("2%"),
    gap: wp("3%"),
  },

  headerIcon: {
    width: isTablet ? wp("10%") : wp("15%"),
    height: isTablet ? hp("8%") : hp("7%"),
    resizeMode: "contain",
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: RFPercentage(2.2),
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "k24",
  },

  headerSubtitle: {
    fontSize: RFPercentage(1.3),
    color: "rgba(255,255,255,0.8)",
    marginTop: hp("0.3%"),
  },

  statsBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
  },

  statsBadgeText: {
    color: "#fff",
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
  },

  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: wp("4%"),
    marginTop: hp("1.5%"),
    paddingVertical: hp("1.2%"),
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
    fontSize: RFPercentage(1.3),
    color: "#333",
    fontWeight: "500",
  },

  card: {
    flex: 1,
    margin: wp("2%"),
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

  productImage: {
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

  storeLogoContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  storeLogo: {
    width: isTablet ? wp("8%") : wp("10%"),
    height: isTablet ? hp("6%") : hp("5%"),
    borderRadius: 50,
    resizeMode: "contain",
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
    backgroundColor: "rgba(10,186,244,0.95)",
  },

  priceText: {
    color: "#fff",
    fontSize: RFPercentage(1.4),
    fontWeight: "bold",
  },

  discountedPriceText: {
    color: "#fff",
    fontSize: RFPercentage(1.4),
    fontWeight: "bold",
  },

  originalPriceText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: RFPercentage(1.1),
    textDecorationLine: "line-through",
  },

  cardContent: {
    padding: wp("3%"),
  },

  productTitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "600",
    color: "#000",
    marginBottom: hp("0.5%"),
    lineHeight: RFPercentage(2.2),
  },

  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    marginBottom: hp("0.5%"),
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

  dotSeparator: {
    fontSize: RFPercentage(1.2),
    color: "#ccc",
  },

  newBadge: {
    fontSize: RFPercentage(1.1),
    color: "#0ABAF4",
    fontWeight: "600",
  },

  footerLoader: {
    paddingVertical: hp("3%"),
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: hp("1%"),
    fontSize: RFPercentage(1.5),
    color: "#0ABAF4",
    fontFamily: "k24",
  },

  endText: {
    marginTop: hp("1%"),
    fontSize: RFPercentage(1.5),
    color: "#888",
    fontFamily: "k24",
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
    fontFamily: "k24",
  },

  emptyText: {
    fontSize: RFPercentage(1.6),
    color: "#999",
    textAlign: "center",
    lineHeight: RFPercentage(2.2),
    fontFamily: "k24",
  },
});
