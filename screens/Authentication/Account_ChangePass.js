import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ClockImage } from "../../assets";
import { AntDesign } from "@expo/vector-icons";

const Account_ChangePass = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  let validateAndSet = (value, valueCompare, setValue) => {
    value !== valueCompare
      ? setValidationMessage("Mật khẩu nhập lại không khớp")
      : setValidationMessage("");
    setValue(value);
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <SafeAreaView>
        <ScrollView className="bg-[#3A4666] h-full">
          <View className="w-full h-96 bg-[#23ACCD] rounded-b-[50px]">
            <View className="w-60 h-60 bg-[#126C83] rounded-full absolute top-12 -left-16"></View>
            <View className="w-32 h-32 bg-[#126C83] rounded-full absolute top-44 -right-8"></View>
            <Image
              source={ClockImage}
              className="w-30 h-30 absolute top-20 right-2"
            />
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View className="w-10 h-10 mt-10 ml-[3%]">
                <AntDesign name="arrowleft" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View className="mt-5">
              <Text className="text-white font-bold text-4xl ml-6">
                Xin chào!
              </Text>
              <Text className="text-white font-bold text-xl ml-10 mt-4">
                Rất vui khi gặp bạn ở đây
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-[80%] h-14 ml-[10%] bg-[#FE8668] rounded-2xl mt-[40%] flex items-center justify-center">
            <Text className="text-[#3A4666] text-center font-bold text-lg">
              Cập nhật lại mật khẩu
            </Text>
          </TouchableOpacity>

          <View className="w-[90%] h-64 bg-white rounded-2xl mx-[5%] top-56 flex justify-center items-center absolute">
            <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 my-[5%]">
              <TextInput
                className="text-lg pl-4"
                placeholderTextColor="#9A999B"
                placeholder="Mật khẩu"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
            </View>
            <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 my-[5%]">
              <TextInput
                className="text-lg pl-4"
                placeholderTextColor="#9A999B"
                placeholder="Mật khẩu mới"
                secureTextEntry={true}
                value={newpassword}
                onChangeText={(text) => setNewPassword(text)}
              ></TextInput>
            </View>
            <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 mt-[5%]">
              <TextInput
                className="text-lg pl-4"
                placeholderTextColor="#9A999B"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={true}
                value={repassword}
                onChangeText={(value) =>
                  validateAndSet(value, newpassword, setrePassword)
                }
              ></TextInput>
            </View>
            <Text className="mt-4 text-red-500">{validationMessage}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Account_ChangePass;
