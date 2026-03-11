
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
import { FontAwesome } from "@expo/vector-icons";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const ITEM_WIDTH = isTablet ? screenWidth * 0.5 : screenWidth * 0.88;
const ITEM_HEIGHT = isTablet ? screenHeight * 0.6 : screenHeight * 0.6;; 
const phoneNumber = "9647508672721"; // ژمارە (بێ +)
 

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url);
  };
const data = {
  'لاپتوپ': [
    { id: 1, title: 'Laptop 1', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 2, title: 'Laptop 2', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 3, title: 'Laptop 3', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 4, title: 'Laptop 4', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 5, title: 'Laptop 5', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 6, title: 'Laptop 6', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 7, title: 'Laptop 7', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 8, title: 'Laptop 8', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 9, title: 'Laptop 9', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
    { id: 10, title: 'Laptop 10', img: require('../../../../assets/m600.jpg'),img1: require('../../../../assets/m202.png') },
  ],}
export default function Fastitem({ navigation, route }) {
    
  return (
    <View style={styles.container}>
     <ScrollView showsHorizontalScrollIndicator={false}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
                  <LinearGradient
                    colors={['#ff3d00', '#444444']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: isTablet ? hp("7%") : hp("5.5%"),
                      height: isTablet ? hp("7%") : hp("5.5%"),
                      borderRadius:isTablet ? hp("5%") : hp("2.75%"),
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: isTablet ? hp("3%") : hp("6%"),
                      left: isTablet ? wp("2%") : wp("3%"),
                    }}
                  >
                    <FontAwesome6
                      name="angle-left"
                      style={{
                        fontSize: RFPercentage(4),
                        color: '#fff',
                      }}
                    />
                  </LinearGradient>
                  <Text style={{ fontSize: RFPercentage(3), color: '#000', marginTop:isTablet ? wp("-2.5%") : wp("3%"), textAlign: 'center',
                     fontWeight: 'bold',fontFamily: 'k24',
                   }}>
                    کرین و فروتنا بلەز
                  </Text>
                </TouchableOpacity>
{/* fast */}

  <View style={{marginTop:isTablet ? wp("8%") : wp("8.5%")}}>
     <LinearGradient
    colors={['rgb(10, 52, 80)', 'rgb(19, 81, 162)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm}
  >
    <View style={styles.rowContainer00}>
   <View style={styles.textWrapper}>
  <Text style={styles.text}>
    هەر تشتەکێ تە بڤێت دێ ل ڤێرێ ب دەستتەکەڤیت
  </Text>

  <Text style={styles.text2}>
    ژبو کرین یان پێشاندانا بەرهەمێ تە پەیوەندیێ ب مە بکە
  </Text>
</View>
 <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
        <FontAwesome name="whatsapp" size={26} color="#fff" />

        <View style={styles.textBox}>
         
          <Text style={styles.number}>whatsapp</Text>
        </View>
      </TouchableOpacity>
  
  </View>
  </LinearGradient>
  </View>

{/* fast */}


<View style={styles.grid}>
  {data['لاپتوپ'].map(item => (
    <TouchableOpacity
      key={item.id}
      style={styles.card1}
      onPress={() =>
        navigation.navigate('Fastitemdetails', { item: item })
      }
    >
      <Image source={item.img} style={styles.image} />
     
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
  
    alignItems: 'center', 
    gap: 8, 
  },
 
 textWrapper: {
  width: "100%",
  alignItems: "center",   // ناوەڕاست
   marginTop: isTablet ? wp("0%") : wp("0%"),
},

text: {
  color: "#fff",
  fontSize: 22,
  textAlign: "center",
  marginBottom: 8,        // ⭐ جیاکردنەوەی ژێر
  lineHeight: 28,
  fontFamily:'k24'
},

text2: {
  color: "#bbb",
  fontSize: 16,
  textAlign: "center",
  lineHeight: 22,
  fontFamily:'k24'
},

    iconImage: {
         width: isTablet ? wp("10%") : wp("15.5%"),
      height: isTablet ? hp("10%") : hp("8%"),
      resizeMode: 'contain',
    },
    vm:{
      width: isTablet ? wp("90%") : wp("90%"),
        height: isTablet ? hp("20%") : hp("20%"),
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 14,
    paddingHorizontal: 58,
    borderRadius: 30,
    width: "90%",
   
  },

  textBox: {
    marginLeft: 12,
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    
  },

  number: {
    color: "#eafff2",
    fontSize: 14,
    marginTop: 2,
    fontWeight:'600'
  },
});
