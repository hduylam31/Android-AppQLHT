import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { moodleLogin } from "../../assets";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import CalendarService from "../../service/CalendarService";

const Done_Moodle = () => {
  const navigation = useNavigation();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const status = await CalendarService.processLoginMoodle(username, password);
    console.log("status: ", status);
    if (status === 1) {
      //1 = ok, 0 = sai mật khẩu, -1 = lỗi
      navigation.navigate("BottomBar");
    } else if (status === 0) {
      console.log("Sai mat khau");
    } else {
      console.log("Loi");
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <SafeAreaView className="flex-1 bg-[#3A4666]">
        <View className="w-full h-[45%] bg-[#23ACCD] rounded-b-[50px]">
          <View className="w-60 h-60 bg-[#126C83] rounded-full absolute top-12 -left-16"></View>
          <View className="w-32 h-32 bg-[#126C83] rounded-full absolute top-44 -right-8"></View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View className="w-10 h-10 mt-[10%] ml-[5%]">
              <AntDesign name="arrowleft" size={40} color="white" />
            </View>
          </TouchableOpacity>
          <View className="mt-[15%] flex-row justify-center items-center">
            <Text className="ml-4 text-[#FFFFFF] text-4xl font-bold">
              Kết nối đến{"\n"}Moodle
            </Text>
            <Animatable.Image
              animation="fadeIn"
              easing="ease-in-out"
              source={moodleLogin}
              resizeMode="contain"
              style={{ marginLeft: 30 }}
            />
          </View>
          <Text className="self-center text-[#FFFFFF] text-xl font-bold mt-[40%] mx-6">
            Kết nối đến Moodle thành công, chọn "Quay lại" để về trang lịch của
            bạn.
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Animatable.View
              easing="ease-in-out"
              iterationCount={"infinite"}
              className="w-[85%] h-[35%] items-center justify-center bg-[#FE8668] self-center rounded-2xl mt-[10%]"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text className="font-bold text-xl">Quay lại</Text>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Done_Moodle;
