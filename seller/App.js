import { Provider } from "react-redux";
import { store, persistor } from './services/store/store';
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import registerNNPushToken from 'native-notify';
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
// import * as ScreenCapture from 'expo-screen-capture';
import NetInfo from '@react-native-community/netinfo';

import { useColorScheme } from "./hooks/useColorScheme";
import { tokenCache } from "./utils/cache";
import { PersistGate } from "redux-persist/integration/react";
import { offlineActions } from "./services/store/slices/offline.slice";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  const colorScheme = useColorScheme();

  // registerNNPushToken(32980, 'JWCSVcILqymOIfCP1Q8BOX');
  const [fontsLoaded] = useFonts({
    roboto: require("./assets/font/Roboto.ttf"),
    roboto1: require("./assets/font/Roboto1.ttf"),
    k24: require("./assets/font/k24.ttf"),
    lor: require("./assets/font/logirent.otf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  // Prevent screen capture (screenshot & screen recording)
  // useEffect(() => {
  //   ScreenCapture.preventScreenCaptureAsync();
  //   return () => {
  //     ScreenCapture.allowScreenCaptureAsync();
  //   };
  // }, []);
  useEffect(() => {
    // Monitor network status
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Trigger sync when coming online
        store.dispatch(offlineActions.processQueue());
      }
    });

    return () => unsubscribe();
  }, []);
  if (!fontsLoaded) return null;


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <GestureHandlerRootView style={styles.container}></GestureHandlerRootView> */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
      <StatusBar style="auto" />
    </Provider>
  );
}
