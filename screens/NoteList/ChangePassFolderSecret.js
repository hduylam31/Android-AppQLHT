import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";

const ChangePassFolderSecret = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  async function changePassFolderSecret() {
    console.log("haha");
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>+-]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    if (oldPassword === "") {
      Alert.alert("Không thể thay đổi mật mã", "Mật mã cũ không được để trống");
    } else if (newPassword === "") {
      Alert.alert(
        "Không thể thay đổi mật mã",
        "Mật mã mới không được để trống"
      );
    } else if (repassword === "") {
      Alert.alert(
        "Không thể thay đổi mật mã",
        "Nhập lại Mật mã không được để trống"
      );
    } else if (
      newPassword.length < 6 &&
      !specialCharacterRegex.test(newPassword) &&
      !uppercaseRegex.test(newPassword) &&
      !lowercaseRegex.test(newPassword)
    ) {
      Alert.alert(
        "Không thể thay đổi mật mã",
        "Mật mã phải trên 6 kí tự, chứa ít nhất một ký tự đặc biệt, một ký tự viết hoa, một ký tự viết thường"
      );
    } else if (newPassword !== repassword) {
      Alert.alert("Không thể thay đổi mật mã", "Nhập lại mật mã không khớp");
    } else if (newPassword != "" && newPassword == repassword) {
      const status = await NoteService.changePassword(oldPassword, newPassword);
      if (status == "") {
        Alert.alert("Không thể thay đổi mật mã", "Mật mã cũ không chính xác");
      } else {
        Alert.alert("Thông báo", "Thay đổi mật mã thành công");
        await new Promise((r) => setTimeout(r, 1000));
        navigation.navigate("UnlockFolderSecret", { secretPassword: status });
      }
    }
  }

  return (
    <SafeAreaView className="bg-[#3A4666] flex-1">
      <View className="p-4 flex-row justify-between items-center mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <MaterialCommunityIcons name="folder-lock" size={28} color="white" />
        <View className="h-8 w-8"></View>
      </View>
      <View className="justify-center items-center px-4">
        <Text className="text-[#FFFFFF] text-[22px] font-semibold">
          Thư mục bảo mật
        </Text>
        <Text className="text-[#FFFFFF] text-lg mt-[25%]">Thay đổi mật mã</Text>
        <View className="w-full h-60 bg-white mt-[5%] rounded-2xl p-4">
          <TextInput
            placeholder="Mật mã cũ"
            autoCapitalize="none"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={(password) => setOldPassword(password)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
          ></TextInput>
          <TextInput
            placeholder="Mật mã mới"
            autoCapitalize="none"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(password) => setNewPassword(password)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
          ></TextInput>
          <TextInput
            placeholder="Nhập lại mật mã mới"
            autoCapitalize="none"
            secureTextEntry={true}
            value={repassword}
            onChangeText={(repassword) => setRepassword(repassword)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 mb-8 flex-1"
          ></TextInput>
        </View>
      </View>

      <TouchableOpacity onPress={changePassFolderSecret} className="mt-10">
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
          <Text className="text-[#3A4666] text-base font-bold">Lưu</Text>
        </Animatable.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePassFolderSecret;
