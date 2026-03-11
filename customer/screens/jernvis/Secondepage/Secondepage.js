
import { StyleSheet,StatusBar,Dimensions, Text, View,ActivityIndicator ,ScrollView ,TouchableOpacity,Platform,FlatList,ImageBackground,Linking} from 'react-native';
import { BlurView } from 'expo-blur';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome6 } from '@expo/vector-icons';
import axios from "react-native-axios";
import {useState,useEffect,useRef} from "react";
import { LinearGradient } from 'expo-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';
import { SliderBox } from "react-native-image-slider-box";
import Carousel from "react-native-snap-carousel";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Video } from 'expo-av';
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const ITEM_WIDTH = isTablet ? screenWidth * 0.5 : screenWidth * 0.88;
const ITEM_HEIGHT = isTablet ? screenHeight * 0.6 : screenHeight * 0.6;; 
const data = {
  'لاپتوپ': [
    { id: 1, title: 'Laptop 1', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 2, title: 'Laptop 2', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 3, title: 'Laptop 3', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 4, title: 'Laptop 4', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 5, title: 'Laptop 5', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 6, title: 'Laptop 6', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 7, title: 'Laptop 7', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 8, title: 'Laptop 8', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 9, title: 'Laptop 9', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
    { id: 10, title: 'Laptop 10', img: require('../../../assets/m600.jpg'),img1: require('../../../assets/m202.png') },
  ],}
export default function Secondepage({ navigation, route }) {
    
  return (
    <View style={styles.container}>
     <ScrollView showsHorizontalScrollIndicator={false}>
     
{/* fast */}
<TouchableOpacity onPress={()=>navigation.navigate("Fastitem")}>
  <View style={{marginTop:isTablet ? wp("10%") : wp("15.5%")}}>
     <LinearGradient
    colors={['rgb(17, 67, 84)', 'rgb(10, 186, 244)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm}
  >
    <View style={styles.rowContainer00}>
    <Image 
      source={require('../../../assets/m911.png')}
      style={styles.iconImage}
    />
    <Text style={styles.text}>کرین و فروتنا بلەز</Text>
  </View>
  </LinearGradient>
  </View>
  </TouchableOpacity>
{/* fast */}


<View style={styles.grid}>
  {data['لاپتوپ'].map(item => (
    <TouchableOpacity
      key={item.id}
      style={styles.card1}
      onPress={() =>
        navigation.navigate('Secondedetails', { item: item })
      }
    >
      <Image source={item.img} style={styles.image} />
       <Image source={item.img1} style={styles.image1} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  ))}
</View>






      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  rowContainer00: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 8, 
  },
 
  text: {
    fontSize: RFPercentage(2.5),
    color: '#fff',
    textAlign: 'left', 
    flexShrink: 1, 
    fontFamily:'k24'
  },
    iconImage: {
         width: isTablet ? wp("10%") : wp("15.5%"),
      height: isTablet ? hp("10%") : hp("8%"),
      resizeMode: 'contain',
    },
    vm:{
      width: isTablet ? wp("90%") : wp("90%"),
        height: isTablet ? hp("10%") : hp("12%"),
        borderTopLeftRadius: isTablet ? 60 : 20,
        borderTopRightRadius: isTablet ? 20 : 20,
        borderBottomLeftRadius: isTablet ? 20 : 20,
        borderBottomRightRadius: isTablet ? 60 : 20,
        justifyContent: 'center', 
        alignItems: 'center',
     
         left: isTablet ? hp("3%") : hp("1.9%")
    },
     page: {
    flex: 1,
    padding: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop:isTablet ? wp("2%") : wp("3%"),
    marginBottom:isTablet ? wp("10%") : wp("23%")
  },

 

  image: {
    width: isTablet ? wp("40%") : wp("44%"),
      height: isTablet ? hp("30%") : hp("25%"),
      borderRadius: isTablet ? 15 : 10,
  },
    image1: {
    width: isTablet ? wp("13%") : wp("12%"),
      height: isTablet ? hp("10%") : hp("6%"),
      marginLeft:isTablet ? wp("26%") : wp("30%"),
      marginTop:isTablet ? wp("1%") : wp("2%"),
      borderRadius: isTablet ? 15 : 10,
      position:'absolute'
  },

  title: {
    color: 'black',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: RFPercentage(2.1),
    fontWeight: '600',
    fontFamily: 'k24',
  },
  
});
