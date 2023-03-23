import react from "react";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Login from "../screens/Authentication/Login";
import GetStarted from "../screens/Authentication/GetStarted";
import Register from "../screens/Authentication/Register";
import ForgotPassword from "../screens/Authentication/ForgotPassword";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword_CheckMail from "../screens/Authentication/ForgotPassword_CheckMail";
import ForgotPassword_ChangePass from "../screens/Authentication/ForgotPassword_ChangePass";
import ToDoListScreen from "../screens/ToDoList/ToDoListMain";
import BottomBar from "../screens/BottomBar";
import TodoList_Add from "../screens/ToDoList/TodoList_Add";
import TodoList_Edit from "../screens/ToDoList/TodoList_Edit";
import Login_Moodle from "../screens/Authentication/Login_Moodle";
import Calendar_Add from "../screens/Calendar/CalendarAdd";
import Calendar_Edit from "../screens/Calendar/CalendarEdit";

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
        name="TodoList_Add"
        component={TodoList_Add}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="TodoList_Edit"
        component={TodoList_Edit}
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
      <Auth.Screen
        name="ToDoListScreen"
        component={ToDoListScreen}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="BottomBar"
        component={BottomBar}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="Login_Moodle"
        component={Login_Moodle}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="Calendar_Add"
        component={Calendar_Add}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="Calendar_Edit"
        component={Calendar_Edit}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
    </Auth.Navigator>
  );
}
