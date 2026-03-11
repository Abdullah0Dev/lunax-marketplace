
import { StyleSheet,Dimensions, Text, View,ActivityIndicator ,ScrollView ,TouchableOpacity,Platform,FlatList,ImageBackground,Linking} from 'react-native';
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
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
  const RADIUS = 20;
const ITEM_WIDTH = isTablet ? screenWidth * 0.5 : screenWidth * 0.88;
const ITEM_HEIGHT = isTablet ? screenHeight * 0.6 : screenHeight * 0.6;; 
export default function Serekij({navigation}) {

const { width } = Dimensions.get('window');



  return (
    <View style={styles.container}>
  




       
     <View style={{top:isTablet ? hp("0%") : hp("4%"),}}>


   <View>
      
      {/* <Image
        source={require('../../../assets/blun.jpg')}
        style={styles.logo}
        resizeMode="contain"
      /> */}

<View style={styles.header}>

  
       <Image
        source={require('../../../assets/b.png')}
        style={styles.logo}
        resizeMode="contain"
      /> 

  {/* Bottom row */}
  <View style={styles.row}>

    <TouchableOpacity>
      <Text style={styles.showAll}>Laptop</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.logout}>
      <Ionicons name="log-out-outline" size={26} color="red" />
    </TouchableOpacity>

  </View>

</View>
    </View>




<View style={styles.cardContainer}>

<TouchableOpacity onPress={()=>navigation.navigate("Logoanddescription")}>
  <View style={styles.card1}>
  <Image
    source={require("../../../assets/k2.png")}
    style={styles.cardImage}
    contentFit="cover"
  />
  <Text style={styles.cardText}>Logo And Description</Text>
</View>
</TouchableOpacity>


<TouchableOpacity onPress={()=>navigation.navigate("Imagedetails")}>
 <View style={styles.card1}>
  <Image
    source={require("../../../assets/k3.webp")}
    style={styles.cardImage}
    contentFit="cover"
  />

  <Text style={styles.cardText}>Image And Details</Text> 
</View>
</TouchableOpacity>


<TouchableOpacity onPress={()=>navigation.navigate("Homerells")}>
 <View style={styles.card1}>
  <Image
    source={require("../../../assets/k13.png")}
    style={styles.cardImage}
    contentFit="cover"
  />

  <Text style={styles.cardText}>Rells</Text>
</View>
</TouchableOpacity>



<TouchableOpacity onPress={()=>navigation.navigate("Homediscount")}>
 <View style={styles.card1}>
  <Image
    source={require("../../../assets/k9.webp")}
    style={styles.cardImage}
    contentFit="cover"
  />

  <Text style={styles.cardText}>Discount</Text>
</View>
</TouchableOpacity>

</View>








</View>
   











     <StatusBar/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },

  logo: {
    width: isTablet ? wp('40%') : wp('50%'),
    height: isTablet ? hp('13%') : hp('10%'),
 justifyContent:'center',
 alignItems:'center',
 alignSelf:'center'
  },
   
  cardContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: wp("5%"),
  marginTop:isTablet ? wp("10%") : wp("13%"),
},

card1: {
  width: isTablet ? wp("40%") : wp("42%"),
  height: isTablet ? hp("30%") : hp("25%"),
  backgroundColor: "#ffffff",
  borderRadius: isTablet ? 18 : 12,
  padding: isTablet ? 14 : 10,
  marginBottom: isTablet ? 25 : 15,
  alignItems: "center",
  justifyContent: "center",

  
  borderColor: "#000",

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
},
cardImage: {
 width: isTablet ? wp("28%") : wp("25%"),
  height: isTablet ? hp("20%") : hp("12%"),
  borderRadius: 10,
},

cardText: {
  fontSize: RFPercentage(1.8),
  fontWeight: "600",
  marginTop: 8,
  textAlign: "center",
},
header: {
  height: 200,
  backgroundColor: "#11a1a1",
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
  paddingHorizontal: 20,
  paddingTop: 50,
  justifyContent: "space-between",
   marginTop:isTablet ? wp("0%") : wp("-10%"),
},

title: {
  color: "#fff",
  fontSize: 28,
  fontWeight: "bold",
  textAlign: "center",
},

row: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 15,
},

showAll: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "700",
},

logout: {
  backgroundColor: "rgba(255,255,255,0.25)",
  padding: 8,
  borderRadius: 50,
},

});
