import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Alert,
  RefreshControl,
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

const FavoritesTab = () => {
  const dispatch = useDispatch();
  const { favorites, toggleFavorite } = useProduct();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

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
  console.log("allFavorites: ", favorites);

  const handleRemoveFromFavorite = useCallback(
    (item) => {
      Alert.alert(
        "Remove from Favorites",
        `Remove ${item.name?.english || item.name?.kurdish || item.title?.english || "item"} from favorites?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              if (item) {
                toggleFavorite(item);
              } else {
                toggleFavorite(item);
              }
            },
          },
        ],
      );
    },
    [dispatch],
  );

  const handleNavigateToDetails = () => {};

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - add your actual refresh logic if needed
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const renderRightActions = useCallback(
    (progress, dragX, item) => {
      return (
        <TouchableOpacity
          style={styles.swipeDelete}
          onPress={() => handleRemoveFromFavorite(item)}
        >
          <Text style={styles.swipeDeleteText}>Delete</Text>
        </TouchableOpacity>
      );
    },
    [handleRemoveFromFavorite],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const itemName =
        typeof item.name === "object"
          ? item.name.kurdish || item.name.english
          : item.name;
      // const itemName =
      //   item.name?.english ||
      //   item.name?.kurdish ||
      //   item.title?.english ||
      //   item.title ||
      //   "Item";
      const imageUrl = item.cover_image || item.logo || item.thumbnail_url;
      const itemPrice = item.discount_price || item.price;

      return (
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item)
          }
          overshootRight={false}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleNavigateToDetails(item)}
            style={styles.card}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.cardImage}
              defaultSource={require("../../assets/images/m62.png")}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {itemName}
              </Text>
              {itemPrice && (
                <Text style={styles.cardPrice}>
                  {itemPrice}
                  {item.discount_price && item.price && (
                    <Text style={styles.originalPrice}> IQD{item.price}</Text>
                  )}
                </Text>
              )}
              {item.type === "store" && (
                <Text style={styles.storeBadge}>Store</Text>
              )}
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    },
    [handleNavigateToDetails, renderRightActions],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../assets/images/m916.webp")}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Start adding items to your favorites
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.navigate("/(tabs)")}
        >
          <Text style={styles.exploreButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    ),
    [router],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allFavorites}
        keyExtractor={(item) => `${item.type}_${item.id}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            colors={["#000"]}
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
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: hp("6%"),
    paddingBottom: hp("2%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    color: "#000",
    fontSize: RFPercentage(3),
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeaderText: {
    color: "#666",
    fontSize: RFPercentage(1.6),
    textAlign: "center",
    marginTop: hp("0.5%"),
  },
  listContent: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("2%"),
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: hp("0.8%"),
    padding: wp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    flex: 1,
    marginLeft: wp("3%"),
    justifyContent: "center",
  },
  cardTitle: {
    color: "#000",
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    marginBottom: hp("0.3%"),
  },
  cardPrice: {
    fontSize: RFPercentage(1.6),
    color: "#007AFF",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: RFPercentage(1.3),
    color: "#999",
    textDecorationLine: "line-through",
    fontWeight: "normal",
  },
  storeBadge: {
    position: "absolute",
    top: -hp("0.5%"),
    right: 0,
    backgroundColor: "#007AFF",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.2%"),
    borderRadius: 4,
    fontSize: RFPercentage(1),
    color: "#fff",
    overflow: "hidden",
  },
  swipeDelete: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: wp("20%"),
    marginVertical: hp("0.8%"),
    borderRadius: 12,
  },
  swipeDeleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: RFPercentage(1.8),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("25%"),
    paddingHorizontal: wp("10%"),
  },
  emptyImage: {
    width: wp("35%"),
    height: hp("18%"),
    marginBottom: hp("2%"),
  },
  emptyTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("0.5%"),
  },
  emptyText: {
    fontSize: RFPercentage(1.6),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  exploreButton: {
    backgroundColor: "#000",
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.2%"),
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: RFPercentage(1.6),
    fontWeight: "500",
  },
});

export default FavoritesTab;
