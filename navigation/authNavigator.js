import react from "react";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Login from "../screens/Login";
import GetStarted from "../screens/GetStarted";
import Register from "../screens/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Auth = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Auth.Navigator>
      <Auth.Screen
        name="GetStarted"
        component={GetStarted}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />

      <Auth.Screen
        name="Login"
        component={Login}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />

      <Auth.Screen
        name="Register"
        component={Register}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
    </Auth.Navigator>
  );
}
