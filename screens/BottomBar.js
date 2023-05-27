import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import ToDoListScreen from "./ToDoList/ToDoListMain";
import AccountMain from "./Account/AccountMain";
import CalendarMain from "./Calendar/CalendarMain";
import ScheduleMain from "./Schedule/ScheduleMain";
import NoteListMain from "./NoteList/NoteListMain";

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#3A4666",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Lịch") {
            iconName = focused ? "calendar" : "calendar";
          } else if (route.name === "Ghi chú") {
            iconName = focused ? "file-document" : "file-document";
          } else if (route.name === "DS công việc") {
            iconName = focused ? "file-check" : "file-check";
          } else if (route.name === "TKB") {
            iconName = focused ? "calendar-text" : "calendar-text";
          } else if (route.name === "Tài khoản") {
            iconName = focused ? "account" : "account";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Lịch" component={CalendarMain} />
      <Tab.Screen name="Ghi chú" component={NoteListMain} />
      <Tab.Screen name="DS công việc" component={ToDoListScreen} />
      <Tab.Screen name="TKB" component={ScheduleMain} />
      <Tab.Screen name="Tài khoản" component={AccountMain} />
    </Tab.Navigator>
  );
};

export default BottomBar;
