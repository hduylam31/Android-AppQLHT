import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Account_Survey = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handlePressLink = () => {
    Linking.openURL(
      "https://docs.google.com/forms/d/e/1FAIpQLSfzA1dHvbZITvwvaBQ9lrOVhuOXUIso2uAEg5_X-7krxDc6vw/viewform?usp=share_link"
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Khảo sát, đánh giá</Text>
            </View>
            <View className="w-8 h-8"></View>
          </View>
        </View>
        <View className="bg-[#F1F5F9] h-full">
          <View className="p-6">
            <Text className="text-base">
              Chào các bạn, tụi mình đang phát triển một ứng dụng quản lý học
              tập và muốn thu thập ý kiến của các bạn để cải thiện sản phẩm. Bạn
              có thể giúp đỡ tụi mình bằng cách nhấn vào link bên dưới để thực
              hiện khảo sát đánh giá:
            </Text>
            <TouchableOpacity
              onPress={handlePressLink}
              className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-10 mt-10"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-semibold text-base">
                Khảo sát ý kiến ứng dụng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Account_Survey;
