import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { isTablet } from "../../constants";
import { useRouter } from "expo-router";
const ProfileTab = () => {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pickImage = async () => {
    // permission بۆ gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to access your photos!",
      );
      return;
    }

    // هەڵبژاردنی وێنە
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image ? { uri: image } : require("../../assets/images/m915.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.nav}>DerfetNezir</Text>

        <View style={styles.container2}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.navigate("/account")}
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={styles.text}>پرۆفایل</Text>
            <Ionicons name="person-outline" size={22} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/account")}
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={styles.text}>وشەیا نهێنی</Text>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/account/about")}
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={styles.text}>دەربارەی مە</Text>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#333"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.navigate("/account")}
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={styles.text}>پەیوەندیێ بکە</Text>
            <Ionicons name="call-outline" size={22} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={styles.text}>وەشان</Text>
            <Ionicons name="sync" size={22} color="#333" />
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>وەشانا ئەپێ</Text>
                <Text style={styles.modalVersion}>1.0.0</Text>
                <Text style={styles.modalText}>
                  ئەڤ وەشانە کومکرنا پێداویستیێن تەنە و ب ساناهیکرنا رێکا تەیە😍
                </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeText}>گرتن</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert(
                "چوونەدەرەوە",
                "ئایا دڵنیایت کە دەتەوێت بچیتە دەرەوە؟",
                [
                  {
                    text: "نەخێر",
                    style: "cancel",
                  },
                  {
                    text: "بەڵێ",
                    style: "destructive",
                    onPress: () => {
                      console.log("User logged out");
                    },
                  },
                ],
              )
            }
          >
            <Ionicons name="chevron-back" size={22} color="#999" />
            <Text style={[styles.text, { color: "#e53935" }]}>چوونەدەرەوە</Text>
            <Ionicons name="log-out-outline" size={22} color="#e53935" />
          </TouchableOpacity>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL("https://instagram.com/yourpage")}
          >
            <FontAwesome name="instagram" size={26} color="#E1306C" />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL("https://tiktok.com/@yourpage")}
          >
            <Ionicons name="logo-tiktok" size={26} color="#000" />
            <Text style={styles.socialText}>TikTok</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    paddingTop: 60,
  },
  imageContainer: { alignItems: "center", marginBottom: 40, marginTop: 50 },
  profileImage: {
    width: isTablet ? wp("40%") : wp("35%"),
    height: isTablet ? wp("40%") : wp("35%"),
    borderRadius: isTablet ? 200 : 100,
    backgroundColor: "#ddd",
  },
  nav: {
    fontFamily: "k24",
    fontSize: RFPercentage(2.5),
    color: "rgb(75, 75, 75)",
    marginTop: isTablet ? wp("3%") : wp("3%"),
  },
  container2: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 16,
    paddingVertical: 8,
    width: isTablet ? wp("90%") : wp("95%"),
    height: isTablet ? wp("60%") : wp("٧5%"),

    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  text: {
    flex: 1,
    marginRight: 19,
    fontSize: 18,
    color: "#222",
    textAlign: "right",
    fontFamily: "k24",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  socialButton: {
    width: "38%",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "rgb(255, 255, 255)",
    marginHorizontal: 20,
  },

  socialText: {
    marginTop: 8,
    fontSize: wp("3.5%"),
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  modalVersion: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
  },
  modalText: {
    fontSize: wp("4%"),
    textAlign: "center",
    color: "#444",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#007aff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
});

export default ProfileTab;
