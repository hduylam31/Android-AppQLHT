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
import ToDoListScreen from "../screens/ToDoList/ToDoListMain";
import BottomBar from "../screens/BottomBar";
import TodoList_Add from "../screens/ToDoList/TodoList_Add";
import TodoList_Edit from "../screens/ToDoList/TodoList_Edit";
import Login_Moodle from "../screens/Authentication/Login_Moodle";
import Calendar_Add from "../screens/Calendar/CalendarAdd";
import Calendar_Edit from "../screens/Calendar/CalendarEdit";
import Done_Moodle from "../screens/Authentication/DoneMoodle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Schedule_Add from "../screens/Schedule/ScheduleAdd";
import Schedule_Edit from "../screens/Schedule/ScheduleEdit";
import MyScrollView from "../screens/NoteList/NoteListAdd";
import NoteList_Add from "../screens/NoteList/NoteListAdd";
import NoteList_Edit from "../screens/NoteList/NoteListEdit";

const Auth = createNativeStackNavigator();

export default function AuthStack() {
  // const navigation = useNavigation();
  // useEffect(() => {
  //   CheckIsExist();
  // }, []);
  // const CheckIsExist = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("GetStarted");
  //     if (value === "true") {
  //       await AsyncStorage.setItem("GetStarted", "true");
  //     } else {
  //       navigation.navigate("Login");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <Auth.Navigator initialRouteName="GetStarted">
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
        name="Done_Moodle"
        component={Done_Moodle}
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
      <Auth.Screen
        name="Schedule_Add"
        component={Schedule_Add}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />

      <Auth.Screen
        name="Schedule_Edit"
        component={Schedule_Edit}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Auth.Screen
        name="NoteList_Add"
        component={NoteList_Add}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />

      <Auth.Screen
        name="NoteList_Edit"
        component={NoteList_Edit}
        option={{
          headerShown: false,
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
    </Auth.Navigator>
  );
}