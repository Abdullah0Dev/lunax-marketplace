import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Create this component outside your HomeScreen
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const RADIUS = 20;

const VideoCard = ({ item, index, onPress }) => {
  const player = useVideoPlayer(item.play, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  return (
    <TouchableOpacity onPress={() => onPress(index)}>
      <View style={styles.card}>
        <VideoView player={player} style={styles.video} />
        <View style={styles.ratingBox}>
          <Image source={{ uri: item.wene1 }} style={styles.ratingIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  card: {
    width: isTablet ? wp("40%") : wp("40.5%"),
    height: isTablet ? hp("40%") : hp("30%"),
    marginHorizontal: wp("2%"),
    borderRadius: RADIUS,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  ratingBox: {
    position: "absolute",
    top: hp("1%"),
    right: wp("3%"),
  },
});
