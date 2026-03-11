import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";

const DoneButton = ({ navigation, isSignedIn }) => (
  <TouchableOpacity
    style={{ marginHorizontal: 10 }}
    onPress={() => navigation.replace( "Binin")}
  >
    <Text style={{ fontSize: 16, color: "#fff" }}>Get Started</Text>
  </TouchableOpacity>
);

const Zanyari = ({ navigation }) => {
  const { isSignedIn, isLoaded } = useUser(); 
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("zanyari");
      setHasSeenOnboarding(seen === "true");

      if (seen === "true" && isLoaded) {
        navigation.replace( "Binin" );
      }
    };
    checkOnboarding();
  }, [isSignedIn, isLoaded]);

  const handleDone = async () => {
    await AsyncStorage.setItem("zanyari", "true");
    navigation.replace( "Binin" );
  };

  if (hasSeenOnboarding === null || !isLoaded) return null; 

  return (
    <Onboarding
      onSkip={handleDone}
      onDone={handleDone}
      DoneButtonComponent={(props) => <DoneButton {...props} navigation={navigation} isSignedIn={isSignedIn} />}
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/aiii.gif")} style={{ width: 200, height: 200 }} />,
          title: "Welcome",
          subtitle: "Here you will see each information about movies and series",
        },
        {
          backgroundColor: "#fdeb93",
          image: <Image source={require("../../../assets/ff.gif")} style={{ width: 200, height: 200 }} />,
          title: "Atlas",
          subtitle: "You will know all information with us",
        },
        {
          backgroundColor: "#e9bcbe",
          image: <Image source={require("../../../assets/gi.gif")} style={{ width: 200, height: 200 }} />,
          title: "Get Started!",
          subtitle: "See the information and take benifit through it",
        },
      ]}
    />
  );
};

export default Zanyari;
