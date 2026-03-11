
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

 


const trsbadinii = [
  {
    id: '1',
    play: require('../../../../assets/vv.mp4'),
    wene1: require('../../../../assets/m202.png'),
  },
  {
    id: '2',
    play: require('../../../../assets/vv.mp4'),
    wene1: require('../../../../assets/m202.png'),
  },
  {
    id: '3',
    play: require('../../../../assets/vv.mp4'),
    wene1: require('../../../../assets/m202.png'),
  },
  {
    id: '4',
    play: require('../../../../assets/vv.mp4'),
    wene1: require('../../../../assets/m202.png'),
  },
];

export default function Homedress1({ navigation, route, klil }) {
  const { itemData } = route.params;
const [activeIndex, setActiveIndex] = useState(0);

const buttons = [
  'لاپتوپ',
  'کومپیوتەر',
  'PC',
  'HP',
  'Dell',
  'Mackbook',
  'هارد',
  'شاشە',
];

const data = {
  'لاپتوپ': [
    { id: 1, title: 'Laptop 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'Laptop 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'Laptop 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'Laptop 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'Laptop 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'Laptop 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'Laptop 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'Laptop 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'Laptop 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'Laptop 10', img: require('../../../../assets/m600.jpg') },
  ],

   'کومپیوتەر': [
    { id: 1, title: 'Computer 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'Computer 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'Computer 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'Computer 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'Computer 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'Computer 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'Computer 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'Computer 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'Computer 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'Computer 10', img: require('../../../../assets/m600.jpg') },
  ],
  'PC': [
    { id: 1, title: 'PC 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'PC 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'PC 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'PC 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'PC 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'PC 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'PC 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'PC 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'PC 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'PC 10', img: require('../../../../assets/m600.jpg') },
  ],

    'HP': [
    { id: 1, title: 'HP 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'HP 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'HP 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'HP 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'HP 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'HP 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'HP 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'HP 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'HP 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'HP 10', img: require('../../../../assets/m600.jpg') },
  ],

    'Dell': [
    { id: 1, title: 'Dell 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'Dell 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'Dell 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'Dell 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'Dell 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'Dell 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'Dell 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'Dell 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'Dell 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'Dell 10', img: require('../../../../assets/m600.jpg') },
  ],

  'Mackbook': [
    { id: 1, title: 'Mackbook 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'Mackbook 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'Mackbook 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'Mackbook 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'Mackbook 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'Mackbook 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'Mackbook 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'Mackbook 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'Mackbook 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'Mackbook 10', img: require('../../../../assets/m600.jpg') },
  ],

  'هارد': [
    { id: 1, title: 'هارد 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'هارد 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'هارد 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'هارد 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'هارد 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'هارد 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'هارد 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'هارد 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'هارد 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'هارد 10', img: require('../../../../assets/m600.jpg') },
  ],

  'شاشە': [
    { id: 1, title: 'شاشە 1', img: require('../../../../assets/m600.jpg') },
    { id: 2, title: 'شاشە 2', img: require('../../../../assets/m600.jpg') },
    { id: 3, title: 'شاشە 3', img: require('../../../../assets/m600.jpg') },
    { id: 4, title: 'شاشە 4', img: require('../../../../assets/m600.jpg') },
    { id: 5, title: 'شاشە 5', img: require('../../../../assets/m600.jpg') },
    { id: 6, title: 'شاشە 6', img: require('../../../../assets/m600.jpg') },
    { id: 7, title: 'شاشە 7', img: require('../../../../assets/m600.jpg') },
    { id: 8, title: 'شاشە 8', img: require('../../../../assets/m600.jpg') },
    { id: 9, title: 'شاشە 9', img: require('../../../../assets/m600.jpg') },
    { id: 10, title: 'شاشەشاشە 10', img: require('../../../../assets/m600.jpg') },
  ],
  // بۆ هەموو button ـەکان هەمان شێواز
};

  return (
    <View style={{marginBottom: isTablet ? hp("0%") : hp("0%"),  }}>
           <ScrollView showsVerticalScrollIndicator={false}>
<View style={{ 
   backgroundColor: 'rgb(74, 78, 78)',
    width :isTablet ? wp("100%") : wp("100%"),
    height: isTablet ? hp("20%") : hp("25%"),
    marginTop: isTablet ? hp("0%") : hp("0%"),
     marginBottom: isTablet ? hp("0%") : hp("2%") }}>
 <TouchableOpacity onPress={() => navigation.goBack()}>
                     <LinearGradient
                       colors={['black', '#444444']}
                       start={{ x: 1, y: 0 }}
                       end={{ x: 1, y: 1 }}
                       style={{
                         width: isTablet ? hp("7%") : hp("5.5%"),
                         height: isTablet ? hp("7%") : hp("5.5%"),
                         borderRadius: isTablet ? hp("5%") : hp("2.75%"),
                         justifyContent: 'center',
                         alignItems: 'center',
                         top: isTablet ? hp("5%") : hp("6%"),
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
                     <Text style={{ fontSize: RFPercentage(4), color: 'white', marginTop:isTablet ? wp("0%") : wp("3.5%"), textAlign: 'center',
                        fontWeight: 'bold',fontFamily: 'lor',left: isTablet ? wp("0%") : wp("4%"),
                      }}>
                       {itemData.title}
                     </Text>
                   </TouchableOpacity>

</View>

<View style={styles.log}>
  <View style={styles.logoview}>
    <Image
      source={itemData.iconImage}
      style={styles.logoImage}
    />
  </View>
  <View >
    <Image
     source={require('../../../../assets/m501.png')}
      style={styles.logoa}
    />
    <Text style={styles.logoText}>باشترین</Text>
  </View>

<View style={styles.logoRow}>
   <Text style={styles.logoText1}>پێشانگەها لاپتوپ دهۆک</Text>
  <Image
    source={require('../../../../assets/m503.webp')}
    style={styles.logoa1}
  />
 
</View>

<View style={styles.logoRow1}>
<Text style={styles.logoText2}>پێشانگەها لاپتوپ دهۆک یا فروتنا هەمی جورێن کومپیوتەر و لاپتوپانە دگەل سەخبێریکرنێ ب باشترین شێواز و ئەرزانترین بها</Text>
</View>

</View>

    {/* Rells */}
<View style={styles.wrapperTop}>
  <View style={styles.wrapperInner}>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row99}>

        {trsbadinii.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate('HomedressRellsrek', {
                videos: trsbadinii,
                startIndex: index,
              })
            }
          >
            <View style={styles.card}>

              <Video
                source={item.play}  
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />

             
              <View style={styles.ratingBox}>
                <Image
                  source={item.wene1}  
                  style={styles.ratingIcon}
                />
              </View>

            </View>
          </TouchableOpacity>
        ))}

      </View>
    </ScrollView>

  </View>
</View>
{/* Rells */}

<View style={{ marginTop: hp('5%'),marginBottom: hp('10%') }}>
 <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              activeIndex === index && styles.activeButton,
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text
              style={[
                styles.buttonText,
                activeIndex === index && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pages */}
     <View style={styles.page}>
  <ScrollView>
        <View style={styles.grid}>
          {data[buttons[activeIndex]]?.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card1}
              onPress={() =>
                navigation.navigate('Homedressdetails', {
                  item: item,
                })
              }
            >
              <Image source={item.img} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
</View>
</View>




               
      


        </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
   wrapperTop: {
    top: hp("-1%"),
  },

  wrapperInner: {
    top: hp("3%"),
  },
   row99: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
   card: {
      width: isTablet ? wp("30%") : wp("35%"),
      height: isTablet ? hp("30%") : hp("25%"),
      marginHorizontal: wp("2%"),
      borderRadius: 20,
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
  
    ratingIcon: {
        width: isTablet ? wp("10%") : wp("10.5%"),
      height: isTablet ? hp("8%") : hp("5%"),
  
      borderRadius:50
    },
  log: {
   
        backgroundColor: 'white',
        marginVertical: hp('1%'),
       width: isTablet ? wp("90%") : wp("90%"),
      height: isTablet ? hp("22%") : hp("20%"),
      marginTop: isTablet ? hp("-6%") : hp("-12%"),
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
    
  
  },
  logoview: {
     backgroundColor: 'white',
        marginVertical: hp('1%'),
       width: isTablet ? wp("13%") : wp("22%"),
      height: isTablet ? hp("10%") : hp("10%"),
      marginTop: isTablet ? hp("-5%") : hp("-7%"),
      marginLeft: isTablet ? wp("73%") : wp("65%"),
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
       
      },
  logoImage: {
    width: isTablet ? wp("10%") : wp("22%"),
    height: isTablet ? hp("8%") : hp("10%"),
    borderRadius: 15,
    position: 'absolute',
  },
  logoa: {
    width: isTablet ? wp("6%") : wp("7%"),
    height: isTablet ? hp("5%") : hp("3%"),
    borderRadius: 15,
    right: isTablet ? wp("22%") : wp("35%"),
    marginTop: isTablet ? hp("2%") : hp("2%"),
  },
  logoText: {
    fontSize: RFPercentage(1.7),
    color: 'black',
    marginTop: isTablet ? hp("0%") : hp("1%"),
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'k24',
    right: isTablet ? wp("30%") : wp("47%"),
    top: isTablet ? hp("-3%") : hp("-3.5%"),
  },

logoRow: {
  position: 'absolute',
  flexDirection: 'row',
  alignItems: 'center',
  right: isTablet ? wp("20%") : wp("31%"),
  top: isTablet ? hp("7%") : hp("6%"),
},
logoa1: {
    width: isTablet ? wp("7%") : wp("7%"),
    height: isTablet ? hp("5%") : hp("3%"),
    borderRadius: 15,
},
logoText1: {
    fontSize: RFPercentage(2),
    color: 'black',
    marginLeft: 7,
    fontWeight: 'bold',
    fontFamily: 'k24',
    marginHorizontal: isTablet ? wp("0%") : wp("1%"),
    marginTop: isTablet ? hp("0%") : hp("0.3%")
  },
  logoRow1: {
    position: 'absolute',
  backgroundColor: 'rgb(74, 78, 78)',
  width :isTablet ? wp("85%") : wp("85%"),
  height: isTablet ? hp("7%") : hp("7%"),
  alignContent: 'center',
  justifyContent: 'center',
  left: isTablet ? wp("2%") : wp("2%"),
  top: isTablet ? hp("14%") : hp("12%"),
  borderRadius: 10,
  },
  logoText2: {
    fontSize: RFPercentage(1.8),
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'k24',
  },

   scrollRow: {
    paddingHorizontal: 10,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
  },

  activeButton: {
    backgroundColor: 'rgb(74, 78, 78)',
  },

  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'k24',
  },

  activeText: {
    color: '#fff',
  },

 page: {
    flex: 1,
    padding: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

 

  image: {
    width: isTablet ? wp("40%") : wp("44%"),
      height: isTablet ? hp("30%") : hp("25%"),
      borderRadius: isTablet ? 15 : 10,
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
