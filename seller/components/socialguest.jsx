import { useOAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import React, { useState, useEffect, useCallback } from "react";

const SocialLoginButton = ({ strategy, navigation }) => {
  const getStrategy = () => {
    switch (strategy) {
      case "facebook":
        return "oauth_facebook";
      case "google":
        return "oauth_google";
      case "apple":
        return "oauth_apple";
      default:
        return "oauth_facebook";
    }
  };

  const { startOAuthFlow } = useOAuth({ strategy: getStrategy() });
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      console.log("User is signed in, redirecting to MainTabs...");
      navigation.replace("MainTabs"); // Ensure "MainTabs" is a valid route
    }
  }, [isSignedIn, navigation]); // Add navigation to the dependency array

  const onSocialLoginPress = useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("MainTabs", { scheme: "atlas" }),
      });

      if (createdSessionId && setActive) {
        console.log("Session created, setting active session...");
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth Error:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow]);

  return (
    <TouchableOpacity onPress={onSocialLoginPress} disabled={isLoading}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Ionicons name={`logo-${strategy}`} size={24} color="grey" />
        )}
        <Text style={styles.buttonText}>
          {isLoading
            ? "Loading..."
            : `Continue with ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}`}
        </Text>
        <View />
      </View>
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    top: 300,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "k24",
  },
});