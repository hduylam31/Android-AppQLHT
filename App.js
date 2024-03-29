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
import * as Permissions from "expo-permissions";

// Thư viện dùng cho notification
import { Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import storage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import CalendarService from "./service/CalendarService";
import CredentialService from "./service/CredentialService";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import Constants from "./domain/Constants";
import UserManual_I from "./screens/Authentication/UserManual_I";

const Stack = createNativeStackNavigator();

//Tùy chỉnh cho thông báo
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log("Recieved notification");
    // Notify for other notifications
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

TaskManager.defineTask(Constants.BACKGROUND_FETCH_TASK, async () => {
  console.log("Task set at ", new Date(Date.now()).toLocaleTimeString());
  try {
    await CredentialService.autoLogin();
    await CalendarService.unRegisterMoodleNotification();
    await CalendarService.reloadMoodleCalendar();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("AutoUpdateMoodle: ", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default function App() {
  // Phần này dùng để cấp phép cho notification, không cần thiết phải hiểu
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    const autoLogin = async () => {
      const todolists = await CredentialService.autoLogin();
      console.log("Auto Login OK");
    };
    autoLogin();
  }, []);

  useEffect(() => {
    const getPermission = async () => {
      try {
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
      } catch (error) {
        console.log("Permission warning");
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
          <Stack.Screen name="Schecule" component={UserManual_I} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </TailwindProvider>
  );
}
