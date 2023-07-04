import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ClockImage } from "../../assets";
import { AntDesign } from "@expo/vector-icons";
import CredentialService from "../../service/CredentialService";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleResetEmail = async () => {
    if (email === "") {
      Alert.alert("Gửi hướng dẫn không thành công", "Vui lòng nhập email");
    } else {
      try {
        if (email) {
          const status = await CredentialService.handleResetEmail(email);
          console.log("OK with status: ", status);
          if (status) {
            navigation.navigate("ForgotPassword_CheckMail");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#3A4666]">
      <View className="w-full h-80 bg-[#23ACCD] rounded-b-3xl">
        <View className="w-60 h-60 bg-[#126C83] rounded-full absolute top-12 -left-16"></View>
        <View className="w-32 h-32 bg-[#126C83] rounded-full absolute top-44 -right-8"></View>
        <Image
          source={ClockImage}
          className="w-30 h-30 absolute top-20 right-2"
        />
        <TouchableOpacity
          className="mt-10 ml-4"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={32} color="white" />
        </TouchableOpacity>
        <View className="mt-[23%]">
          <Text className="text-white font-bold text-3xl ml-7">
            Đặt lại mật khẩu
          </Text>
          <Text className="text-white text-base mx-7 mt-2">
            Vui lòng nhập email được liên kết với tài khoản và chúng tôi sẽ gửi
            email có hướng dẫn đặt lại mật khẩu của bạn
          </Text>
        </View>
        <View className="w-[90%] bg-white rounded-2xl mx-[5%] mt-5 py-2 px-4">
          <TextInput
            className="bg-white pl-4 py-2 "
            placeholderTextColor="#9A999B"
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={(email) => setEmail(email)}
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={handleResetEmail}
          className="w-[80%] h-[50px] ml-[10%] bg-[#FE8668] rounded-2xl mt-10 flex items-center justify-center"
        >
          <Text className="text-[#3A4666] text-center font-bold text-lg">
            Gửi hướng dẫn
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
