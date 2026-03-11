import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function Logoanddescription() {

  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [englishName, setEnglishName] = useState("");
  const [kurdishName, setKurdishName] = useState("");
  const [message, setMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [fieldType, setFieldType] = useState("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const openModal = (type, currentValue) => {
    setFieldType(type);
    setTempValue(currentValue);
    setModalVisible(true);
  };

  const saveValue = () => {
    if (fieldType === "english") setEnglishName(tempValue);
    if (fieldType === "kurdish") setKurdishName(tempValue);
    if (fieldType === "description") setMessage(tempValue);
    setModalVisible(false);
  };

  const getModalTitle = () => {
    if (fieldType === "english") return "English Name";
    if (fieldType === "kurdish") return "Kurdish Name";
    if (fieldType === "description") return "Description";
    return "";
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#111" />
      </TouchableOpacity>

      {/* LOGO SECTION */}
      <View style={styles.logoSection}>
        <Text style={styles.title}>Brand Logo</Text>

        <TouchableOpacity style={styles.logoBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <>
              <Image
                               source={require("../../../assets/k16.png")}
                               style={{
                                 width: isTablet ? wp("20%") : wp("17%"),
                                  height: isTablet ? hp("8%") : hp("8%"),
                               }}
                               />
              <Text style={styles.uploadHint}>Tap to upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* INPUTS */}
      <View style={styles.form}>

        <Text style={styles.label}>English Name</Text>
        <TouchableOpacity style={styles.inputCard} onPress={() => openModal("english", englishName)}>
          <Text style={styles.inputText}>{englishName || "Enter name..."}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Kurdish Name</Text>
        <TouchableOpacity style={styles.inputCard} onPress={() => openModal("kurdish", kurdishName)}>
          <Text style={styles.inputText}>{kurdishName || "Enter name..."}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TouchableOpacity style={styles.textArea} onPress={() => openModal("description", message)}>
          <Text style={styles.inputText}>{message || "Write description..."}</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>{message.length}/100</Text>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>{getModalTitle()}</Text>

            <TextInput
              style={[styles.modalInput, fieldType==="description" && {height:120}]}
              value={tempValue}
              onChangeText={(t) => {
                if (fieldType === "description" && t.length > 100) return;
                setTempValue(t);
              }}
              multiline={fieldType === "description"}
              autoFocus
              placeholder="Type here..."
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveValue}>
              <Text style={{ color: "white", fontWeight: "600", fontSize:16 }}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{ flex:1, backgroundColor:"#f3f4f6" },

  backButton:{ position:"absolute", top:50, left:20, zIndex:5 },

  title:{
    fontSize:RFPercentage(3.8),
    fontWeight:"700",
    marginBottom:20,
    color:"#111",
    textAlign:"center"
  },

  logoSection:{ marginTop:hp("12%"), alignItems:"center" },

  logoBox:{
    width:wp("40%"),
    height:wp("40%"),
    borderRadius:25,
    backgroundColor:"#fff",
    justifyContent:"center",
    alignItems:"center",
    shadowColor:"#000",
    shadowOpacity:0.08,
    shadowRadius:20,
    elevation:6
  },

  image:{ width:"100%", height:"100%", borderRadius:25 },

  uploadHint:{ marginTop:10, color:"#6b7280" },

  form:{ marginTop:40 },

  label:{
    marginLeft:wp("7%"),
    marginBottom:6,
    fontWeight:"600",
    color:"#374151"
  },

  inputCard:{
    backgroundColor:"#fff",
    marginHorizontal:wp("5%"),
    borderRadius:18,
    padding:18,
    marginBottom:20,
    shadowColor:"#000",
    shadowOpacity:0.05,
    shadowRadius:10,
    elevation:4
  },

  textArea:{
    backgroundColor:"#fff",
    marginHorizontal:wp("5%"),
    borderRadius:18,
    padding:18,
    height:140,
    shadowColor:"#000",
    shadowOpacity:0.05,
    shadowRadius:10,
    elevation:4
  },

  inputText:{ color:"#111" },

  counter:{ alignSelf:"flex-end", marginRight:wp("7%"), color:"#6b7280" },

  modalOverlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.35)",
    justifyContent:"center",
    alignItems:"center"
  },

  modalBox:{
    width:wp("85%"),
    backgroundColor:"#fff",
    borderRadius:25,
    padding:25
  },

  modalTitle:{ fontSize:18, fontWeight:"700", marginBottom:15 },

  modalInput:{
    borderWidth:1,
    borderColor:"#e5e7eb",
    borderRadius:14,
    padding:15,
    marginBottom:20
  },

  saveButton:{
    backgroundColor:"#16a34a",
    padding:16,
    borderRadius:14,
    alignItems:"center"
  }
});
