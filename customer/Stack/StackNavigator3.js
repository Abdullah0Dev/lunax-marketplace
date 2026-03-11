import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Rellsall from "../screens/jernvis/Rellsall/Rellsall";


const Stack = createNativeStackNavigator();

export const StackNavigator3 = () => (

    <Stack.Navigator>
      <Stack.Screen
        name="Rellsall"
        component={Rellsall}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      
    </Stack.Navigator>
  );
