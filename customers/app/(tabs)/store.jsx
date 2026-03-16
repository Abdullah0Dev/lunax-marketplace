import {
  StyleSheet,
  StatusBar,
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

import React from "react";
 
const StoreTab = () => {
  const router = useRouter();
console.log("storeData", storeData[1]);

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* fast */}
        <TouchableOpacity onPress={() => navigation.navigate("Fastitem")}>
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
                <Text style={styles.text}>کرین و فروتنا بلەز</Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        {/* fast */}

        <View style={styles.grid}>
          {storeData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card1}
              onPress={
                () => {
                  router.push(`/product/${item.id}`);
                }
                // navigation.navigate("Secondedetails", { item: item })
              }
            >
              <Image source={item.img} style={styles.image} />
              <Image source={item.img1} style={styles.image1} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

export default StoreTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
