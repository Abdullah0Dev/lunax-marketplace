import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image as RNImage,
} from "react-native";
import { Image } from "expo-image";
import ImageViewing from "react-native-image-viewing";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
const { width: screenWidth } = Dimensions.get("window");
import { SliderBox } from 'react-native-image-slider-box';
import { FontAwesome5 } from '@expo/vector-icons';


const isTablet = screenWidth >= 768;

export default function Secondedetails({ navigation, route }) {
  const { item } = route.params;

  // 🔹 main image zoom
  const [visibleMain, setVisibleMain] = useState(false);

  // 🔹 gallery zoom
  const [visibleGallery, setVisibleGallery] = useState(false);
  const [index, setIndex] = useState(0);

  // 🔹 local gallery images

const images1 = [
  require('../../../assets/m920.webp'),
  require('../../../assets/m920.webp'),
  require('../../../assets/m920.webp'),
  require('../../../assets/m920.webp'),
];


  // 🔑 main image convert
  const mainImage = [
    { uri: RNImage.resolveAssetSource(item.img).uri },
  ];
  const [visible, setVisible] = useState(false);

const [openIndex, setOpenIndex] = React.useState(null);

 const specs = [
  { title: 'مارکە', value: 'Dell' },
  { title: 'مۆدێل', value: 'Inspiron 15' },
  { title: 'پرۆسێسەر', value: 'Intel Core i7' },
  { title: 'خێرایی پرۆسێسەر', value: '3.2GHz' },
  { title: 'رام', value: '١٦ گب' },
  { title: 'جۆری رام', value: 'DDR4' },
  { title: 'بیرگەی هەڵگرتن', value: '٥١٢ گب SSD' },
  { title: 'کارت گرافیک', value: 'NVIDIA GTX 1650' },
  { title: 'قەبارەی شاشە', value: '١٥.٦ ئینچ' },
  { title: 'ڕوونی شاشە', value: 'Full HD' },
  { title: 'سیستەمی کارپێکردن', value: 'Windows 11' },
  { title: 'باتری', value: '٥–٧ کاتژمێر' },
];

  const dispatch = useDispatch();
  const favoriteList = useSelector((state) => state.favorites.favoriteList);

  const isFavorite = favoriteList.some((favorite) => favorite.id === id);

  const handleToggleFavorite = () => {
    console.log("Data:", item);


    if (isFavorite) {
      dispatch(removeFromFavorite(item)); 
    } else {
      dispatch(addToFavorite(item)); 
    }
  };


  const [selectedPercent, setSelectedPercent] = useState(0);

const totalAmount = 200000;
const finalAmount = (totalAmount * selectedPercent) / 100;

  return (
    <View style={styles.container}>
      
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* BACK BUTTON */}
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <LinearGradient colors={["black", "#444"]} style={styles.backBtn}>
      <FontAwesome6 name="angle-left" size={24} color="#fff" />
    </LinearGradient>
  </TouchableOpacity>

  <Text
    style={[
      styles.headerTitle,
      { flex: 1, textAlign: 'center',marginTop: isTablet ? hp("5%") : hp("6%")}
    ]}
    numberOfLines={1}
  >
    {item.title}
  </Text>

  <TouchableOpacity onPress={handleToggleFavorite}>
    <LinearGradient
      colors={['rgb(43, 41, 41)', 'rgb(46, 45, 45)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: isTablet ? wp("8%") : wp("12%"),
        height: isTablet ? hp("6%") : wp("12%"),
        borderRadius: isTablet ? wp("2%") : wp("4%"),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: isTablet ? hp("5%") : hp("6%"),
        marginRight: wp("3%"),
      }}
    >
      <Image
        source={
          isFavorite
            ? require('../../../assets/bookmarked.png')
            : require('../../../assets/bookmark.png')
        }
        style={{
          width: isTablet ? wp("4%") : wp("5.5%"),
          height: isTablet ? hp("4%") : hp("3.3%"),
          resizeMode: 'contain',
        }}
      />
    </LinearGradient>
  </TouchableOpacity>

</View>


        {/* MAIN IMAGE */}
<View style={{ top: hp('2%') }}>

      <SliderBox
        images={images1}
        autoplay
        circleLoop
        dotColor="orange"
        inactiveDotColor="#90A4AE"
        resizeMode="cover"
        ImageComponentStyle={{
          borderRadius: 15,
          width: isTablet ? wp("90%") : wp("95.5%"),
          height: isTablet ? hp("40%") : hp("43.3%"),
          marginTop: 10,
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 30,
          height: 7,
          borderRadius: 20,
        }}
        onCurrentImagePressed={(i) => {
          setIndex(i);
          setVisible(true);
        }}
      />
<ImageViewing
  images={images1}
  imageIndex={index}
  visible={visible}
  onRequestClose={() => setVisible(false)}
/>



    </View>





        {/* MAIN IMAGE VIEW */}
        <ImageViewing
          images={mainImage}
          imageIndex={0}
          visible={visibleMain}
          onRequestClose={() => setVisibleMain(false)}
        />

        <Text style={styles.title}>{item.title}</Text>

        {/* HORIZONTAL GALLERY */}
      

<TouchableOpacity>
<View style={{ marginTop: isTablet ? hp("4%") : hp("10%"),}}>
<View style={styles.log}>
  <View style={styles.logoview}>
    <Image
       source={require('../../../assets/m202.png')}
      style={styles.logoImage}
    />
  </View>
  <View >
    <Image
     source={require('../../../assets/m501.png')}
      style={styles.logoa}
    />
    <Text style={styles.logoText}>باشترین</Text>
  </View>

<View style={styles.logoRow}>
   <Text style={styles.logoText1}>پێشانگەها لاپتوپ دهۆک</Text>
  <Image
    source={require('../../../assets/m503.webp')}
    style={styles.logoa1}
  />
 
</View>

<View style={styles.logoRow1}>
<Text style={styles.logoText2}>پێشانگەها لاپتوپ دهۆک یا فروتنا هەمی جورێن کومپیوتەر و لاپتوپانە دگەل سەخبێریکرنێ ب باشترین شێواز و ئەرزانترین بها</Text>
</View>

</View>
</View>
</TouchableOpacity>


<View style={{ width:isTablet ? wp("90%") : wp("90%"),
height: isTablet ? hp("8%") : hp("7%"),
justifyContent: "center",
alignSelf: "center",
marginTop: hp("2%"),
backgroundColor: "#FFA51F",
borderTopLeftRadius: 30,
borderTopEndRadius: 10,
borderBottomLeftRadius: 10,
borderBottomRightRadius: 30,

 }}>
<View style={{ 
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
}}>
   <Text style={{ 
    fontSize: RFPercentage(2),
    fontFamily: "k24",
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: wp("1%"),
    marginVertical: hp("2%"),
    color: "black",
   }}>دهۆک - مالتا نێزیک نەخوشخانا شریان</Text>
  <Image
    source={require('../../../assets/m700.webp')}
    style={{
      width: isTablet ? wp("10%") : wp("12%"),
      height: isTablet ? hp("7%") : hp("6%"),
    }} 
  />

</View>



</View>


<View style={{ width:isTablet ? wp("90%") : wp("90%"),
height: isTablet ? hp("7%") : hp("7%"),
justifyContent: "center",
alignSelf: "center",
marginTop: hp("2%"),
backgroundColor: "#1FE1FF",
borderTopLeftRadius: 30,
borderTopEndRadius: 10,
borderBottomLeftRadius: 10,
borderBottomRightRadius: 30,

 }}>
<View style={{ 
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
}}>
   <Text style={{ 
    fontSize: RFPercentage(2),
    
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: wp("1%"),
    marginVertical: hp("2%"),
    color: "black",
   }}>07507771177 - 07507771177</Text>
  <Image
    source={require('../../../assets/m701.webp')}
    style={{
      width: isTablet ? wp("8%") : wp("11%"),
      height: isTablet ? hp("6%") : hp("5%"),
    
    }} 
  />
 
</View>



</View>



 <View style={{marginTop: isTablet ? hp("2%") : hp("2%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
      <Text style={styles.textstudio}>جور</Text>
      <View style={styles.dashLine} />   
    </View>
  </View>


<View style={{ marginTop: hp('3%'), paddingHorizontal: wp('3%') }}>
  {specs.map((item, index) => {
    const isOpen = openIndex === index;

    return (
      <View
        key={index}
        style={{
          marginBottom: 10,
          borderRadius: 14,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenIndex(isOpen ? null : index)}
          style={{
            flexDirection: 'row-reverse',   // RTL
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 14,
          }}
        >
          <Text style={{ color: 'black', fontSize: 15, textAlign: 'right',fontFamily:'k24' }}>
            {item.title}
          </Text>

          <FontAwesome5
            name={isOpen ? 'angle-down' : 'angle-left'}
            size={30}
            color="rgb(14, 75, 82)"
          />
        </TouchableOpacity>

        {/* Body */}
        {isOpen && (
          <View
            style={{
              padding: 14,
              borderTopWidth: 1,
              borderTopColor: '#ccc',
              backgroundColor: 'white',
            }}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                lineHeight: 22,
                textAlign: 'right',  // align right
              }}
            >
              {item.value}
            </Text>
          </View>
        )}
      </View>
    );
  })}
</View>



<View style={{ width:isTablet ? wp("90%") : wp("90%"),
height: isTablet ? hp("7%") : hp("7%"),
justifyContent: "center",
alignSelf: "center",
marginTop: hp("2%"),
backgroundColor: "#AAB964",
borderRadius:isTablet ? 50 : 30,

 }}>
<View style={{ 
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
}}>
   <Text style={{ 
    fontSize: RFPercentage(2),
    
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: wp("1%"),
    marginVertical: hp("2%"),
    color: "black",
   }}>200,000 IDQ</Text>
  <Image
    source={require('../../../assets/m750.png')}
    style={{
      width: isTablet ? wp("10%") : wp("11%"),
      height: isTablet ? hp("5%") : hp("5%"),
    
    }} 
  />
 
</View>



</View>



 <View style={{marginTop: isTablet ? hp("2%") : hp("2%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
      <Text style={styles.textstudio}>تێبینی</Text>
      <View style={styles.dashLine} />   
    </View>
  </View>


  <View style={styles.card1}>
 <Text style={styles.text}>
  ئەم لاپتوپە بە حالەت نوێ و بەردەستە و دەتوانرێت بۆ کارەکانى فەرمی و گرافیکی بەکار بێت. بۆ زانیاری زیاتر پەیوەندی بکەن.
    </Text>

</View>
      </ScrollView>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },

  backBtn: {
    width: isTablet ? wp("7%") : wp("12%"),
    height: isTablet ? hp("5%") : hp("5.5%"),
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("6%"),
    marginLeft: wp("3%"),
  },

  headerTitle: {
    fontSize: RFPercentage(3),
    fontFamily: "k24",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: hp("-4%"),
    color: "black",
  },

  image: {
    width: wp("90%"),
    height: hp("50%"),
    alignSelf: "center",
    marginTop: hp("2%"),
    borderRadius: 12,
  },

  title: {
    fontSize: RFPercentage(3.5),
    fontFamily: "k24",
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: wp("5%"),
    marginVertical: hp("4%"),
    color: "black",
  },

  grid: {
    flexDirection: "row",
    paddingHorizontal: wp("3%"),
  },

  item: {
    marginRight: wp("3%"),
  },

  image1: {
    width: wp("30%"),
    height: hp("15%"),
    borderRadius: 12,
  },

   card: {
    backgroundColor: '#fff',
 width:isTablet ? wp("90%") : wp("90%"),
    padding: 15,
    borderRadius: 12,

    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // shadow for Android
    elevation: 6,

    alignSelf: 'center',
    marginVertical: 10,
  },

  text: {
    fontSize: RFPercentage(2),
    color: '#000',
    textAlign: 'right',
    fontWeight: '500',
    fontFamily: 'k24',
  },
  lineWithOr: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},

dashLine: {
  flex: 1,
  height: 3,
  backgroundColor: 'black',
  marginHorizontal: 10,
  opacity: 0.6,
  borderRadius:50,
},
textstudio: {
  fontSize: RFPercentage(2.5),
  fontFamily: "k24",
  fontWeight: "bold",
  color: 'black',
},
   card1: {
    backgroundColor: '#fff',
 width:isTablet ? wp("90%") : wp("90%"),
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // shadow for Android
    elevation: 6,
marginBottom: hp("12%"),
    alignSelf: 'center',
    marginVertical: 10,
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
    backgroundColor: 'rgb(123, 119, 12)',
    width :isTablet ? wp("85%") : wp("85%"),
    height: isTablet ? hp("7%") : hp("7%"),
    alignContent: 'center',
    justifyContent: 'center',
    left: isTablet ? wp("2%") : wp("2%"),
    top: isTablet ? hp("14%") : hp("12%"),
    borderRadius: 10,
    },
    logoText2: {
      fontSize: RFPercentage(1.7),
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: 'k24',
    },
});
