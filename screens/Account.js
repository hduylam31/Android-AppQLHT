import React, { useLayoutEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../firebase'

const Account = () => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
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
      <TouchableOpacity
        onPress={() => {
          handleSignOut();
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
