
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
  const RADIUS = 20;
const ITEM_WIDTH = isTablet ? screenWidth * 0.5 : screenWidth * 0.88;
const ITEM_HEIGHT = isTablet ? screenHeight * 0.6 : screenHeight * 0.6;; 
export default function Serekij({navigation}) {

const { width } = Dimensions.get('window');







 

  
////////////////////////////////////////////////////
const screenWidth = Dimensions.get('window').width;
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
const [images1, setImages1] = useState([]);
const [links1, setLinks1] = useState([]);

useEffect(() => {
  fetch('https://amedbaz.github.io/lunabalav1/lunabalav1.json')
    .then(response => response.json())
    .then(data => {
      const lunabalav1 = data.lunabalav1 || [];
      setImages1(lunabalav1.map(item => item.image));
      setLinks1(lunabalav1.map(item => item.link));
    })
    .catch(error => {
      console.error('Error loading images:', error);
    });
}, []);

const handleImagePress1 = (index) => {
  const url = links1[index];
  if (url) {
    Linking.openURL(url).catch(err =>
      console.error("Failed to open URL:", err)
    );
  }
};

////////////////////////////////////////////////////




  ////////////////////////////////////////////


  //////////////////////////////////////////////////
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);








  



            ////////////////////////////////////
            const [trsbadinii,setTrsbadinii] = useState([]);
            useEffect(() => {
              axios.get('https://amedbaz.github.io/rellsrek/rellsrek.json')
              .then(result=>{
                setTrsbadinii(result.data.rellsrek)
              })
              }, []);


  return (
    <View style={styles.container}>
  



{loading ? (
        <ActivityIndicator size="large" color="#f13a00" style={{backgroundColor:'black',width:wp("100%"),
          height:hp("100%")
        }}/>
      ) : (
       
     <View style={{top:isTablet ? hp("0%") : hp("4%"),}}>
<ScrollView showsHorizontalScrollIndicator={false}>
<View >
   <View style={styles.container10}>
      {/* Left Icon */}
      {/* <Image
        source={require('../../../assets/bars-sort (1).png')}
        style={styles.icon}
        resizeMode="contain"
      /> */}

      {/* Center Logo */}
      <Image
        source={require('../../../assets/luna.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right Icon */}
       <TouchableOpacity onPress={() => navigation.navigate('Search')}>
      <Image
        source={require('../../../assets/m2.webp')}
        style={styles.icon8}
        resizeMode="contain"
      />
      </TouchableOpacity>
    </View>








<View style={{marginBottom: isTablet ? hp("0%") : hp("15%"),}}>

{/* belavbun */}
<View style={{ top: isTablet ? hp('-2%') : hp('-4%') }}>
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
          height: screenWidth * 0.5,
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




{/* discount */}
<View style={{ marginTop: isTablet ? hp("0%") : hp("-4%")}}>
<View>
  <Image 
    source={require('../../../assets/m3.png')} 
    style={styles.reklam}
    blurRadius={4} // Add this prop - adjust number for more/less blur
  />
   <Image 
    source={require('../../../assets/m5.webp')} 
    style={styles.reklam1}
   
  />
   <Image 
    source={require('../../../assets/m6.png')} 
    style={styles.reklam2}
   
  />

  <View style={styles.flex}>
  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/024/326/134/small/promotion-3d-render-png.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/011/297/609/small/promotion-number-20-percent-3d-png.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://static.vecteezy.com/system/resources/previews/035/116/431/non_2x/discount-15-percent-luxury-gold-and-red-offer-in-3d-suitable-for-promotions-for-christmas-chinese-new-years-and-ramadhan-sale-free-png.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/10-percent-discount-3d-icon-png-download-5522836.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>
</View>
</View>
  {/* discount */}     
{/* discount */}
<View style={{ marginTop: isTablet ? hp("0%") : hp("22%")}}>

  <View style={styles.flex}>
  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
     <Image 
    source={require('../../../assets/m8.png')}
    style={styles.iconImage}
  />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
      <Image 
    source={require('../../../assets/m10.png')}
    style={styles.iconImage}
  />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/35-percentage-off-3d-icon-png-download-5873628.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>

  <LinearGradient
    colors={['rgb(45, 97, 80)', 'rgb(150, 182, 176)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.fancyBorderRadius}
  >
    <Image 
      source={{ uri: 'https://www.pngall.com/wp-content/uploads/13/30-Discount.png' }}
      style={styles.iconImage}
    />
  </LinearGradient>
</View>
</View>
</View>
  {/* discount */}


{/* design */}
  <View>
     <LinearGradient
    colors={['rgb(103, 4, 4)', 'rgb(103, 4, 4)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm}
  >
    <View style={styles.rowContainer00}>
    <Image 
      source={require('../../../assets/m11.webp')}
      style={styles.iconImage}
    />
    <Text style={styles.text}>بازار مە هەمی یا کوم ڤەکری ژ بوتە</Text>
  </View>
  </LinearGradient>
  </View>
{/* design */}


{/* koktel */}
<View style={styles.bgkokteli}>
  {/* <View style={{marginTop: isTablet ? hp("2%") : hp("13%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
       <Image 
    source={require('../../../assets/m16.webp')}
    style={styles.iconImage1}
  />
      <View style={styles.dashLine} />   
    </View>
  </View> */}

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalScroll}
>

  <View>

    {/* ROW 1 */}
    <View style={styles.row1}>

<TouchableOpacity onPress={() => navigation.navigate('Homelaptop')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m20.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>کومپیوتەر</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('HomeClothes')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m21.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>جلوبەرگ</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homeshoes')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m22.webp')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>پێلاڤ</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homeindustry')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m23.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>دروسکەر</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homesport')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m26.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>وەرزشی</Text>
      </View>
</TouchableOpacity>

    </View>

    {/* ROW 2 */}
    <View style={styles.row1}>

<TouchableOpacity onPress={() => navigation.navigate('Homemarket')}>
  <View style={styles.item}>
    <View style={styles.imageButton}>
      <Image source={require('../../../assets/m24.webp')} style={styles.iconImage1} />
    </View>
    <Text style={styles.imageText}>مارکێت</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homeoil')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m25.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>پانزینخانە</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homepaper')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m27.webp')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>پەرگە</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homefly')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m28.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>فروکەڤانی</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homehotel')}>
      <View style={styles.item}>
        <View style={styles.imageButton}>
          <Image source={require('../../../assets/m29.webp')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText}>هوتێل</Text>
      </View>
</TouchableOpacity>

    </View>

  </View>

</ScrollView>


</View>
{/* koktel */}


{/* Brand */}
 <View style={{marginTop: isTablet ? hp("5%") : hp("2%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
      <Text style={styles.textstudio}>brand</Text>
      <View style={styles.dashLine} />   
    </View>
  </View>
{/* Brand */}




{/* marka */}
<View style={{marginTop: isTablet ? hp("0%") : hp("-1%"),}}>
  <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalScroll}
>

  <View>

    {/* ROW 1 */}
    <View style={styles.row1}>

      <View style={styles.item}>
        <View style={styles.imageButton2}>
          <Image source={require('../../../assets/m40.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText2}>Adidas</Text>
      </View>

      <View style={styles.item}>
        <View style={styles.imageButton2}>
          <Image source={require('../../../assets/m41.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText2}>Nike</Text>
      </View>

      <View style={styles.item}>
        <View style={styles.imageButton2}>
          <Image source={require('../../../assets/m43.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText2}>Lacoste</Text>
      </View>

      <View style={styles.item}>
        <View style={styles.imageButton2}>
          <Image source={require('../../../assets/m44.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText2}>Louis Veitton</Text>
      </View>

      <View style={styles.item}>
        <View style={styles.imageButton2}>
          <Image source={require('../../../assets/m45.png')} style={styles.iconImage1} />
        </View>
        <Text style={styles.imageText2}>Gucci</Text>
      </View>


    </View>

  

  </View>

</ScrollView>
</View>
{/* marka */}


{/* mobilyat */}
<TouchableOpacity onPress={() => navigation.navigate('Homemobilyat')}>
<View>
  <Image source={require('../../../assets/m50.png')} style={styles.bobilyat} />
   <Image 
      source={require('../../../assets/m52.png')}
      style={styles.iconImagegift}
    />
  <View style={{marginTop: isTablet ? hp("0%") : hp("5%"),
    left: isTablet ? hp("0%") : hp("8.9%")
  }}>
     <LinearGradient
    colors={['rgb(10, 92, 85)', 'rgb(10, 92, 85)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm1}
  >
    
    <View style={styles.rowContainer00}>
    <Text style={styles.texta}>پێشانگەهێن موبیلیاتا</Text>
  </View>
  </LinearGradient>
  </View>
</View>
</TouchableOpacity>
{/* mobilyat */}






{/* mobilyat */}
<View style={styles.mobilyatWrapper}>
  {/* item */}


  <TouchableOpacity onPress={() => navigation.navigate('Homephone')}>
  <View style={styles.mobilyatItem}>
    <Image source={require('../../../assets/m54.gif')} style={styles.mobile} />


    <LinearGradient
      colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.vm2}
    >
      <Text style={styles.textaq}>پێشانگەهێن موبایلا</Text>
    </LinearGradient>
  </View>
</TouchableOpacity>

  {/* item */}
   <TouchableOpacity onPress={() => navigation.navigate('Hometv')}>
  <View style={styles.mobilyatItem}>
    <Image source={require('../../../assets/m60.png')} style={styles.mobile1} />


    <LinearGradient
       colors={['rgb(255, 255, 253)', 'rgb(255, 255, 255)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.vm2}
    >
      <Text style={styles.textaq}>پێشانگەهێن Tv سمارت</Text>
    </LinearGradient>
  </View>
  </TouchableOpacity>
</View>
{/* mobilyat */}



{/* studio */}
 <View style={{marginTop: isTablet ? hp("2%") : hp("6%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
    <Text style={styles.textstudio}>studio</Text>
      <View style={styles.dashLine} />   
    </View>
  </View>

<TouchableOpacity onPress={() => navigation.navigate('Homestudio')}>
  <View style={{marginTop: isTablet ? hp("0%") : hp("1%"),}}>
  <Image source={require('../../../assets/m61.png')} style={styles.bobilyat} />
   
  <View style={{marginTop: isTablet ? hp("0%") : hp("5%"),
    left: isTablet ? hp("0%") : hp("8.9%")
  }}>
     {/* <LinearGradient
    colors={['rgb(215, 90, 7)', 'rgb(198, 93, 7)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm5}
  >
    
    <View style={styles.rowContainer00}>
    <Text style={styles.texta}>ستودیو</Text>
  </View>
  </LinearGradient> */}
  </View>
</View>
</TouchableOpacity>
{/* studio */}


{/* salon u qa3a dawata u clk bik */}
<View style={{marginTop: isTablet ? hp("0%") : hp("-6%"),}}>
  <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalScroll}
>

  <View>

    {/* ROW 1 */}
    <View style={styles.row1}>

<TouchableOpacity onPress={() => navigation.navigate('Homesalon')}>
      <View style={styles.item}>
       
          <Image source={require('../../../assets/m62.png')} style={styles.iconImage12} />
        
        <Text style={styles.imageText2}>جوانکاریێن ئافرەتان</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homeholl')}>
   <View style={styles.item}>
       
          <Image source={require('../../../assets/m63.png')} style={styles.iconImage12} />
        
        <Text style={styles.imageText2}>هۆڵێن شەهیانا</Text>
      </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Homedress')}>
      <View style={styles.item}>
       
          <Image source={require('../../../assets/m64.png')} style={styles.iconImage12} />
        
        <Text style={styles.imageText2}>کراسێن بیکا</Text>
      </View>

</TouchableOpacity>
    </View>

  

  </View>

</ScrollView>
</View>
{/* salon u qa3a dawata u clk bik */}



{/* belavbun1 */}
<View style={{ top: hp('-2%') }}>
      <SliderBox
        images={images1}
        autoplay
        circleLoop
        dotColor="orange"
        inactiveDotColor="#90A4AE"
        resizeMode="cover"
        ImageComponentStyle={{
          borderRadius: 20,
          width: screenWidth * 0.95,
          height: screenWidth * 0.5,
          marginTop: 10,
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 30,
          height: 7,
          borderRadius: 20,
        }}
        onCurrentImagePressed={handleImagePress1}
      />
    </View>
{/* belavbun1 */}





{/* gaming */}
 <View style={{marginTop: isTablet ? hp("2%") : hp("2%"),}}>
    <View style={styles.lineWithOr}>
      <View style={styles.dashLine} />
    <Text style={styles.textstudio}>gaming</Text>
      <View style={styles.dashLine} />   
    </View>
  </View>
  <TouchableOpacity onPress={() => navigation.navigate('Homegaming')}>
    <View style={{marginTop: isTablet ? hp("0%") : hp("1%"),}}>
  <Image source={require('../../../assets/m65.png')} style={styles.bobilyat} />
</View>
</TouchableOpacity>
{/* gaming */}



{/* rells */}
<View style={styles.wrapperTop}>
  <View style={styles.wrapperInner}>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row99}>

        {trsbadinii.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate("Rellsrek", {
                videos: trsbadinii,
                startIndex: index,
              })
            }
          >

            <View style={styles.card}>
              <Video
                source={{ uri: item.play }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
                useNativeControls={false}
              />

              <View style={styles.ratingBox}>
                <Image
                  source={{ uri: item.wene1 }}
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
{/* rells */}


{/* zarok */}
<TouchableOpacity onPress={() => navigation.navigate('Homebaby')}>
<View>
  <View style={{marginTop: isTablet ? hp("5%") : hp("5%"),}}>
  <Image source={require('../../../assets/m90.png')} style={styles.bobilyat} />
</View>
<Text style={{
  fontFamily:'k24',
  color:'black',
  fontSize:RFPercentage(2.5),
  textAlign:'center',
  marginTop: isTablet ? hp("2%") : hp("1%"),
}}>جیهانا زاروکا</Text>
</View>
</TouchableOpacity>
{/* zarok */}



<View>
  <View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
   
  }}
>
  <TouchableOpacity onPress={() => navigation.navigate('Homecar')}>
        <LinearGradient
    colors={['rgb(6, 69, 117)', 'rgb(5, 114, 156)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm91}
  >
    <View style={styles.cardContent}>
  <Image
    source={require('../../../assets/m108.png')}
    style={styles.cardIcon}
  />
  <Text style={styles.cardTitle}>
ترومبێل
  </Text>
</View>

  </LinearGradient>
  </TouchableOpacity>
{/* /////////////////// */}
<TouchableOpacity onPress={() => navigation.navigate('Homehouse')}>
    <LinearGradient
    colors={['rgb(37, 81, 3)', 'rgb(7, 138, 68)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm91}
  >
    <View style={styles.cardContent}>
  <Image
    source={require('../../../assets/m106.png')}
    style={styles.cardIcon}
  />
  <Text style={styles.cardTitle}>
   ئەرد و خانی
  </Text>
</View>
  </LinearGradient>
  </TouchableOpacity>
  </View>
</View>



<View>
  <View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
   
  }}
>
  <TouchableOpacity onPress={() => navigation.navigate('Homewatch')}>
        <LinearGradient
    colors={['rgb(188, 114, 3)', 'rgb(173, 156, 6)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm91}
  >
    <View style={styles.cardContent}>
  <Image
    source={require('../../../assets/m102.png')}
    style={styles.cardIcon}
  />
  <Text style={styles.cardTitle}>
جیهانا دەمژمێرا
  </Text>
</View>

  </LinearGradient>
  </TouchableOpacity>
{/* /////////////////// */}
  <TouchableOpacity onPress={() => navigation.navigate('Homehome')}>
    <LinearGradient
    colors={['rgb(84, 27, 136)', 'rgb(7, 44, 138)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.vm91}
  >
    <View style={styles.cardContent}>
  <Image
    source={require('../../../assets/m910.webp')}
    style={styles.cardIcon}
  />
  <Text style={styles.cardTitle}>
    ناف مالی
  </Text>
</View>
  </LinearGradient>
  </TouchableOpacity>
  </View>
</View>













</View>

</View >
</ScrollView>
</View>
      )}











     <StatusBar 
     backgroundColor="black"
     barStyle="#fff"
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  wene27:{
    width:wp('27%'),
    height: hp('7%'),top:hp('4%'),left:hp('1%')
  },
  reklam:{
    width:isTablet ? wp("120%") : wp("110%"),
    height:isTablet ? hp("17%") : hp("20%"),
    left:isTablet ? hp("-10%") : hp("-4%"),
    borderRadius:5,
    resizeMode:"cover",
    top: isTablet ? hp("0%") : hp("-3%"),
 },
reklam1: {
    width: isTablet ? wp("20%") : wp("20%"),
    height: isTablet ? hp("10%") : hp("8%"),
    borderRadius: 5,
    resizeMode: "cover",
    alignSelf: "center", 
    marginVertical: "auto", 
     top: isTablet ? hp("-12%") : hp("-17%"),
},
reklam2: {
    width: isTablet ? wp("30%") : wp("37%"),
    height: isTablet ? hp("10%") : hp("8%"),
    borderRadius: 5,
    resizeMode: "cover",
    alignSelf: "center", 
    marginVertical: "auto", 
    top: isTablet ? hp("-13%") : hp("-19%"),
},
flex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-evenly",
    alignItems: 'center',
    width: '100%', 
    paddingHorizontal: 10, 
   marginTop: isTablet ? hp("0%") : hp("-20%"),
  },
  
  fancyBorderRadius: {
    width: isTablet ? wp("15%") : wp("18%"),
    height: isTablet ? hp("10%") : hp("7%"),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 10,
    marginBottom: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
  iconImage: {
       width: isTablet ? wp("10%") : wp("12.5%"),
    height: isTablet ? hp("10%") : hp("8%"),
    resizeMode: 'contain',
  },
vm:{
  width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("10%") : hp("6%"),
    borderTopLeftRadius: isTablet ? 60 : 30,
    borderTopRightRadius: isTablet ? 20 : 10,
    borderBottomLeftRadius: isTablet ? 20 : 10,
    borderBottomRightRadius: isTablet ? 60 : 30,
    justifyContent: 'center', 
    alignItems: 'center',
     marginTop: isTablet ? hp("2%") : hp("-10%"),
     left: isTablet ? hp("3%") : hp("1.9%")
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

 bgkokteli: {
    width: isTablet ? wp("90%") : wp("95%"),
    height: isTablet ? hp("30%") : hp("26%"),
    left: isTablet ? hp("3%") : hp("1%"), 
    borderTopLeftRadius:isTablet ? 40 : 10,
    borderTopRightRadius: isTablet ? 40 : 10,
    borderBottomLeftRadius: isTablet ? 40 : 10,
    borderBottomRightRadius: isTablet ? 40 : 10,
    backgroundColor: 'white',
     shadowColor: '#999',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 6,
  // Android shadow
  elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    top: isTablet ? hp("2%") : hp("0%")
  },
  horizontalScroll: {
  flexDirection: 'column',
  paddingVertical: 20,
  paddingHorizontal: 10,
  
},

row1: {
  flexDirection: 'row',
  marginBottom: 12,
},

item: {
  alignItems: 'center',
  marginRight: 10,
},

/* BUTTON */
imageButton: {
  width: isTablet ? wp('14%') : wp('16%'),
  height: isTablet ? wp('14%') : wp('16%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,              
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',            
  elevation: 3,                  
  shadowColor: '#000',            
  shadowOpacity: 0.15,
  shadowRadius: 4,
},

iconImage1: {
  width: '70%',
  height: '70%',
  resizeMode: 'contain',
},

imageText: {
  marginTop: 4,
  fontSize: 17,
  textAlign: 'center',
  color: 'black',
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

iconImage13: {
  width: isTablet ? wp('14%') : wp('40%'),
  height: isTablet ? wp('14%') : wp('16%'),
  resizeMode: 'contain',
},

imageButton2: {
  width: isTablet ? wp('14%') : wp('22%'),
  height: isTablet ? wp('14%') : wp('18%'),
     borderTopLeftRadius: isTablet ? 20 : 10,
    borderTopRightRadius: isTablet ? 40 : 20,
    borderBottomLeftRadius: isTablet ? 40 : 20,
    borderBottomRightRadius: isTablet ? 20 : 10,
  backgroundColor: 'rgb(106, 171, 197)',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',            
  elevation: 3,                  
  shadowColor: '#000',            
  shadowOpacity: 0.15,
  shadowRadius: 4,
},
imageText2: {
  marginTop: 4,
  fontSize: RFPercentage(2.2),
  textAlign: 'center',
  color: '#fff',
  fontFamily: 'k24',
  color:'black',
  fontWeight:'bold'
},
bobilyat:{
  width: isTablet ? wp("90%") : wp("98%"),
  height: isTablet ? hp("30%") : hp("25%"),
  borderRadius: 20,
  resizeMode: "cover",
  alignSelf: "center",
},
vm1:{
  width: isTablet ? wp("0%") : wp("50%"),
    height: isTablet ? hp("0%") : hp("4%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
    justifyContent: 'center', 
    alignItems: 'center',
     marginTop: isTablet ? hp("2%") : hp("4%"),
     left: isTablet ? hp("0%") : hp("1.9%")
},
 texta: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'left', 
    flexShrink: 1, 
    fontFamily:'k24'
  },

  iconImagegift: {
    width: isTablet ? wp("0%") : wp("20.5%"),
    height: isTablet ? hp("0%") : hp("10%"),
    resizeMode: 'contain',
    marginTop: isTablet ? hp("0%") : hp("-25%"),
    left: isTablet ? hp("0%") : hp("1.5%")
  },

  mobilyatWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: "space-evenly",
  paddingHorizontal: wp('2%'),
  top: isTablet ? hp("0%") : hp("3%")
},

mobilyatItem: {
  width: isTablet ? wp('45%') : wp('45%'),         
  marginBottom: hp('2%'),
  alignItems: 'center',
},

mobile: {
  width: '100%',
  height: hp("20%"),
   borderTopLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 10,
  resizeMode: "cover",
},
mobile1: {
  width: '100%',
  height: hp("20%"),
   borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
  resizeMode: "cover",
},
iconImagemo: {
  width: '60%',
  height: hp("7%"),
  resizeMode: 'contain',
  marginTop: hp('-6%'),
},

vm2: {
  marginTop: hp('1%'),
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
},

textaq: {
  fontSize: 16,
  color: 'black',
  fontFamily: 'k24',
  textAlign: 'center',
},

textstudio: {
  fontSize: 30,
  color: 'black',
  fontFamily: 'lor',
  textAlign: 'center',
  fontWeight:"900"
},
vm5:{
  width: isTablet ? wp("0%") : wp("50%"),
    height: isTablet ? hp("0%") : hp("4%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center', 
    alignItems: 'center',
     marginTop: isTablet ? hp("2%") : hp("-10%"),
     left: isTablet ? hp("0%") : hp("1.9%")
},

iconImage12: {
 width: isTablet ? wp("90%") : wp("60%"),
    height: isTablet ? hp("20%") : hp("10%"),
borderRadius:isTablet ? 40 :10,
 
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

  ratingIcon: {
      width: isTablet ? wp("0%") : wp("10.5%"),
    height: isTablet ? hp("0%") : hp("5%"),

    borderRadius:50
  },
 
watch:{
  width: isTablet ? wp("90%") : wp("98%"),
  height: isTablet ? hp("15%") : hp("10%"),
  borderRadius: 20,
  alignSelf: "center",
  resizeMode: "cover",
  marginTop: isTablet ? hp("2%") : hp("5%"),
},

watch1:{
  width: isTablet ? wp("0%") : wp("25%"),
  height: isTablet ? hp("0%") : hp("15%"),

  resizeMode: "cover",
  marginTop: isTablet ? hp("2%") : hp("-13%"),

},
watch2:{
  width: isTablet ? wp("0%") : wp("25%"),
  height: isTablet ? hp("0%") : hp("15%"),
marginLeft: isTablet ? hp("0%") : hp("1%"),
  resizeMode: "cover",
  marginTop: isTablet ? hp("2%") : hp("-13%"),

},
watch3:{
  width: isTablet ? wp("0%") : wp("35%"),
  height: isTablet ? hp("25%") : hp("15%"),
marginLeft: isTablet ? hp("0%") : hp("-0.5%"),
  resizeMode: "cover",
  marginTop: isTablet ? hp("2%") : hp("-12%"),

},

nafmali:{
  width: isTablet ? wp("90%") : wp("98%"),
  height: isTablet ? hp("30%") : hp("17%"),
 borderBottomEndRadius:20,
 borderBottomStartRadius:10,
 borderTopEndRadius:10,
 borderTopStartRadius:20,
  resizeMode: "cover",
  alignSelf: "center",
},
vm91:{
  width: isTablet ? wp("90%") : wp("45%"),
    height: isTablet ? hp("10%") : hp("20%"),
    borderTopLeftRadius: isTablet ? 60 : 20,
    borderTopRightRadius: isTablet ? 20 : 20,
    borderBottomLeftRadius: isTablet ? 20 : 20,
    borderBottomRightRadius: isTablet ? 60 : 20,
    justifyContent: 'center',
    alignItems: 'center',
     marginTop: isTablet ? hp("2%") : hp("3%"),
     
},
cardContent: {
  justifyContent: 'center',
  alignItems: 'center',
},

cardIcon: {
    width: isTablet ? wp("10%") : wp("50.5%"),
    height: isTablet ? hp("10%") : hp("10%"),
    resizeMode: 'contain',
},

cardTitle: {
    fontSize: RFPercentage(2.5),
    color: '#fff',
    textAlign: 'center', 
    flexShrink: 1, 
    fontFamily:'k24'
},





















wene29: {
  width:wp("90%"),
  height:hp("57%"),
  marginTop:hp("-7%"),
   borderRadius:5,
   resizeMode:"cover",
     
   left:hp("2%")
},
nav: {
  fontSize: RFPercentage(3.5),
  fontWeight:'400',
 marginHorizontal:hp("3%"),
  color: '#fff',
  fontFamily:'k24',
  position:'absolute',
  top:hp("50%")
},
LinearGradient2: {
  width:wp('100%'),height:100, position:'absolute',
  top:hp("52%")
},
    blurView: {
      width: wp("90%"),
      height:hp("8.2%"),
      top:hp("-2%"),
      left:("4.5%"),
      borderRadius: 10,
      overflow: 'hidden',
     
    
    },
    blurView1: {
      width: wp("30%"),
      height:hp("5%"),
      top:hp("1.6%"),
      left:("2%"),
      borderRadius: 10, 
      overflow: 'hidden', 
      
    
    },
    nava:{
      fontSize: RFPercentage(2.5),
      fontWeight:'400',
    textAlign:'center',
      color: '#fff',
      fontFamily:'k24',
      marginTop:hp("1.3%")
    },
  
  //  row: {
  //   backgroundColor: '#1C1917',
  //   padding: isTablet ? wp("2.5%") : wp("3%"),
  //   borderRadius: 16,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent:'space-between',
  //   position: 'relative',
  //   top:hp('3%')
  // },




rowGlow: {
  borderRadius: RADIUS,

  // ئەمە light ـەکەی لە دەرەوە دروست دەکات

  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 25,
  elevation: 25, // Android
},

row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 16,
  paddingHorizontal: 12,
  backgroundColor: 'rgba(23, 24, 24, 0.8)',
  borderRadius: RADIUS,

  // ئەمە light ـەکەی لە چەپ و ڕاست دیارتر دەکات
  borderLeftWidth: 1.5,
  borderRightWidth: 1.5,
  borderColor: 'rgba(0,234,255,0.8)',
},


  binerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biner: {
    fontSize: isTablet ? wp("4%") : wp("6%"),
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    fontFamily:'k24'
  },
   biner0: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    fontFamily:'k24',left:hp("5%")
  },
  biner1: {
  
    color: '#21BCFF',
    fontWeight: '600',
     fontSize: isTablet ? wp("4%") : wp("6%"),
      fontFamily:'k24'
  },
  icon2: {
    width: 45,
    height: 49.5,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
   wene2:{
        width:isTablet ? wp("35%") : wp("40%"),
        height:isTablet ? hp("45%") : hp("30%"),
        marginHorizontal:10,
        borderRadius:10,
        top:'0%',
     
   },
   binernew:{

    fontSize: RFPercentage(3),
    fontWeight:'400',
  textAlign:'center',
    color: '#fff',
    fontFamily:'k24',
    marginTop:hp("1.5%"),

   },
   new:{
    width:wp("15%"),
    height:hp("6%"),
    position:'absolute',
    left:wp("27.7%"),
    marginTop:wp("0%")
   },
   LinearGradient21:{
    width:wp("80%"),
    height:hp("8%"),
    left:hp("3%"),
    borderRadius:10
   },
   innerContainer20:{
    width:wp("79%"),
    height:hp("7.5%"),
    top:hp('0.3%'),left:hp('0.2%'),
    borderRadius:10,
    backgroundColor:'#17202a'
   },
   imgd:{
    width:wp("8%"),
    height:hp("3.4%"),
    marginTop:hp("-5.3%"),
    left:hp("30%")
   },
   imgd1:{
    width:wp("45%"),
    height:hp("7%"),
    marginTop:hp("0.3%"),
    left:hp("3%")
   },
   renderItem1_view1: {
    width: 80,
    position: "absolute",
    fontSize: 20,
    top: 10,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    alignItems: "center",
 },
 renderItem1_text1: {
    fontWeight: "700",
    color: "#000000",
 },
 renderItem2_parentView2: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    height: 450,
    width: 350,
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
 },
 renderItem2_img: {
    width:wp("86%"),
    height:hp("25%"),
    borderRadius:10,
   
  
 },
 navo:{
  position:'absolute',
  color:'#fff',
  fontFamily:'k24',
  fontSize:RFPercentage(3),
  left:hp('2%'),
  marginBlock:hp('50%')
 },
 spee:{
  width:wp("13%"),
  height:hp("6.3%"),
  left:20
 },
 aiu:{
  width:wp("15%"),
  height:hp("9%"),
  marginTop:hp("-3.3%"),
  left:hp('0.7%'),
 },
 aiu1:{
  width:wp("15%"),
  height:hp("10%"),
  marginTop:hp("-4.0%"),
  left:hp('0%'),
 },
 overlayContainer: {
  position: 'absolute',
  top:isTablet ? hp("41%") : hp("26%"),
 left:isTablet ? hp("18%") : hp("12%"),
  borderRadius: 6,
  overflow: 'hidden'
},
blurBackground: {
  paddingHorizontal:isTablet ? wp("3%") : wp("1%"),
  paddingVertical:isTablet ? wp("1%") : wp("1%"),
  borderRadius: 6,
  
},
overlayText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: 'bold',
  fontFamily:'k24'
},
 overlayContainer1: {
  position: 'absolute',
  top:hp("1%"),
left:hp("1.5%"),
  borderRadius: 6,
  overflow: 'hidden'
},
 container10: {
    width: '100%',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('0%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon8: {
    width: isTablet ? wp('8%') : wp('12%'),
    height: isTablet ? hp('8%') : hp('8.2%'),
     right:isTablet ? hp("0.5%") : hp("0%"),
     top:isTablet ? hp("0%") : hp("-0.7%"),
  },
  logo: {
    width: wp('40%'),
    height: hp('13%'),
    right:isTablet ? hp("3.6%") : hp("1%"),
    top:isTablet ? hp("0%") : hp("-1%"),
  },
    container7: {
top:hp("-6%"),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
   loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  renderItem1_view1: {
    width: 100,
    position: "absolute",
    top: 10,
    right: 20,
    paddingVertical: 5,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    alignItems: "center",
  },
  renderItem1_text1: {
    fontWeight: "700",
    fontSize: 12,
  },
  renderItem2_parentView2: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    height: 520,
    width: 380,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  renderItem2_img: {
    width: 380,
    height: 520,
  },
  carouselContainer: {
    marginTop: 20,
  },
  carouselContent: {
    alignItems: 'center',
  },
  
});
