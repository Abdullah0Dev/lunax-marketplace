import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Serekij from "../screens/jernvis/Sereki/Serekij";
import Logoanddescription from "../screens/jernvis/Sereki/Logoanddescription";
import Homerells from "../screens/jernvis/Sereki/Rells/Homerells";
import Imagedetails from "../screens/jernvis/Sereki/imageanddetails/Imagedetails"
import Imagedetails1 from "../screens/jernvis/Sereki/imageanddetails/Imagedetails1"
import Homediscount from "../screens/jernvis/Sereki/discount/Homediscount";
import Dis10 from "../screens/jernvis/Sereki/discount/Dis10";
import Dis15 from "../screens/jernvis/Sereki/discount/Dis15";
import Dis20 from "../screens/jernvis/Sereki/discount/Dis20";
import Dis25 from "../screens/jernvis/Sereki/discount/Dis25";
import Dis30 from "../screens/jernvis/Sereki/discount/Dis30";
import Dis35 from "../screens/jernvis/Sereki/discount/Dis35";
import Dis40 from "../screens/jernvis/Sereki/discount/Dis40";
import Dis50 from "../screens/jernvis/Sereki/discount/Dis50";
const Stack = createNativeStackNavigator();

export const StackNavigator1 = () => (

    <Stack.Navigator>
      <Stack.Screen
        name="Serekij"
        component={Serekij}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
     
 <Stack.Screen
        name="Logoanddescription"
        component={Logoanddescription}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

 <Stack.Screen
        name="Homerells"
        component={Homerells}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />


 <Stack.Screen
        name="Imagedetails"
        component={Imagedetails}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
 <Stack.Screen
        name="Imagedetails1"
        component={Imagedetails1}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
 <Stack.Screen
        name="Homediscount"
        component={Homediscount}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
 <Stack.Screen
        name="Dis10"
        component={Dis10}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

       <Stack.Screen
        name="Dis15"
        component={Dis15}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
        <Stack.Screen
        name="Dis20"
        component={Dis20}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

          <Stack.Screen
        name="Dis25"
        component={Dis25}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
           <Stack.Screen
        name="Dis30"
        component={Dis30}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

            <Stack.Screen
        name="Dis35"
        component={Dis35}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

              <Stack.Screen
        name="Dis40"
        component={Dis40}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />

                 <Stack.Screen
        name="Dis50"
        component={Dis50}
       options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "transparentModal",
              }}
      />
    </Stack.Navigator>
  
);