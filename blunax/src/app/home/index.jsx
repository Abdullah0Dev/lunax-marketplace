import React from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { capitalizeFirstLetter } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/api/auth.api";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useGetMyStoreQuery } from "../../services/api/store.api";
  
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const HomeScreen = () => {
  const { data: storeData, isLoading: isFetchingStore } = useGetMyStoreQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  console.log("storeData: ", storeData);

  const handleLogout = async () => {
    console.log("logging out... ");
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    await dispatch(logoutUser());
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={{ top: isTablet ? hp("0%") : hp("4%") }}>
        <View>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/b.png")}
              style={styles.logo}
              contentFit="contain"
            />
            {/* Bottom row */}
            <View style={styles.row}>
              <TouchableOpacity>
                <Text style={styles.showAll}>
                  {" "}
                  {storeData && capitalizeFirstLetter(storeData.category)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logout}>
                <Ionicons name="log-out-outline" size={26} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => router.push("/home/edit-store")}>
            <View style={styles.card1}>
              <Image
                source={require("../../assets/images/k3.webp")}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Logo And Description</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/home/products")}>
            <View style={styles.card1}>
              <Image
                source={require("../../assets/images/k3.webp")}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Mange Products</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/home/reels")}>
            <View style={styles.card1}>
              <Image
                source={require("../../assets/images/k13.png")}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Reels</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/home/discount")}>
            <View style={styles.card1}>
              <Image
                source={require("../../assets/images/k9.webp")}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Discount</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: isTablet ? wp("40%") : wp("50%"),
    height: isTablet ? hp("13%") : hp("10%"),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    marginTop: isTablet ? wp("8%") : wp("10%"),
  },
  card1: {
    width: isTablet ? wp("43%") : wp("45%"),
    height: isTablet ? hp("28%") : hp("26%"),
    backgroundColor: "#ffffff",
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 16 : 12,
    marginBottom: isTablet ? 20 : 16,
    alignItems: "center",
    justifyContent: "center",

    // Modern shadow for iOS
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,

    // Modern shadow for Android
    elevation: 10,

    // Border for subtle definition
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.1)",

    // Background with slight gradient effect
    backgroundImage: "linear-gradient(145deg, #ffffff 0%, #fafaff 100%)",
  },

  cardImage: {
    width: isTablet ? wp("30%") : wp("28%"),
    height: isTablet ? hp("16%") : hp("14%"),
    borderRadius: 16,
    marginBottom: 8,

    // Image shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  cardText: {
    fontSize: RFPercentage(isTablet ? 1.9 : 2),
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    color: "#1F2937",

    // Text shadow for depth
    textShadowColor: "rgba(99, 102, 241, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,

    // Add letter spacing for modern look
    letterSpacing: 0.3,
  },

  // Optional: Add hover/pressed state effect
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  header: {
    height: 200,
    backgroundColor: "#11a1a1",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "space-between",
    marginTop: isTablet ? wp("0%") : wp("-10%"),
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15, 
  },

  showAll: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  logout: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 50,
  },
});
