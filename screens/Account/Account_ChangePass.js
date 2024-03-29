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
import AccountMain from "./AccountMain";
import CredentialService from "../../service/CredentialService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account_ChangePass = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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

  const updatePassword = async () => {
    if (password === "") {
      Alert.alert("Đổi mật khẩu không thành công", "Vui lòng nhập mật khẩu");
    } else if (newPassword === "") {
      Alert.alert(
        "Đổi mật khẩu không thành công",
        "Vui lòng nhập mật khẩu mới. Mật khẩu bao gồm 6 kí tự"
      );
    } else if (reNewPassword === "") {
      Alert.alert(
        "Đổi mật khẩu không thành công",
        "Vui lòng nhập nhập lại mật khẩu mới"
      );
    } else if (newPassword !== reNewPassword) {
      Alert.alert(
        "Đổi mật khẩu không thành công",
        "Mật khẩu nhập lại không khớp"
      );
    } else {
      const currentPassword = await AsyncStorage.getItem("password");
      if (currentPassword != password) {
        Alert.alert(
          "Đổi mật khẩu không thành công",
          "Mật khẩu không chính xác"
        );
      } else {
        const status = await CredentialService.changePassword(newPassword);
        console.log("as", status);
        //Navigate ở đây
        if (status) {
          Alert.alert("Thành công", "Mật khẩu đã được cập nhật", [
            {
              text: "Xác nhận",
              onPress: () => {
                navigation.navigate("BottomBar", {
                  screen: "Tài khoản",
                  params: {
                    screenAccount: "UpdateToMain",
                  },
                });
              },
            },
            // {
            //   text: "Hủy",
            //   onPress: () => {
            //     console.log("No Pressed");
            //   },
            // },
          ]);
        }
      }
    }
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
                Bạn muốn đổi mật khẩu ?
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={updatePassword}
            className="w-[80%] h-14 ml-[10%] bg-[#FE8668] rounded-2xl mt-[40%] flex items-center justify-center"
          >
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
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              ></TextInput>
            </View>
            <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 mt-[5%]">
              <TextInput
                className="text-lg pl-4"
                placeholderTextColor="#9A999B"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={true}
                value={reNewPassword}
                onChangeText={(value) =>
                  validateAndSet(value, newPassword, setReNewPassword)
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
