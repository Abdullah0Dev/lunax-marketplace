
import { StyleSheet,StatusBar,Dimensions, Text, View,ActivityIndicator ,ScrollView ,TouchableOpacity,Platform,FlatList,ImageBackground,Linking} from 'react-native';
import { BlurView } from 'expo-blur';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome6 } from '@expo/vector-icons';
import axios from "react-native-axios";
import { LinearGradient } from 'expo-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';
import { SliderBox } from "react-native-image-slider-box";
import Carousel from "react-native-snap-carousel";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Video } from 'expo-av';
import {useState,useEffect,useRef} from "react";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;



export default function Homesport({ navigation, route, klil }) {
const [images, setImages] = useState([]);
const [links, setLinks] = useState([]);

useEffect(() => {
  fetch('https://amedbaz.github.io/lunabalav/lunabalav.json')
    .then(response => response.json())
    .then(data => {
      const lunabalav = data.lunabalav || [];
      setImages(lunabalav.map(item => item.image));
      setLinks(lunabalav.map(item => item.link));
    })
    .catch(error => {
      console.error('Error loading images:', error);
    });
}, []);

const handleImagePress = (index) => {
  const url = links[index];
  if (url) {
    Linking.openURL(url).catch(err =>
      console.error("Failed to open URL:", err)
    );
  }
};
////////////////////////////////////////////////////
// 🔥 FIRST: gradients
const GRADIENTS = [
   ['#33691e', '#9ccc65'], // lime green
  ['#bf360c', '#ff7043'], // deep orange
  ['#006064', '#4dd0e1'], // cyan
  ['#311b92', '#9575cd'], // deep purple
  ['#827717', '#d4e157'], // yellow-green
  ['#ff3d00', '#ff9100'], // orange fire
  ['#1a237e', '#3949ab'], // indigo
  ['#004d40', '#26a69a'], // teal
  ['#4a148c', '#7b1fa2'], // purple
  ['#263238', '#546e7a'], // blue grey
  ['#880e4f', '#d81b60'], // pink
  ['#0d47a1', '#1976d2'], // blue
  ['#1b5e20', '#66bb6a'], // green
  ['#e65100', '#ffb74d'], // orange soft
  ['#3e2723', '#8d6e63'], // brown
  ['#212121', '#616161'], // dark grey
  ['#01579b', '#4fc3f7'], // sky blue
  ['#004d40', '#80cbc4'], // mint
  ['#37474f', '#90a4ae'], // slate
  ['#b71c1c', '#ef5350'], // red
  ['#004d40', '#80cbc4'], // mint
];


// 🔥 THEN: data
const DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  title: `Laptop Duhok ${i + 1}`,
  subtitle: 'Excellent Service',
  iconImage: require('../../../../assets/m202.png'),

  // auto gradient per item
  gradient: GRADIENTS[i % GRADIENTS.length],
}));



const CardItem = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('Homesport1', {
          itemData: item,
        })
      }
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image source={item.iconImage} style={styles.cardIcon} />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};












  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              جلۆبەرگێن وەرزشی
             </Text>
           </TouchableOpacity>


           {/* belavbun */}
<View style={{ top: hp('2%') }}>
      <SliderBox
        images={images}
        autoplay
        circleLoop
        dotColor="red"
        inactiveDotColor="#90A4AE"
        resizeMode="cover"
        ImageComponentStyle={{
          borderRadius: 20,
          width: screenWidth * 0.95,
          height: screenWidth * 0.5 ,
          marginTop: 10,
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 30,
          height: 7,
          borderRadius: 20,
        }}
        onCurrentImagePressed={handleImagePress}
      />
    </View>
{/* belavbun */}

<View>
   {/* design */}
     <View>
        <LinearGradient
       colors={['rgb(28, 78, 2)', 'rgb(32, 97, 32)']}
       start={{ x: 0, y: 0 }}
       end={{ x: 1, y: 0 }}
       style={styles.vm}
     >
       <View style={styles.rowContainer00}>
       <Image 
         source={require('../../../../assets/m26.png')}
         style={styles.iconImage}
       />
       <Text style={styles.text}>باشترین دێ ب دەستتەکەڤن</Text>
     </View>
     </LinearGradient>
     </View>
   {/* design */}
</View>


<View style={styles.container}>
  <FlatList
    data={DATA}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <CardItem item={item} />}
    showsVerticalScrollIndicator={false}
    ListHeaderComponent={
      <>
        {/* back button + title */}
        {/* slider */}
        {/* green gradient section */}
      </>
    }
    contentContainerStyle={{
      paddingBottom: hp('12%'),
      paddingTop: hp('2%'),
    }}
  />
</View>







{/* jh */}











           </ScrollView>
     <StatusBar 
     backgroundColor="black"
     barStyle="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
   
  },
   rowContainer00: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 8, 
  },
    iconImage: {
         width: isTablet ? wp("10%") : wp("12.5%"),
      height: isTablet ? hp("7%") : hp("8%"),
      resizeMode: 'contain',
    },
     text: {
    fontSize: RFPercentage(2.2),
    color: '#fff',
    textAlign: 'left', 
    flexShrink: 1, 
    fontFamily:'k24'
  },
  vm:{
    width: isTablet ? wp("90%") : wp("90%"),
      height: isTablet ? hp("7%") : hp("6%"),
      borderTopLeftRadius: isTablet ? 60 : 30,
      borderTopRightRadius: isTablet ? 60 : 10,
      borderBottomLeftRadius: isTablet ? 60 : 10,
      borderBottomRightRadius: isTablet ? 60 : 30,
      justifyContent: 'center',
      alignItems: 'center',
       marginTop: isTablet ? hp("5%") : hp("4%"),
       left: isTablet ? hp("3%") : hp("1.9%")
  },
   card: {
    width: isTablet ? wp('90%') : wp('90%'),
    height: isTablet ? hp('20%') : hp('15%'),
    alignSelf: 'center',
    marginVertical: hp('0.5%'),
    borderRadius:isTablet ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  cardIcon: {
    width:isTablet ? wp('25%') : wp('20%'),
    height: isTablet ? hp('17%') : hp('10%'),
    resizeMode: 'contain',
  },

  cardContent: {
    flex: 1,
    alignItems: 'flex-end', // RTL
  },

  cardTitle: {
    fontSize: RFPercentage(2.5),
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'k24',
    textAlign: 'right',
  },

  cardSub: {
    fontSize: RFPercentage(1.6),
    color: '#eee',
    textAlign: 'right',
  },
});
