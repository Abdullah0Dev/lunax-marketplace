import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { adImages, categoriesData, isTablet } from "../../../constants";
import { getPaletteByName } from "../../../constants/Colors";
import VideoCard from "../../../components/VideoCard";
import { useState } from "react";
import SlidingBox from "../../../components/SlidingBox";

const StorePage = () => {
  const router = useRouter();
  const { slug, gradient, title, store, fromProduct } = useLocalSearchParams();
  const storeDetails = fromProduct ? JSON.parse(store) : JSON.parse(store)[0];
  const storeProducts = storeDetails.products;
  const [activeIndex, setActiveIndex] = useState("all");

  const addAllCategories = storeDetails.products.length > 0 ? ["all"]: [];
  const productCategories = [
    ...new Set(storeDetails.products.map((prod) => prod.category)),
    ...(addAllCategories),
  ];
  const filteredProducts =
    activeIndex === "all"
      ? storeProducts
      : storeProducts?.filter((item) => item.category === activeIndex);
  console.log("categoryData: ", productCategories);
  const storeReels = storeDetails.reels.map((reel) => ({
    id: reel.id,
    url: reel.url || require("../../../assets/images/vv.mp4"),
    thumbnail_url:
      reel.thumbnail_url || require("../../../assets/images/m202.png"),
  }));

  const handleOpenReel = (id, url) => {
    router.navigate({
      pathname: "/(tabs)/reels",
      params: {
        video: url,
        id,
      },
    });
  };
  const handleViewProduct = (productId, product) => {
    const enhancedProduct = {
      ...product, // Spread all existing product properties
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
    const url = `/product/${productId}`;
    router.navigate({
      pathname: url,
      params: {
        fromStore: true,
        storeData: stringifiedProduct,
      },
    });
  };

  // 🔥 THEN: data
  const itemData = {
    id: storeDetails.id,
    title: storeDetails?.name?.kurdish || storeDetails?.name?.english,
    name: storeDetails?.name?.kurdish || storeDetails?.name?.english,
    subtitle: storeDetails?.address,
    description: storeDetails?.description,
    logo: storeDetails?.logo || require("../../../assets/images/m202.png"),
    gradient: gradient,
  };
  return (
    <View style={{ marginBottom: isTablet ? hp("0%") : hp("0%") }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.containerView,
            {
              backgroundColor: itemData.gradient,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["black", "#444444"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <FontAwesome6 name="angle-left" style={styles.arrowIcon} />
            </LinearGradient>
            <Text style={styles.storeTitle}>{itemData.title}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.floatingCardContainer}>
          <View style={styles.infoCardContainer}>
            <View style={styles.infoCardContainer2}>
              <View style={styles.nameContainer}>
                <Text
                  style={styles.nameText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {" "}
                  {itemData.name}
                </Text>
                <Image
                  source={require("../../../assets/images/m501.png")}
                  style={styles.logoa1}
                />
              </View>
              <View style={styles.nameContainer}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.nameText}
                >
                  {" "}
                  {itemData.subtitle}
                </Text>
                <Image
                  source={require("../../../assets/images/m503.webp")}
                  style={styles.logoa1}
                />
              </View>
            </View>
            <View style={styles.descContainer}>
              <Image source={itemData.logo} style={styles.logoImage} />
            </View>
          </View>

          <View
            style={[styles.logoRow1, { backgroundColor: itemData.gradient }]}
          >
            <Text style={styles.logoText2}>{itemData.description}</Text>
          </View>
        </View>
        {/* Rells */}
        <View style={styles.wrapperTop}>
          <View style={styles.wrapperInner}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.row99}>
                {storeReels.map((item, index) => (
                  <VideoCard
                    key={item.id}
                    item={item}
                    index={index}
                    onPress={(idx) => handleOpenReel(item.id, item.url)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        {/* Rells */}

        <View style={{ marginTop: hp("5%"), marginBottom: hp("10%") }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}
          >
            {productCategories.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.button,
                  activeIndex === item && {
                    backgroundColor: itemData.gradient,
                  },
                ]}
                onPress={() => {
                  console.log("active category: ", item, activeIndex);

                  setActiveIndex(item);
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    activeIndex === item && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Pages */}
          <View style={styles.page}>
            <ScrollView>
              <View style={styles.grid}>
                {filteredProducts?.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleViewProduct(item.id, item)}
                  >
                    <Image source={item.cover_image} style={styles.image} />
                    <Text style={styles.title}>
                      {item.name.kurdish || item.name.english}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StorePage;

const styles = StyleSheet.create({
  containerView: {
    width: isTablet ? wp("100%") : wp("100%"),
    height: isTablet ? hp("20%") : hp("25%"),
    marginTop: isTablet ? hp("0%") : hp("0%"),
    marginBottom: isTablet ? hp("0%") : hp("2%"),
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCardContainer: {
    width: isTablet ? wp("90%") : wp("90%"),
    minHeight: isTablet ? hp("22%") : hp("20%"),
    backgroundColor: "#fff",
    marginTop: -110,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowIcon: {
    fontSize: RFPercentage(4),
    color: "#fff",
  },
  storeTitle: {
    fontSize: RFPercentage(4),
    color: "white",
    marginTop: isTablet ? wp("0%") : wp("3.5%"),
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "lor",
    left: isTablet ? wp("0%") : wp("4%"),
  },
  gradientContainer: {
    width: isTablet ? hp("7%") : hp("5.5%"),
    height: isTablet ? hp("7%") : hp("5.5%"),
    borderRadius: isTablet ? hp("5%") : hp("2.75%"),
    justifyContent: "center",
    alignItems: "center",
    top: isTablet ? hp("5%") : hp("6%"),
    left: isTablet ? wp("2%") : wp("3%"),
  },
  nameContainer: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  nameText: {
    fontSize: RFPercentage(2),
    color: "black",
    fontWeight: "bold",
    fontFamily: "k24",
  },
  infoCardContainer: {
    display: "flex",
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  descContainer: {
    width: isTablet ? wp("13%") : wp("22%"),
    height: isTablet ? hp("10%") : hp("10%"),
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCardContainer2: {
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
    maxWidth: isTablet ? wp("50%") : wp("50%"),
  },
  wrapperTop: {
    top: hp("-1%"),
  },

  wrapperInner: {
    top: hp("3%"),
  },
  row99: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    width: isTablet ? wp("30%") : wp("35%"),
    height: isTablet ? hp("30%") : hp("25%"),
    marginHorizontal: wp("2%"),
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  ratingBox: {
    position: "absolute",
    top: hp("1%"),
    right: wp("3%"),
  },

  ratingIcon: {
    width: isTablet ? wp("10%") : wp("10.5%"),
    height: isTablet ? hp("8%") : hp("5%"),

    borderRadius: 50,
  },
  log: {
    backgroundColor: "white",
    marginVertical: hp("1%"),
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("22%") : hp("20%"),
    marginTop: isTablet ? hp("-6%") : hp("-12%"),
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  logoview: {
    backgroundColor: "white",
    marginVertical: hp("1%"),
    width: isTablet ? wp("13%") : wp("22%"),
    height: isTablet ? hp("10%") : hp("10%"),
    marginTop: isTablet ? hp("-5%") : hp("-7%"),
    marginLeft: isTablet ? wp("73%") : wp("65%"),
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  logoImage: {
    width: isTablet ? wp("10%") : wp("22%"),
    height: isTablet ? hp("8%") : hp("10%"),
    borderRadius: 15,
  },
  logoa: {
    width: isTablet ? wp("6%") : wp("7%"),
    height: isTablet ? hp("5%") : hp("3%"),
    borderRadius: 15,
    right: isTablet ? wp("22%") : wp("35%"),
    marginTop: isTablet ? hp("2%") : hp("2%"),
  },
  logoText: {
    fontSize: RFPercentage(1.7),
    color: "black",
    marginTop: isTablet ? hp("0%") : hp("1%"),
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "k24",
    right: isTablet ? wp("30%") : wp("47%"),
    top: isTablet ? hp("-3%") : hp("-3.5%"),
  },

  logoRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: isTablet ? wp("20%") : wp("31%"),
    top: isTablet ? hp("7%") : hp("6%"),
  },
  logoa1: {
    width: isTablet ? wp("7%") : wp("7%"),
    height: isTablet ? hp("5%") : hp("3%"),
    borderRadius: 15,
  },
  logoText1: {
    fontSize: RFPercentage(2),
    color: "black",
    marginLeft: 7,
    fontWeight: "bold",
    fontFamily: "k24",
    marginHorizontal: isTablet ? wp("0%") : wp("1%"),
    marginTop: isTablet ? hp("0%") : hp("0.3%"),
  },
  logoRow1: {
    minWidth: isTablet ? wp("85%") : wp("85%"),
    minHeight: isTablet ? hp("7%") : hp("7%"),
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  logoText2: {
    fontSize: RFPercentage(1.8),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "k24",
  },

  scrollRow: {
    paddingHorizontal: 10,
    justifyContent: "flex-end",
    flex: 1,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
  },

  activeButton: {
    backgroundColor: "rgb(103, 0, 143)",
  },

  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "k24",
  },

  activeText: {
    color: "#fff",
  },

  page: {
    flex: 1,
    padding: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  image: {
    width: isTablet ? wp("40%") : wp("44%"),
    height: isTablet ? hp("30%") : hp("25%"),
    borderRadius: isTablet ? 15 : 10,
  },

  title: {
    color: "black",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: RFPercentage(2.1),
    fontWeight: "600",
    fontFamily: "k24",
  },
});
