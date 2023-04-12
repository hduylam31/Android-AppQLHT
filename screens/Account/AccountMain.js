import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../../firebase";
import NotificationUtils from "../../service/NotificationUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const AccountMain = () => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(async () => {
        NotificationUtils.removeAllNotification();
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("password");
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

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-[#3A4666] h-[15%]"></View>
      <View className="h-full bg-[#F1F5F9] items-center">
        <Text className="mt-24 text-[#3A4666] text-xl font-bold">aa</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Account_EditInfor");
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
          <Ionicons name="key-outline" size={30} color="black" />
          <Text className="text-[#3A4666] text-base">Đổi mật khẩu</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View className="w-36 h-36 bg-[#A4AAB8] rounded-full justify-center items-center absolute top-20 left-[32%] right-0 bottom-0">
        <MaterialCommunityIcons name="account" size={120} color="white" />
      </View>
      <TouchableOpacity
        onPress={() => {
          handleSignOut();
          navigation.navigate("Login");
        }}
        className="w-[90%] h-[5%] absolute bottom-5 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
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
