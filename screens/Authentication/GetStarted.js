import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { GetStartedImage } from "../../assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const GetStarted = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [appLaunched, setAppLaunched] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("appLaunchedFirst")
      .then((value) => {
        if (value !== null) {
          setAppLaunched(true);
          navigation.navigate("Login");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("appLaunchedFirst", "true")
      .then(() => console.log("App launched"))
      .catch((error) => console.log(error));
  }, []);
  if (appLaunched) {
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
            navigation.navigate("UserManual_I");
          }}
          className="bg-[#FE8668] rounded-tl-3xl ml-[55%] flex items-center justify-center w-48 h-24 "
        >
          <Text className="text-[#3A4666] text-center font-bold text-2xl w-full">
            Bắt đầu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};

export default GetStarted;
