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
import CommonService from "../../service/CommonService";

const Login_Moodle = () => {
  const navigation = useNavigation();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const status = await CalendarService.processLoginMoodle(username, password); 
    // const status = await CommonService.loadAllNotificationAndUpdateDB();  //Này để test
    console.log("statuss: ", status);
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
          <View className="mt-[8%] flex-row justify-center items-center">
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
          <View className="w-42 h-60 bg-white rounded-2xl mx-6 mt-10 flex justify-center items-center space-y-6">
            <TextInput
              placeholder="Tài khoản"
              value={username}
              onChangeText={(text) => setUsername(text)}
              className="w-[80%] h-[25%] bg-[#D9D9D9] pl-4"
            ></TextInput>
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              className="w-[80%] h-[25%] bg-[#D9D9D9] pl-4"
            ></TextInput>
          </View>
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
              <Text className="font-bold text-xl">Kết nối</Text>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login_Moodle;
