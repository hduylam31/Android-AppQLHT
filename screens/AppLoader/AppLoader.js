import React from "react";
import { View } from "react-native";

import Lottie from "lottie-react-native";

const AppLoader = () => {
  return (
    <Lottie
      source={require("../../assets/28340-loading-bar.json")}
      autoPlay
      loop
    />
  );
};

export default AppLoader;
