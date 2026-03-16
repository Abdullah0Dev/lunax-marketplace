import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
 

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    index: {
      focused: require("../assets/images/m120.png"),
      unfocused: require("../assets/images/m121.png"),
    },
    store: {
      focused: require("../assets/images/m126.png"),
      unfocused: require("../assets/images/m127.png"),
    },
    reels: {
      focused: require("../assets/images/m124.png"),
      unfocused: require("../assets/images/m125.png"),
    },
    favorites: {
      focused: require("../assets/images/m128.png"),
      unfocused: require("../assets/images/m129.png"),
    },
    profile: {
      focused: require("../assets/images/m122.png"),
      unfocused: require("../assets/images/m123.png"),
    },
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            console.log("route: ", route);

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const iconSource = isFocused
              ? icons[route.name]?.focused
              : icons[route.name]?.unfocused;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <Image source={iconSource} style={styles.icon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    width: wp("100%"),
    alignSelf: "center",
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: 18,
  },
  blurContainer: {
    backgroundColor: "#000",
    borderRadius: 35,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  icon: {
    width: 25, // You can adjust size
    height: 25, // You can adjust size
    marginTop: 0, // Remove top margin if you had any
  },
});

export default TabBar;
