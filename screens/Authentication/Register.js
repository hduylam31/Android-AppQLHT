import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ClockImage } from "../../assets";
import { AntDesign } from "@expo/vector-icons";
import CredentialService from "../../service/CredentialService";

const Register = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");

  const handleRegister = () => {
    try {
      if (email && password && repassword) {
        if (password !== repassword) {
          Alert.alert("Mật khẩu nhập lại không khớp");
        } else {
          CredentialService.handleRegister(name, email, password);
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

  return (
    <SafeAreaView className="flex-1 bg-[#3A4666]">
      <View className="w-full h-[45%] bg-[#23ACCD] rounded-b-[50px]">
        <View className="w-60 h-60 bg-[#126C83] rounded-full absolute top-12 -left-16"></View>
        <View className="w-32 h-32 bg-[#126C83] rounded-full absolute top-44 -right-8"></View>
        <Image
          source={ClockImage}
          className="w-30 h-30 absolute top-20 right-2"
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="w-10 h-10 mt-[7%] ml-[3%]">
            <AntDesign name="arrowleft" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <View className="mt-5">
          <Text className="text-white font-bold text-4xl ml-8">Hello!</Text>
          <Text className="text-white font-bold text-xl ml-14 mt-4">
            Good to see you here
          </Text>
        </View>
        <View className="w-42 h-80 bg-white rounded-2xl mx-5 mt-10 flex justify-center items-center">
          <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 mb-[3%]">
            <TextInput
              className="text-lg pl-4"
              placeholderTextColor="#9A999B"
              placeholder="Họ và tên"
              value={name}
              onChangeText={(name) => setName(name)}
            ></TextInput>
          </View>
          <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 my-[3%]">
            <TextInput
              className="text-lg pl-4"
              placeholderTextColor="#9A999B"
              placeholder="Email"
              value={email}
              onChangeText={(email) => setEmail(email)}
            ></TextInput>
          </View>
          <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 my-[3%]">
            <TextInput
              className="text-lg pl-4"
              placeholderTextColor="#9A999B"
              placeholder="Mật khẩu"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
          </View>
          <View className="w-[85%] h-[12%] border-b-[#9A999B] border-b-2 my-[3%]">
            <TextInput
              className="text-lg pl-4"
              placeholderTextColor="#9A999B"
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={true}
              value={repassword}
              onChangeText={(text) => setrePassword(text)}
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity
          className="w-[80%] h-14 ml-[10%] bg-[#FE8668] rounded-2xl mt-10 flex items-center justify-center"
          onPress={handleRegister}
        >
          <Text className="text-[#3A4666] text-center font-bold text-xl">
            Đăng kí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[80%] h-14 ml-[10%] bg-[#CECECE] rounded-2xl mt-5 flex items-center justify-center">
          <Text className="text-[#9E9090] text-center font-bold text-xl">
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;
