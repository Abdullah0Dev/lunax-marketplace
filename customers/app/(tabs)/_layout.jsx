import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import TabBar from "../../components/TabBar";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    roboto: require("../../assets/fonts/Roboto.ttf"),
    roboto1: require("../../assets/fonts/Roboto1.ttf"),
    k24: require("../../assets/fonts/k24.ttf"),
    lor: require("../../assets/fonts/logirent.otf"),

  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="store" />
        <Tabs.Screen name="reels" />
        <Tabs.Screen name="favorites" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
