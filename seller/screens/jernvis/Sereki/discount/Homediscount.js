import { StyleSheet, Dimensions, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function Homediscount({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Go Back Button */}
     

      {/* Scrollable Cards */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
         <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
           <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Dis10")}>
            <View style={styles.card1}>
              <Image
                source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/10-percent-discount-3d-icon-png-download-5522836.png' }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Discount 10%</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Dis15")}>
            <View style={styles.card1}>
              <Image
                source={{ uri: 'https://static.vecteezy.com/system/resources/previews/035/116/431/non_2x/discount-15-percent-luxury-gold-and-red-offer-in-3d-suitable-for-promotions-for-christmas-chinese-new-years-and-ramadhan-sale-free-png.png' }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Discount 15%</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Dis20")}>
            <View style={styles.card1}>
              <Image
                source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/011/297/609/small/promotion-number-20-percent-3d-png.png' }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <Text style={styles.cardText}>Discount 20%</Text>
            </View>
          </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.navigate("Dis25")}>
              <View style={styles.card1}>
                <Image
                  source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/024/326/134/small/promotion-3d-render-png.png' }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardText}>Discount 25%</Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity  onPress={() => navigation.navigate("Dis30")}>
              <View style={styles.card1}>
                <Image
                 source={require("../../../../assets/m11.png")}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardText}>Discount 30%</Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity  onPress={() => navigation.navigate("Dis35")}>
              <View style={styles.card1}>
                <Image
                   source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/35-percentage-off-3d-icon-png-download-5873628.png' }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardText}>Discount 35%</Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity  onPress={() => navigation.navigate("Dis40")}>
              <View style={styles.card1}>
                <Image
                  source={require("../../../../assets/m10.png")}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardText}>Discount 40%</Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity  onPress={() => navigation.navigate("Dis50")}>
              <View style={styles.card1}>
                <Image
                  source={require("../../../../assets/m8.png")}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardText}>Discount 50%</Text>
              </View>
            </TouchableOpacity>


        </View>
      </ScrollView>

      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  goBackButton: {
    backgroundColor: "#11a1a1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 70,
    alignSelf: "flex-start",
    marginTop: isTablet ? wp("2%") : wp("10%"),
  },
  goBackText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    marginTop: isTablet ? wp("2%") : wp("4%"),
  },
  card1: {
    width: isTablet ? wp("40%") : wp("42%"),
    height: isTablet ? hp("30%") : hp("25%"),
    backgroundColor: "#ffffff",
    borderRadius: isTablet ? 18 : 12,
    padding: isTablet ? 14 : 10,
    marginBottom: isTablet ? 25 : 15,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cardImage: {
    width: isTablet ? wp("28%") : wp("25%"),
    height: isTablet ? hp("20%") : hp("12%"),
    borderRadius: 10,
  },
  cardText: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});
