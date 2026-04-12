import React, { useEffect, useState } from "react";
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
const { width: screenWidth } = Dimensions.get("window");
// import { SliderBox } from 'react-native-image-slider-box';
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProduct } from "../../../hooks/useProduct";
import { useExplore } from "../../../hooks/useExplore";
import { getRandomGradient } from "../../../constants/Colors";
import SlidingBox from "../../../components/SlidingBox";
const isTablet = screenWidth >= 768;

export default function ProductPage() {
  const router = useRouter();
  const { slug: productId, fromStore, storeData } = useLocalSearchParams();
  const { toggleFavorite, favorites } = useProduct();
  const [gradient, setGradient] = useState(getRandomGradient());
  const isFavorite =
    favorites.products.length > 0
      ? favorites.products?.some((prod) => prod?.id === productId)
      : false;

  const parsedItem = {};
  const productData = JSON.parse(storeData);
  console.log("storeData: ", favorites.products);
  const { store, refetchStore } = useExplore(
    productData?.storeDetails?.id || null,
  );

  const [index, setIndex] = useState(0);
  const [viewedImageIndex, setViewedImageIndex] = useState(1);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = React.useState(null);

  // const dispatch = useDispatch();
  // const favoriteList = useSelector((state) => state.favorites.favoriteList);

  const itemData = {
    gradient,
    title: productData?.name?.kurdish || productData?.name?.english,
    mainImage: [{ uri: productData?.cover_image }],
    price: productData?.price || 20000,
    images: productData?.media,
    description: productData?.description,
    discountPrice: productData?.discount_price,
    storeDetails: {
      id: productData?.storeDetails?.id,
      location: productData?.storeDetails?.location,
      number: `${productData?.storeDetails?.number}`,
      name: productData?.storeDetails?.name,
      subtitle:
        productData?.storeDetails?.subtitle ||
        productData?.storeDetails?.location,
      description: productData?.storeDetails?.description,
      logo: productData?.storeDetails?.logo,
    },
    specifications: productData?.specifications,
  };
  useEffect(() => {
    const loadStore = async () => {
      await refetchStore(itemData.storeDetails.id);
    };
    loadStore();
  }, []);

  const handleToggleFavorite = () => {
    console.log("Data:", productData);
    toggleFavorite(productData);
    console.log("After Favorite:", favorites);
    // if (isFavorite) {
    //   dispatch(removeFromFavorite(parsedItem));
    // } else {
    //   dispatch(addToFavorite(parsedItem));
    // }
  };
  const handleNavigateToStore = () => {
    const stringifiedStore = JSON.stringify(store);
    console.log("stringifiedStore: ", stringifiedStore);
    console.log(itemData.gradient);
    const url = `/store/${itemData.storeDetails.id}`;
    const title = "";
    router.navigate({
      pathname: url,
      params: {
        store: stringifiedStore,
        fromProduct: true,
        gradient: itemData.gradient,
        title,
      },
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BACK BUTTON */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient colors={["black", "#444"]} style={styles.backBtn}>
              <FontAwesome6 name="angle-left" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                flex: 1,
                textAlign: "center",
                marginTop: isTablet ? hp("5%") : hp("6%"),
              },
            ]}
            numberOfLines={1}
          >
            {itemData.title}
          </Text>

          <TouchableOpacity onPress={handleToggleFavorite}>
            <LinearGradient
              colors={["rgb(43, 41, 41)", "rgb(46, 45, 45)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: isTablet ? wp("8%") : wp("12%"),
                height: isTablet ? hp("6%") : wp("12%"),
                borderRadius: isTablet ? wp("2%") : wp("4%"),
                justifyContent: "center",
                alignItems: "center",
                marginTop: isTablet ? hp("5%") : hp("6%"),
                marginRight: wp("3%"),
              }}
            >
              <Image
                source={
                  isFavorite
                    ? require("../../../assets/images/bookmarked.png")
                    : require("../../../assets/images/bookmark.png")
                }
                style={{
                  width: isTablet ? wp("4%") : wp("5.5%"),
                  height: isTablet ? hp("4%") : hp("3.3%"),
                  resizeMode: "contain",
                }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* MAIN IMAGE */}
        <SlidingBox
          moreHeight
          images={itemData.images}
          handleImagePress={(i) => {
            setIndex(i);
            setVisible(true);
            console.log("stuff: ", i);
          }}
        />

        {/* MAIN IMAGE VIEW */}
        <ImageViewing
          images={itemData.images.map((img) => ({
            uri: img,
          }))}
          onImageIndexChange={(i) => setViewedImageIndex(i)}
          imageIndex={index}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          FooterComponent={() => (
            <View
              style={{
                marginBottom: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: `rgb(255,255,255,0.7)`,
                  fontSize: RFPercentage(1.9),
                  fontFamily: "roboto",
                  fontWeight: "bold",
                }}
              >
                {viewedImageIndex + 1}/{itemData.images.length}{" "}
              </Text>
            </View>
          )}
        />

        {/* HORIZONTAL GALLERY */}
        {!fromStore && (
          <TouchableOpacity
            onPress={handleNavigateToStore}
            style={styles.floatingCardContainer}
          >
            <View style={styles.infoCardContainer}>
              <View style={styles.infoCardContainer2}>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {" "}
                    {itemData?.storeDetails?.name}
                  </Text>
                  <Image
                    source={require("../../../assets/images/m501.png")}
                    style={styles.logoa1}
                  />
                </View>
                <View style={styles.nameContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.nameText}
                  >
                    {" "}
                    {itemData?.storeDetails?.subtitle}
                  </Text>
                  <Image
                    source={require("../../../assets/images/m503.webp")}
                    style={styles.logoa1}
                  />
                </View>
              </View>
              <View style={styles.descContainer}>
                <Image
                  source={itemData?.storeDetails?.logo}
                  style={styles.logoImage}
                />
              </View>
            </View>

            <View
              style={[
                styles.logoRow1,
                { backgroundColor: itemData.gradient || "#333" },
              ]}
            >
              <Text style={styles.logoText2}>{itemData?.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        <View
          style={{
            width: isTablet ? wp("90%") : wp("90%"),
            height: isTablet ? hp("8%") : hp("7%"),
            justifyContent: "center",
            alignSelf: "center",
            marginTop: hp("2%"),
            backgroundColor: "#FFA51F",
            borderTopLeftRadius: 30,
            borderTopEndRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              // justifyContent: "center",
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                fontSize: RFPercentage(2),
                fontFamily: "k24",
                fontWeight: "bold",
                textAlign: "center",
                marginHorizontal: wp("1%"),
                marginVertical: hp("2%"),
                color: "black",
                flex: 1,
              }}
            >
              {itemData.storeDetails?.location}
            </Text>
            <Image
              source={require("../../../assets/images/m700.webp")}
              style={{
                width: isTablet ? wp("10%") : wp("12%"),
                height: isTablet ? hp("7%") : hp("6%"),
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: isTablet ? wp("90%") : wp("90%"),
            height: isTablet ? hp("7%") : hp("7%"),
            justifyContent: "center",
            // alignItems: "flex-end",
            alignSelf: "center",
            marginTop: hp("2%"),
            backgroundColor: "#1FE1FF",
            borderTopLeftRadius: 30,
            borderTopEndRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              // justifyContent: "center",
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                fontSize: RFPercentage(2),
                fontWeight: "bold",
                textAlign: "center",
                marginHorizontal: wp("1%"),
                marginVertical: hp("2%"),
                color: "black",
                flex: 1,
              }}
            >
              {itemData.storeDetails?.number}
            </Text>
            <Image
              source={require("../../../assets/images/m701.webp")}
              style={{
                width: isTablet ? wp("8%") : wp("11%"),
                height: isTablet ? hp("6%") : hp("5%"),
              }}
            />
          </View>
        </View>

        <View style={{ marginTop: isTablet ? hp("2%") : hp("2%") }}>
          <View style={styles.lineWithOr}>
            <View style={styles.dashLine} />
            <Text style={styles.textstudio}>جور</Text>
            <View style={styles.dashLine} />
          </View>
        </View>

        <View style={{ marginTop: hp("3%"), paddingHorizontal: wp("3%") }}>
          {itemData.specifications.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  borderRadius: 14,
                  backgroundColor: "white",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    flexDirection: "row-reverse", // RTL
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 15,
                      textAlign: "right",
                      fontFamily: "k24",
                    }}
                  >
                    {item.key}
                  </Text>

                  <FontAwesome5
                    name={isOpen ? "angle-down" : "angle-left"}
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
                      borderTopColor: "#ccc",
                      backgroundColor: "white",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        lineHeight: 22,
                        textAlign: "right",
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

        <View
          style={{
            width: isTablet ? wp("90%") : wp("90%"),
            height: isTablet ? hp("7%") : hp("7%"),
            justifyContent: "center",
            alignSelf: "center",
            marginTop: hp("2%"),
            backgroundColor: "#AAB964",
            borderRadius: isTablet ? 50 : 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFPercentage(2),
                fontWeight: "bold",
                textAlign: "center",
                marginHorizontal: wp("1%"),
                marginVertical: hp("2%"),
                color: "black",
              }}
            >
              {itemData.discountPrice ? (
                <>
                  {" "}
                  <Text
                    style={{
                      fontSize: RFPercentage(1.7),
                      textDecorationLine: "line-through",
                      color: "#00000080",
                    }}
                  >
                    {itemData.price.toLocaleString()}{" "}
                  </Text>
                  {itemData.discountPrice.toLocaleString()}
                </>
              ) : (
                itemData.price.toLocaleString()
              )}{" "}
              IDQ
            </Text>
            <Image
              source={require("../../../assets/images/m750.png")}
              style={{
                width: isTablet ? wp("10%") : wp("11%"),
                height: isTablet ? hp("5%") : hp("5%"),
              }}
            />
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    width: isTablet ? wp("100%") : wp("100%"),
    height: isTablet ? hp("20%") : hp("25%"),
    marginTop: isTablet ? hp("0%") : hp("0%"),
    marginBottom: isTablet ? hp("0%") : hp("2%"),
  },
  floatingCardContainer: {
    width: isTablet ? wp("90%") : wp("90%"),
    minHeight: isTablet ? hp("22%") : hp("20%"),
    backgroundColor: "#fff",
    marginTop: 32,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowIcon: {
    fontSize: RFPercentage(4),
    color: "#fff",
  },
  storeTitle: {
    fontSize: RFPercentage(4),
    color: "white",
    marginTop: isTablet ? wp("0%") : wp("3.5%"),
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "lor",
    left: isTablet ? wp("0%") : wp("4%"),
  },
  gradientContainer: {
    width: isTablet ? hp("7%") : hp("5.5%"),
    height: isTablet ? hp("7%") : hp("5.5%"),
    borderRadius: isTablet ? hp("5%") : hp("2.75%"),
    justifyContent: "center",
    alignItems: "center",
    top: isTablet ? hp("5%") : hp("6%"),
    left: isTablet ? wp("2%") : wp("3%"),
  },
  nameContainer: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  nameText: {
    fontSize: RFPercentage(2),
    color: "black",
    fontWeight: "bold",
    fontFamily: "k24",
  },
  infoCardContainer: {
    display: "flex",
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  descContainer: {
    width: isTablet ? wp("13%") : wp("22%"),
    height: isTablet ? hp("10%") : hp("10%"),
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCardContainer2: {
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
    maxWidth: isTablet ? wp("50%") : wp("50%"),
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
    backgroundColor: "#fff",
    width: isTablet ? wp("90%") : wp("90%"),
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    alignSelf: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: RFPercentage(2),
    color: "#000",
    textAlign: "right",
    fontWeight: "500",
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
  textstudio: {
    fontSize: RFPercentage(2.5),
    fontFamily: "k24",
    fontWeight: "bold",
    color: "black",
  },
  card1: {
    backgroundColor: "#fff",
    width: isTablet ? wp("90%") : wp("90%"),
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: hp("12%"),
    alignSelf: "center",
    marginVertical: 10,
  },
  log: {
    backgroundColor: "white",
    marginVertical: hp("1%"),
    width: isTablet ? wp("90%") : wp("90%"),
    height: isTablet ? hp("22%") : hp("20%"),
    marginTop: isTablet ? hp("-6%") : hp("-12%"),
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  logoview: {
    backgroundColor: "white",
    marginVertical: hp("1%"),
    width: isTablet ? wp("13%") : wp("22%"),
    height: isTablet ? hp("10%") : hp("10%"),
    marginTop: isTablet ? hp("-5%") : hp("-7%"),
    marginLeft: isTablet ? wp("73%") : wp("65%"),
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  logoImage: {
    width: isTablet ? wp("10%") : wp("22%"),
    height: isTablet ? hp("8%") : hp("10%"),
    borderRadius: 15,
    position: "absolute",
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
    color: "black",
    marginTop: isTablet ? hp("0%") : hp("1%"),
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "k24",
    right: isTablet ? wp("30%") : wp("47%"),
    top: isTablet ? hp("-3%") : hp("-3.5%"),
  },
  logoRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
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
    color: "black",
    marginLeft: 7,
    fontWeight: "bold",
    fontFamily: "k24",
    marginHorizontal: isTablet ? wp("0%") : wp("1%"),
    marginTop: isTablet ? hp("0%") : hp("0.3%"),
  },
  logoRow1: {
    position: "absolute",
    backgroundColor: "rgb(123, 119, 12)",
    width: isTablet ? wp("85%") : wp("85%"),
    height: isTablet ? hp("7%") : hp("7%"),
    alignContent: "center",
    justifyContent: "center",
    left: isTablet ? wp("2%") : wp("2%"),
    top: isTablet ? hp("14%") : hp("12%"),
    borderRadius: 10,
  },
  logoText2: {
    fontSize: RFPercentage(1.8),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "k24",
  },
});
