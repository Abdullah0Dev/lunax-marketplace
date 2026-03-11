import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { height, width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function HomehotelRellsrek({ navigation, route }) {
  const { videos, startIndex } = route.params;

  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showMoreIndex, setShowMoreIndex] = useState(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      setShowMoreIndex(null);

      videoRefs.current.forEach((video, i) => {
        if (video) {
          i === index ? video.playAsync() : video.pauseAsync();
        }
      });
    }
  }).current;

  return (
    <View style={styles.container}>

      {/* 🔙 BACK BLUR + IMAGE */}
      <BlurView intensity={10} tint="dark" style={styles.backBlur}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>

        {/* IMAGE RIGHT */}
       
      </BlurView>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        renderItem={({ item, index }) => {
          const showMore = showMoreIndex === index;

          return (
            <View style={styles.videoContainer}>

              {/* VIDEO */}
              <Video
                ref={(ref) => (videoRefs.current[index] = ref)}
              source={require('../../../../assets/vv.mp4')}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={index === currentIndex}
                isLooping
                useNativeControls={false}
              />

              {/* USER BOX */}
              <BlurView intensity={20} tint="dark" style={styles.userBox}>

                <Image source={require('../../../../assets/m202.png')} style={styles.avatar} />

                <View style={styles.userTextBox}>

                  <View style={styles.nameRow}>
                    <Text style={styles.username}>Laptop Duhok</Text>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={20}
                      color="#1DA1F2"
                      style={{ marginLeft: 6 }}
                      marginTop={-3}
                    />
                  </View>

                  <Text
                    style={styles.subText}
                  >
                    ئەگەر دەتەوێت باشترین لەپتۆپ بەدەستبهێنی لە دۆزینەوەکەتدا، کلیل لەسەر "زیاتر" بکە بۆ بینینی هەموو زانیارییەکان.

                  </Text>

                </View>
              </BlurView>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  /* 🔙 BACK AREA */
  backBlur: {
    position: 'absolute',
    top: hp('6%'),
    left: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 30,
    zIndex: 20,
    overflow: 'hidden',
    
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  backImage: {
    height: isTablet ? hp('0%') : hp('5%'),
    width: isTablet ? wp('0%') : wp('25%'),
    borderRadius: 18,
  },

  videoContainer: {
    height,
    width: '100%',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  userBox: {
    position: 'absolute',
    bottom: isTablet ? hp('15%') : hp('12%'),
    width: isTablet ? wp('60%') : wp('94%'),
    left: isTablet ? wp('20%') : wp('3%'),

    flexDirection: 'row',
    alignItems: 'flex-start',

    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.6%'),

    borderRadius: 22,
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
  },

  username: {
    color: '#fff',
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    fontFamily: 'lor',
  },

  subText: {
    color: '#eee',
    fontSize: isTablet ? 16 : 14,
    lineHeight: isTablet ? 26 : 22,
    marginTop: 6,
    fontFamily: 'k24',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  moreText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 15,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'right',
  },
});
