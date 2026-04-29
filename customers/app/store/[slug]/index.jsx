import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { adImages, categoriesData, isTablet } from "../../../constants";
import { getPaletteByName } from "../../../constants/Colors";
import VideoCard from "../../../components/VideoCard";
import { useCallback, useState, useRef, useEffect } from "react";
import SlidingBox from "../../../components/SlidingBox";
import { FlashList } from "@shopify/flash-list";
import { defaultStyles } from "../../../constants/style";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - wp("10%")) / 2;

const StorePage = () => {
  const router = useRouter();
  const { slug, gradient, title, store, fromProduct } = useLocalSearchParams();
  const storeDetails = fromProduct ? JSON.parse(store) : JSON.parse(store)[0];
  const storeProducts = storeDetails.products;
  const [activeIndex, setActiveIndex] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
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

  const addAllCategories = storeDetails.products.length > 0 ? ["all"] : [];
  const productCategories = [
    ...new Set(storeDetails.products.map((prod) => prod.category)),
    ...addAllCategories,
  ];

  const filteredProducts =
    activeIndex === "all"
      ? storeProducts
      : storeProducts?.filter((item) => item.category === activeIndex);

  const storeReels = storeDetails.reels.map((reel) => ({
    ...reel,
    id: reel.id,
    url: reel.url || require("../../../assets/images/vv.mp4"),
    thumbnail_url:
      reel.thumbnail_url || require("../../../assets/images/m202.png"),
  }));

  const formatPrice = (price) => {
    return `${price.toLocaleString()} IQD`;
  };

  const handleOpenReel = (item) => {
    const feedVideo = JSON.stringify({
      id: item?.id,
      url: item?.url?.replace(
        "http://tools-openinary-8f358f-173-249-22-222.traefik.me",
        "https://storage.dmsystem.dpdns.org",
      ),
      thumbnail_url: item?.thumbnail_url,
      title:
        `${item?.title?.kurdish}\n${item?.description ? item?.description : ""}` ||
        `${item?.title?.english}\n${item?.description ? item?.description : ""}`,
      store: {
        id: storeDetails?.id,
        name: storeDetails?.name?.kurdish || storeDetails?.name?.english || "",
        logo: storeDetails?.logo
          ? { uri: storeDetails?.logo }
          : require("../../../assets/images/m202.png"),
      },
    });

    router.navigate({
      pathname: "/(tabs)/reels",
      params: {
        feedVideo,
      },
    });
  };

  const handleViewProduct = (productId, product) => {
    const hasDiscount =
      product.discount_price && product.discount_price < product.price;
    const enhancedProduct = {
      ...product,
      hasDiscount,
      discountPercentage: hasDiscount
        ? Math.round(
            ((product.price - product.discount_price) / product.price) * 100,
          )
        : 0,
      storeDetails: {
        id: storeDetails.id,
        number: storeDetails.phone_number?.replace("+964", "0"),
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
        fromStore: true,
        storeData: stringifiedProduct,
      },
    });
  };

  const itemData = {
    id: storeDetails.id,
    title:  storeDetails?.name?.english || storeDetails?.name?.kurdish,
    name: storeDetails?.name?.kurdish || storeDetails?.name?.english,
    subtitle: storeDetails?.address,
    description: storeDetails?.description,
    logo: storeDetails?.logo || require("../../../assets/images/m202.png"),
    gradient: gradient,
    rating: storeDetails?.rating || 4.5,
    totalProducts: storeProducts.length,
    totalReels: storeReels.length,
  };

  const renderCategoryButton = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.categoryButton,
          activeIndex === item && styles.categoryButtonActive,
        ]}
        onPress={() => setActiveIndex(item)}
      >
        <LinearGradient
          colors={
            activeIndex === item
              ? [itemData.gradient, itemData.gradient]
              : ["#fff", "#fff"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryGradient}
        >
          <Text
            style={[
              styles.categoryButtonText,
              activeIndex === item && styles.activeCategoryText,
            ]}
          >
            {item === "all" ? "All Products" : item}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [activeIndex, itemData.gradient],
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptyText}>
        No products available in this category
      </Text>
    </View>
  );

  const renderProductItem = useCallback(({ item, index }) => {
    const productName = item.name?.kurdish || item.name?.english || item.name;
    const hasDiscount = item.discount_price && item.discount_price < item.price;
    const discountPercentage = hasDiscount
      ? Math.round(((item.price - item.discount_price) / item.price) * 100)
      : 0;

    return (
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
          style={styles.productCard}
          onPress={() => handleViewProduct(item.id, item)}
          activeOpacity={0.8}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.cover_image}
              style={styles.productImage}
              contentFit="cover"
            />

            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            )}

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
                <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
              )}
            </View>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {productName}
            </Text>
            <View style={styles.categoryTag}>
              <Ionicons name="pricetag-outline" size={10} color="#999" />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, []);

  const renderReelItem = useCallback(
    ({ item, index }) => (
      <VideoCard
        key={index}
        item={item}
        index={index}
        onPress={() => handleOpenReel(item)}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[itemData.gradient, itemData.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <BlurView
                intensity={80}
                tint="dark"
                style={styles.backButtonBlur}
              >
                <FontAwesome6 name="angle-left" size={24} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            <Text style={styles.storeTitle}>{itemData.title}</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        {/* Store Info Card */}
        <View style={styles.floatingCardContainer}>
          <View style={styles.storeInfoRow}>
            <Image source={itemData.logo} style={styles.storeLogo} />
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{itemData.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.storeLocation}>{itemData.subtitle}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="albums-outline" size={14} color="#666" />
                {/* 
                <Text style={styles.ratingText}>{itemData.rating}</Text> */}
                <Text style={styles.statsText}>
                  {" "}
                  {itemData.totalProducts} products
                </Text>
                <Text style={styles.statsText}>
                  • {itemData.totalReels} reels
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{itemData.description}</Text>
          </View>
        </View>

        {/* Stats Banner */}
        {/* <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <FontAwesome6 name="store" size={16} color={itemData.gradient} />
            <Text style={styles.statText}>Verified Store</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={itemData.gradient}
            />
            <Text style={styles.statText}>100% Authentic</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name="return-down-back"
              size={16}
              color={itemData.gradient}
            />
            <Text style={styles.statText}>Easy Returns</Text>
          </View>
        </View> */}

        {/* Reels Section */}
        {storeReels.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <FontAwesome6
                  name="play-circle"
                  size={20}
                  color={itemData.gradient}
                />
                <Text style={styles.sectionTitle}>Store Reels</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                {storeReels.length} videos
              </Text>
            </View>

            <FlashList
              data={storeReels}
              renderItem={renderReelItem}
              ItemSeparatorComponent={() => (
                <View style={{ width: wp("2%") }} />
              )}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={120}
              contentContainerStyle={styles.reelsList}
            />
          </>
        )}

        {/* Products Section Header */}
        <View style={styles.productsHeaderContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="cube" size={20} color={itemData.gradient} />
              <Text style={styles.sectionTitle}>Products</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              {filteredProducts.length} items
            </Text>
          </View>
        </View>

        {/* Category Filters */}
        <FlashList
          data={productCategories.reverse()}
          renderItem={renderCategoryButton}
          ItemSeparatorComponent={() => <View style={{ width: wp("2%") }} />}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={100}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Products Grid */}
        <FlashList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          estimatedItemSize={isTablet ? 350 : 300}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={ListEmptyComponent}
          removeClippedSubviews={true}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={10}
          scrollEnabled={false} // Disable inner scroll since parent ScrollView handles it
        />
      </ScrollView>
    </View>
  );
};

