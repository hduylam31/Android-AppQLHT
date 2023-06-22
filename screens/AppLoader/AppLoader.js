import React from "react";
import { View, Text } from "react-native";

import Lottie from "lottie-react-native";

const AppLoader = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Lottie
        source={require("../../assets/115350-loading-bar-avis.json")}
        autoPlay
        loop
      />
      <View className="flex-row justify-center items-center mt-20 ml-7">
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

export default AppLoader;
