import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import ToDoListScreen from "./ToDoList";
import Account from "./Account";
import NoteList from "./NoteList";
import Pomodoro from "./Pomodoro";
import Schedule from "./Schedule";

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

          if (route.name === "Schedule") {
            iconName = focused ? "calendar-blank-outline" : "calendar-blank";
          } else if (route.name === "NoteList") {
            iconName = focused ? "file-document-outline" : "file-document";
          } else if (route.name === "ToDoList") {
            iconName = focused ? "file-check-outline" : "file-check";
          } else if (route.name === "Pomodoro") {
            iconName = focused ? "clock-outline" : "clock";
          } else if (route.name === "Account") {
            iconName = focused ? "account-outline" : "account";
          }

          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="NoteList" component={NoteList} />
      <Tab.Screen name="ToDoList" component={ToDoListScreen} />
      <Tab.Screen name="Pomodoro" component={Pomodoro} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};

export default BottomBar;