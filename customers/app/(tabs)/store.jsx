import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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

const StoreTab = () => {
  const router = useRouter();
  const {
    latestProducts,
    productsLoading,
    loadMoreLatestProducts,
    latestProductsHasMore,
    refreshLatestProducts,
  } = useExplore();
  console.log("latestProducts: ", latestProducts);

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

  // Transform data for rendering
  const itemData = latestProducts.map((prod) => ({
    ...prod,
    title: prod.name.kurdish || prod.name.english,
    image: prod.cover_image,
    storeImage: prod.store_id.logo,
  }));

  // Header component (gradient + title)
  const Header = () => (
    <View style={{ marginTop: isTablet ? wp("10%") : wp("15.5%") }}>
      <LinearGradient
        colors={["rgb(17, 67, 84)", "rgb(10, 186, 244)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.vm}
      >
        <View style={styles.rowContainer00}>
          <Image
            source={require("../../assets/images/m911.png")}
            style={styles.iconImage}
          />
          <Text style={styles.text}>بەرهەمە نوێیەکان</Text>
        </View>
      </LinearGradient>
    </View>
  );

  // Footer loading indicator
  const Footer = () => {
    console.log("stats: ", productsLoading, latestProductsHasMore);
    
    if (!productsLoading && !latestProductsHasMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#0ABAF4" />
        {!latestProductsHasMore && (
          <Text style={styles.endText}>هیچ بەرهەمێکی تر نییە</Text>
        )}
      </View>
    );
  };

  // Render each product item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewProduct(item.id, item)}
    >
      <Image source={item.image} style={styles.image} />
      <Image source={item.storeImage} style={styles.storeImage} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={itemData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // two columns like original grid
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        onEndReached={loadMoreLatestProducts}
        onEndReachedThreshold={0.5} // load when 50% from bottom
        onRefresh={refreshLatestProducts}
        refreshing={productsLoading && latestProducts.length === 0} // refresh only on initial load
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default StoreTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: isTablet ? wp("10%") : wp("23%"),
  },
  rowContainer00: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: RFPercentage(2.5),
    color: "#fff",
    textAlign: "left",
    flexShrink: 1,
    fontFamily: "k24",
  },
  iconImage: {
    width: isTablet ? wp("10%") : wp("15.5%"),
    height: isTablet ? hp("10%") : hp("8%"),
    resizeMode: "contain",
  },
  vm: {
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("10%") : hp("12%"),
    borderTopLeftRadius: isTablet ? 60 : 20,
    borderTopRightRadius: isTablet ? 20 : 20,
    borderBottomLeftRadius: isTablet ? 20 : 20,
    borderBottomRightRadius: isTablet ? 60 : 20,
    justifyContent: "center",
    alignItems: "center",
    left: isTablet ? hp("3%") : hp("1.9%"),
    marginBottom: wp("3%"), // space below header
  },
  card: {
    flex: 1,
    margin: wp("2%"),
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: isTablet ? wp("40%") : wp("44%"),
    height: isTablet ? hp("30%") : hp("25%"),
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  storeImage: {
    width: isTablet ? wp("13%") : wp("12%"),
    height: isTablet ? hp("10%") : hp("6%"),
    marginLeft: isTablet ? wp("26%") : wp("30%"),
    marginTop: wp("2%"),
    borderRadius: 10,
    position: "absolute",
    top: 0,
    right: 0,
  },
  title: {
    color: "black",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: RFPercentage(2.1),
    fontWeight: "600",
    fontFamily: "k24",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  endText: {
    marginTop: 10,
    fontSize: RFPercentage(1.8),
    color: "#888",
    fontFamily: "k24",
  },
});
