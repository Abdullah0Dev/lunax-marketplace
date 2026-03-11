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
import { Video, ResizeMode } from "expo-av";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
const isTablet = width >= 768;

const videos = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  play: require("../../../assets/vv.mp4"),
  wene1: require("../../../assets/m202.png"),
  nav: `Laptop ${i + 1}`,
  subt:
    "ئەگەر دەتەوێت باشترین لەپتۆپ بەدەستبهێنی لە دۆزینەوەکەتدا، کلیل لەسەر 'زیاتر' بکە بۆ بینینی هەموو زانیارییەکان.",
}));

export default function Rellsall() {
  const navigation = useNavigation();
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ▶️ only visible video plays
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;

    const index = viewableItems[0].index;
    setCurrentIndex(index);
    setPaused(false);

    videoRefs.current.forEach((video, i) => {
      if (video) i === index ? video.playAsync() : video.pauseAsync();
    });
  }).current;

  const pauseAllVideos = () => {
    videoRefs.current.forEach((v) => v && v.pauseAsync());
  };

  // ▶️ tap center play / pause
  const togglePlay = async () => {
    const current = videoRefs.current[currentIndex];
    if (!current) return;

    paused ? await current.playAsync() : await current.pauseAsync();
    setPaused(!paused);
  };

  useFocusEffect(
    useCallback(() => {
      const current = videoRefs.current[currentIndex];
      if (current && !paused) current.playAsync();
      return pauseAllVideos;
    }, [currentIndex, paused])
  );

  useEffect(() => {
    const unsub = navigation.addListener("blur", pauseAllVideos);
    return unsub;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            {/* 🎥 VIDEO */}
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={item.play}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={index === currentIndex && !paused}
            />

            {/* 👆 CENTER TAP ONLY */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={togglePlay}
              style={styles.centerTap}
            >
              {paused && (
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
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  videoContainer: { height, width: "100%" },
  video: { width: "100%", height: "100%" },

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
    zIndex: 20, // ⭐ above tap
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
