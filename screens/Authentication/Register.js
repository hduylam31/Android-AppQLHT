import {
  View,
  Text,
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
import { SafeAreaView } from "react-native-safe-area-context";
import CredentialService from "../../service/CredentialService";
import Ionicons from "react-native-vector-icons/Ionicons";

const Register = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRepass, setShowRepass] = useState(false);

  let validateAndSet = (value, valueCompare, setValue) => {
    value !== valueCompare
      ? setValidationMessage("Mật khẩu nhập lại không khớp")
      : setValidationMessage("");
    setValue(value);
  };

  const handleRegister = async () => {
    if (name === "") {
      Alert.alert("Đăng kí không thành công", "Vui lòng nhập họ và tên");
    } else if (email === "") {
      Alert.alert("Đăng kí không thành công", "Vui lòng nhập email");
    } else if (password === "") {
      Alert.alert("Đăng kí không thành công", "Vui lòng nhập mật khẩu");
    } else if (repassword === "") {
      Alert.alert(
        "Đăng kí không thành công",
        "Vui lòng nhập nhập lại mật khẩu"
      );
    } else
      try {
        if (email && password && repassword) {
          if (password !== repassword) {
            Alert.alert("Mật khẩu nhập lại không khớp");
          } else {
            const status = await CredentialService.handleRegister(
              name,
              email,
              password
            );
            if (status) {
              Alert.alert("Đăng kí thành công", "Trở về trang đăng nhập", [
                {
                  text: "Đồng ý",
                  onPress: () => navigation.navigate("Login"),
                },
              ]);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
              <View className="w-10 h-10 mt-7 ml-[3%]">
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
          <TouchableOpacity
            className="w-[80%] h-[50px] ml-[10%] bg-[#FE8668] rounded-2xl mt-[50%] flex items-center justify-center"
            onPress={handleRegister}
          >
            <Text className="text-[#3A4666] text-center font-bold text-xl">
              Đăng kí
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
            className="w-[80%] h-[50px] ml-[10%] bg-[#CECECE] rounded-2xl mt-5 flex items-center justify-center"
          >
            <Text className="text-[#9E9090] text-center font-bold text-xl">
              Đăng nhập
            </Text>
          </TouchableOpacity>

          <View className="w-[90%] h-72 bg-white rounded-2xl mx-[5%] top-56 px-4 py-4 absolute">
            <TextInput
              className="bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
              placeholderTextColor="#9A999B"
              placeholder="Họ và tên"
              autoCapitalize="none"
              value={name}
              onChangeText={(name) => setName(name)}
            ></TextInput>

            <TextInput
              className="bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
              placeholderTextColor="#9A999B"
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={(email) => setEmail(email)}
            ></TextInput>

            <View className="bg-white px-4 border-b-[#9A999B] border-b-2 flex-1 flex-row justify-between items-center">
              <TextInput
                className="w-[85%]"
                placeholderTextColor="#9A999B"
                placeholder="Mật khẩu"
                autoCapitalize="none"
                secureTextEntry={showPass ? false : true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
              <TouchableOpacity
                onPress={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? (
                  <Ionicons name="eye-outline" size={28} color="black" />
                ) : (
                  <Ionicons name="eye-off-outline" size={28} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <View className="bg-white px-4 border-b-[#9A999B] border-b-2 flex-1 flex-row justify-between items-center">
              <TextInput
                className=" w-[85%]"
                placeholderTextColor="#9A999B"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={showRepass ? false : true}
                autoCapitalize="none"
                value={repassword}
                onChangeText={(value) =>
                  validateAndSet(value, password, setrePassword)
                }
              ></TextInput>
              <TouchableOpacity
                onPress={() => {
                  setShowRepass(!showRepass);
                }}
              >
                {showRepass ? (
                  <Ionicons name="eye-outline" size={28} color="black" />
                ) : (
                  <Ionicons name="eye-off-outline" size={28} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="mt-4 self-center text-red-500">
              {validationMessage}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Register;
