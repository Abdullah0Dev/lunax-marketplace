import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import { useUser } from "@clerk/clerk-expo";
import Splash from "./screens/navi/Splash/Splash";
import Zanyari from "./screens/navi/Splash/Zanyari";
import Signin1 from "./screens/navi/sign/Signin1";
import ForgetPassword from "./screens/navi/sign/Forgetpassword";
import Signup from "./screens/navi/sign/signup";
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {


  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
       <Stack.Screen name="Signin1" component={Signin1} />
       <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
       <Stack.Screen name="Zanyari" component={Zanyari} />
      <Stack.Screen name="Signup" component={Signup} />
     
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};
