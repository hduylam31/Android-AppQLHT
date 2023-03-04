import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { GetStartedImage } from "../assets";

const GetStarted = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-between bg-[#23ACCD] pt-36">
      <View className="w-full h-[40%]">
        <Image source={GetStartedImage} className="w-full h-full" />
      </View>
      <View className="pt-6">
        <Text className="text-white text-center font-bold text-4xl">
          Quản lí mới
        </Text>
        <Text className="text-white text-center font-bold text-4xl">
          Hiệu quả mới
        </Text>
      </View>
      <View className="pb-10">
        <Text className="text-white text-center font-bold text-xl">
          Chúng tôi ở đây để giúp bạn
        </Text>
        <Text className="text-white text-center font-bold text-xl">
          quản lý hiệu quả thời gian của mình.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
        className="bg-[#FE8668] rounded-tl-3xl ml-[55%] flex items-center justify-center w-48 h-24 "
      >
        <Text className="text-black text-center font-bold text-2xl w-full">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GetStarted;
