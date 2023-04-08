import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import Done_Moodle from "./screens/Authentication/DoneMoodle";
import CalendarMain from "./screens/Calendar/CalendarMain";
import Login_Moodle from "./screens/Authentication/Login_Moodle";
import Login from "./screens/Authentication/Login";
import ScheduleMain from "./screens/Schedule/ScheduleMain";

// Thư viện dùng cho notification
import { Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import storage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

const Stack = createNativeStackNavigator();

// Tùy chỉnh notification như có âm thanh, có thông báo,...
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  // Phần này dùng để cấp phép cho notification, không cần thiết phải hiểu
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const getPermission = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        console.log("Final status1: ", finalStatus);
        if (existingStatus !== "granted") {
          console.log("Final status2: ", finalStatus);
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        console.log("Final status3: ", finalStatus);
        if (finalStatus !== "granted") {
          alert("Enable push notifications to use the app!");
          await storage.setItem("expopushtoken", "");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        await storage.setItem("expopushtoken", token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      // Tùy chỉnh notification cho điện thoại Android
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthStack />
        {/* <Stack.Navigator>
          <Stack.Screen name="Schecule" component={Login_Moodle} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </TailwindProvider>
  );
}
