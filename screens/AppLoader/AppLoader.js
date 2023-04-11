import React from "react";
import { View } from "react-native";

import Lottie from "lottie-react-native";

const AppLoader = () => {
  return <Lottie source={require("../../assets/loading.json")} autoPlay loop />;
};

export default AppLoader;
