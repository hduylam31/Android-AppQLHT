import react from "react";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Login from "../screens/Login";
import GetStarted from "../screens/GetStarted";
import Register from "../screens/Register";
import ForgotPassword from "../screens/ForgotPassword";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword_CheckMail from "../screens/ForgotPassword_CheckMail";
import ForgotPassword_ChangePass from "../screens/ForgotPassword_ChangePass";

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

      <Auth.Screen
        name="ForgotPassword_CheckMail"
        component={ForgotPassword_CheckMail}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="ForgotPassword_ChangePass"
        component={ForgotPassword_ChangePass}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
    </Auth.Navigator>
  );
}
