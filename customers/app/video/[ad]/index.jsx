import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
const { height, width } = Dimensions.get("window");
const isTablet = width >= 768;

// Individual Video Component with its own player
const VideoItem = ({ item, isActive, onTogglePlay, paused }) => {
  const player = useVideoPlayer(item.url, (player) => {
    player.loop = true;
    // player.muted = true;
  });

  // Control playback based on active state and paused state
  useEffect(() => {
    if (isActive && !paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, paused]);

  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};

const ReelsTab = () => {
  const router = useRouter();
  const { feedVideo: reelVideo } = useLocalSearchParams();
  const feedVideo = reelVideo ? JSON.parse(reelVideo) : [];

  const [paused, setPaused] = useState(false);
  // Toggle play/pause
  const togglePlay = () => {
    setPaused(!paused);
  };

  // Pause all videos when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setPaused(true);
      };
    }, []),
  );

  return ( 
    <View style={styles.videoContainer}>
      <TouchableOpacity
        style={styles.backBtnContainer}
        onPress={() => router.back()}
      >
        <View style={[styles.backBtnWrapper, { borderRadius: 30 }]}>
          <BlurView intensity={80} tint="dark" style={styles.backBtn}>
            <FontAwesome6 name="angle-left" size={24} color="#fff" />
          </BlurView>
        </View>
      </TouchableOpacity>
      {/* 🎥 VIDEO with expo-video */}
      <VideoItem
        item={feedVideo}
        isActive={true}
        paused={paused}
        onTogglePlay={togglePlay}
      />

      {/* 👆 CENTER TAP ONLY */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={togglePlay}
        style={styles.centerTap}
      >
        {paused && (
          <FontAwesome6 name="play" size={70} color="rgba(255,255,255,0.85)" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ReelsTab;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  videoContainer: { height, width: "100%", position: "relative" },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backBtnWrapper: {
    borderRadius: 30,
    overflow: "hidden", // Critical for clipping the blur
  },
  backBtn: {
    width: isTablet ? wp("7%") : wp("12%"),
    height: isTablet ? hp("5%") : hp("5.5%"),
    justifyContent: "center",
    alignItems: "center",
    // Remove borderRadius from here
  },
  backBtnContainer: {
    position: "absolute",
    top: "7%",
    left: "5%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  centerTap: {
    position: "absolute",
    top: "35%",
    left: "20%",
    width: "60%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },

  userBox: {
    position: "absolute",
    bottom: isTablet ? hp("15%") : hp("12%"),
    width: isTablet ? wp("60%") : wp("94%"),
    left: isTablet ? wp("20%") : wp("3%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.6%"),
    borderRadius: 22,
    overflow: "hidden",
    zIndex: 20,
  },

  avatar: {
    width: isTablet ? 56 : 46,
    height: isTablet ? 56 : 46,
    borderRadius: 28,
  },

  userTextBox: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    color: "#fff",
    fontSize: isTablet ? 20 : 18,
    fontWeight: "bold",
  },

  subText: {
    width: "100%",
    color: "#eee",
    fontSize: isTablet ? 16 : 14,
    lineHeight: isTablet ? 26 : 22,
    marginTop: 6,
    textAlign: "right",
    writingDirection: "ltr",
    fontFamily: "k24",
  },
  loadingFooter: {
    height: height * 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
    fontFamily: "k24",
  },
});
