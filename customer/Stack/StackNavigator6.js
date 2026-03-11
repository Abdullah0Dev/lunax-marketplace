import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/profile/Profile";
import Contact from "../screens/profile/contact/Contact";
import Aboutus from "../screens/profile/aboutus/Aboutus";

import Person from "../screens/profile/person/Person";
import Password from "../screens/profile/password/Password";


const Stack = createNativeStackNavigator();

export const StackNavigator6 = () => (

    <Stack.Navigator>
       <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "containedModal",
              }}
            />
<Stack.Screen
              name="Contact"
              component={Contact}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "containedModal",
              }}
            />
     <Stack.Screen
              name="Aboutus"
              component={Aboutus}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "containedModal",
              }}
            />
            
                 <Stack.Screen
              name="Person"
              component={Person}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "containedModal",
              }}
            />
                  <Stack.Screen
              name="Password"
              component={Password}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                presentation: "containedModal",
              }}
            />
    </Stack.Navigator>
  );
