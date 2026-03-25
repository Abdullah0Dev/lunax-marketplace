import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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

const StoreTab = () => {
  const router = useRouter();
  const { latestProducts, productsLoading } = useExplore();

  console.log("latest prod", latestProducts[0]);
  const handleViewProduct = (productId, product) => {
    const storeDetails = product.store;
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
        storeData: stringifiedProduct,
      },
    });
  };
  const itemData = latestProducts.map((prod) => ({
    ...prod,
    title: prod.name.kurdish || prod.name.english,
    image: prod.cover_image,
    storeImage: prod.store_id.logo,
  }));
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* fast */}
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
        {/* fast */}

        <View style={styles.grid}>
          {itemData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card1}
              onPress={() => handleViewProduct(item.id, item)}
            >
              <Image source={item.image} style={styles.image} />
              <Image source={item.storeImage} style={styles.image1} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoreTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card1: {},
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
  },
  page: {
    flex: 1,
    padding: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: isTablet ? wp("2%") : wp("3%"),
    marginBottom: isTablet ? wp("10%") : wp("23%"),
  },

  image: {
    width: isTablet ? wp("40%") : wp("44%"),
    height: isTablet ? hp("30%") : hp("25%"),
    borderRadius: isTablet ? 15 : 10,
    backgroundColor: "rgb(0,0,0,0.05)",
  },
  image1: {
    width: isTablet ? wp("13%") : wp("12%"),
    height: isTablet ? hp("10%") : hp("6%"),
    marginLeft: isTablet ? wp("26%") : wp("30%"),
    marginTop: isTablet ? wp("1%") : wp("2%"),
    borderRadius: isTablet ? 15 : 10,
    position: "absolute",
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
