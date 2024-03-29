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
  Alert,
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
} from "../../assets";
import CredentialService from "../../service/CredentialService";
import { auth } from "../../firebase";
import CommonService from "../../service/CommonService";
import AppLoader from "../AppLoader/AppLoader";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GetStarted from "./GetStarted";
import LoginLoader from "../AppLoader/LoginLoader";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      setIsLoadingLogin(true);
      const status = await CredentialService.autoLogin();
      if (status) {
        console.log("isAutoLogin: ", true);
        await CommonService.loadAllNotificationAndUpdateDB(true);
        navigation.navigate("BottomBar");
      }
      setIsLoadingLogin(false);
    };
    autoLogin();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleLogin = async () => {
    if (email === "") {
      Alert.alert("Đăng nhập không thành công", "Vui lòng nhập Email");
    } else if (Password === "") {
      Alert.alert("Đăng nhập không thành công", "Vui lòng nhập mật khẩu");
    } else {
      try {
        let account;
        if (!email.includes("@gmail.com")) {
          account = email + "@gmail.com";
        } else {
          account = email;
        }
        const status = await CredentialService.handleLoginWithEmail(
          account,
          Password
        );
        if (status) {
          setIsLoadingLogin(true);
          console.log("isAutoLogin: ", false);
          await CommonService.loadAllNotificationAndUpdateDB(false);
          setIsLoadingLogin(false);
          navigation.navigate("BottomBar");
        }
        console.log("Login OK");
      } catch (error) {
        console.log("Login fail with: ", error);
      }
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleDismiss = () => {
    navigation.navigate("UserManual_I", { param1: "isNotOpen" });
    setShowWelcomeScreen(false);
    AsyncStorage.setItem("ShownWelcomeApp", "true");
  };

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  useEffect(() => {
    // Kiểm tra xem đã hiển thị màn hình chào mừng lần đầu tiên hay chưa
    async function checkIfShowWelcomeScreen() {
      const hasShown = await AsyncStorage.getItem("ShownWelcomeApp");
      console.log(hasShown);
      if (hasShown !== null) {
        setShowWelcomeScreen(false);
      }
    }
    checkIfShowWelcomeScreen();
  }, []);

  console.log("showWelcome", showWelcomeScreen);
  if (showWelcomeScreen) {
    return <GetStarted onDismiss={handleDismiss} />;
  } else if (isLoadingLogin) {
    return <LoginLoader />;
  } else {
    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={handlePress}>
          <SafeAreaView>
            {/* <StatusBar className="bg-[#23ACCD]" /> */}
            <View className="bg-[#23ACCD] flex-1 relative">
              {/* first section */}
              <View>
                <View className="absolute w-[177px] h-[177px] bg-[#126C83] rounded-full  top-[30%] -left-[15%]"></View>
                <View className="absolute w-[130px] h-[130px] bg-[#126C83] rounded-full  top-[30%] -right-[10%]]"></View>
              </View>
              {/* Second section */}
              <View className="mt-[8%] flex-row justify-center items-center">
                <Text className="ml-4 text-[#FFFFFF] text-3xl font-bold">
                  Chào mừng {"\n"}bạn quay trở lại
                </Text>
                <Animatable.Image
                  animation="fadeIn"
                  easing="ease-in-out"
                  source={ClockImage}
                  resizeMode="contain"
                  style={{ marginLeft: 20 }}
                />
              </View>
              <View className="flex-1 bg-[#FE8668] mt-4 rounded-t-[40px]">
                <View className="flex-1 bg-[#3A4666] mt-2 space-y-4 h-full rounded-t-[47px] px-5">
                  <View className="bg-[#F8F7FA] mt-[15%] rounded-2xl px-5 py-8 space-y-4">
                    <TextInput
                      placeholder="Email"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      autoCapitalize="none"
                      className="py-4 bg-[#D9D9D9] pl-4 rounded-2xl"
                    ></TextInput>
                    <TextInput
                      placeholder="Mật khẩu"
                      value={Password}
                      autoCapitalize="none"
                      secureTextEntry
                      onChangeText={(text) => setPassword(text)}
                      className=" py-4 bg-[#D9D9D9] pl-4 rounded-2xl"
                    ></TextInput>
                    <TouchableOpacity onPress={handleLogin}>
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
                        <Text className="text-[#3A4666] text-center font-bold text-lg">
                          Đăng nhập
                        </Text>
                      </Animatable.View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    className="self-end"
                    onPress={() => {
                      navigation.navigate("ForgotPassword");
                    }}
                  >
                    <Text className="font-light italic text-sm text-right underline mr-2 text-white">
                      Quên mật khẩu ?
                    </Text>
                  </TouchableOpacity>
                  <View className="flex-row self-center space-x-2 ">
                    <Text className="text-sm text-white">
                      Bạn chưa có tài khoản ?
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Register");
                      }}
                    >
                      <Text className="text-sm text-[#23ACCD]">
                        Đăng ký ngay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
};

export default Login;
