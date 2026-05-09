import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { isTablet } from "../constants";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const CardItem = ({ item, onPress }) => {
  const router = useRouter();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image
          source={item.iconImage}
          contentFit="contain"
          style={styles.cardIcon}
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CardItem;

const styles = StyleSheet.create({
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
    height: isTablet ? wp("25%") : wp("20%"),
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },

  cardContent: {
    flex: 1,
    
  },

  cardTitle: {
    fontSize: RFPercentage(2.7),
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginTop:15

  },

  cardSub: {
    fontSize: RFPercentage(1.6),
    color: "#eee",
    textAlign: "right",
  },
});
