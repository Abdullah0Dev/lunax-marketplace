import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { useVideoPlayer, VideoView } from "expo-video";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function BadiniPage() {
  const [actionbadinii, setActionbadinii] = useState([]);

  useEffect(() => {
    axios
      .get("https://amedbaz.github.io/bnk/bnk.json")
      .then((result) => {
        setActionbadinii(result.data.bnk);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {actionbadinii.map((item) => (
        <View key={item.id}>
          {item.a2 && <VideoItem videoUrl={item.a2} />}
          {item.a3 && <VideoItem videoUrl={item.a3} />}
          {item.a4 && <VideoItem videoUrl={item.a4} />}
          {item.a5 && <VideoItem videoUrl={item.a5} />}
        </View>
      ))}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const VideoItem = ({ videoUrl }) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    // دەتوانیت لێرە ڕێکخستنی تر بکەیت
  });

  return (
    <View style={styles.videoBox}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        // ✅ چالاککردنی کۆنتڕۆڵەکان بۆ گەورەکردن و گۆڕینی کات
        nativeControls={true} 
        // ڕێگەدان بە گەورەکردن بۆ سەرانسەری شاشە
        allowsFullscreen={true}
        // کاتێک ڤیدیۆکە گەورە دەبێت، ڕووکارەکە چۆن بێت
        allowsVideoFrameAnalysis={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoBox: {
    width: wp("94%"),
    height: isTablet ? hp("30%") : hp("25%"),
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});