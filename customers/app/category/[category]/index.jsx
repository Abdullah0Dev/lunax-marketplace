import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
// import { SliderBox } from "react-native-image-slider-box";
import { useState, useEffect, useRef } from "react";
import CardItem from "../../../components/CardItem";
import { useLocalSearchParams, useRouter } from "expo-router";
import { adImages, categoriesData } from "../../../constants";
import { getPaletteByName } from "../../../constants/Colors";
import { useExplore } from "../../../hooks/useExplore";
import SlidingBox from "../../../components/SlidingBox";
const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const CategoryPage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const categoryData = categoriesData
    .flat()
    .find((cat) => cat.screen === category);
  const categoryPallette = getPaletteByName(categoryData.palette || "computer");
  // Data is already cached from pre-fetch, so this will be instant
  const { storesByCategory, isLoading } = useExplore(null, category);
  console.log("categoryData: ", storesByCategory, categoryData.palette);

  // Log when data loads (should be instant from cache)
  useEffect(() => {
    if (storesByCategory && storesByCategory.length > 0) {
      console.log(
        `📦 ${category} category: ${storesByCategory.length} stores loaded from cache`,
      );
    }
  }, [storesByCategory, category]);

  // Show loading only on first load (should be instant due to cache)
  if (isLoading && !storesByCategory.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading stores...</Text>
      </View>
    );
  }
  const primaryColor = categoryPallette[1][0];
  const handleStorePressed = (index, gradient, title) => {
    const selectedStore = storesByCategory.filter(
      (store) => store.id === index,
    );
    const stringifiedStore = JSON.stringify(selectedStore);
    console.log("stringifiedStore: ", stringifiedStore);
    const url = `/store/${index}`;
    // return;
    router.navigate({
      pathname: url,
      params: {
        store: stringifiedStore,
        gradient: gradient,
        title,
      },
    });
  };
  const DATA = storesByCategory.map((store) => {
    const randomNumber = Math.floor(Math.random() % categoryPallette.length);

    return {
      id: store.id,
      title: store.name.english || store.name.kurdish,
      subtitle: "",
      iconImage: store.logo || require("../../../assets/images/m202.png"),

      // auto gradient per item
      gradient: categoryPallette[randomNumber],
    };
  });
  // 🔥 THEN: data
  // const DATA = Array.from({ length: 20 }).map((_, i) => ({
  //   id: i.toString(),
  //   title: `Laptop Duhok ${i + 1}`,
  //   subtitle: "Excellent Service",
  //   iconImage: require("../../../assets/images/m202.png"),

  //   // auto gradient per item
  //   gradient: categoryPallette[i % categoryPallette.length],
  // }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()}>
          <LinearGradient
            colors={["#ff3d00", "#444444"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: isTablet ? hp("7%") : hp("5.5%"),
              height: isTablet ? hp("7%") : hp("5.5%"),
              borderRadius: isTablet ? hp("5%") : hp("2.75%"),
              justifyContent: "center",
              alignItems: "center",
              top: isTablet ? hp("3%") : hp("6%"),
              left: isTablet ? wp("2%") : wp("3%"),
            }}
          >
            <FontAwesome6
              name="angle-left"
              style={{
                fontSize: RFPercentage(4),
                color: "#fff",
              }}
            />
          </LinearGradient>
          <Text
            style={{
              fontSize: RFPercentage(3),
              color: "#000",
              marginTop: isTablet ? wp("-2.5%") : wp("3%"),
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "k24",
            }}
          >
            {categoryData.title}
          </Text>
        </TouchableOpacity>
        <SlidingBox images={adImages} handleImagePress={() => {}} />
        {/* belavbun */}
        {/* <View style={{ top: hp("2%") }}>
          <SliderBox
            images={images}
            autoplay
            circleLoop
            dotColor="red"
            inactiveDotColor="#90A4AE"
            resizeMode="cover"
            ImageComponentStyle={{
              borderRadius: 20,
              width: screenWidth * 0.95,
              height: screenWidth * 0.5,
              marginTop: 10,
              alignSelf: "center",
            }}
            dotStyle={{
              width: 30,
              height: 7,
              borderRadius: 20,
            }}
            onCurrentImagePressed={handleImagePress}
          />
        </View> */}
        {/* belavbun */}
 

        <View style={styles.container}>
          <FlashList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardItem
                item={item}
                onPress={() =>
                  handleStorePressed(item.id, item.gradient[0], item.title)
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                {/* back button + title */}
                {/* slider */}
                {/* green gradient section */}
              </>
            }
            contentContainerStyle={{
              paddingBottom: hp("12%"),
              paddingTop: hp("2%"),
            }}
          />
        </View>

        {/* jh */}
      </ScrollView>
    </View>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  rowContainer00: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconImage: {
    width: isTablet ? wp("10%") : wp("12.5%"),
    height: isTablet ? hp("7%") : hp("8%"),
  },
  text: {
    fontSize: RFPercentage(2.2),
    color: "#fff",
    textAlign: "left",
    flexShrink: 1,
    fontFamily: "k24",
  },
  vm: {
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("7%") : hp("6%"),
    borderTopLeftRadius: isTablet ? 60 : 30,
    borderTopRightRadius: isTablet ? 60 : 10,
    borderBottomLeftRadius: isTablet ? 60 : 10,
    borderBottomRightRadius: isTablet ? 60 : 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: isTablet ? hp("5%") : hp("4%"),
    left: isTablet ? hp("3%") : hp("1.9%"),
  },
  card: {
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("20%") : hp("15%"),
    alignSelf: "center",
    marginVertical: hp("0.5%"),
    borderRadius: isTablet ? 40 : 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),

    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  cardIcon: {
    width: isTablet ? wp("25%") : wp("20%"),
    height: isTablet ? hp("17%") : hp("10%"),
    resizeMode: "contain",
  },

  cardContent: {
    flex: 1,
    alignItems: "flex-end", // RTL
  },

  cardTitle: {
    fontSize: RFPercentage(2.5),
    color: "#fff",
    fontWeight: "700",
    fontFamily: "k24",
    textAlign: "right",
  },

  cardSub: {
    fontSize: RFPercentage(1.6),
    color: "#eee",
    textAlign: "right",
  },
});
