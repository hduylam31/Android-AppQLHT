import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../../firebase";
import NotificationUtils from "../../service/NotificationUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AccountService from "../../service/AccountService";
import * as BackgroundFetch from "expo-background-fetch";
import Constants from "../../domain/Constants";

const AccountMain = () => {
  const [name, setName] = useState("");

  async function loadName() {
    const userName = await AccountService.loadUserInfo();
    setName(userName);
  }

  const route = useRoute();
  useEffect(() => {
    if (
      route?.params?.screenAccount === "UpdateToMain" ||
      route?.params?.screenAccount === "EditToMain"
    ) {
      loadName();
    }
  }, [route]);

  useEffect(() => {
    loadName();
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(async () => {
        NotificationUtils.removeAllNotification();
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("password");
        AsyncStorage.removeItem("name");
        AsyncStorage.removeItem("noteList");
        AsyncStorage.removeItem("scheduleList");
        AsyncStorage.removeItem("todoList");
        AsyncStorage.removeItem("groupTodolist");

        AsyncStorage.removeItem("moodleStatus");
        AsyncStorage.removeItem("moodleToken");
        AsyncStorage.removeItem("moodleCalendar");
        AsyncStorage.removeItem("userCalendar");

        try {
          await BackgroundFetch.unregisterTaskAsync(
            Constants.BACKGROUND_FETCH_TASK
          );
        } catch (error) {
          console.log("Loi nay ke no di: ", error);
        }

        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const AlertSignOut = () => {
    Alert.alert("Đăng xuất", "Bạn muốn đăng xuất ?", [
      {
        text: "Đồng ý",
        onPress: handleSignOut,
      },
      {
        text: "Hủy",
        onPress: () => {
          console.log("No Pressed");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-[#3A4666] h-[15%]"></View>
      <View className="h-full bg-[#F1F5F9] items-center">
        <View className="w-[70%] mt-[25%] items-center justify-center">
          <Text
            className=" text-[#3A4666] text-xl font-bold "
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Account_EditInfor", { name });
          }}
          className="mt-5 w-[50%] h-12 rounded-3xl bg-white justify-center items-center"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <Text className="text-[#3A4666] text-base font-semibold">
            Chỉnh sửa thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Account_ChangePass");
          }}
          className="mt-5 w-full h-16 px-4 bg-white justify-between items-center flex-row"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <Ionicons name="key-outline" size={28} color="black" />
          <Text className="text-[#3A4666] text-base">Đổi mật khẩu</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserManual_I", { param1: "isOpen" });
          }}
          className="mt-5 w-full h-16 px-4 bg-white justify-between items-center flex-row"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <MaterialCommunityIcons
            name="book-open-variant"
            size={28}
            color="black"
          />
          <Text className="text-[#3A4666] text-base">Xem hướng dẫn</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Account_Survey");
          }}
          className="mt-5 w-full h-16 px-4 bg-white justify-between items-center flex-row"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <MaterialCommunityIcons
            name="application-edit-outline"
            size={28}
            color="black"
          />
          <Text className="text-[#3A4666] text-base">Khảo sát, đánh giá</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View className="w-36 h-36 bg-[#A4AAB8] rounded-full justify-center items-center absolute bottom-[75%] left-[32%]">
        <MaterialCommunityIcons name="account" size={120} color="white" />
      </View>
      <TouchableOpacity
        onPress={AlertSignOut}
        className="w-[90%] h-10 absolute bottom-5 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Text className="text-white text-center font-bold text-base">
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountMain;
