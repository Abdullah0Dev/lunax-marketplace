import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FavoriteScreen from "../screens/scree/FavoriteScreen";

const Stack = createNativeStackNavigator();

export const StackNavigator5 = () => (

    <Stack.Navigator>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
  
    </Stack.Navigator>
  );
