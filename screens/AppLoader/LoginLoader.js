import React from "react";
import { View, Text, Image } from "react-native";

import Lottie from "lottie-react-native";

const LoginLoader = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require("../../assets/splashIcon.png")}
        className="w-full h-full"
      />
      <View className="flex-row justify-center items-center absolute top-[58%]">
        <Text className="font-semibold text-lg -mr-2">Đang tải dữ liệu</Text>
        <Lottie
          style={{
            height: 40,
            // backgroundColor: "red",
            marginTop: 4,
          }}
          source={require("../../assets/64108-loading-dots.json")}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default LoginLoader;
