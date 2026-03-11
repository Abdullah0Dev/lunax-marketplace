import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StatusBar, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { StackNavigator1 } from "./Stack/StackNavigator1";
import { StackNavigator3 } from "./Stack/StackNavigator3";
import { StackNavigator5 } from "./Stack/StackNavigator5";
import { StackNavigator6 } from "./Stack/StackNavigator6";
import { StackNavigator7 } from "./Stack/StackNavigator7";

const Tab = createBottomTabNavigator();

export default function MainTab() {
  const [fontsLoaded] = useFonts({
    roboto: require("./assets/font/Roboto.ttf"),
    roboto1: require("./assets/font/Roboto1.ttf"),
    k24: require("./assets/font/k24.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar barStyle="light-content" />

      <Tab.Navigator
        initialRouteName="Jer"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let imageSource;

            if (route.name === "Jer") {
              imageSource = focused
                ? require("./assets/m120.png")
                : require("./assets/m121.png");
            } else if (route.name === "Secondepage") {
              imageSource = focused
                ? require("./assets/m126.png")
                : require("./assets/m127.png");
            } else if (route.name === "Rellsall") {
              imageSource = focused
                ? require("./assets/m124.png")
                : require("./assets/m125.png");
            } else if (route.name === "FavoriteScreen") {
              imageSource = focused
                ? require("./assets/m128.png")
                : require("./assets/m129.png");
            } else if (route.name === "Profile") {
              imageSource = focused
                ? require("./assets/m122.png")
                : require("./assets/m123.png");
            }

            return (
              <Image
                source={imageSource}
                style={{ width: size, height: size, top: 20 }}
              />
            );
          },

          tabBarInactiveTintColor: "#fff",

          // 🔥 FIXED BACKGROUND
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#000" }}>
              <BlurView
                intensity={80}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            </View>
          ),

          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 10,
            height: 70,
            width: hp("43%"),
            bottom: 20,
            alignSelf: "center",
            borderRadius: 35,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            left: 14,
          },
        })}
      >
        <Tab.Screen
          name="Jer"
          component={StackNavigator1}
          options={{
            headerShown: false,
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name="Secondepage"
          component={StackNavigator7}
          options={{
            headerShown: false,
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name="Rellsall"
          component={StackNavigator3}
          options={{
            headerShown: false,
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name="FavoriteScreen"
          component={StackNavigator5}
          options={{
            headerShown: false,
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name="Profile"
          component={StackNavigator6}
          options={{
            headerShown: false,
            tabBarLabel: "",
          }}
        />
      </Tab.Navigator>
    </>
  );
}
