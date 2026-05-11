import { Stack } from "expo-router";
import "react-native-reanimated";
import { store, persistor } from "../services/store/store";
import { useFonts } from "expo-font";

import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";

export const unstable_settings = {
  anchor: "home",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    roboto: require("../assets/font/Roboto.ttf"),
    roboto1: require("../assets/font/Roboto1.ttf"),
    k24: require("../assets/font/k24.ttf"),
    lor: require("../assets/font/logirent.otf"),
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

  //   useEffect(() => {
  //   // Monitor network status
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected) {
  //       // Trigger sync when coming online
  //       store.dispatch(offlineActions.processQueue());
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  if (!fontsLoaded) return null;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}
