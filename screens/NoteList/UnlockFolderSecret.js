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
import { useNavigation, useRoute } from "@react-navigation/native";
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

  const route = useRoute();
  const storePassword = route.params.secretPassword;

  const [passwordUnlock, setPasswordUnlock] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function openSecretFolder() {
    console.log("passwordUnlock: ", passwordUnlock);
    console.log("storePassword: ", storePassword);
    if (passwordUnlock === "") {
      Alert.alert("Không thể mở thư mục", "Vui lòng nhập mật mã!");
    } else if (passwordUnlock != "") {
      const isAuth = await NoteService.login(passwordUnlock, storePassword);
      console.log("isAuth: ", isAuth);
      if (isAuth) {
        navigation.navigate("NoteListFolderSecret", {
          paramMovetoSecretFolder: "NotMoveData",
        });
        setPasswordUnlock("");
        setShowPass(false);
      } else {
        Alert.alert("Không thể mở thư mục", "Sai mật mã!");
      }
    }
  }

  function saveSecretFolderPassword() {
    console.log("haha: ", password);
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>+-]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    if (password === "") {
      Alert.alert("Không thể thiết lập mật mã", "Mật mã không được để trống");
    } else if (repassword === "") {
      Alert.alert(
        "Không thể thiết lập mật mã",
        "Nhập lại Mật mã không được để trống"
      );
    } else if (password.length < 6) {
      Alert.alert("Không thể thiết lập mật mã", "Mật mã phải trên 6 kí tự");
    } else if (!specialCharacterRegex.test(password)) {
      Alert.alert(
        "Không thể thiết lập mật mã",
        "Mật mã phải mật khẩu chứa ít nhất một ký tự đặc biệt"
      );
    } else if (!uppercaseRegex.test(password)) {
      Alert.alert(
        "Không thể thiết lập mật mã",
        "Mật mã phải mật khẩu chứa ít nhất một ký tự viết hoa"
      );
    } else if (!lowercaseRegex.test(password)) {
      Alert.alert(
        "Không thể thiết lập mật mã",
        "Mật mã phải mật khẩu chứa ít nhất một ký tự viết thường"
      );
    } else if (password !== repassword) {
      Alert.alert("Không thể thiết lập mật mã", "Nhập lại mật mã không khớp");
    } else if (password != "" && password == repassword) {
      NoteService.saveSecretFolderPassword(password);
      navigation.navigate("NoteListFolderSecret", {
        paramMovetoSecretFolder: "NotMoveData",
      });
    }
  }

  return (
    <SafeAreaView className="bg-[#3A4666] flex-1">
      <View className="p-4 flex-row justify-between items-center mt-10">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("BottomBar", {
              screen: "Ghi chú",
              params: {
                screenNoteList: "EditToMain",
              },
            });
          }}
        >
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <MaterialCommunityIcons name="folder-lock" size={28} color="white" />
        <View className="h-8 w-8"></View>
      </View>
      {storePassword === "" ? (
        <View className="justify-center items-center px-4">
          <Text className="text-[#FFFFFF] text-[22px] font-semibold">
            Thư mục bảo mật
          </Text>
          <Text className="text-[#FFFFFF] text-lg mt-[20%]">
            Thiết lập mật mã
          </Text>

          <Text className="text-[#FFFFFF] text-sm font-light mt-2 text-center">
            (mật mã phải trên 6 kí tự, chứa kí tự đặc biệt {"\n"} có cả chữ hoa
            và chữ thường)
          </Text>

          <View className="w-full h-48 bg-white mt-[5%] rounded-2xl p-4">
            <TextInput
              placeholder="Mật mã"
              autoCapitalize="none"
              secureTextEntry={true}
              value={password}
              onChangeText={(password) => setPassword(password)}
              className=" bg-white border-b-[#9A999B] border-b-2 flex-1"
            ></TextInput>
            <TextInput
              placeholder="Nhập lại mật mã"
              autoCapitalize="none"
              secureTextEntry={true}
              value={repassword}
              onChangeText={(repassword) => setRepassword(repassword)}
              className=" bg-white border-b-[#9A999B] border-b-2 mb-8 flex-1"
            ></TextInput>
          </View>
        </View>
      ) : (
        <View className="justify-center items-center px-4">
          <Text className="text-[#FFFFFF] text-[22px] font-semibold">
            Thư mục bảo mật
          </Text>
          <Text className="text-[#FFFFFF] text-lg mt-[25%]">Nhập mật mã</Text>
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
          <TouchableOpacity
            className="self-end mt-3"
            onPress={() => {
              navigation.navigate("ResetPassFolderSecret");
            }}
          >
            <Text className="font-light italic text-sm text-right underline text-white">
              Quên mật mã
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {storePassword === "" ? (
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
