import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { isTablet } from "../constants";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const SlidingBox = ({
  images = [
    "https://contents.mediadecathlon.com/p2606947/1cr1/k$1c9e0ffdefc3e67bdeabc82be7893e93/dry-men-s-running-breathable-t-shirt-neon-coral-pink.jpg",
    "https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_Natural_01_1.jpg",
  ],
  handleImagePress,
  hideMargin = false,
  moreHeight = false,
}) => {
  return (
    <View style={!hideMargin && { marginTop: 15 }}>
      <SliderBox
        images={images}
        autoplay
        circleLoop
        dotColor="red"
        inactiveDotColor="#90A4AE"
        resizeMode="cover"
        ImageComponentStyle={[
          styles.ImageComponentStyle,
          { height: moreHeight ? screenWidth * 0.7 : screenWidth * 0.5 },
        ]}
        dotStyle={styles.dotStyle}
        onCurrentImagePressed={handleImagePress}
      />
    </View>
  );
};

export default SlidingBox;

const styles = StyleSheet.create({
  ImageComponentStyle: {
    borderRadius: 20,
    width: screenWidth * 0.95,

    marginTop: 10,
    alignSelf: "center",
  },
  dotStyle: {
    width: 30,
    height: 7,
    borderRadius: 20,
  },
});
