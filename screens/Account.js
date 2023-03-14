import React, { useLayoutEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Account = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
        className="w-[80%] h-14 absolute bottom-5 ml-[10%] bg-[#c2372de3] rounded-2xl flex items-center justify-center"
      >
        <Text className="text-white text-center font-bold text-xl">
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Account;
