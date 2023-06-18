import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { forgotpw } from "../../assets";
import * as Animatable from "react-native-animatable";

const ForgotPassword_CheckMail = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <SafeAreaView className="bg-[#3A4666] flex-1">
      {/* <View className="mt-9 ml-4">
          <AntDesign name="arrowleft" size={40} color="white" />
        </View> */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View className="mt-10 ml-[3%] w-7 h-7">
          <AntDesign name="arrowleft" size={28} color="white" />
        </View>
      </TouchableOpacity>
      <View className="justify-center items-center space-y-6">
        <Image source={forgotpw} className="w-30 h-30 mt-[35%]" />
        <Text className="text-[#FFFFFF] text-3xl font-bold">
          Kiểm tra email của bạn
        </Text>
        <Text className="text-[#FFFFFF] text-base font-light ml-[10%] mr-[10%]">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
        </Text>
      </View>
      <View className="mt-10 space-y-5">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Animatable.View
            easing="ease-in-out"
            iterationCount={"infinite"}
            className="w-[80%] h-[50px] items-center justify-center bg-[#FE8668] self-center rounded-2xl mt-[2%]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-[#3A4666] text-base font-bold">
              Quay lại trang đăng nhập
            </Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword_CheckMail;
