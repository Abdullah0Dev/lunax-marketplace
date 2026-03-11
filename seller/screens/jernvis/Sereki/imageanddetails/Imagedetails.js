import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function Imagedetails() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [data, setData] = useState([]);

  const handleSave = () => {
    if (textValue.trim() === "") return;
    setData([...data, { id: Date.now().toString(), name: textValue }]);
    setTextValue("");
    setModalVisible(false);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    setData(data.filter(item => item.id !== selectedId));
    setDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Image And Details</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
        <Image
          source={require("../../../../assets/k15.webp")}
          style={{
            width: isTablet ? wp("10%") : wp("15%"),
            height: isTablet ? hp("8%") : hp("8%"),
          }}
        />
        <Text style={styles.uploadText}>Add Details</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("Imagedetails1", { item })}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Modal */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add New Detail</Text>

            <TextInput
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Write something..."
              style={styles.input}
            />

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setTextValue("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal transparent animationType="fade" visible={deleteModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteTitle}>
              Are you sure you want to delete?
            </Text>

            <View style={styles.deleteButtons}>
              <TouchableOpacity onPress={() => setDeleteModal(false)}>
                <Text style={{ color: "gray" }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Text style={{ color: "red" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: hp("6%") },

  title: {
    fontSize: RFPercentage(4),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
   
     marginTop: isTablet ? wp("0%") : wp("10%"),

  },

  uploadButton: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: wp("90%"),
    height: hp("20%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgb(17, 161, 161)",
    borderStyle: "dashed",
    gap: 8,
    marginBottom: hp("2%"),
  },

  uploadText: {
    color: "rgb(17, 161, 161)",
    fontSize: RFPercentage(3),
  fontWeight:'700'
  },

  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  itemText: {
    fontSize: RFPercentage(2.2),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 10,
  },

  cancelText: {
    color: "gray",
    fontWeight: "bold",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "rgb(248, 0, 231)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
  },

  deleteBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },

  deleteTitle: {
    textAlign: "center",
    marginBottom: 15,
  },

  deleteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});
