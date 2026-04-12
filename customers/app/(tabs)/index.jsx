// @ts-nocheck
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import VideoCard from "../../components/VideoCard";
import { adImages, categoriesData, discountData } from "../../constants";
import { useExplore } from "../../hooks/useExplore";
import { useDispatch } from "react-redux";
import SlidingBox from "../../components/SlidingBox";
import { FlashList } from "@shopify/flash-list";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const RADIUS = 20;
const ITEM_WIDTH = isTablet ? screenWidth * 0.5 : screenWidth * 0.88;
const ITEM_HEIGHT = isTablet ? screenHeight * 0.6 : screenHeight * 0.6;

const HomeScreen = () => {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { isLoading, getStoresByCategory, preFetchAllCategories } =
    useExplore();
  ////////////////////////////////////////////////////
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);
  const [localReels, setLocalReels] = useState([]);

  // Option 1: Use useEffect to watch for reels changes
  // Option 3: Use useEffect to fetch on mount
  // useEffect(() => {
  //   const fetchReels = async () => {
  //     console.log("Fetching reels on mount...");
  //     const result = await refetchReels();
  //     console.log("Fetch result:", result);
  //   };
  //   fetchReels();
  // }, []); // Empty dependency array means run once on mount

  const handleImagePress = (index) => {
    const url = links[index];
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err),
      );
    }
  };
  ////////////////////////////////////////////////////
  const [images1, setImages1] = useState([]);
  const [links1, setLinks1] = useState([]);

  useEffect(() => {
    fetch("https://amedbaz.github.io/lunabalav1/lunabalav1.json")
      .then((response) => response.json())
      .then((data) => {
        const lunabalav1 = data.lunabalav1 || [];
        setImages1(lunabalav1.map((item) => item.image));
        setLinks1(lunabalav1.map((item) => item.link));
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
    fetch("https://amedbaz.github.io/rellsrek/rellsrek.json")
      .then((response) => response.json())
      .then((data) => {
        const reels =
          data.rellsrek.map((item) => ({
            id: item.id,
            thumbnail_url: item.wene1,
            logo: item.wene1,
            url: item.play,
          })) || [];
        console.log("reels: ", reels);

        /**
         * 
         // id => id
// wene1 => thumbnail_url 
// play => url
         */
        setLocalReels(reels.map((item) => item));
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  }, []);

  const handleImagePress1 = (index) => {
    const url = links1[index];
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err),
      );
    }
  };
  // Pre-fetch all categories when app starts
  useEffect(() => {
    const loadAllCategoryData = async () => {
      console.log("🚀 Pre-fetching all category data...");
      setIsLoadingCategories(true);
      await preFetchAllCategories();
      setIsLoadingCategories(false);
    };

    loadAllCategoryData();
  }, []);
  const navigateTo = async (categoryName) => {
    console.log("categoryName: ", categoryName);
    console.log(`Navigating to ${categoryName} (data already cached)`);
    const url = `/category/${categoryName}`;
    router.push(url);
  };

  const navigateToRellsrek = (video, startIndex) => {
    router.push({
      pathname: "/(tabs)/reels",
      params: { videos: JSON.stringify({}), startIndex },
    });
  };
  const quickCategories = [
    {
      gradient: ["rgb(6, 69, 117)", "rgb(5, 114, 156)"],
      image: require("../../assets/images/m108.png"),
      title: "ترومبێل",
      link: "cars",
    },
    {
      gradient: ["rgb(37, 81, 3)", "rgb(7, 138, 68)"],
      image: require("../../assets/images/m106.png"),
      title: "ئەرد و خانی",
      link: "homes",
    },
    {
      gradient: ["rgb(188, 114, 3)", "rgb(173, 156, 6)"],
      image: require("../../assets/images/m102.png"),
      title: "جیهانا دەمژمێرا",
      link: "watches",
    },
    {
      gradient: ["rgb(84, 27, 136)", "rgb(7, 44, 138)"],
      image: require("../../assets/images/m910.webp"),
      title: "ناف مالی",
      link: "living",
    },
  ];

  const handleOpenReel = (item) => {
    console.log("data items: ", item);
    const feedVideo = JSON.stringify({
      id: item?.id,
      url: item?.url?.replace(
        "http://tools-openinary-8f358f-173-249-22-222.traefik.me",
        "https://storage.dmsystem.dpdns.org",
      ),
      thumbnail_url: item?.thumbnail_url,
      title:
        `${item?.title?.kurdish}\n${item?.description ? item?.description : ""}` ||
        `${item?.title?.english}\n${item?.description ? item?.description : ""}`,
      store: {
        id: item?.store?.id,
        name: item?.store?.name?.kurdish || item?.store?.name?.english || "",
        logo: item?.store?.logo
          ? { uri: item?.store?.logo }
          : require("../../assets/images/m202.png"),
      },
    });

    // return;
    router.navigate({
      pathname: `/video/${item.id}`,
      params: {
        feedVideo,
      },
    });
  };
  const handleOpenProductsDiscounts = (item) => {
    console.log("data items: ", item.discountValue.replace("%", ''));
    const percentage = item.discountValue.replace("%", '') ?? "all"
    // return;
    const feedVideo = JSON.stringify({
      id: item?.id,
      url: item?.url?.replace(
        "http://tools-openinary-8f358f-173-249-22-222.traefik.me",
        "https://storage.dmsystem.dpdns.org",
      ),
      thumbnail_url: item?.thumbnail_url,
      title:
        `${item?.title?.kurdish}\n${item?.description ? item?.description : ""}` ||
        `${item?.title?.english}\n${item?.description ? item?.description : ""}`,
      store: {
        id: item?.store?.id,
        name: item?.store?.name?.kurdish || item?.store?.name?.english || "",
        logo: item?.store?.logo
          ? { uri: item?.store?.logo }
          : require("../../assets/images/m202.png"),
      },
    });
    // return;
    router.navigate({
      pathname: `/discount/${percentage}`,
      params: {
        percentage,
      },
    });
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#f13a00"
          style={{
            backgroundColor: "black",
            width: wp("100%"),
            height: hp("100%"),
          }}
        />
      ) : (
        <View style={{ top: isTablet ? hp("0%") : hp("4%") }}>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.container10}>
                <Image
                  source={require("../../assets/images/luna.jpeg")}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  onPress={() => {
                    console.log("search: ", router);
                    router.navigate("/search");
                  }}
                >
                  <Image
                    source={require("../../assets/images/m2.webp")}
                    style={styles.icon8}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: isTablet ? hp("0%") : hp("15%") }}>
                {/* belavbun */}
                <View style={{ top: isTablet ? hp("-2%") : hp("-4%") }}>
                  <SlidingBox
                    hideMargin
                    images={adImages}
                    handleImagePress={handleImagePress}
                  />
                </View>

                {/* discount */}
                <View style={{ marginTop: isTablet ? hp("0%") : hp("-4%") }}>
                  <View>
                    {/* Your background images */}
                    <Image
                      source={require("../../assets/images/m3.png")}
                      style={styles.reklam}
                      blurRadius={4}
                    />
                    <Image
                      source={require("../../assets/images/m5.webp")}
                      style={styles.reklam1}
                    />
                    <Image
                      source={require("../../assets/images/m6.png")}
                      style={styles.reklam2}
                    />

                    {/* Dynamic discount items - Row 1 */}
                    <View style={styles.flex}>
                      {discountData
                        .filter((item) => item.row === 1)
                        .map((item) => (
                          <TouchableOpacity
                            onPress={() => handleOpenProductsDiscounts(item)}
                          >
                            <LinearGradient
                              key={item.id}
                              colors={["rgb(45, 97, 80)", "rgb(150, 182, 176)"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.fancyBorderRadius}
                            >
                              <Image
                                source={
                                  item.imageType === "url"
                                    ? { uri: item.source }
                                    : item.source
                                }
                                style={styles.iconImage}
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>

                  <View style={{ marginTop: isTablet ? hp("0%") : hp("22%") }}>
                    {/* Dynamic discount items - Row 2 */}
                    <View style={styles.flex}>
                      {discountData
                        .filter((item) => item.row === 2)
                        .map((item) => (
                          <TouchableOpacity
                            onPress={() => handleOpenProductsDiscounts(item)}
                          >
                            <LinearGradient
                              key={item.id}
                              colors={["rgb(45, 97, 80)", "rgb(150, 182, 176)"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.fancyBorderRadius}
                            >
                              <Image
                                source={
                                  item.imageType === "url"
                                    ? { uri: item.source }
                                    : item.source
                                }
                                style={styles.iconImage}
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                </View>
                {/* discount */}

                {/* design */}
                <View>
                  <LinearGradient
                    colors={["rgb(103, 4, 4)", "rgb(103, 4, 4)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.vm}
                  >
                    <View style={styles.rowContainer00}>
                      <Image
                        source={require("../../assets/images/m11.webp")}
                        style={styles.iconImage}
                      />
                      <Text style={styles.text}>
                        بازار مە هەمی یا کوم ڤەکری ژ بوتە
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
                {/* design */}

                {/* koktel */}
                <View style={styles.bgkokteli}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                  >
                    <View>
                      {categoriesData.slice(0, 2).map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row1}>
                          {row.map((item) => (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => navigateTo(item.screen)}
                            >
                              <View style={styles.item}>
                                <View style={styles.imageButton}>
                                  <Image
                                    source={item.image}
                                    style={styles.iconImage1}
                                  />
                                </View>
                                <Text style={styles.imageText}>
                                  {item.title}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
                {/* koktel */}

                {/* Brand */}
                <View style={{ marginTop: isTablet ? hp("5%") : hp("2%") }}>
                  <View style={styles.lineWithOr}>
                    <View style={styles.dashLine} />
                    <Text style={styles.textstudio}>brand</Text>
                    <View style={styles.dashLine} />
                  </View>
                </View>
                {/* Brand */}

                {/* marka */}
                <View style={{ marginTop: isTablet ? hp("0%") : hp("-1%") }}>
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
                            <Image
                              source={require("../../assets/images/m40.png")}
                              style={styles.iconImage1}
                            />
                          </View>
                          <Text style={styles.imageText2}>Adidas</Text>
                        </View>

                        <View style={styles.item}>
                          <View style={styles.imageButton2}>
                            <Image
                              source={require("../../assets/images/m41.png")}
                              style={styles.iconImage1}
                            />
                          </View>
                          <Text style={styles.imageText2}>Nike</Text>
                        </View>

                        <View style={styles.item}>
                          <View style={styles.imageButton2}>
                            <Image
                              source={require("../../assets/images/m43.png")}
                              style={styles.iconImage1}
                            />
                          </View>
                          <Text style={styles.imageText2}>Lacoste</Text>
                        </View>

                        <View style={styles.item}>
                          <View style={styles.imageButton2}>
                            <Image
                              source={require("../../assets/images/m44.png")}
                              style={styles.iconImage1}
                            />
                          </View>
                          <Text style={styles.imageText2}>Louis Veitton</Text>
                        </View>

                        <View style={styles.item}>
                          <View style={styles.imageButton2}>
                            <Image
                              source={require("../../assets/images/m45.png")}
                              style={styles.iconImage1}
                            />
                          </View>
                          <Text style={styles.imageText2}>Gucci</Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
                {/* marka */}

                {/* mobilyat */}
                <TouchableOpacity onPress={() => navigateTo("showroom")}>
                  <View>
                    <Image
                      source={require("../../assets/images/m50.png")}
                      style={styles.bobilyat}
                    />
                    <Image
                      source={require("../../assets/images/m52.png")}
                      style={styles.iconImagegift}
                    />
                    <View
                      style={{
                        marginTop: isTablet ? hp("0%") : hp("5%"),
                        left: isTablet ? hp("0%") : hp("8.9%"),
                      }}
                    >
                      <LinearGradient
                        colors={["rgb(10, 92, 85)", "rgb(10, 92, 85)"]}
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
                  <TouchableOpacity onPress={() => navigateTo("phone")}>
                    <View style={styles.mobilyatItem}>
                      <Image
                        source={require("../../assets/images/m54.gif")}
                        style={styles.mobile}
                      />
                      <LinearGradient
                        colors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.vm2}
                      >
                        <Text style={styles.textaq}>پێشانگەهێن موبایلا</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigateTo("smart-tv")}>
                    <View style={styles.mobilyatItem}>
                      <Image
                        source={require("../../assets/images/m60.png")}
                        style={styles.mobile1}
                      />
                      <LinearGradient
                        colors={["rgb(255, 255, 253)", "rgb(255, 255, 255)"]}
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
                <View style={{ marginTop: isTablet ? hp("2%") : hp("6%") }}>
                  <View style={styles.lineWithOr}>
                    <View style={styles.dashLine} />
                    <Text style={styles.textstudio}>studio</Text>
                    <View style={styles.dashLine} />
                  </View>
                </View>

                <TouchableOpacity onPress={() => navigateTo("studio")}>
                  <View style={{ marginTop: isTablet ? hp("0%") : hp("1%") }}>
                    <Image
                      source={require("../../assets/images/m61.png")}
                      style={styles.bobilyat}
                    />
                    <View
                      style={{
                        marginTop: isTablet ? hp("0%") : hp("5%"),
                        left: isTablet ? hp("0%") : hp("8.9%"),
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {/* studio */}

                {/* salon u qa3a dawata u clk bik */}
                <View style={{ marginTop: isTablet ? hp("0%") : hp("-6%") }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                  >
                    <View>
                      {/* ROW 1 */}
                      <View style={styles.row1}>
                        <TouchableOpacity
                          onPress={() => navigateTo("beauty-salon")}
                        >
                          <View style={styles.item}>
                            <Image
                              source={require("../../assets/images/m62.png")}
                              style={styles.iconImage12}
                            />
                            <Text style={styles.imageText2}>
                              جوانکاریێن ئافرەتان
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => navigateTo("wedding-hall")}
                        >
                          <View style={styles.item}>
                            <Image
                              source={require("../../assets/images/m63.png")}
                              style={styles.iconImage12}
                            />
                            <Text style={styles.imageText2}>هۆڵێن شەهیانا</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => navigateTo("wedding-dress")}
                        >
                          <View style={styles.item}>
                            <Image
                              source={require("../../assets/images/m64.png")}
                              style={styles.iconImage12}
                            />
                            <Text style={styles.imageText2}>کراسێن بیکا</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </View>
                {/* salon u qa3a dawata u clk bik */}

                {/* belavbun1 */}
                {/* <View style={{ top: hp("-2%") }}>
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
                      alignSelf: "center",
                    }}
                    dotStyle={{
                      width: 30,
                      height: 7,
                      borderRadius: 20,
                    }}
                    onCurrentImagePressed={handleImagePress1}
                  />
                </View> */}
                {/* belavbun1 */}

                {/* gaming */}
                <View style={{ marginTop: isTablet ? hp("2%") : hp("2%") }}>
                  <View style={styles.lineWithOr}>
                    <View style={styles.dashLine} />
                    <Text style={styles.textstudio}>gaming</Text>
                    <View style={styles.dashLine} />
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigateTo("gaming")}>
                  <View style={{ marginTop: isTablet ? hp("0%") : hp("1%") }}>
                    <Image
                      source={require("../../assets/images/m65.png")}
                      style={styles.bobilyat}
                    />
                  </View>
                </TouchableOpacity>
                {/* gaming */}

                {/* rells */}

                <FlashList
                  data={localReels}
                  renderItem={({ item, index }) => (
                    <VideoCard
                      key={index}
                      item={item}
                      logo
                      index={index}
                      onPress={(idx) => handleOpenReel(item)}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  estimatedItemSize={80}
                  contentContainerStyle={[
                    styles.categoriesList,
                    { marginTop: 12 },
                  ]}
                />
                {/* zarok */}
                <TouchableOpacity onPress={() => navigateTo("kids")}>
                  <View>
                    <View style={{ marginTop: isTablet ? hp("5%") : hp("5%") }}>
                      <Image
                        source={require("../../assets/images/m90.png")}
                        style={styles.bobilyat}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: "k24",
                        color: "black",
                        fontSize: RFPercentage(2.5),
                        textAlign: "center",
                        marginTop: isTablet ? hp("2%") : hp("1%"),
                      }}
                    >
                      جیهانا زاروکا
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* zarok */}
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                    }}
                  >
                    {quickCategories.map((item) => {
                      return (
                        <TouchableOpacity
                          key={item.link}
                          onPress={() => navigateTo("cars")}
                        >
                          <LinearGradient
                            colors={item.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.vm91}
                          >
                            <View style={styles.cardContent}>
                              <Image
                                source={item.image}
                                style={styles.cardIcon}
                              />
                              <Text style={styles.cardTitle}>{item.title}</Text>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoriesList: {
    paddingVertical: hp("1%"),
    paddingHorizontal: 12,
  },
  wene27: {
    width: wp("27%"),
    height: hp("7%"),
    top: hp("4%"),
    left: hp("1%"),
  },
  reklam: {
    width: isTablet ? wp("120%") : wp("110%"),
    height: isTablet ? hp("17%") : hp("20%"),
    left: isTablet ? hp("-10%") : hp("-4%"),
    borderRadius: 5,
    resizeMode: "cover",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: isTablet ? wp("10%") : wp("12.5%"),
    height: isTablet ? hp("10%") : hp("8%"),
    resizeMode: "contain",
  },
  vm: {
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("10%") : hp("6%"),
    borderTopLeftRadius: isTablet ? 60 : 30,
    borderTopRightRadius: isTablet ? 20 : 10,
    borderBottomLeftRadius: isTablet ? 20 : 10,
    borderBottomRightRadius: isTablet ? 60 : 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: isTablet ? hp("2%") : hp("-10%"),
    left: isTablet ? hp("3%") : hp("1.9%"),
  },
  rowContainer00: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: RFPercentage(2.5),
    color: "#fff",
    textAlign: "left",
    flexShrink: 1,
    fontFamily: "k24",
  },
  bgkokteli: {
    width: isTablet ? wp("90%") : wp("95%"),
    height: isTablet ? hp("30%") : hp("26%"),
    left: isTablet ? hp("3%") : hp("1%"),
    borderTopLeftRadius: isTablet ? 40 : 10,
    borderTopRightRadius: isTablet ? 40 : 10,
    borderBottomLeftRadius: isTablet ? 40 : 10,
    borderBottomRightRadius: isTablet ? 40 : 10,
    backgroundColor: "white",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
    top: isTablet ? hp("2%") : hp("0%"),
  },
  horizontalScroll: {
    flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  row1: {
    flexDirection: "row",
    marginBottom: 12,
  },
  item: {
    alignItems: "center",
    marginRight: 10,
  },
  imageButton: {
    width: isTablet ? wp("14%") : wp("16%"),
    height: isTablet ? wp("14%") : wp("16%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconImage1: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  imageText: {
    marginTop: 4,
    fontSize: 17,
    textAlign: "center",
    color: "black",
    fontFamily: "k24",
  },
  lineWithOr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dashLine: {
    flex: 1,
    height: 3,
    backgroundColor: "black",
    marginHorizontal: 10,
    opacity: 0.6,
    borderRadius: 50,
  },
  iconImage13: {
    width: isTablet ? wp("14%") : wp("40%"),
    height: isTablet ? wp("14%") : wp("16%"),
    resizeMode: "contain",
  },
  imageButton2: {
    width: isTablet ? wp("14%") : wp("22%"),
    height: isTablet ? wp("14%") : wp("18%"),
    borderTopLeftRadius: isTablet ? 20 : 10,
    borderTopRightRadius: isTablet ? 40 : 20,
    borderBottomLeftRadius: isTablet ? 40 : 20,
    borderBottomRightRadius: isTablet ? 20 : 10,
    backgroundColor: "rgb(106, 171, 197)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  imageText2: {
    marginTop: 4,
    fontSize: RFPercentage(2.2),
    textAlign: "center",
    fontFamily: "k24",
    color: "black",
    fontWeight: "bold",
  },
  bobilyat: {
    width: isTablet ? wp("90%") : wp("98%"),
    height: isTablet ? hp("30%") : hp("25%"),
    borderRadius: 20,
    resizeMode: "cover",
    alignSelf: "center",
  },
  vm1: {
    width: isTablet ? wp("0%") : wp("50%"),
    height: isTablet ? hp("0%") : hp("4%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: isTablet ? hp("2%") : hp("4%"),
    left: isTablet ? hp("0%") : hp("1.9%"),
  },
  texta: {
    fontSize: 20,
    color: "#fff",
    textAlign: "left",
    flexShrink: 1,
    fontFamily: "k24",
  },
  iconImagegift: {
    width: isTablet ? wp("0%") : wp("20.5%"),
    height: isTablet ? hp("0%") : hp("10%"),
    resizeMode: "contain",
    marginTop: isTablet ? hp("0%") : hp("-25%"),
    left: isTablet ? hp("0%") : hp("1.5%"),
  },
  mobilyatWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: wp("2%"),
    top: isTablet ? hp("0%") : hp("3%"),
  },
  mobilyatItem: {
    width: isTablet ? wp("45%") : wp("45%"),
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  mobile: {
    width: "100%",
    height: hp("20%"),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 10,
    resizeMode: "cover",
  },
  mobile1: {
    width: "100%",
    height: hp("20%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
    resizeMode: "cover",
  },
  vm2: {
    marginTop: hp("1%"),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textaq: {
    fontSize: 16,
    color: "black",
    fontFamily: "k24",
    textAlign: "center",
  },
  textstudio: {
    fontSize: 30,
    color: "black",
    fontFamily: "lor",
    textAlign: "center",
    fontWeight: "900",
  },
  iconImage12: {
    width: isTablet ? wp("90%") : wp("60%"),
    height: isTablet ? hp("20%") : hp("10%"),
    borderRadius: isTablet ? 40 : 10,
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
    borderRadius: 50,
  },
  vm91: {
    width: isTablet ? wp("90%") : wp("45%"),
    height: isTablet ? hp("10%") : hp("20%"),
    borderTopLeftRadius: isTablet ? 60 : 20,
    borderTopRightRadius: isTablet ? 20 : 20,
    borderBottomLeftRadius: isTablet ? 20 : 20,
    borderBottomRightRadius: isTablet ? 60 : 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: isTablet ? hp("2%") : hp("3%"),
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    width: isTablet ? wp("10%") : wp("50.5%"),
    height: isTablet ? hp("10%") : hp("10%"),
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: RFPercentage(2.5),
    color: "#fff",
    textAlign: "center",
    flexShrink: 1,
    fontFamily: "k24",
  },
  container10: {
    width: "100%",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("0%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon8: {
    width: isTablet ? wp("8%") : wp("12%"),
    height: isTablet ? hp("8%") : hp("8.2%"),
    right: isTablet ? hp("0.5%") : hp("0%"),
    top: isTablet ? hp("0%") : hp("-0.7%"),
  },
  logo: {
    width: wp("40%"),
    height: hp("13%"),
    right: isTablet ? hp("3.6%") : hp("1%"),
    top: isTablet ? hp("0%") : hp("-1%"),
  },
});

export default HomeScreen;
