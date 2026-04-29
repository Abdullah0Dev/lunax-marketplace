import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  useGetMyStoreQuery,
  useUpdateStoreMutation,
} from "../../services/api/store.api";
import { LinearGradient } from "expo-linear-gradient";
import { uploadImage } from "../../services/api/upload.api";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const EditStore = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { top } = useSafeAreaInsets();

  const STORE_ID = user.id || "";

  // Fetch existing store data
  const { data: storeData, isLoading: isFetchingStore } = useGetMyStoreQuery();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Local state
  const [image, setImage] = useState(null);
  const [englishName, setEnglishName] = useState("");
  const [kurdishName, setKurdishName] = useState("");
  const [message, setMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [fieldType, setFieldType] = useState("");

  useEffect(() => {
    if (storeData) {
      setEnglishName(storeData.name.english || "");
      setKurdishName(storeData.name.kurdish || "");
      setMessage(storeData.description || "");
      if (storeData.logo) {
        setImage({ uri: storeData.logo });
      }
    }
  }, [storeData]);

  // Track changes
  useEffect(() => {
    if (storeData) {
      const hasImageChanged = image?.uri !== storeData.logo;
      const hasEnglishChanged = englishName !== (storeData.name.english || "");
      const hasKurdishChanged = kurdishName !== (storeData.name.kurdish || "");
      const hasDescriptionChanged = message !== (storeData.description || "");

      setHasChanges(
        hasImageChanged ||
          hasEnglishChanged ||
          hasKurdishChanged ||
          hasDescriptionChanged,
      );
    }
  }, [image, englishName, kurdishName, message, storeData]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photos",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const img = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName.toLowerCase() || "image.jpg",
        type: result.assets[0].mimeType,
      };
      setImage(img);
    }
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

  const handleSaveChanges = async () => {
    setIsSavingChanges(true);
    // upload image and get url
    let logoUrl = "";
    if (image) {
      console.log("Uploading image:", image);
      logoUrl = await uploadImage(STORE_ID, image);
      console.log("Uploaded logo URL:", logoUrl);
    }

    try {
      const updateData = {
        id: STORE_ID, // Include the ID in the object
        ...(image && { logo: logoUrl }),
        ...((englishName || kurdishName) && {
          name: {
            ...(englishName && { english: englishName }),
            ...(kurdishName && { kurdish: kurdishName }),
          },
        }),
        ...(message && { description: message }),
      };
      console.log("Sending update:", updateData); // Debug log

      await updateStore(updateData).unwrap();

      Alert.alert(
        "Success! 🎉",
        "Your store information has been updated successfully.",
        [{ text: "Great!" }],
      );

      setHasChanges(false);
      setIsSavingChanges(false);
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.data?.message || "Something went wrong. Please try again.",
        [{ text: "OK" }],
      );
      setIsSavingChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard all unsaved changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            // Revert to original data
            if (storeData) {
              setEnglishName(storeData.name.english || "");
              setKurdishName(storeData.name.kurdish || "");
              setMessage(storeData.description || "");
              if (storeData.logo) {
                setImage(storeData.logo);
              }
            }
            setHasChanges(false);
          },
        },
      ],
    );
  };

  const getModalTitle = () => {
    if (fieldType === "english") return "Edit English Name";
    if (fieldType === "kurdish") return "Edit Kurdish Name";
    if (fieldType === "description") return "Edit Description";
    return "";
  };

  if (isFetchingStore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading store data...</Text>
      </View>
    );
  }

  return (
    // <SafeAreaView style={styles.flexContainer}>
    <View style={styles.container}>
      {/* <StatusBar style="dark" /> */}

   
      {/* Header with Save Button */}
      <LinearGradient
        colors={["#11a1a1", "#ffffff"]}
        style={[styles.header, { paddingTop: top + hp("2%") }]}
      >
           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#111" />
      </TouchableOpacity>

        <View style={styles.headerActions}>
          {hasChanges && (
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscardChanges}
              disabled={isUpdating}
            >
              <Ionicons name="close-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || isUpdating) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveChanges}
            disabled={!hasChanges || isUpdating}
          >
            {isUpdating || isSavingChanges ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* LOGO SECTION */}
      <View style={styles.logoSection}>
        <Text style={styles.sectionTitle}>Brand Logo</Text>

        <TouchableOpacity
          style={styles.logoBox}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          {image ? (
            <>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </>
          ) : (
            <>
              <Image
                source={require("../../assets/images/k16.png")}
                style={{
                  width: isTablet ? wp("20%") : wp("17%"),
                  height: isTablet ? hp("8%") : hp("8%"),
                }}
              />
              <Text style={styles.uploadHint}>Tap to upload logo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* INPUTS */}
      <View style={styles.form}>
        <Text style={styles.label}>English Name</Text>
        <TouchableOpacity
          style={styles.inputCard}
          onPress={() => openModal("english", englishName)}
          activeOpacity={0.7}
        >
          <Text style={[styles.inputText, !englishName && styles.placeholder]}>
            {englishName || "Enter store name in English..."}
          </Text>
          <Ionicons name="create-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <Text style={styles.label}>Kurdish Name</Text>
        <TouchableOpacity
          style={styles.inputCard}
          onPress={() => openModal("kurdish", kurdishName)}
          activeOpacity={0.7}
        >
          <Text style={[styles.inputText, !kurdishName && styles.placeholder]}>
            {kurdishName || "Enter store name in Kurdish..."}
          </Text>
          <Ionicons name="create-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TouchableOpacity
          style={styles.textArea}
          onPress={() => openModal("description", message)}
          activeOpacity={0.7}
        >
          <Text style={[styles.inputText, !message && styles.placeholder]}>
            {message || "Write a description for your store..."}
          </Text>
          <Ionicons name="create-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {message.length > 0 && (
          <Text
            style={[
              styles.counter,
              message.length > 90 && styles.counterWarning,
            ]}
          >
            {message.length}/100
          </Text>
        )}
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <SafeAreaView style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>

                <TextInput
                  style={[
                    styles.modalInput,
                    fieldType === "description" && { height: 120 },
                  ]}
                  value={tempValue}
                  onChangeText={(t) => {
                    if (fieldType === "description" && t.length > 100) return;
                    setTempValue(t);
                  }}
                  multiline={fieldType === "description"}
                  autoFocus
                  placeholder={`Enter ${fieldType === "description" ? "description" : "name"}...`}
                  maxLength={fieldType === "description" ? 100 : 50}
                />

                {fieldType === "description" && (
                  <Text style={styles.modalCounter}>
                    {tempValue.length}/100
                  </Text>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalSaveButton}
                    onPress={saveValue}
                  >
                    <Text style={styles.modalSaveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Changes indicator */}
      {hasChanges && !isUpdating && (
        <View style={styles.changesIndicator}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.changesText}>You have unsaved changes</Text>
        </View>
      )}
    </View>
    // {/* </SafeAreaView> */}
  );
};

