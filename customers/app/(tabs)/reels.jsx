import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";

const { height, width } = Dimensions.get("window");
const isTablet = width >= 768;

const videos = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  play: require("../../assets/images/vv.mp4"),
  wene1: require("../../assets/images/m202.png"),
  nav: `Laptop ${i + 1}`,
  subt: "ئەگەر دەتەوێت باشترین لەپتۆپ بەدەستبهێنی لە دۆزینەوەکەتدا، کلیل لەسەر 'زیاتر' بکە بۆ بینینی هەموو زانیارییەکان.",
}));

// Individual Video Component with its own player
const VideoItem = ({ item, isActive, onTogglePlay, paused }) => {
  const player = useVideoPlayer(item.play, (player) => {
    player.loop = true;
    player.muted = true;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const flatListRef = useRef(null);

  // Handle viewable items change
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;
    const index = viewableItems[0].index;
    setCurrentIndex(index);
    setPaused(false);
  }).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 80,
  };

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
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            {/* 🎥 VIDEO with expo-video */}
            <VideoItem 
              item={item} 
              isActive={index === currentIndex}
              paused={paused}
              onTogglePlay={togglePlay}
            />

            {/* 👆 CENTER TAP ONLY */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={togglePlay}
              style={styles.centerTap}
            >
              {paused && index === currentIndex && (
                <FontAwesome6
                  name="play"
                  size={70}
                  color="rgba(255,255,255,0.85)"
                />
              )}
            </TouchableOpacity>

            {/* 🧊 BLUR BOX (CLICKABLE) */}
            <BlurView intensity={20} tint="dark" style={styles.userBox}>
              <TouchableOpacity>
                <Image source={item.wene1} style={styles.avatar} />
              </TouchableOpacity>

              <View style={styles.userTextBox}>
                <View style={styles.nameRow}>
                  <Text style={styles.username}>{item.nav}</Text>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={20}
                    color="#1DA1F2"
                    style={{ marginLeft: 6, marginTop: 0 }}
                  />
                </View>

                <Text style={styles.subText}>{item.subt}</Text>
              </View>
            </BlurView>
          </View>
        )}
      />
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

  /* 👇 only middle of video */
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
    flexDirection: "row",
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
    marginLeft: 10,
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: wp("2.5%"),
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
});