import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useProductManagement } from "../../hooks/useStore";
import { useGetMyProductsQuery } from "../../services/api/product.api";
import { uploadImages } from "../../services/api/upload.api";
import { useSelector } from "react-redux";

const MangeProducts = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { top } = useSafeAreaInsets();
  const { user } = useSelector((state) => state.auth);
  const STORE_ID = user.id || "";

  // API Hooks
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch,
  } = useGetMyProductsQuery();
  const isUpdating = false;
  const isCreating = false;
  const isDeleting = false;
  const { createProduct, updateProduct, deleteProduct, updateQuantity } =
    useProductManagement();

  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state - matching your schema
  const [kurdishName, setKurdishName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * (p.quantity || 0),
    0,
  );

  // Reset form
  const resetForm = () => {
    setKurdishName("");
    setEnglishName("");
    setPrice("");
    setDiscountPrice("");
    setQuantity("");
    setCategory("");
    setDescription("");
    setCoverImage(null);
    setMedia([]);
    setSpecifications([{ key: "", value: "" }]);
    setSelectedProduct(null);
  };

  // Load product data for editing
  useEffect(() => {
    if (selectedProduct) {
      setKurdishName(selectedProduct.name?.kurdish || "");
      setEnglishName(selectedProduct.name?.english || "");
      setPrice(selectedProduct.price?.toString() || "");
      setDiscountPrice(selectedProduct.discount_price?.toString() || "");
      setQuantity(selectedProduct.quantity?.toString() || "");
      setCategory(selectedProduct.category || "");
      setDescription(selectedProduct.description || "");
      setCoverImage({ uri: selectedProduct.cover_image } || null);
      setMedia(selectedProduct.media || []);
      setSpecifications(
        selectedProduct.specifications?.length > 0
          ? selectedProduct.specifications
          : [{ key: "", value: "" }],
      );
    }
  }, [selectedProduct]);

  const pickImage = async (isCover = true) => {
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
      allowsMultipleSelection: !isCover,
    });

    if (!result.canceled) {
      console.log("result.assets: ", result.assets);

      if (isCover) {
        const img = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || `cover-${Date.now()}.jpg`,
          type: result.assets[0].mimeType || "image/jpeg",
        };
        setCoverImage(img);
      } else {
        const imgs = result.assets.map((img) => ({
          uri: img.uri,
          name: img.fileName || `cover-${Date.now()}.jpg`,
          type: img.mimeType || "image/jpeg",
        }));
        setMedia([...media, ...imgs]);
      }
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const validateForm = () => {
    if (!kurdishName.trim()) {
      Alert.alert("Error", "Please enter Kurdish name");
      return false;
    }
    if (!englishName.trim()) {
      Alert.alert("Error", "Please enter English name");
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return false;
    }
    if (!category.trim()) {
      Alert.alert("Error", "Please enter a category");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return false;
    }
    if (!coverImage && !selectedProduct) {
      Alert.alert("Error", "Please add a cover image");
      return false;
    }
    return true;
  };

  const isRemoteUrl = (uri) =>
    uri?.startsWith("http://") || uri?.startsWith("https://");

  const handleSaveProduct = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      let coverImageUrl = "";
      let mediaUrls = [];
      const imagesToUpload = [];

      // Collect all new images to upload
      if (
        coverImage &&
        !coverImage.isExisting &&
        !isRemoteUrl(coverImage.uri)
      ) {
        imagesToUpload.push({
          uri: coverImage.uri,
          name: coverImage.name || `cover-${Date.now()}.jpg`,
          type: coverImage.type || "image/jpeg",
        });
      }

      if (media && media.length > 0) {
        media.forEach((img) => {
          if (!img.isExisting && !isRemoteUrl(img.uri)) {
            imagesToUpload.push({
              uri: img.uri,
              name: img.name || `media-${Date.now()}-${Math.random()}.jpg`,
              type: img.type || "image/jpeg",
            });
          }
        });
      }

      if (imagesToUpload.length > 0) {
        console.log(
          `Uploading ${imagesToUpload.length} images:`,
          imagesToUpload,
        );

        const uploadedImages = await uploadImages(STORE_ID, imagesToUpload);
        console.log("Uploaded images:", uploadedImages);

        let uploadIndex = 0;

        if (
          coverImage &&
          !coverImage.isExisting &&
          !isRemoteUrl(coverImage.uri)
        ) {
          coverImageUrl =
            uploadedImages[uploadIndex]?.url || uploadedImages[uploadIndex];
          uploadIndex++;
        } else if (coverImage?.isExisting || isRemoteUrl(coverImage?.uri)) {
          coverImageUrl = coverImage.uri;
        }

        if (media && media.length > 0) {
          mediaUrls = media.map((img) => {
            if (img.isExisting || isRemoteUrl(img.uri)) {
              return img.uri;
            } else {
              return (
                uploadedImages[uploadIndex++]?.url ||
                uploadedImages[uploadIndex - 1]
              );
            }
          });
        }
      } else {
        if (coverImage?.isExisting) {
          coverImageUrl = coverImage.uri;
        }
        if (media && media.length > 0) {
          mediaUrls = media.map((img) => img.uri);
        }
      }

      const productData = {
        store_id: STORE_ID,
        name: {
          kurdish: kurdishName,
          english: englishName,
        },
        price: parseFloat(price),
        ...(discountPrice && { discount_price: parseFloat(discountPrice) }),
        quantity: parseInt(quantity) || 0,
        category: category.trim(),
        description: description.trim(),
        cover_image: coverImageUrl,
        ...(mediaUrls.length > 0 && { media: mediaUrls }),
        specifications: specifications.filter(
          (s) => s.key.trim() && s.value.trim(),
        ),
      };

      console.log(
        "Sending product data:",
        JSON.stringify(productData, null, 2),
      );

      if (selectedProduct) {
        await updateProduct({
          id: selectedProduct.id,
          ...productData,
        }).unwrap();
        Alert.alert("Success", "Product updated successfully");
      } else {
        await createProduct(productData).unwrap();
        Alert.alert("Success", "Product added successfully");
      }

      setModalVisible(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(
        "Error",
        error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProduct.id).unwrap();
      setDeleteModal(false);
      Alert.alert("Success", "Product deleted successfully");
      refetch();
    } catch (error) {
      Alert.alert("Error", error?.data?.message || "Failed to delete product");
    }
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => openEditModal(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.cover_image }}
        style={styles.productImage}
        defaultSource={require("../../assets/images/k15.webp")}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name?.english || item.name?.kurdish}
        </Text>
        <Text style={styles.productCategory}>{item.category}</Text>

        <View style={styles.productMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color="#16a34a" />
            {item.discount_price ? (
              <Text style={styles.metaText}>
                IQD{Math.floor(item.discount_price).toLocaleString()}
                <Text style={styles.discountPrice}>
                  {" "}
                  IQD{Math.floor(item.price).toLocaleString()}
                </Text>
              </Text>
            ) : (
              <Text style={styles.metaText}>
                IQD{Math.floor(item.price)?.toLocaleString()}
              </Text>
            )}
          </View>
          {item.quantity > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={14} color="#3b82f6" />
              <Text style={styles.metaText}>{item.quantity || 0} in stock</Text>
            </View>
          )}
        </View>

        {item.media?.length > 0 && (
          <View style={styles.mediaIndicator}>
            <Ionicons name="images-outline" size={14} color="#6b7280" />
            <Text style={styles.mediaText}>{item.media.length} images</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.statCard}>
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </LinearGradient>

        <LinearGradient colors={["#10b981", "#059669"]} style={styles.statCard}>
          <Text style={styles.statValue}>{totalStock}</Text>
          <Text style={styles.statLabel}>Items in Stock</Text>
        </LinearGradient>

        <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.statCard}>
          <Text style={styles.statValue}>
            IQD{Math.floor(totalValue).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Inventory Value</Text>
        </LinearGradient>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={openAddModal}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoadingProducts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#11a1a1", paddingTop: top }}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        {/* Header */}
        <LinearGradient
          colors={["#11a1a1", "#f9fafb"]}
          style={styles.headerBar}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Management</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Products List */}
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={60} color="#d1d5db" />
              <Text style={styles.emptyText}>No products yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the button above to add your first product
              </Text>
            </View>
          }
        />

        {/* Add/Edit Modal */}
        <Modal transparent visible={modalVisible}>
          <SafeAreaView style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedProduct ? "Edit Product" : "Add New Product"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        resetForm();
                      }}
                    >
                      <Ionicons name="close" size={24} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Cover Image */}
                  <Text style={styles.sectionLabel}>Cover Image *</Text>
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={() => pickImage(true)}
                  >
                    {coverImage ? (
                      <Image
                        source={{ uri: coverImage.uri }}
                        style={styles.pickedImage}
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons
                          name="camera-outline"
                          size={32}
                          color="#9ca3af"
                        />
                        <Text style={styles.imagePlaceholderText}>
                          Tap to add cover
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Product Names */}
                  <View style={styles.form}>
                    <Text style={styles.inputLabel}>Kurdish Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={kurdishName}
                      onChangeText={setKurdishName}
                      placeholder="ناوی بەرهەم"
                      placeholderTextColor="#9ca3af"
                    />

                    <Text style={styles.inputLabel}>English Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={englishName}
                      onChangeText={setEnglishName}
                      placeholder="Product name"
                      placeholderTextColor="#9ca3af"
                    />

                    <View style={styles.rowInputs}>
                      <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Price (IQD) *</Text>
                        <TextInput
                          style={styles.input}
                          value={price}
                          onChangeText={setPrice}
                          placeholder="0.00"
                          keyboardType="decimal-pad"
                          placeholderTextColor="#9ca3af"
                        />
                      </View>

                      <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Category *</Text>
                        <TextInput
                          style={styles.input}
                          value={category}
                          onChangeText={setCategory}
                          placeholder="e.g. Electronics"
                          placeholderTextColor="#9ca3af"
                        />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>Description *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Product description..."
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                    />

                    {/* Additional Images */}
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Additional Images</Text>
                      <TouchableOpacity onPress={() => pickImage(false)}>
                        <Ionicons name="add-circle" size={24} color="#16a34a" />
                      </TouchableOpacity>
                    </View>

                    {media.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.mediaList}
                      >
                        {media.map((img, index) => {
                          const isObject = typeof img === "object";
                          console.log("images: ", isObject, img);
                          return (
                            <View key={index} style={styles.mediaItem}>
                              <Image
                                source={!isObject ? { uri: img } : img}
                                style={styles.mediaImage}
                              />
                              <TouchableOpacity
                                style={styles.removeMedia}
                                onPress={() =>
                                  setMedia(media.filter((_, i) => i !== index))
                                }
                              >
                                <Ionicons
                                  name="close-circle"
                                  size={20}
                                  color="#ef4444"
                                />
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}

                    {/* Specifications */}
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Specifications</Text>
                      <TouchableOpacity onPress={addSpecification}>
                        <Ionicons name="add-circle" size={24} color="#16a34a" />
                      </TouchableOpacity>
                    </View>

                    {specifications.map((spec, index) => (
                      <View key={index} style={styles.specRow}>
                        <TextInput
                          style={[styles.input, styles.specInput]}
                          value={spec.key}
                          onChangeText={(text) =>
                            updateSpecification(index, "key", text)
                          }
                          placeholder="Key (e.g. Color)"
                          placeholderTextColor="#9ca3af"
                        />
                        <TextInput
                          style={[styles.input, styles.specInput]}
                          value={spec.value}
                          onChangeText={(text) =>
                            updateSpecification(index, "value", text)
                          }
                          placeholder="Value (e.g. Red)"
                          placeholderTextColor="#9ca3af"
                        />
                        {specifications.length > 1 && (
                          <TouchableOpacity
                            onPress={() => removeSpecification(index)}
                          >
                            <Ionicons
                              name="close-circle"
                              size={20}
                              color="#ef4444"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Actions */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => {
                        setModalVisible(false);
                        resetForm();
                      }}
                    >
                      <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalSaveButton}
                      onPress={handleSaveProduct}
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating || isSaving ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.modalSaveText}>
                          {selectedProduct ? "Update" : "Save"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal transparent animationType="fade" visible={deleteModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModal}>
              <Ionicons name="warning-outline" size={48} color="#ef4444" />
              <Text style={styles.deleteTitle}>Delete Product?</Text>
              <Text style={styles.deleteMessage}>
                Are you sure you want to delete "
                {selectedProduct?.name?.english}"? This action cannot be undone.
              </Text>

              <View style={styles.deleteActions}>
                <TouchableOpacity
                  style={styles.deleteCancelButton}
                  onPress={() => setDeleteModal(false)}
                >
                  <Text style={styles.deleteCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteConfirmButton}
                  onPress={handleDeleteProduct}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.deleteConfirmText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default MangeProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: RFPercentage(2),
    color: "#6b7280",
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  backButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  listContent: {
    paddingBottom: hp("4%"),
  },

  header: {
    padding: wp("4%"),
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("3%"),
    gap: 8,
  },

  statCard: {
    flex: 1,
    padding: wp("3%"),
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  statValue: {
    fontSize: RFPercentage(2.4),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: RFPercentage(1.4),
    color: "#fff",
    opacity: 0.9,
  },

  addButton: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: hp("1.8%"),
    borderRadius: 16,
    gap: 8,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  addButtonText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    fontWeight: "600",
  },

  productCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginHorizontal: wp("4%"),
    marginBottom: hp("1.5%"),
    padding: wp("3%"),
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  productImage: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },

  productInfo: {
    flex: 1,
    marginLeft: wp("3%"),
    justifyContent: "center",
  },

  productName: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },

  productCategory: {
    fontSize: RFPercentage(1.6),
    color: "#6b7280",
    marginBottom: 6,
  },

  productMeta: {
    flexDirection: "row",
    gap: 12,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontSize: RFPercentage(1.6),
    color: "#4b5563",
  },

  discountPrice: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
    fontSize: RFPercentage(1.4),
  },

  mediaIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  mediaText: {
    fontSize: RFPercentage(1.4),
    color: "#6b7280",
  },

  deleteButton: {
    padding: 8,
    justifyContent: "center",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("10%"),
  },

  emptyText: {
    fontSize: RFPercentage(2.2),
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: RFPercentage(1.8),
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: wp("10%"),
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },

  modalScrollContent: {
    padding: wp("4%"),
    flex: 1,
    justifyContent: "center",
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

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },

  modalTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },

  sectionLabel: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#374151",
  },

  imagePicker: {
    alignItems: "center",
    marginBottom: hp("2%"),
  },

  pickedImage: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: 16,
  },

  imagePlaceholder: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },

  imagePlaceholderText: {
    fontSize: RFPercentage(1.4),
    color: "#9ca3af",
    marginTop: 4,
  },

  form: {
    marginBottom: hp("2%"),
  },

  inputLabel: {
    fontSize: RFPercentage(1.6),
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: hp("1.5%"),
    fontSize: RFPercentage(1.8),
    backgroundColor: "#f9fafb",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },

  halfInput: {
    flex: 1,
  },

  mediaList: {
    flexDirection: "row",
    marginVertical: 8,
  },

  mediaItem: {
    position: "relative",
    marginRight: 8,
  },

  mediaImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  removeMedia: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  specRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  specInput: {
    flex: 1,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
  },

  modalCancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  modalSaveButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
  },

  modalSaveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  // Delete Modal
  deleteModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: wp("6%"),
    alignItems: "center",
  },

  deleteTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 8,
  },

  deleteMessage: {
    fontSize: RFPercentage(1.8),
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },

  deleteActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  deleteCancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
  },

  deleteCancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  deleteConfirmButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
  },

  deleteConfirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },
});
