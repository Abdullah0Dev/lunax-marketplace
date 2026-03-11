import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Secondepage from "../screens/jernvis/Secondepage/Secondepage";
import Secondedetails from "../screens/jernvis/Secondepage/Secondedetails";
import Fastitem from "../screens/jernvis/Secondepage/Fastitem/Fastitem";
import Fastitemdetails from "../screens/jernvis/Secondepage/Fastitem/Fastitemdetails";
const Stack = createNativeStackNavigator();

export const StackNavigator7 = () => (

    <Stack.Navigator>
         <Stack.Screen
                             name="Secondepage"
                             component={Secondepage}
                             options={{
                               headerShown: false,
                               tabBarShowLabel: false,
                               presentation: "containedModal",
                             }}
                           />
            <Stack.Screen
                             name="Secondedetails"
                             component={Secondedetails}
                             options={{
                               headerShown: false,
                               tabBarShowLabel: false,
                               presentation: "containedModal",
                             }}
                           />
                             <Stack.Screen
                             name="Fastitem"
                             component={Fastitem}
                             options={{
                               headerShown: false,
                               tabBarShowLabel: false,
                               presentation: "containedModal",
                             }}
                           />
                             <Stack.Screen
                             name="Fastitemdetails"
                             component={Fastitemdetails}
                             options={{
                               headerShown: false,
                               tabBarShowLabel: false,
                               presentation: "containedModal",
                             }}
                           />
    </Stack.Navigator>
  );
