import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";

const UnlockFolderSecret = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [passwordUnlock, setPasswordUnlock] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function openSecretFolder() {
    console.log("haha: ", passwordUnlock);
  }

  function saveSecretFolderPassword() {
    console.log("haha: ", password);
    if (password != "" && password == repassword) {
      // NoteService.saveSecretFolderPassword(password);
    }
  }

  return (
    <SafeAreaView className="bg-[#3A4666] flex-1">
      <View className="p-4 flex-row justify-between items-center mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={32} color="white" />
        </TouchableOpacity>
        <MaterialCommunityIcons name="folder-lock" size={32} color="white" />
        <View className="h-8 w-8"></View>
      </View>
      {passwordUnlock === "" ? (
        <View className="justify-center items-center px-4">
          <Text className="text-[#FFFFFF] text-3xl font-bold">
            Thư mục bảo mật
          </Text>
          <Text className="text-[#FFFFFF] text-base font-light mt-[25%]">
            Thiết lập mật mã
          </Text>
          <View className="w-full h-48 bg-white mt-[5%] rounded-2xl p-4">
            <TextInput
              placeholder="Mật mã"
              autoCapitalize="none"
              value={password}
              onChangeText={(password) => setPassword(password)}
              className=" bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
            ></TextInput>
            <TextInput
              placeholder="Nhập lại mật mã"
              autoCapitalize="none"
              value={repassword}
              onChangeText={(repassword) => setRepassword(repassword)}
              className=" bg-white pl-4 border-b-[#9A999B] border-b-2 mb-8 flex-1"
            ></TextInput>
          </View>
        </View>
      ) : (
        <View className="justify-center items-center px-4">
          <Text className="text-[#FFFFFF] text-3xl font-bold">
            Thư mục bảo mật
          </Text>
          <Text className="text-[#FFFFFF] text-base font-light mt-[25%]">
            Nhập mật mã
          </Text>
          <View className="h-10 w-full bg-white rounded-2xl flex-row justify-between items-center mt-5">
            <TextInput
              placeholder="Mật mã"
              autoCapitalize="none"
              secureTextEntry={showPass ? false : true}
              value={passwordUnlock}
              onChangeText={(passwordUnlock) =>
                setPasswordUnlock(passwordUnlock)
              }
              className="pl-4 w-[85%]"
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                setShowPass(!showPass);
              }}
              className="pr-4"
            >
              {showPass ? (
                <Ionicons name="eye-outline" size={28} color="black" />
              ) : (
                <Ionicons name="eye-off-outline" size={28} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {passwordUnlock === "" ? (
        <TouchableOpacity
          onPress={() => {
            saveSecretFolderPassword();
          }}
          className="mt-10"
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
            <Text className="text-[#3A4666] text-base font-bold">Lưu</Text>
          </Animatable.View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            openSecretFolder();
          }}
          className="mt-10"
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
              Mở thư mục
            </Text>
          </Animatable.View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default UnlockFolderSecret;
