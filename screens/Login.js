import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import {
  ArrowLeft,
  HeroImage,
  Logo,
  NotFound,
  Google,
  Face,
  ClockImage,
} from "../assets";
import CredentialService from "../service/CredentialService";
import { auth } from "../firebase";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("BottomBar");
      }
    });
    return unsubcribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleLogin = () => {
    try {
      let account;
      if(!email.includes("gmail.com")){
        account = email + "@gmail.com";
      }else{
        account = email;
      }
      CredentialService.handleLoginWithEmail(account, Password);
      console.log("Login OK");
    } catch (error) {
      console.log("Login fail with: ", error);
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <SafeAreaView className="bg-[#23ACCD] flex-1 relative">
        {/* first section */}
        <View>
          <View className="absolute w-[177px] h-[177px] bg-[#126C83] rounded-full  top-[30%] -left-[15%]"></View>
          <View className="absolute w-[130px] h-[130px] bg-[#126C83] rounded-full  top-[30%] -right-[10%]]"></View>
        </View>
        {/* Second section */}
        <View className="mt-[8%] flex-row justify-center items-center">
          <Text className="ml-4 text-[#FFFFFF] text-3xl font-bold">
            Hi Welcome {"\n"}back
          </Text>
          <Animatable.Image
            animation="fadeIn"
            easing="ease-in-out"
            source={ClockImage}
            resizeMode="contain"
            style={{ marginLeft: 20 }}
          />
        </View>
        <View
          className="flex-1 bg-[#FE8668] mt-4 "
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        >
          <View
            className="flex-1 bg-[#3A4666] mt-2 space-y-[4%]"
            style={{ borderTopLeftRadius: 47, borderTopRightRadius: 47 }}
          >
            <View className="self-center w-[80%] h-[50%] bg-[#F8F7FA] mt-[10%] rounded-2xl space-y-4 justify-center">
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                className="w-[80%] h-[20%] bg-[#D9D9D9] mt-[20%] self-center pl-4"
              ></TextInput>
              <TextInput
                placeholder="Password"
                value={Password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                className="w-[80%] h-[20%] bg-[#D9D9D9] self-center pl-4"
              ></TextInput>
              <TouchableOpacity onPress={handleLogin}>
                <Animatable.View
                  easing="ease-in-out"
                  iterationCount={"infinite"}
                  className="w-[80%] h-[45%] items-center justify-center bg-[#FE8668] self-center rounded-2xl mt-[2%]"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text className="text-base">Đăng nhập</Text>
                </Animatable.View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ForgotPassword");
              }}
            >
              <Text
                className="font-light italic text-sm text-right underline mr-10"
                style={{ color: "white" }}
              >
                Quên mật khẩu
              </Text>
            </TouchableOpacity>
            <View className="flex-row space-x-3 items-center justify-center">
              <View className="w-[25%] h-[1px] bg-[#F8F7FA]">
                <AntDesign name="arrowleft" size={40} />
              </View>
              <Text className="text-base" style={{ color: "white" }}>
                Or sign in with
              </Text>
              <View className="w-[25%] h-[1px] bg-[#F8F7FA] items-center"></View>
            </View>
            <View className="self-center w-[40%] h-[10%] bg-[#F8F7FA] mt-[10%] rounded-2xl flex-row justify-center items-center space-x-4">
              <TouchableOpacity>
                <View>
                  <Animatable.Image source={Face} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View>
                  <Animatable.Image source={Google} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-row self-center space-x-2">
              <Text className="text-sm" style={{ color: "white" }}>
                Bạn chưa có tài khoản ?
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Register");
                  }}
                >
                  <Text className="text-sm" style={{ color: "#23ACCD" }}>
                    Đăng ký ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