export default StorePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  headerGradient: {
    width: "100%",
    height: isTablet ? hp("28%") : hp("30%"),
    paddingTop: isTablet ? hp("6%") : hp("8%"),
    paddingHorizontal: wp("5%"),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  storeTitle: {
    fontSize: RFPercentage(2.2),
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },

  headerSpacer: {
    width: wp("10%"),
  },

  floatingCardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: wp("5%"),
    marginTop: hp("-8%"),
    borderRadius: 20,
    padding: wp("5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  storeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("4%"),
    marginBottom: hp("2%"),
  },

  storeLogo: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("9%"),
    backgroundColor: "#f5f5f5",
  },

  storeDetails: {
    flex: 1,
  },

  storeName: {
    fontSize: RFPercentage(2.2),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("0.5%"),
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    marginBottom: hp("0.5%"),
  },

  storeLocation: {
    fontSize: RFPercentage(1.4),
    color: "#666",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    flexWrap: "wrap",
  },

  ratingText: {
    fontSize: RFPercentage(1.4),
    color: "#666",
    fontWeight: "600",
  },

  statsText: {
    fontSize: RFPercentage(1.3),
    color: "#999",
  },

  descriptionBox: {
    backgroundColor: "#f8f9fa",
    padding: wp("3%"),
    borderRadius: 12,
    marginTop: hp("1%"),
  },

  descriptionText: {
    fontSize: RFPercentage(1.5),
    color: "#666",
    lineHeight: RFPercentage(2.2),
    textAlign: "auto",
  },

  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: wp("5%"),
    marginTop: hp("2%"),
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
    fontSize: RFPercentage(1.3),
    color: "#333",
    fontWeight: "500",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    marginTop: hp("3%"),
    marginBottom: hp("1.5%"),
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },

  sectionTitle: {
    fontSize: RFPercentage(2),
    fontWeight: "bold",
    color: "#000",
  },

  sectionSubtitle: {
    fontSize: RFPercentage(1.4),
    color: "#999",
  },

  reelsList: {
    paddingHorizontal: wp("3%"),
    paddingBottom: hp("1%"),
  },

  productsHeaderContainer: {
    marginTop: hp("2%"),
  },

  categoriesList: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
  },

  categoryButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginRight: wp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  categoryButtonActive: {
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  categoryGradient: {
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("5%"),
  },

  categoryButtonText: {
    fontSize: RFPercentage(1.6),
    fontWeight: "600",
    color: "#666",
  },

  activeCategoryText: {
    color: "#fff",
  },

  productsList: {
    paddingHorizontal: wp("3%"),
    paddingBottom: hp("10%"),
  },

  itemContainer: {
    width: CARD_WIDTH,
    marginBottom: hp("2%"),
    marginHorizontal: wp("1%"),
  },

  productCard: {
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

  productInfo: {
    padding: wp("3%"),
  },

  productTitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "600",
    color: "#000",
    marginBottom: hp("0.5%"),
    lineHeight: RFPercentage(2.2),
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

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("15%"),
    paddingHorizontal: wp("10%"),
  },

  emptyTitle: {
    fontSize: RFPercentage(2),
    fontWeight: "bold",
    color: "#000",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },

  emptyText: {
    fontSize: RFPercentage(1.5),
    color: "#999",
    textAlign: "center",
    lineHeight: RFPercentage(2.2),
  },
});
