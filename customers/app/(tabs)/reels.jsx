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
import { useExplore } from "../../hooks/useExplore";
import { getRandomGradient } from "../../constants/Colors";
const { height, width } = Dimensions.get("window");
const isTablet = width >= 768;
import { useLazyGetStoreByIdQuery } from "../../services/api/store.api";

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
  const { reels, loadMoreReels, hasMore, reelsLoading, refreshReels } =
    useExplore();
  const [fetchStore, { data: store, isLoading: storeLoading }] =
    useLazyGetStoreByIdQuery();
  const { feedVideo: reelVideo } = useLocalSearchParams();
  const feedVideo = reelVideo ? JSON.parse(reelVideo) : []

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const isFetchingRef = useRef(false);

  const feedVideos = reels.map((item, index) => {
    return {
      id: item?.id,
      url: item?.url?.replace(
        "http://tools-openinary-8f358f-173-249-22-222.traefik.me",
        "https://storage.dmsystem.dpdns.org",
      ),
      thumbnail_url: item?.thumbnail_url,
      title:
        `${item?.title?.kurdish}\n${item?.description}` ||
        `${item?.title?.english}\n${item?.description}`,
      store: {
        id: item?.store?.id,
        name: item?.store?.name?.kurdish || item?.store?.name?.english || "",
        logo: item?.store?.logo
          ? { uri: item?.store?.logo }
          : require("../../assets/images/m202.png"),
      },
    };
  });

  // Handle viewable items change and trigger pagination
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;
    const index = viewableItems[0].index;
    setCurrentIndex(index);
    setPaused(false);

    // Check if we're near the end of the list (last 2 items)
    const isNearEnd = index >= feedVideos.length - 2;

    // Load more reels if we're near the end, have more content, and not already loading
    if (isNearEnd && hasMore && !reelsLoading && !isFetchingRef.current) {
      isFetchingRef.current = true;
      loadMoreReels().finally(() => {
        isFetchingRef.current = false;
      });
    }
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
    }, []),
  );

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshReels();
    setRefreshing(false);
  };

  const handleViewStore = async (item) => {
    const storeId = item.store.id;
    const results = await fetchStore(storeId);
    const store = results.data;
    const stringifiedStore = JSON.stringify(store);
    const url = `/store/${item.id}`;
    const title = "";
    router.navigate({
      pathname: url,
      params: {
        store: stringifiedStore,
        fromProduct: true,
        gradient: getRandomGradient(),
        title,
      },
    });
    return;
  };

  // Footer loading indicator
  const ListFooterComponent = () => {
    if (!reelsLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>بارکردنی ڤیدیۆی تر...</Text>
      </View>
    );
  };
  const reelsFeed = feedVideo ? [feedVideo, ...feedVideos] : feedVideos ?? [];
  console.log("reelsFeed: ", reelsFeed.flat());
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reelsFeed.flat()}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListFooterComponent={ListFooterComponent}
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
            <BlurView intensity={28} tint="dark" style={styles.userBox}>
              <TouchableOpacity
                onPress={() => handleViewStore(item)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Image source={item?.store?.logo} style={styles.avatar} />
                <View style={styles.nameRow}>
                  <Text style={styles.username}>{item?.store?.name}</Text>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={20}
                    color="#1DA1F2"
                    style={{ marginLeft: 6, marginTop: 0 }}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.userTextBox}>
                <Text style={styles.subText}>{item?.title}</Text>
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
