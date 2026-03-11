import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function HomeReels() {
  const navigation = useNavigation();
  const [reels, setReels] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempVideo, setTempVideo] = useState(null);
  const [tempDescription, setTempDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const flatListRef = useRef(null);

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) setTempVideo(result.assets[0].uri);
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setTempVideo(reels[index].video);
      setTempDescription(reels[index].description);
      setEditingIndex(index);
    } else {
      setTempVideo(null);
      setTempDescription("");
      setEditingIndex(null);
    }
    setModalVisible(true);
  };

  const saveReel = () => {
    if (!tempVideo && !tempDescription) return;

    const timestamp = new Date();

    if (editingIndex !== null) {
      const updatedReels = reels.map((item, i) =>
        i === editingIndex
          ? { ...item, video: tempVideo, description: tempDescription, date: timestamp }
          : item
      );
      setReels(updatedReels);
    } else {
      setReels(prev => [
        { video: tempVideo, description: tempDescription, date: timestamp },
        ...prev
      ]);
    }

    setModalVisible(false);
    setTempVideo(null);
    setTempDescription("");
    setEditingIndex(null);

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const deleteReel = (index) => {
    const updated = reels.filter((_, i) => i !== index);
    setReels(updated);
  };

  const renderItem = ({ item, index }) => {
    const formattedDate = item.date ? new Date(item.date).toLocaleString() : "";
    return (
      <View style={styles.reelItem}>
        {item.video && (
          <Video source={{ uri: item.video }} style={styles.reelVideo} useNativeControls resizeMode="contain" />
        )}

        <Text style={styles.reelDescription}>{item.description}</Text>
        <Text style={styles.reelDate}>{formattedDate}</Text>

        <View style={styles.reelButtons}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openModal(index)}>
            <Text style={{ color: "white" }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReel(index)}>
            <Text style={{ color: "white" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Reels</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={() => openModal()}>
        <Image
                  source={require("../../../../assets/k14.webp")}
                  style={{
                    width: isTablet ? wp("20%") : wp("17%"),
                     height: isTablet ? hp("8%") : hp("8%"),
                  }}
                  />
        <Text style={styles.uploadText}>Upload Reel</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={reels}
        extraData={reels}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              <Text style={styles.modalTitle}>Upload Reel</Text>

              <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
                {tempVideo ? (
                  <>
                    <Ionicons name="checkmark-circle" size={26} color="#2E7D32" />
                    <Text style={styles.videoSelected}>Video Selected</Text>
                    <Video source={{ uri: tempVideo }} style={styles.previewVideo} resizeMode="cover" />
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={40} color="red" />
                    <Text style={styles.videoPlaceholder}>Tap to select video</Text>
                    <Text style={styles.videoHint}>Videos Only</Text>
                  </>
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.modalInput}
                placeholder="اكتب الوصف..."
                value={tempDescription}
                onChangeText={setTempDescription}
                multiline
                textAlign="right"
                writingDirection="rtl"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={Keyboard.dismiss}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#2E7D32" }]} onPress={saveReel}>
                  <Text style={{ color: "white", fontWeight: "600" }}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#999" }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"white", paddingTop:hp("5%") },
  title:{ fontSize:RFPercentage(4), fontWeight:"bold", textAlign:"center", marginBottom:hp("2%"), marginTop:20 },

  uploadButton:{
    flexDirection:"row",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    width:wp("90%"),
    height:hp("20%"),
    borderRadius:25,
    borderWidth:2,
    borderColor:"rgb(85,132,26)",
    borderStyle:"dashed",
    gap:10,
    marginBottom:hp("2%"),
  },

  uploadText:{ color:"rgb(85,132,26)", fontSize:RFPercentage(3.5),fontWeight:'700' },

  reelItem:{ backgroundColor:"#f2f2f2", margin:20, borderRadius:15, padding:10 },
  reelVideo:{ width:"100%", height:hp("20%"), borderRadius:10, marginBottom:8 },
  reelDescription:{ textAlign:"right", writingDirection:"rtl", fontSize:16 },
  reelDate:{ fontSize:12, color:"#666", textAlign:"right" },

  reelButtons:{ flexDirection:"row", justifyContent:"space-between", marginTop:10 },
  editBtn:{ backgroundColor:"#2E7D32", padding:8, borderRadius:8, width:"48%", alignItems:"center" },
  deleteBtn:{ backgroundColor:"#D32F2F", padding:8, borderRadius:8, width:"48%", alignItems:"center" },

  modalOverlay:{ flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center" },
  modalBox:{ width:wp("85%"), backgroundColor:"white", borderRadius:25, padding:20 },
  modalTitle:{ fontSize:RFPercentage(3), fontWeight:"bold", marginBottom:15, textAlign:"center" },

  videoPicker:{ borderWidth:2, borderColor:"red", borderRadius:20, borderStyle:"dashed", padding:20, alignItems:"center", marginBottom:15 },
  videoPlaceholder:{ marginTop:10, fontSize:16 },
  videoHint:{ fontSize:12, color:"red" },
  videoSelected:{ fontSize:14, color:"#2E7D32", marginVertical:6 },
  previewVideo:{ width:"100%", height:150, borderRadius:12, marginTop:10 },

  modalInput:{ borderWidth:1, borderColor:"#ccc", borderRadius:12, padding:12, height:120, marginBottom:15 },

  modalButtons:{ flexDirection:"row", justifyContent:"space-between" },
  modalBtn:{ flex:1, padding:14, borderRadius:12, alignItems:"center", marginHorizontal:5 },

  backButton:{ position:"absolute", top:50, left:25 },
}); 