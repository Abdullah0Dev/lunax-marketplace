import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Platform } from 'react-native';

const Splash = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions(); // Get dynamic screen size

  useEffect(() => {
    console.log('Splash mounted, starting timer...');
    const timer = setTimeout(() => {
      console.log('Timer done, navigating to MainTabs');
      navigation.replace('Signin1');
    }, 5000);

    return () => {
      console.log('Splash unmounted, clearing timer');
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
       source={require('../../../assets/luna.jpeg')}
        style={[
          styles.image,
          {
            width: width > 768 ? wp("50%") : wp("80%"),  // Adjusts for iPads & iPhones
            height: width > 768 ? hp("50%") : hp("40%"), // Keeps aspect ratio
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    marginBottom: hp("2%"),
  },
});

export default Splash;
