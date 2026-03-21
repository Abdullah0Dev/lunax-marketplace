import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
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
import { categoriesData } from "../../../constants";
import { getPaletteByName } from "../../../constants/Colors";
const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const CategoryPage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const categoryData = categoriesData
    .flat()
    .find((cat) => cat.screen === category);
  const categoryPallette = getPaletteByName(categoryData.palette);
  const primaryColor = categoryPallette[1][0];
  console.log("categoryData: ", categoryData.palette);

  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch("https://amedbaz.github.io/lunabalav/lunabalav.json")
      .then((response) => response.json())
      .then((data) => {
        const lunabalav = data.lunabalav || [];
        setLinks(lunabalav.map((item) => item.link));
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  }, []);

  const handleStorePressed = (index) => {
    const url = `/store/${index}`;
    router.push(url);
  };

  // 🔥 THEN: data
  const DATA = Array.from({ length: 20 }).map((_, i) => ({
    id: i.toString(),
    title: `Laptop Duhok ${i + 1}`,
    subtitle: "Excellent Service",
    iconImage: require("../../../assets/images/m202.png"),

    // auto gradient per item
    gradient: categoryPallette[i % categoryPallette.length],
  }));

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

        <View>
          {/* design */}
          <View>
            <LinearGradient
              colors={[primaryColor, primaryColor + "80"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vm}
            >
              <View style={styles.rowContainer00}>
                <Image source={categoryData.image} style={styles.iconImage} />
                <Text style={styles.text}>
                  باشترین دێ ب {categoryData.title}
                </Text>
              </View>
            </LinearGradient>
          </View>
          {/* design */}
        </View>

        <View style={styles.container}>
          <FlashList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardItem item={item} onPress={handleStorePressed(item.id)} />
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
      <StatusBar backgroundColor="black" barStyle="white" />
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
    resizeMode: "contain",
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