export default EditStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  flexContainer: {
    flex: 1,
    backgroundColor: "#11a1a1",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },

  loadingText: {
    marginTop: 12,
    fontSize: RFPercentage(2),
    color: "#6b7280",
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("6%"),
    paddingBottom: hp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  discardButton: {
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 30,
    marginRight: 8,
  },

  saveButton: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 4,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  logoSection: {
    marginTop: hp("4%"),
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: "600",
    marginBottom: 16,
    color: "#374151",
    alignSelf: "flex-start",
    marginLeft: wp("5%"),
  },

  logoBox: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },

  editBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#16a34a",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  uploadHint: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: RFPercentage(1.6),
  },

  form: {
    marginTop: 30,
    paddingHorizontal: wp("5%"),
  },

  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: "#374151",
    fontSize: RFPercentage(1.8),
  },

  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  textArea: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    height: 140,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  inputText: {
    color: "#111",
    flex: 1,
    fontSize: RFPercentage(1.8),
  },

  placeholder: {
    color: "#9ca3af",
  },

  counter: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: "#6b7280",
    fontSize: RFPercentage(1.6),
  },

  counterWarning: {
    color: "#f59e0b",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollContent: {
    padding: wp("4%"),
    marginTop: hp("8%"),
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: wp("5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalBox: {
    width: wp("85%"),
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  modalTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    fontSize: RFPercentage(1.8),
    textAlignVertical: "top",
  },

  modalCounter: {
    alignSelf: "flex-end",
    color: "#6b7280",
    marginBottom: 20,
    fontSize: RFPercentage(1.6),
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },

  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },

  modalCancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  modalSaveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    alignItems: "center",
  },

  modalSaveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  changesIndicator: {
    position: "absolute",
    bottom: 30,
    left: wp("5%"),
    right: wp("5%"),
    backgroundColor: "#dbeafe",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  changesText: {
    color: "#1e40af",
    fontWeight: "500",
    fontSize: RFPercentage(1.6),
  },
});
