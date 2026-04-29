import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/services/api/auth.api";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const SigninPage = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(""); // Optional: for immediate validation

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      // Clear any errors
      setLocalError("");
      // navigation.navigate('MainTabs');
      router.push("home")
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: "MainTabs" }],
      //   }),
      // );
    }
  }, [isAuthenticated, router]);

  // Show error when Redux error changes
  useEffect(() => {
    if (error) {
      console.log("results: ", error);
      setLocalError(error);
    }
  }, [error]);

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim()) {
      setLocalError("Please enter username");
      return;
    }

    if (!password.trim()) {
      setLocalError("Please enter password");
      return;
    }

    // Clear previous error
    setLocalError("");

    // Call the login thunk
    const data = await dispatch(loginUser(username, password));
    console.log("data: ", data);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/blun.jpg")}
        style={[
          styles.image,
          {
            width: width > 768 ? wp("40%") : wp("55%"),
            height: width > 768 ? hp("25%") : hp("15%"),
            marginTop: isTablet ? hp("6%") : hp("12%"),
          },
        ]}
        resizeMode="contain"
      />

      {/* Error Message */}
      {localError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="#ff4444" />
          <Text style={styles.errorText}>{localError}</Text>
        </View>
      ) : null}

      {/* Username */}
      <View
        style={[
          styles.inputRow,
          localError && styles.inputRowError, // Optional: highlight inputs on error
        ]}
      >
        <Ionicons name="person-outline" size={22} color="rgb(46, 102, 31)" />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#999"
          style={styles.input}
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (localError) setLocalError(""); // Clear error when typing
          }}
        />
      </View>

      {/* Password */}
      <View style={[styles.inputRow, localError && styles.inputRowError]}>
        <Ionicons
          name="lock-closed-outline"
          size={22}
          color="rgb(46, 102, 31)"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (localError) setLocalError(""); // Clear error when typing
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="rgb(46, 102, 31)"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Optional: Clear error button */}
      {localError && (
        <TouchableOpacity
          style={styles.clearErrorBtn}
          onPress={() => setLocalError("")}
        >
          <Text style={styles.clearErrorText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp("7%"),
  },
  image: {
    alignSelf: "center",
    marginBottom: hp("4%"),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: hp("2%"),
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#ff4444",
    fontSize: wp("3.8%"),
    marginLeft: 10,
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginBottom: hp("2%"),
  },
  inputRowError: {
    borderWidth: 1,
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#000",
    marginHorizontal: 10,
  },
  loginBtn: {
    backgroundColor: "rgb(46, 102, 31)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  loginBtnDisabled: {
    backgroundColor: "#9bc48a",
    opacity: 0.7,
  },
  loginText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  clearErrorBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  clearErrorText: {
    color: "#999",
    fontSize: wp("3.5%"),
    textDecorationLine: "underline",
  },
});

export default SigninPage;
