import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform
} from "react-native";
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useGetMyReelsQuery } from "../../../../services/api/reel.api";
import { useReelManagement } from "../../../../hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// API Hooks

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

// Video duration limits
const MAX_DURATION = 300; // 5 minutes in seconds
const MIN_DURATION = 1;

export default function ReelManagement({ navigation }) {
  // API Hooks
  const { data: reels = [], isLoading: loadingReels, refetch } = useGetMyReelsQuery();
  const {
    uploadReel,
    updateReel,
    deleteReel,
    uploadLimit,
    canUploadToday
  } = useReelManagement();
  const { user } = useSelector((state) => state.auth);
  const STORE_ID = user.id || ""
  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(null);

  // Form state - matching schema
  const [videoAsset, setVideoAsset] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [kurdishTitle, setKurdishTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoInfo, setVideoInfo] = useState({
    format: "",
    width: 0,
    height: 0,
    size: 0
  });

  // Stats
  const todayUploads = reels?.filter(r =>
    new Date(r.createdAt).toDateString() === new Date().toDateString()
  ).length || 0;

  const pickVideo = async () => {
    if (!canUploadToday) {
      Alert.alert(
        "Upload Limit Reached",
        `You've used all your ${uploadLimit?.limit || 5} uploads for today. Try again tomorrow.`
      );
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please grant permission to access your videos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      console.log("asset: ", asset);

      // Validate duration
      if (asset.duration) {
        const durationInSeconds = Math.round(asset.duration / 100);
        if (durationInSeconds > MAX_DURATION) {
          Alert.alert(
            "Video Too Long",
            `Maximum duration is ${MAX_DURATION / 60} minutes. Your video is ${Math.round(durationInSeconds / 60)} minutes.`
          );
          return;
        }
        setDuration(durationInSeconds.toString());
      }

      setVideoAsset(asset.uri);
      setVideoInfo({
        format: asset.type?.split('/')[1] || 'mp4',
        width: asset.width || 0,
        height: asset.height || 0,
        size: asset.fileSize || 0
      });
    }
  };

  const pickThumbnail = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setVideoAsset(null);
    setThumbnail(null);
    setKurdishTitle("");
    setEnglishTitle("");
    setDescription("");
    setDuration("");
    setVideoInfo({ format: "", width: 0, height: 0, size: 0 });
    setSelectedReel(null);
  };

  const openEditModal = (reel) => {
    console.log("reel: ", reel);

    setSelectedReel(reel);
    setVideoAsset(reel.url);
    setThumbnail(reel.thumbnail_url);
    setKurdishTitle(reel.title?.kurdish || "");
    setEnglishTitle(reel.title?.english || "");
    setDescription(reel.description || "");
    setDuration(reel.duration?.toString() || "");
    setVideoInfo({
      format: reel.format || "",
      width: reel.width || 0,
      height: reel.height || 0,
      size: reel.size || 0
    });
    setModalVisible(true);
  };

  const confirmDelete = (reel) => {
    setSelectedReel(reel);
    setDeleteModal(true);
  };

  const validateForm = () => {
    if (!selectedReel && !videoAsset) {
      Alert.alert("Error", "Please select a video");
      return false;
    }
    if (!kurdishTitle.trim()) {
      Alert.alert("Error", "Please enter Kurdish title");
      return false;
    }
    if (!englishTitle.trim()) {
      Alert.alert("Error", "Please enter English title");
      return false;
    }
    if (!duration || parseInt(duration) < MIN_DURATION || parseInt(duration) > MAX_DURATION) {
      Alert.alert("Error", `Duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds`);
      return false;
    }
    return true;
  };
  const createReelFormData = async () => {
    const formData = new FormData();
    const storeId = STORE_ID; // Get from your store

    // Add video file
    if (videoAsset) {
      const filename = videoAsset.split('/').pop() || 'video.mp4';
      const mimeType = `video/${videoInfo.format || 'mp4'}`;

      formData.append('video', {
        uri: videoAsset,
        name: filename,
        type: mimeType,
      });
    }

    // Add thumbnail if exists
    if (thumbnail) {
      const thumbFilename = thumbnail.split('/').pop() || 'thumbnail.jpg';
      formData.append('thumbnail', {
        uri: thumbnail,
        name: thumbFilename,
        type: 'image/jpeg',
      });
    }

    // Add all fields
    formData.append('storeId', storeId);
    formData.append('titleKurdish', kurdishTitle);
    formData.append('titleEnglish', englishTitle);
    if (description) {
      formData.append('description', description);
    }
    formData.append('duration', duration);
    // formData.append('width', videoInfo.width);
    // formData.append('height', videoInfo.height);

    return formData;
  };

  const handleUploadReel = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = await createReelFormData();
      const updateData = {
        title: {
          kurdish: kurdishTitle,
          english: englishTitle,
        },
        description: description.trim(),
      };
      // Log FormData contents for debugging
      console.log('Uploading reel...');

      if (selectedReel) {
        console.log('Updating reel with:', updateData); // Debug log
        // For updates, check if your API supports FormData for updates
        await updateReel({
          id: selectedReel.id,
          updates: updateData  // Make sure it's 'updates' not 'data' to match the mutation
        }).unwrap();
        Alert.alert("Success", "Reel updated successfully");
      } else {
        await uploadReel(formData).unwrap();
        Alert.alert("Success", "Reel uploaded successfully");
      }

      setModalVisible(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        "Error",
        error?.data?.message || error?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReel = async () => {
    setLoading(true);
    try {
      await deleteReel(selectedReel.id).unwrap();
      setDeleteModal(false);
      Alert.alert("Success", "Reel deleted successfully");
      refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to delete reel");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderReelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.reelCard}
      onPress={() => openEditModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.reelPreview}>
        {item.thumbnail_url ? (
          <Image
            source={{ uri: item.thumbnail_url }}
            style={styles.thumbnail}
            contentFit="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="play-circle" size={40} color="#9ca3af" />
          </View>
        )}

        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
        </View>
      </View>

      <View style={styles.reelInfo}>
        <Text style={styles.reelTitle} numberOfLines={1}>
          {item.title?.english || item.title?.kurdish}
        </Text>

        <View style={styles.reelMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {item.size > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="server-outline" size={12} color="#6b7280" />
              <Text style={styles.metaText}>{formatFileSize(item.size)}</Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.reelDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteReelButton}
        onPress={() => confirmDelete(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Header */}
        <LinearGradient
          colors={['#11a1a1', '#f9fafb']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reel Management</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Upload Limit Card */}
        <BlurView intensity={80} tint="light" style={styles.limitCard}>
          <View style={styles.limitInfo}>
            <Ionicons name="cloud-upload-outline" size={24} color="#6366f1" />
            <View style={styles.limitText}>
              <Text style={styles.limitTitle}>Daily Upload Limit</Text>
              <Text style={styles.limitCount}>
                {todayUploads} / {uploadLimit?.limit || 5} used
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(todayUploads / (uploadLimit?.limit || 5)) * 100}%` }
              ]}
            />
          </View>
        </BlurView>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            !canUploadToday && styles.uploadButtonDisabled
          ]}
          onPress={() => setModalVisible(true)}
          disabled={!canUploadToday}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canUploadToday ? ['#6366f1', '#8b5cf6'] : ['#9ca3af', '#6b7280']}
            style={styles.uploadGradient}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {canUploadToday ? 'Upload New Reel' : 'Daily Limit Reached'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Reels List */}
        {loadingReels ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Loading reels...</Text>
          </View>
        ) : (
          <FlatList
            data={reels}
            renderItem={renderReelCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.reelList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={60} color="#d1d5db" />
                <Text style={styles.emptyText}>No reels yet</Text>
                <Text style={styles.emptySubtext}>
                  Upload your first reel to showcase your products
                </Text>
              </View>
            }
          />
        )}

        {/* Upload/Edit Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedReel ? 'Edit Reel' : 'Upload New Reel'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Video Picker */}
                {!selectedReel && (
                  <TouchableOpacity
                    style={styles.videoPicker}
                    onPress={pickVideo}
                  >
                    {videoAsset ? (
                      <View style={styles.videoPreview}>
                        <Video
                          source={{ uri: videoAsset }}
                          style={styles.previewVideo}
                          useNativeControls
                          resizeMode="cover"
                          isLooping
                        />
                        <View style={styles.changeVideoBadge}>
                          <Ionicons name="camera-reverse" size={20} color="#fff" />
                        </View>
                      </View>
                    ) : (
                      <View style={styles.videoPlaceholder}>
                        <Ionicons name="cloud-upload" size={40} color="#9ca3af" />
                        <Text style={styles.placeholderTitle}>Tap to select video</Text>
                        <Text style={styles.placeholderSubtitle}>
                          Max duration: {MAX_DURATION / 60} minutes
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}

                {/* Thumbnail Picker */}
                <TouchableOpacity
                  style={styles.thumbnailPicker}
                  onPress={pickThumbnail}
                >
                  {thumbnail ? (
                    <View style={styles.thumbnailPreview}>
                      <Image source={{ uri: thumbnail }} style={styles.previewThumbnail} />
                      <View style={styles.changeThumbnailBadge}>
                        <Ionicons name="image" size={16} color="#fff" />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.thumbnailPlaceholder}>
                      <Ionicons name="image-outline" size={24} color="#9ca3af" />
                      <Text style={styles.thumbnailPlaceholderText}>
                        {selectedReel ? 'Change thumbnail' : 'Add thumbnail (optional)'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View style={styles.form}>
                  <Text style={styles.label}>Kurdish Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={kurdishTitle}
                    onChangeText={setKurdishTitle}
                    placeholder="ناونیشانی ڤیدیۆ"
                    placeholderTextColor="#9ca3af"
                  />

                  <Text style={styles.label}>English Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={englishTitle}
                    onChangeText={setEnglishTitle}
                    placeholder="Video title"
                    placeholderTextColor="#9ca3af"
                  />

                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your reel..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                  />
                  {/* Video Info */}
                  {videoInfo.format && (
                    <View style={styles.videoInfo}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Format:</Text>
                        <Text style={styles.infoValue}>{videoInfo.format}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Resolution:</Text>
                        <Text style={styles.infoValue}>
                          {videoInfo.width} x {videoInfo.height}
                        </Text>
                      </View>
                      {videoInfo.size > 0 && (
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Size:</Text>
                          <Text style={styles.infoValue}>
                            {formatFileSize(videoInfo.size)}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.uploadConfirmButton}
                    onPress={handleUploadReel}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.uploadConfirmText}>
                        {selectedReel ? 'Update' : 'Upload'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal visible={deleteModal} transparent animationType="fade">
          <View style={[styles.modalOverlay]}>
            <BlurView intensity={3} tint="dark" style={styles.deleteModal}>
              <Ionicons name="warning-outline" size={48} color="#ef4444" />
              <Text style={styles.deleteTitle}>Delete Reel?</Text>
              <Text style={styles.deleteMessage}>
                Are you sure you want to delete "{selectedReel?.title?.english}"?
                This action cannot be undone.
              </Text>

              <View style={styles.deleteActions}>
                <TouchableOpacity
                  style={styles.deleteCancel}
                  onPress={() => setDeleteModal(false)}
                >
                  <Text style={styles.deleteCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteConfirm}
                  onPress={handleDeleteReel}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.deleteConfirmText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  backButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  limitCard: {
    margin: wp('4%'),
    padding: wp('4%'),
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  limitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  limitText: {
    flex: 1,
    marginLeft: 12,
  },

  limitTitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#111",
  },

  limitCount: {
    fontSize: RFPercentage(1.6),
    color: "#6b7280",
  },

  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },

  uploadButton: {
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  uploadButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
  },

  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp('2%'),
    gap: 8,
  },

  uploadButtonText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    fontWeight: "600",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    marginTop: 12,
    fontSize: RFPercentage(1.8),
    color: "#6b7280",
  },

  reelList: {
    padding: wp('4%'),
  },

  reelCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: wp('3%'),
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  reelPreview: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },

  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },

  durationText: {
    color: '#fff',
    fontSize: RFPercentage(1.2),
    fontWeight: "500",
  },

  reelInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  reelTitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  reelMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: RFPercentage(1.4),
    color: "#6b7280",
  },

  reelDescription: {
    fontSize: RFPercentage(1.4),
    color: "#6b7280",
  },

  deleteReelButton: {
    padding: 8,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },

  emptyText: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: RFPercentage(1.6),
    color: "#9ca3af",
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: wp('10%'),
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
  },

  modalScroll: {
    padding: wp('4%'),
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: wp('5%'),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  modalTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#111",
  },

  videoPicker: {
    marginBottom: 16,
  },

  videoPreview: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  previewVideo: {
    width: '100%',
    height: '100%',
  },

  changeVideoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 30,
  },

  videoPlaceholder: {
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },

  placeholderTitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },

  placeholderSubtitle: {
    fontSize: RFPercentage(1.4),
    color: "#9ca3af",
    marginTop: 4,
  },

  thumbnailPicker: {
    marginBottom: 16,
  },

  thumbnailPreview: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },

  previewThumbnail: {
    width: '100%',
    height: '100%',
  },

  changeThumbnailBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },

  thumbnailPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },

  thumbnailPlaceholderText: {
    fontSize: RFPercentage(1.4),
    color: "#9ca3af",
    textAlign: 'center',
    marginTop: 4,
  },

  form: {
    marginBottom: hp('2%'),
  },

  label: {
    fontSize: RFPercentage(1.6),
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: RFPercentage(1.8),
    backgroundColor: '#f9fafb',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  videoInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  infoLabel: {
    fontSize: RFPercentage(1.4),
    color: "#6b7280",
  },

  infoValue: {
    fontSize: RFPercentage(1.4),
    fontWeight: "500",
    color: "#111",
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  uploadConfirmButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  uploadConfirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  // Delete Modal
  deleteModal: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: wp('8%'),
    alignItems: 'center',
    margin: wp('10%'),
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
    textAlign: 'center',
    marginBottom: 24,
  },

  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  deleteCancel: {
    flex: 1,
    backgroundColor: '#f7f9fe',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  deleteCancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },

  deleteConfirm: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  deleteConfirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: RFPercentage(1.8),
  },
});